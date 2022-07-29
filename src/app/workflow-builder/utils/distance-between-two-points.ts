

export function distanceBetweenTwoPoints(fromPos: {x: number, y: number}, toPos: {x: number, y: number}): number {
  return Math.sqrt(Math.pow((fromPos.x - toPos.x), 2) + Math.pow((fromPos.y - toPos.y), 2));
}
