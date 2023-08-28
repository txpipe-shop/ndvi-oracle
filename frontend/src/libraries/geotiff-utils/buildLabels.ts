import { Label, NODATA_TOKEN } from ".";

export default function(raster: number[]): Label[] {
  const track: Record<string, Label> = {};

  raster.forEach(value => {
    if (value == NODATA_TOKEN) {
      return;
    }

    const key = `${value}`;

    if (track[key] == null) {
      track[key] = { value, points: 0 };
    }

    const label = track[key];
    track[key] = { value: label.value, points: label.points + 1 };
  });

  return Object.values(track);
}
