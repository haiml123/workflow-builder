import {Point} from "@wf-models/point";
import {NodeService} from "@wf-services/node.service";
import {ConnectorService} from "@wf-services/connector.service";
import {BaseService} from "@wf-services/base.service";
import {WorkflowNode} from "@wf-models/node/node.model";
import {PlainNode} from "@wf-types/plain-node.type";
import {WorkflowService} from "@wf-services/workflow.service";
import {NodeEdge} from "@wf-models/node/node-edge.model";
import {EdgesConnection} from "@wf-models/edges-connection.model";
import {runPlugins} from "@wf-utils/run-plugins";
import {PLUGIN_METHOD} from "@wf-types/plugin.types";
import {WorkflowOptions} from "@wf-types/workflow-options.type";
import {MOUSE_EVENT} from "@wf-types/general.types";
import {getElementDataType} from "@wf-utils/get-element-data-type";
import {ELEMENT_TYPE} from "@workflow-builder/consts/element.consts";


export class WorkflowManager extends BaseService {
  private workflowService: WorkflowService;
  private pointCursor: Point | null = null;
  selectedType: string = '';
  selectedElement: WorkflowNode | NodeEdge | EdgesConnection;
  nodeService = new NodeService();
  connectorService = new ConnectorService();
  options: any;

  constructor(private id: string, workspaceElem: HTMLElement) {
    super();
    this.setBoundaryElement(workspaceElem)
      .setBoundary();
  }

  setOptions(options: WorkflowOptions): WorkflowManager {
    const oldOptions = this.options;
    this.options = {...this.options, ...options};
    runPlugins<[WorkflowOptions, WorkflowOptions], WorkflowOptions, void>(this.plugins, PLUGIN_METHOD.ON_OPTION_CHANGED, oldOptions, this.options, oldOptions);
    return this;
  }

  iniPlugins(plugins: any[]): WorkflowManager {
    const newPlugins = plugins.filter((plugin: any) => !this.plugins.some((oldPlugins: any) => plugin.key === oldPlugins.key ))
    newPlugins.map(plugin => new plugin(this)).forEach((plugin)=> {
      if(plugin.onInit) {
        plugin.onInit();
      }
      this.plugins.push(plugin);
    });
    this.nodeService.setPlugins(this.plugins);
    this.connectorService.setPlugins(this.plugins);
    return this;
  }

  isPosInBoundary(x: number, y: number): boolean {
    const isOverlapping = x >= this.boundary.x && ((this.boundary.x + this.boundary.width) >= x)
      && y >= this.boundary.y && ((this.boundary.y + this.boundary.height) >= y);
    return isOverlapping;
  }

  getId(): string {
    return this.id;
  }

  getNodes(): WorkflowNode[] {
    return this.nodeService.nodes;
  }

  getNodeConnectors(node: NodeEdge | string): {inputs: EdgesConnection[], outputs: EdgesConnection[]} {
    const workflowNode = node instanceof WorkflowNode ? node : this.nodeService.getNodeById(node as string);
    return this.connectorService.getNodeConnectors(workflowNode);
  }

  reCalculate(node: WorkflowNode): WorkflowManager {
    this.nodeService.recalculate(node);
    return this;
  }

  dispatchEvent(eventName: string, data: any): void {
    this.workflowService.eventManager.next({eventName, data})
  }

  setWorkflowService(workflowService: WorkflowService): WorkflowManager {
    this.workflowService = workflowService;
    this.connectorService.dispatch = this.dispatchEvent;
    this.connectorService.dispatch = this.dispatchEvent;
    return this;
  }

  setBoundary(): WorkflowManager {
    this.connectorService.setBoundaryElement(this.boundaryElement);
    this.nodeService.setBoundaryElement(this.boundaryElement);
    this.nodeService.connectorService = this.connectorService;
    return this;
  }

  private setPointCursor(x: number, y: number): void {
    this.pointCursor = new Point(x, y);
    this.nodeService.setPointCursor(this.pointCursor);
  }

  private resetPointCursor(unSelect = true): void {
    this.pointCursor = null;
    this.selectedType = '';
    this.nodeService.resetPointCursor(unSelect);
  }

  disconnect(connector: EdgesConnection) {
    this.connectorService.disconnect(connector);
  }

  addWorkflowNodes(nodes: WorkflowNode[]): WorkflowManager {
    nodes.forEach((node) => {
        const {inputs, outputs} = this.workflowService.getNodeView(node.type);
        this.nodeService.addNode(node, inputs, outputs)
      }
    );
    return this;
  }

  addPlainNodes(nodes: PlainNode[]): WorkflowManager {
    const workflowNodes = nodes.map(node => new WorkflowNode(node.id)
      .setData(node?.data?.inputs, node?.data?.outputs)
      .setPos(node?.point?.x, node?.point?.y)
      .setType(node?.type)
    );
    this.addWorkflowNodes(workflowNodes);
    return this;
  }

  handleEventOutsideBoundary(eventCode: MOUSE_EVENT): void {
    if(eventCode === MOUSE_EVENT.MOUSE_MOVE) {
      this.nodeService.reCalculateAllActive();
    } else if(eventCode === MOUSE_EVENT.MOUSE_UP) {
      // TODO cache result
      this.nodeService.reCalculateAllActive();
      this.connectorService.resetConnection();
      this.nodeService.resetPointCursor(true);
    }

  }

  onMouseDown(event: MouseEvent): void {
    this.setPointCursor(event.clientX, event.clientY);
    let target = event.target as HTMLElement;
    target = target.closest('[data-type]');
    const dataType = getElementDataType(event);
    if(dataType !== ELEMENT_TYPE.CONNECTOR) {
      this.connectorService.resetPathSelection();
    }
    switch (dataType) {
      case ELEMENT_TYPE.NODE: {
        event.stopPropagation();
        const id = target.id;
        this.selectedType = ELEMENT_TYPE.NODE;
        this.nodeService.onMouseDown(event, [id]);

        break;
      }

      case ELEMENT_TYPE.EDGE: {
        event.stopPropagation();
        this.selectedType = ELEMENT_TYPE.EDGE;
        const nodeId = target.getAttribute('node-id');
        const edgeId = target.id;
        const node = this.nodeService.findNodeById(nodeId);
        if (node) {
          this.selectedElement = node;
          const edge = node.getEdgeById(edgeId);
          this.selectedElement = edge;
          this.connectorService.onMouseDown(event, edge);
        }
        break;
      }

      case ELEMENT_TYPE.CONNECTOR: {
        this.selectedType = ELEMENT_TYPE.CONNECTOR;
        break;
      }
      case ELEMENT_TYPE.LABEL_CONNECTOR: {
        this.selectedType = ELEMENT_TYPE.LABEL_CONNECTOR;
        break;
      }
      case ELEMENT_TYPE.WORKSPACE: {
        break;
      }
      default: {
        // runPlugins(this.plugins, 'onWorkspaceMouseDown', event, this.selectedType);
      }
    }
  }

  onMouseMove(event: MouseEvent): void {
    const dataType = getElementDataType(event);
    switch (this.selectedType) {
      case ELEMENT_TYPE.NODE: {
        if (this.pointCursor) {
          this.nodeService.onMouseMove(event);
        }
        break;
      }

      case ELEMENT_TYPE.EDGE: {
        this.selectedType = ELEMENT_TYPE.EDGE;
        event.stopPropagation();
        this.connectorService.onMouseMove(event);
        break;
      }

      case ELEMENT_TYPE.CONNECTOR: {

        break;
      }
    }
    this.setPointCursor(event.clientX, event.clientY);
  }

  onMouseUp(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    let unselect = true;
    const dataType = getElementDataType(event);
    if(dataType !== ELEMENT_TYPE.CONNECTOR) {
      this.connectorService.resetPathSelection();
    }
    switch (this.selectedType) {
      case ELEMENT_TYPE.NODE: {
        this.nodeService.onMouseUp(event);
        break;
      }

      case ELEMENT_TYPE.EDGE: {
        const edgeId = target.id;
        const nodeId = target.getAttribute('node-id');
        const node = this.nodeService.findNodeById(nodeId);
        if (node) {
          const edge = node.getEdgeById(edgeId);
          this.connectorService.onMouseUp(event, edge);
        } else {
          this.connectorService.resetConnection();
        }
        break;
      }

      case ELEMENT_TYPE.CONNECTOR: {
        break;
      }
      default: {
        unselect = false;
      }
    }
    this.selectedType = '';
    this.resetPointCursor(unselect);
  }

  onMouseClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dataType = getElementDataType(event);
    console.log('event', target);
    if(dataType !== ELEMENT_TYPE.CONNECTOR) {
      this.connectorService.resetPathSelection();
    } else {
      const connectorId = target.id;
      this.connectorService.onPathClicked(connectorId, event);
    }
  }
}
