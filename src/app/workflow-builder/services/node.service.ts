import {WorkflowNode} from "@wf-models/node/node.model";
import {runPlugins} from "@wf-utils/run-plugins";
import {Point} from "@wf-models/point";
import {BaseService} from "@wf-services/base.service";
import {ConnectorService} from "@wf-services/connector.service";
import {PLUGIN_METHOD} from "@wf-types/plugin.types";


export class NodeService extends BaseService {
  nodes: any[] = [];
  dragOffsets: Map<WorkflowNode, any> = new Map();
  cursorPoint: Point | null = null;
  connectorService: ConnectorService;

  constructor() {
    super();
  }

  setPointCursor(point: Point): void {
    this.cursorPoint = point;
  }

  resetPointCursor(unSelect = true): void {
    this.cursorPoint = null;
    if (unSelect) {
      this.unSelectAll();
      this.dragOffsets.clear();
    }
  }

  getNodeById(id: string): WorkflowNode {
    return this.nodes.find(node => node.id === id);
  }

  unSelectAll() {
    [...this.dragOffsets.keys()].forEach(node => (node.unSelect() as WorkflowNode).draggingOff());
  }

  addNode(node: WorkflowNode, inputs: number, outputs: number): void {
    runPlugins<[WorkflowNode, number, number], null, void>(this.plugins, PLUGIN_METHOD.ON_REGISTER_NODE, null, node, inputs, outputs);
    this.nodes.push(node);
  }

  addPlainNodes(nodes: any[]) {

  }

  onMouseDown(event: MouseEvent, selectedIds: string[]): void {
    this.nodes.filter(node => selectedIds.includes(node.id))
      .forEach(node => {
        if(runPlugins<[WorkflowNode], boolean, boolean>(this.plugins, PLUGIN_METHOD.IS_NODE_SELECTABLE_VALIDATOR, true, node)) {
          node.select();
        }
      });
    this.getSelectedNodes().forEach((node: WorkflowNode) => {
      this.dragOffsets.set(node, {
        x: node.point.x - event.clientX,
        y: node.point.y - event.clientY
      });
    });
  }



  onMouseMove(ev: MouseEvent): void {
    const zoom = 1;
    let widthZoom = this.boundary.width / (this.boundary.width * zoom);
    widthZoom = widthZoom || 0;
    let heightZoom = this.boundary.height / (this.boundary.height * zoom);
    heightZoom = heightZoom || 0;
    ev.preventDefault();
    this.getSelectedNodes()
      .filter(node => runPlugins<[WorkflowNode], boolean, boolean>(this.plugins, PLUGIN_METHOD.IS_NODE_DRAGGABLE_VALIDATOR, true, node))
      .forEach((node) => {
        const offset = this.dragOffsets.get(node);
        node.draggingOn();
        if (offset) {
          node.point.x = this.getXCoordinate(offset.x + ev.clientX, node.rectInfo().width) * widthZoom;
          node.point.y = this.getYCoordinate(offset.y + ev.clientY, node.rectInfo().height) * heightZoom;
        }
        this.recalculate(node);
      });
  }

  onMouseUp(event: MouseEvent): void {
    this.nodes.forEach(node => this.recalculate(node));
    this.resetPointCursor();
  }

  recalculate(node: WorkflowNode): void {
    this.connectorService.reCalculate(node.getInputs());
    this.connectorService.reCalculate(node.getOutputs());
  }

  reCalculateAllActive(): void {
    this.getSelectedNodes().forEach(node => this.recalculate(node));
  }

  getSelectedNodes(): WorkflowNode[] {
    return this.nodes.filter(node => node.isSelected());
  }

  findNodeById(nodeId: string): WorkflowNode {
    return this.nodes.find(node => node.id === nodeId);
  }


  private getCoordinate(coordinate: number, max: number): number {
    coordinate = Math.max(coordinate, 0);
    coordinate = Math.min(coordinate, max);
    return coordinate;
  }

  private getXCoordinate(x: number, w: number): number {
    let coordinate = x;
    const { left, right } = this.boundary;
    if (x < (2)) {
      coordinate = 2;
    } else if (x > (right - w - left - 1)) {
      coordinate = right - w - left;
    }
    return coordinate;
  }

  /**
   * Force boundary workspace
   * @param y
   * @param h
   * @private
   */
  private getYCoordinate(y: number, h: number): number {
    const { top, bottom } = this.boundary;
    let coordinate = y;
    if(y <= 0) {
      coordinate = 1;
    }
    else if(y > (bottom - h - top - 1)) {
      coordinate = bottom - h - top - 1;
    }
    return coordinate;
  }


}
