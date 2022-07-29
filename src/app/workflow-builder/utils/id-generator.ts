
let count = 0;
export function idGenerator(): string {
  count++;
  return count.toString();
}
