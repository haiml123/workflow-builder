import {NodeEdge} from "@wf-models/node/node-edge.model";
import {Point} from "@wf-models/point";
import {TemplateRef, Type} from "@angular/core";

export type NgComponentType = Type<any>;
export type RegistryView = {view: NodeContent, inputs?: number, outputs?: number};
export type NodeContent = TemplateRef<any> | Type<any> | string | any;
export type Constructor = new (...args: any[]) => {};
export type ContentOutputs = {[key: string]: Function};
export type KeyValue = {[key: string] : any}
export type NodeData = {
  inputs?: KeyValue
  outputs?: ContentOutputs
};

export interface Connection {
  p1?: Point | null;
  p2?: Point | null;
  edge?: NodeEdge | null;
  d?: string | null;
}


export const enum ELEMENT_TYPE {
  NONE,
  NODE,
  CONNECTOR,
  EDGE
}

export const enum MOUSE_EVENT {
  NONE,
  MOUSE_DOWN,
  MOUSE_MOVE,
  MOUSE_UP
}
