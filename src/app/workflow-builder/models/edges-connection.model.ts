import {ElementBase} from "@wf-models/element.base.model";
import {NodeEdge} from "@wf-models/node/node-edge.model";
import {createCurvature} from "@wf-utils/create-curvature";

export class EdgesConnection extends ElementBase {
  inputEdge: NodeEdge;
  outputEdge: NodeEdge;
  fromPos: any;
  toPos: any;
  d: string;
  label: string;
  labelDeg: number;
  labelX: number;
  labelY: number;
  labelWidth: number;
  labelHeight: number;
  angle = 0;
  constructor(id?: string) {
    super(id);
  }

  setLabel(label: string): EdgesConnection {
    this.label = label;
    return this;
  }

  isOutputConnected(outputEdge: NodeEdge): boolean {
    return this.outputEdge === outputEdge;
  }

  isInputConnected(inputEdge: NodeEdge): boolean {
    return this.inputEdge === inputEdge;
  }

  reconnect(offset: any): EdgesConnection {
    this.fromPos = this.outputEdge?.center(offset);
    this.toPos = this.inputEdge?.center(offset);
    this.d = createCurvature(this.fromPos.x, this.fromPos.y, this.toPos.x, this.toPos.y, 0,'openclose');
    this.calculateLabelPos();
    return this;
  }



  private calculateLabelPos(): void {
    const elementRect = this.element ? (this.element as any).getBBox() : null;
    this.labelDeg = this.calculateAngle();
   if(this.element) {
     this.labelWidth = elementRect.width;
     this.labelHeight = elementRect.height;
     this.labelX = elementRect.x
     this.labelY = elementRect.y
   }
  }

  calculateAngle(): number {
    let deg = Math.atan2(this.fromPos.y - this.toPos.y, this.fromPos.x - this.toPos.x) * (180 / Math.PI);
    deg = deg < 0 ? deg + 360 : deg;
    // console.log('deg', deg);
    this.angle = (deg > 90 && deg < 270) ? deg + 180 : deg;
    return this.angle;
  }

  setConnection(outputEdge: NodeEdge, inputEdge: NodeEdge): EdgesConnection {
    this.outputEdge = outputEdge;
    this.inputEdge = inputEdge;
    return this;
  }

}
