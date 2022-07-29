import {ElementBase} from "@wf-models/element.base.model";
import {WorkflowNode} from "@wf-models/node/node.model";
import {EdgesConnection} from "@wf-models/edges-connection.model";
import {NODE_EDGE_TYPE} from "@workflow-builder/consts/element.consts";


export class NodeEdge extends ElementBase {
  connections: NodeEdge[] = [];
  connectionRef: EdgesConnection;
  constructor(id: string,
              private type: NODE_EDGE_TYPE,
              private parent: WorkflowNode = null) {
    super(id);
  }

  setParent(node: WorkflowNode): NodeEdge {
    this.parent = node;
    return this;
  }

  geParent(): WorkflowNode {
    return this.parent;
  }

  isInput(): boolean {
    return this.type === NODE_EDGE_TYPE.INPUT;
  }

  isOutput(): boolean {
    return this.type === NODE_EDGE_TYPE.OUTPUT;
  }

  clone(id: string = ''): NodeEdge {
    return new NodeEdge(id, this.type);
  }

  connect(edge: NodeEdge): void {
    if(!this.connections.some((ed)=> ed === edge)) {
      this.connections.push(edge);
    }
  }

  disconnect(edge: NodeEdge): void {
    this.connections = this.connections.filter(connection => connection !== edge);
  }
}
