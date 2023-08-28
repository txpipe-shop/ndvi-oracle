export default function(
  inputDomain: [number, number],
  outputDomain: [number, number]
) {
  const [inputMin, inputMax] = inputDomain
  const [outputMin, outputMax] = outputDomain

  return (input: number): number => {
    const inputPos = (input - inputMin) / (inputMax - inputMin)
    const outputPos = inputPos * (outputMax - outputMin)
    return outputMin + outputPos
  }
}
