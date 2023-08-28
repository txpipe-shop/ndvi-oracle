import * as React from 'react';

import { ColorRasterOverlay } from '.';
import renderGeotiffRaster from '../utils/renderGeotiffRaster';
import { binsEquals } from '../utils';

import type { Polygon } from 'geojson';
import type { GeotiffType, GeotiffRender } from '../utils/renderGeotiffRaster';

interface Props {
  id: string;
  geometry: Polygon;
  geotiffUrl: string;
  geotiffType: GeotiffType;
  inputDomain: [number, number] | null;
  outputDomain: [number, number] | null;
  nodata: number | null;
  customBins: NdviRasterBins | null;
  onLoading?: () => void;
  onRender?: (render: GeotiffRender) => void;
  onClick?: () => void;
}

interface State {
  loading: boolean;
  geotiffUrl: string;
  customBins: NdviRasterBins | null;
  heatmapUrl: string | null;
}

export default class GeotiffOverlay extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State): State {
    const needsRender =
      !prevState ||
      nextProps.geotiffUrl !== prevState.geotiffUrl ||
      !binsEquals(nextProps.customBins, prevState.customBins);

    return {
      loading: prevState && prevState.loading || false,
      geotiffUrl: nextProps.geotiffUrl,
      customBins: nextProps.customBins,
      heatmapUrl: needsRender ? null : prevState.heatmapUrl
    };
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: false,
      geotiffUrl: props.geotiffUrl,
      customBins: props.customBins,
      heatmapUrl: null
    };
  }

  async renderGeotiff() {
    const { geotiffUrl, customBins } = this.state;
    const {
      geotiffType,
      inputDomain,
      outputDomain,
      nodata,
      onLoading,
      onRender
    } = this.props;

    if (onLoading) {
      await this.setState({ loading: true });
      onLoading();
    }

    const render = await renderGeotiffRaster(
      geotiffUrl,
      geotiffType,
      inputDomain,
      outputDomain,
      nodata,
      customBins
    );

    await this.setState({ heatmapUrl: render.dataUrl, loading: false });

    if (onRender) {
      onRender(render);
    }
  }

  componentDidMount() {
    this.renderGeotiff();
  }

  componentDidUpdate() {
    const { heatmapUrl, loading } = this.state;
    if (!heatmapUrl && !loading) {
      this.renderGeotiff();
    }
  }

  renderLoaded(heatmapUrl: string) {
    const { id, geometry, onClick } = this.props;

    return (
      <ColorRasterOverlay
        id={id}
        geometry={geometry}
        onClick={onClick}
        imageUrl={heatmapUrl}
      />
    );
  }

  render() {
    const { heatmapUrl } = this.state;
    return heatmapUrl ? this.renderLoaded(heatmapUrl) : null;
  }
}
