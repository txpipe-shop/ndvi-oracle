// Lambda doesnt like when coordinates array has duplicate values,
// so we clean up coordinates client-side.
export default function (coordinates: number[][][]) {
  return Array.from(yieldCleanMultiPolygons(coordinates));
}

function areCoordsEqual(a: number[], b: number[]) {
  let [lonA, latA] = a;
  let [lonB, latB] = b;
  return lonA === lonB && latA === latB;
}

function* yieldCleanMultiPolygons(coordinates: number[][][]) {
  for (const simplePolygon of coordinates) {
    yield Array.from(yieldCleanSimplePolygon(simplePolygon));
  }
}

function* yieldCleanSimplePolygon(simplePolygon: number[][]) {
  let lastCoord = null;
  for (const currentCoord of simplePolygon) {
    if (!lastCoord || !areCoordsEqual(currentCoord, lastCoord)) { 
      yield currentCoord;
      lastCoord = currentCoord;
    }
  }
}