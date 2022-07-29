import {WorkflowNode} from "@wf-models/node/node.model";
import {WorkflowManager} from "@wf-services/workflow.manager";
import {EdgesConnection} from "@wf-models/edges-connection.model";
import {WorkflowPlugin} from "@wf-types/plugin.types";
import {PluginBase} from "@wf-plugins/plugin.base";
import {NodeEdge} from "@wf-models/node/node-edge.model";

export class CorePlugin extends PluginBase implements WorkflowPlugin {
  static key: string =  'core-plugin';
  static priority: number = 1;
  constructor(workflowManager: WorkflowManager) {
    super(workflowManager);
  }

  onRegisterNode(node: WorkflowNode, inputs: number, outputs: number): void {
    if(!node.inputs.length) {
      node.setInputs(new Array(inputs).fill({}));
    }
    if(!node.outputs.length) {
      node.setOutputs(new Array(outputs).fill({}));
    }
    if(!node.meta) {
      node.meta = {};
    }
  }

  onConnectorCreated(connector: EdgesConnection): void {
    const fromEdge = connector.outputEdge;
    const fromNode = fromEdge.geParent();
    const toEdge = connector.inputEdge;
    const toNode = toEdge.geParent();
    connector.setLabel(`${fromNode.id}:${fromEdge.id} -> ${toNode.id}:${toEdge.id}`);
  }

  isValidConnectionValidator(output: NodeEdge, input: NodeEdge, connectors: EdgesConnection[]): boolean {

    return (output.isOutput() && input.isInput()) && (output.geParent() !== input.geParent());
  }
}
