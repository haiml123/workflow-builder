import {WorkflowOptions} from "@wf-types/workflow-options.type";
import {NodeViewBaseModel} from "@wf-models/node/node-view-base.model";
import {ConnectorLabelViewComponent} from "@workflow-builder/components/connector-label-view.component";

export const WorkflowDefaultOptions: WorkflowOptions = {
  workspaceClass: 'workflow-canvas',
  connectorLabelComponent: ConnectorLabelViewComponent,
  defaultNodeComponent: {view: NodeViewBaseModel, inputs: 1, outputs: 1},
  nodeDraggingClass: 'node-dragging',

}
