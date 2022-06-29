export function padStart(input: number, length: number, char: string = "0") {
  const s = String(input);
  const diff = length - s.length;
  if (diff > 0) {
    const pad = new Array(diff).fill(char).join("");
    return pad + s;
  }
  return s;
}