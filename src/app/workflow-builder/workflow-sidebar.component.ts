import {ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {WorkflowNode} from "@wf-models/node/node.model";
import {WorkflowService} from "@wf-services/workflow.service";
import {Point} from "@wf-models/point";
import {fromEvent, switchMap, takeUntil, tap} from "rxjs";
import {filter} from "rxjs/operators";
import {takeUntilDestroy$} from "@wf-utils/until-destroyed";

@Component({
  selector: 'workflow-sidebar',
  template:`
    <div class="workflow-sidebar">
      <wf-node-view *ngFor="let node of nodes"
                    [node]="node"
                    [id]="node.id"
                    position="none"></wf-node-view>
      <wf-node-view *ngIf="selectedNode" [node]="selectedNode"
                    position="fixed">
      </wf-node-view>
    </div>
  `,
  styles: [`
    .workflow-sidebar {
      display: flex;
      flex-flow: row wrap;
      wf-node-view {
        margin: 5px;
        width: calc(50% - 10px);
      }
    }
  `]
})
export class WorkflowSidebar implements OnInit {
  selectedNode: WorkflowNode = null;
  point = new Point(0, 0);
  _nodes: WorkflowNode[] = [];
  @Input() nodes: WorkflowNode[] = [];
  constructor(private el: ElementRef, private workflowService: WorkflowService) {
    this.registerMouseEvents();
  }

  isNodeType(event: MouseEvent): boolean {
    return !!(event.target as HTMLElement).closest('.node-view');
  }

  registerMouseEvents() {
    const mousedown$ = fromEvent<MouseEvent>(this.el.nativeElement, 'mousedown');

    const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove');

    const mouseup$ = fromEvent<MouseEvent>(document, 'mouseup')
      .pipe(tap((event)=> this.onMouseUp(event)));

    mousedown$.pipe(
      filter((event)=> this.isNodeType(event)),
      tap((event: MouseEvent)=> this.onMouseDown(event)),
      switchMap((event) => mousemove$.pipe(takeUntil(mouseup$))),
      tap((event: MouseEvent)=> this.onMouseMove(event)),
      takeUntilDestroy$(),
    ).subscribe()
  }

  onMouseMove(event: MouseEvent): void {
    const {top, left, width, height} = this.selectedNode && this.selectedNode.element ? this.selectedNode.rectInfo() : this.getSidebarRect();
    if(this.selectedNode) {
      this.point.x += event.clientX - left - (width / 2);
      this.point.y += event.clientY - top - (height / 2);
      this.selectedNode
        .setPos(this.point.x, this.point.y)
        .draggingOn();
      if(this.selectedNode.element) {
        this.selectedNode.element.style.zIndex = '9';
        this.selectedNode.element?.focus();
      }
    }
  }

  ngOnInit(): void {

  }

  getSidebarRect() {
    return this.el.nativeElement.getBoundingClientRect();
  }

  getNodeByTarget(target: HTMLElement) {
    const nodeWrap = target.closest('wf-node-view')
    return nodeWrap && nodeWrap.id ? this.nodes.find(node => node.id === nodeWrap.id) : null;
  }

  onMouseDown(event: MouseEvent): void {
    const node = this.getNodeByTarget(event.target as HTMLElement);
    if(node) {
      const {top, left} = this.getSidebarRect();
      this.selectedNode = node.getNewClone();
      this.point.x = this.point.x + event.clientX - left;
      this.point.y = this.point.y + event.clientY - top;
      console.log(this.point, event.clientX, event.clientY)
      this.selectedNode.setPos(this.point.x, this.point.y);
    }
  }

  onMouseUp(event: MouseEvent): void {
    console.log('UPUPUP');
    if(this.selectedNode) {
      const wm = this.workflowService.getWorkspaceByPos(this.selectedNode.point.x, this.selectedNode.point.y);
     if(wm) {
       const newPoint = this.selectedNode.point.clone();
       newPoint.x = newPoint.x - wm.boundary.left;
       newPoint.y = newPoint.y - wm.boundary.top;
       const newNode = new WorkflowNode(this.selectedNode.id)
         .setData(this.selectedNode?.data?.inputs, this.selectedNode?.data?.outputs)
         .setType(this.selectedNode.type)
         .setPos(newPoint);
       wm.addWorkflowNodes([newNode]);
     }
    }
    this.selectedNode = null;
    this.point.x = 0;
    this.point.y = 0;
  }
}
