import {AfterViewInit, Component, ElementRef, Input, OnInit} from '@angular/core';
import {WorkflowNode} from "@wf-models/node/node.model";
import {WorkflowManager} from "@wf-services/workflow.manager";
import {idGenerator} from "@wf-utils/id-generator";

@Component({
  selector: '[wf-node-view], wf-node-view',
  template: `
  <div [style.position]="position" *ngIf="node" data-type="node-view" class="node-view"
       [ngStyle]="{top: node.point?.y + 'px', left: node.point?.x + 'px'}"
       [attr.id]="node.id">
    <div class="node-edges node-inputs">
      <div data-type="node-edge"
           *ngFor="let edge of node?.inputs; let index = index"
           [attr.node-id]="node.id"
           set-element-to-model
           [model]="edge"
           [attr.id]="edge.id"
           class="node-edge">
      </div>
    </div>
    <div [ngStyle]="{'pointer-events': node.viewOnly ? 'none' : ''}"
         [ngClass]="{'node-selected': node.selected, 'node-dragging': node.dragging}">
      <content-loader style="z-index: 3"
                      [node]="node"
                      [workflowManager]="workflowManager"
                      [outputs]="node.data.outputs"
                      [inputs]="node.data.inputs">
      </content-loader>
    </div>
    <div class="node-edges node-outputs">
      <div data-type="node-edge"
           *ngFor="let edge of node?.outputs; let index = index"
           [attr.node-id]="node.id"
           set-element-to-model
           [model]="edge"
           [attr.id]="edge.id"
           class="node-edge">
      </div>
    </div>
  </div>
  `,
  styles: [`
    .node-view {
      /*position: absolute;*/
    }
    .node-edges {
      display: flex;
      justify-content: space-around;
    }
    .node-edge {
      position: relative;
      border-radius: 50%;
      height: 15px;
      width: 15px;
      border: 2px solid #cacaca;
      background: white;
    }
    .node-inputs .node-edge {
      top: 7.5px;
    }
    .node-outputs .node-edge {
      bottom: 7.5px;
    }
  `]
})
export class NodeViewComponent implements OnInit, AfterViewInit {
  isDragging: boolean = false;
  @Input() workflowManager: WorkflowManager;
  @Input() node: WorkflowNode | undefined;
  @Input() position: string = 'absolute';
  constructor(private el: ElementRef) {

  }
  ngOnInit(): void {
    if(this.node) {
      if(!this.node.id) {
        this.node.id = idGenerator();
      }
    }
  }

  ngAfterViewInit(): void {
    if(this.node) {
      this.el.nativeElement.classList.add('node-view');
      this.node.element = this.el.nativeElement.firstChild;
      if(!this.node.point) {
        console.log('auto set', this.node.rectInfo())
        this.node.setPos(this.node.rectInfo().left, this.node.rectInfo().top);
      }
    }
  }


}
