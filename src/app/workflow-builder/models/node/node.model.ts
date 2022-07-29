import {ElementBase} from "@wf-models/element.base.model";
import {ContentOutputs, KeyValue, NodeData} from "@wf-types/general.types";
import {NodeEdge} from "@wf-models/node/node-edge.model";
import {DraggingElement} from "@wf-models/dragging-element";
import {Point} from "@wf-models/point";
import {idGenerator} from "@wf-utils/id-generator";
import {isDefined} from "@wf-utils/is-defined";
import {NODE_EDGE_TYPE} from "@workflow-builder/consts/element.consts";

export class WorkflowNode extends DraggingElement(ElementBase) {
  viewOnly: boolean = false;
  point: Point | null;
  inputs: NodeEdge[] = [];
  outputs: NodeEdge[] = [];
  type: string = 'default';
  data: NodeData = {
    inputs: {
      node: this
    }
  }
  constructor(id: string, data?: NodeData) {
    super(id);
    this.data = {...this.data, ...data || {}};
  }

  setViewOnly(view: boolean = true): WorkflowNode {
    this.viewOnly = view;
    return this;
  }

  getDataInput(key: string): any {
    return this.data && this.data.inputs[key] || null;
  }

  setDataInput(key: string, value: any): WorkflowNode {
    if(key && isDefined(value)) {
      this.data.inputs[key] = value;
    }
    return this;
  }


  setData(inputs?: KeyValue, outputs?: ContentOutputs): WorkflowNode {
    this.data.inputs = inputs;
    this.data.outputs = outputs;
    return this;
  }

  setType(type: string): WorkflowNode {
    this.type = type;
    return this;
  }

  setPos(x: number, y: number): WorkflowNode;
  setPos(point: Point): WorkflowNode;
  setPos(...args: any[]): WorkflowNode {
    if(args[0] instanceof Point) {
      this.point = args[0];
    } else {
      this.point = new Point(args[0], args[1]);
    }
    return this;
  }

  getEdgeById(id: string): NodeEdge {
    return this.inputs.concat(this.outputs).find(edge => edge.id === id);
  }

  newEdge(type: NODE_EDGE_TYPE, id?: string): NodeEdge {
    return new NodeEdge(id, type).setParent(this);
  }

  addInput(input: any): WorkflowNode {
    this.inputs.push(this.newEdge(NODE_EDGE_TYPE.INPUT, input.id));
    return this;
  }

  addOutput(output: any): WorkflowNode {
    this.inputs.push(this.newEdge(NODE_EDGE_TYPE.OUTPUT, output.id));
    return this;
  }

  setInputs(inputs: any[]): WorkflowNode {
    this.inputs = inputs.map((input) => this.newEdge(NODE_EDGE_TYPE.INPUT, input.id));
    return this;
  }

  getInputs(): NodeEdge[] {
    return this.inputs;
  }

  setOutputs(outputs: any[]): WorkflowNode {
    this.outputs = outputs.map((output) => this.newEdge(NODE_EDGE_TYPE.OUTPUT, output.id));
    return this;
  }

  getOutputs(): NodeEdge[] {
    return this.outputs;
  }

  getNewClone(): WorkflowNode {
    const newNode = new WorkflowNode(idGenerator(), this.data);
    newNode
      .setPos(this.point.x, this.point.y)
      .setType(this.type)
      .setViewOnly(this.viewOnly);
    this.getInputs().forEach((input: NodeEdge) => newNode.inputs.push(input.clone().setParent(newNode)));
    this.getOutputs().forEach((output: NodeEdge) => newNode.outputs.push(output.clone().setParent(newNode)));
    return newNode;
  }
}
