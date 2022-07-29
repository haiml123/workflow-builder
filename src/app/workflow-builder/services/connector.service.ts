import {NodeEdge} from "@wf-models/node/node-edge.model";
import {Connection} from "@wf-types/general.types";
import {BaseService} from "@wf-services/base.service";
import {Point} from "@wf-models/point";
import {createCurvature} from "@wf-utils/create-curvature";
import {EdgesConnection} from "@wf-models/edges-connection.model";
import {runPlugins} from "@wf-utils/run-plugins";
import {PLUGIN_METHOD} from "@wf-types/plugin.types";
import {WorkflowNode} from "@wf-models/node/node.model";


export class ConnectorService  extends BaseService {
  nodes: any[] = [];
  edges: NodeEdge[] = [];
  connection: Connection;
  connectors: EdgesConnection[] = [];
  selectedPaths: Map<string, EdgesConnection> = new Map<string, EdgesConnection>();
  constructor() {
    super();
    this.resetConnection();
  }

  resetConnection(): void {
    this.connection = {p1: null, p2: null, edge: null, d: null};
  }

  getConnectorById(id: string): EdgesConnection {
    return this.connectors.find(connector => connector.id === id);
  }

  disconnect(connector: EdgesConnection): void {
    this.connectors = this.connectors.filter(connection => connection !== connector);
  }

  getNodeConnectors(node: WorkflowNode) {
    let connectors: {inputs: EdgesConnection[], outputs: EdgesConnection[]} = {inputs: [], outputs: []};
      connectors.inputs = this.connectors.filter((connector)=> node.inputs.includes(connector.outputEdge))
      connectors.outputs = this.connectors.filter((connector)=> node.outputs.includes(connector.inputEdge))
      return connectors;
  }

  isConnectionExists(outputEdge: NodeEdge, inputEdge: NodeEdge) {
    return !this.connectors.some(connector => connector.outputEdge === outputEdge && connector.inputEdge === inputEdge)
  }

  public getEdgeDAttribute(pt1: any, pt2: any, style: string): string {
    return createCurvature(pt1.x, pt1.y, pt2.x, pt2.y, 0.2,'openclose');
  }

  resetPathSelection() {
    [...this.selectedPaths.values()].forEach(connector => connector.unSelect());
    this.selectedPaths.clear();
  }

  onPathClicked(id: string, event: MouseEvent) {
    const connector = this.getConnectorById(id);
    if(connector) {
      connector.select();
      this.selectedPaths.set(id, connector);
    }
    runPlugins<[EdgesConnection, HTMLElement], null, void>(this.plugins, PLUGIN_METHOD.ON_CONNECTOR_CLICKED, null, connector, event.target as HTMLElement);
  }

  onMouseDown(event: MouseEvent, edge: NodeEdge): void {
    if(edge.isOutput()) {
      this.connection.p1 = edge.center(new Point(this.boundary.left, this.boundary.top));
      this.connection.p2 = new Point(event.clientX - this.boundary.x, event.clientY - this.boundary.y)
      this.connection.edge = edge;
      this.connection.d = this.getEdgeDAttribute(this.connection.p1, this.connection.p2, 'openclose');
      runPlugins<[NodeEdge], null, void>(this.plugins, PLUGIN_METHOD.ON_EDGE_SELECTED, null, edge);
    }
  }

  onMouseMove(ev: MouseEvent): any {
    if(!this.connection.edge) return false;

    ev.preventDefault();
    const canvasOffset = this.boundary;
    this.connection.p2 = new Point(ev.clientX - canvasOffset.x,ev.clientY - canvasOffset.y );

    this.connection.d = this.getEdgeDAttribute(this.connection.p1, this.connection.p2, 'openclose');
  }

  onMouseUp(ev: MouseEvent, edge: NodeEdge | null = null): void {
    if(this.connection && this.connection.edge && edge) {
      const isValidConnection = runPlugins<[NodeEdge, NodeEdge, EdgesConnection[]], boolean, boolean>(this.plugins, PLUGIN_METHOD.IS_VALID_CONNECTION_VALIDATOR, true, this.connection.edge, edge , this.connectors);
      if(isValidConnection && this.isConnectionExists(this.connection.edge, edge)) {
        edge.connect(this.connection.edge);
        this.connection.edge.connect(edge);
        const newConnector = new EdgesConnection()
          .setConnection(this.connection.edge, edge)
          .reconnect(this.boundary);
        runPlugins<[EdgesConnection], null, void>(this.plugins, PLUGIN_METHOD.ON_CONNECTOR_CREATED, null, newConnector);
        this.connectors.push(newConnector);
      }
    }
    this.resetConnection();
  }

  reCalculate(edges: NodeEdge[]): void {
    const canvasOffset = this.boundary;
    edges.forEach((edge: NodeEdge)=> {
      const edgesToRecalculate = this.connectors.filter(connection => connection.isInputConnected(edge) || connection.isOutputConnected(edge));
      edgesToRecalculate.forEach((connection)=> {
        connection.reconnect(canvasOffset);
      });
    });
  }
}
