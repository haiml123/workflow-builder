import {Point} from "@wf-models/point";
import {idGenerator} from "@wf-utils/id-generator";

export class ElementBase {
  _element: HTMLElement | any;
  selected: boolean = false;
  active: boolean = false;
  id: string;
  meta: any = {};
  constructor(id: string) {
    this.id = id || idGenerator();
  }

  setMeta(key: string, value: unknown): ElementBase {
    this.meta[key] = value;
    return this;
  }


  set element(element) {
    this._element = element;
  }

  get element(): HTMLElement {
    return this._element;
  }

  rectInfo(): DOMRect {
    return this._element.getBoundingClientRect();
  }

  center(offset: Point = new Point(0, 0)): Point {
    const rect = this.rectInfo();{}
    const left = rect.left - offset.x;
    const top = rect.top - offset.y;
    const x = left + (rect.width / 2);
    const y = top + (rect.height / 2);
    return new Point(x, y);
  }

  isElementInRectangle(p1: Point, p2: Point, offset: Point): boolean {
    const rect = this.rectInfo();
    const x1 = rect.left - offset.x;
    const y1 = rect.top - offset.y;
    const x2 = x1 + rect.width;
    const y2 = y1 + rect.height;
    const isXEdgeInRange1 =  ((x1 >= p1.x && x1 <= p2.x) || (x2 >= p1.x && x2 <= p2.x));
    const isYEdgeInRange1 = ((y1 >= p1.y && y1 <= p2.y) || (y2 >= p1.y && y2 <= p2.y));
    const isXEdgeInRange2 = (p1.x >= x1 && p1.x <= x2) || (p2.x >= x1 && p2.x <= x2);
    const isYEdgeInRange2 = (p1.y >= y1 && p1.y <= y2) || (p2.y >= y1 && p2.y <= y2);
    return (isXEdgeInRange1 && isYEdgeInRange1) || (isXEdgeInRange1 && isYEdgeInRange2) || (isYEdgeInRange1 && isXEdgeInRange2);
    // return x1 >= p1.x && y1 >= p1.y && x2 <= p2.x && y2 <= p2.y;
  }

  select(): ElementBase {
    this.selected = true;
    return this;
  }

  unSelect(): ElementBase {
    this.selected = false;
    return this;
  }

  isSelected(): boolean {
    return this.selected;
  }

  activate(): ElementBase {
    this.active = true;
    return this;
  }

  deActivate(): ElementBase {
    this.active = false;
    return this;
  }

}
