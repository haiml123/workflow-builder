

export function getElementDataType(event: MouseEvent): string {
  let target = event.target as HTMLElement;
  target = target.closest('[data-type]');
  return target && target.getAttribute('data-type') || '';
}
