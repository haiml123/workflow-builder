import {NgComponentType, NodeContent, RegistryView} from "@wf-types/general.types";


export type NodeType = {key: string, comp: NodeContent, inputs?: number, outputs?: number};

export interface WorkflowOptions {
  workspaceClass?: string;
  connectorLabelComponent?: NgComponentType;
  defaultNodeComponent?: RegistryView;
  nodeDraggingClass?: string;
}

export interface ModuleConfigOption {
  options?: WorkflowOptions;
  plugins?: any[];
  nodes?: NodeType[]
}

