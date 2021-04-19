export function parse(value: unknown) {
  return JSON.parse(JSON.stringify(value));
}
