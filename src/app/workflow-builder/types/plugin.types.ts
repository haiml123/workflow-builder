import {NodeEdge} from "@wf-models/node/node-edge.model";
import {WorkflowNode} from "@wf-models/node/node.model";
import {EdgesConnection} from "@wf-models/edges-connection.model";
import {NgComponentType} from "@wf-types/general.types";
import {WorkflowOptions} from "@wf-types/workflow-options.type";

export const PLUGIN_METHOD = {
  ON_OPTION_CHANGED: 'onOptionChanged',
  ON_EDGE_SELECTED: 'onEdgeSelected',
  ON_REGISTER_NODE: 'onRegisterNode',
  ON_CONNECTOR_CREATED: 'onConnectorCreated',
  ON_CONNECTOR_CLICKED: 'onConnectorClicked',
  IS_VALID_CONNECTION_VALIDATOR: 'isValidConnectionValidator',
  IS_NODE_SELECTABLE_VALIDATOR: 'isNodeSelectableValidator',
  IS_NODE_DRAGGABLE_VALIDATOR: 'isNodeDraggableValidator',
}

export interface WorkflowPlugin {
  workspaceAddon?: NgComponentType;
  onInit?(): void;
  onOptionChanged?(newOptions: WorkflowOptions, oldOptions: WorkflowOptions): void;
  onEdgeSelected?(edge: NodeEdge): void;
  onRegisterNode?(node: WorkflowNode, inputs: number, outputs: number): void;
  onConnectorCreated?(connection: EdgesConnection): void;
  onConnectorClicked?(connection: EdgesConnection, path: HTMLElement): void;
  isValidConnectionValidator?(output: NodeEdge, input: NodeEdge, connectors: EdgesConnection[]): boolean;
  isNodeSelectableValidator?(node: WorkflowNode): boolean;
  isNodeDraggableValidator?(node: WorkflowNode): boolean;
}
