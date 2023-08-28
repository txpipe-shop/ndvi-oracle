export default function(
  bins1: NdviRasterBins | null,
  bins2: NdviRasterBins | null
): boolean {
  if (!bins1 && !bins2) {
      return true;
  }

  if (!bins1 || !bins2) {
    return false;
  }

  if (bins1.length !== bins2.length) {
    return false;
  }

  return bins1.every((bin1, idx) => {
    const bin2 = bins2[idx];
    return bin1.min === bin2.min && bin1.max === bin2.max;
  });
}
