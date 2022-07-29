import {KeyValue, NodeContent, NodeData} from "@wf-types/general.types";
import {NODE_EDGE_TYPE} from "@workflow-builder/consts/element.consts";

export type PlainNodeEdges = {
  id?: string,
  type: NODE_EDGE_TYPE
}

export type PlainNode = {
  id?: string;
  type?: string;
  point?: {
    x: number,
    y: number
  };
  edges?: PlainNodeEdges[];
  data?: NodeData;
  mata?: KeyValue;
}
