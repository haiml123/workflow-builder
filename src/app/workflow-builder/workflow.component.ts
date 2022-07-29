import {AfterViewInit, Component, ElementRef, HostBinding, Input, OnInit, ViewChild} from '@angular/core';
import {WorkflowService} from "@wf-services/workflow.service";
import {WorkflowManager} from "@wf-services/workflow.manager";
import {CorePlugin} from "@wf-plugins/core.plugin";
import {MultiSelectionPlugin} from "@wf-plugins/multi-selection-plugin/multi-selection.plugin";

@Component({
  selector: 'app-workflow',
  template: `
    <div class="workflow-app">
      <div class="workspace workflow-canvas"
           #workspaceRef
           (click)="onMouseClick($event)"
           (mouseup)="onMouseUp($event)"
           (mousedown)="onMouseDown($event)"
           (mousemove)="onMouseMove($event)">

        <ng-container *ngFor="let node of workflowManager?.nodeService?.nodes">
          <wf-node-view [workflowManager]="workflowManager" [node]="node"></wf-node-view>
        </ng-container>

        <svg class="connection">
          <defs>
            <marker class="fc-arrow-marker" id="arrowDefId" markerWidth="5" markerHeight="5" viewBox="-6 -6 12 12"
                    refX="10"
                    refY="0" markerUnits="strokeWidth" orient="auto">
              <polygon points="-2,0 -5,5 5,0 -5,-5" stroke="gray" fill="gray" stroke-width="1px"/>
            </marker>
          </defs>


          <path set-element-to-model [model]="connection"
                [attr.d]="connection.d"
                [id]="connection.id"
                *ngFor="let connection of workflowManager?.connectorService?.connectors"
                data-type="connector"
                class="main-path"
                [class.active]="connection.active"
                [class.selected]="connection.selected"
                marker-end="url(#arrowDefId)">
          </path>
          <path
            *ngIf="workflowManager && workflowManager.connectorService && workflowManager.connectorService.connection && workflowManager.connectorService.connection.d"
            [attr.d]="workflowManager?.connectorService.connection.d"
            class="main-path"
            marker-end="url(#arrowDefId)">
          </path>
        </svg>

<!--        transform: 'rotate(' + connector.labelDeg  + 'deg)'-->
        <div *ngFor="let connector of workflowManager?.connectorService?.connectors"
             [ngStyle]="{position: 'absolute'}"
             class="label-wrapper"
             connection-label [connection]="connector" [workflowManager]="workflowManager">
          <ng-container dynamic-component-loader
                        [comp]="workflowManager.options.connectorLabelComponent"
                        [inputs]="{connector: connector, workflowManager: workflowManager}">

          </ng-container>
        </div>

          <ng-container *ngFor="let plugin of workflowManager?.plugins">
            <ng-container *ngIf="plugin && plugin.workspaceAddon"
                          dynamic-component-loader
                          [comp]="plugin.workspaceAddon"
                          [inputs]="{workflowManager: workflowManager, inputs: plugin?.addonInputs}">
            </ng-container>
          </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .workflow-app {
      display: flex;
      width: 100%;

    .workspace {
      /*display: flex;*/
      /*width: 70%;*/

    .connection {
      width: 100%;
      height: 100%;
      /*z-index: 10;*/

    .main-path {
      position: absolute;
      fill: none;
      stroke-width: 5px;
      stroke: #1e73eb;
    }

    }
    .label-wrapper {
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    }
    .sidebar {
      width: 30%;
    }

    }
    .workflow-canvas {
      position: relative;
      background: var(--background-color);
      background-size: 25px 25px;
      background-image: linear-gradient(to right, #f1f1f1 1px, transparent 1px), linear-gradient(to bottom, #f1f1f1 1px, transparent 1px);
      width: 100%;
      min-height: 600px;
      height: 100%;
      user-select: none;
    }
  `]
})
export class WorkflowComponent implements OnInit, AfterViewInit {
  @HostBinding('attr.id') id = Date.now().toString();
  @Input() options: any = {};
  workflowManager: WorkflowManager | undefined;
  @ViewChild('workspaceRef') workspaceRef: ElementRef | undefined;
  @Input() nodes: any[] = [];

  constructor(public workflowService: WorkflowService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.workflowManager = this.workflowService.initInstance(this.id, this.workspaceRef?.nativeElement, this.options);
  }

  onMouseClick(event: MouseEvent) {
    this.workflowManager?.onMouseClick(event);
  }

  onMouseUp(event: MouseEvent) {
    this.workflowManager?.onMouseUp(event);
  }

  onMouseDown(event: MouseEvent) {
    this.workflowManager?.onMouseDown(event);
  }

  onMouseMove(event: MouseEvent) {
    this.workflowManager?.onMouseMove(event);
  }

}
