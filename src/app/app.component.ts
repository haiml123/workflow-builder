import {Component, Input} from '@angular/core';
import {WorkflowNode} from "@wf-models/node/node.model";
import {WorkflowService} from "@wf-services/workflow.service";


@Component({
  selector: 'app-root',
  template: `
    <div class="light-mode main-app">
      <mat-toolbar color="primary" class="m-b-15">
        Workflow Builder
      </mat-toolbar>
      <mat-drawer-container>
        <mat-drawer mode="side" opened>
          <workflow-sidebar [nodes]="nodes"></workflow-sidebar>
        </mat-drawer>
        <mat-drawer-content>
          <div class="ngx-workspace content">
            <app-workflow></app-workflow>
          </div>
        </mat-drawer-content>
      </mat-drawer-container>
    </div>
  `,
  // @ts-ignore
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  nodes: WorkflowNode[] = [
    new WorkflowNode('', {inputs: {name: 'hello'}}).setType('user-login').setViewOnly(),
    new WorkflowNode('', {inputs: {name: 'byy'}}).setType('plain').setViewOnly(),
    new WorkflowNode('', {inputs: {}}).setType('status-type').setViewOnly(),
    new WorkflowNode('', {inputs: {}}).setType('image-type').setViewOnly()
  ];
  constructor(private workflowService: WorkflowService) {

  }
}
