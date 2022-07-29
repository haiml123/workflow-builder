import {ChangeDetectorRef, Component, Input, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {ContentOutputs, KeyValue, NodeContent} from "@wf-types/general.types";
import {tap} from "rxjs";
import {WorkflowManager} from "@wf-services/workflow.manager";
import {WorkflowNode} from "@wf-models/node/node.model";
import {WorkflowService} from "@wf-services/workflow.service";

@Component({
  selector: 'content-loader',
  template: `
      <ng-container [ngSwitch]="renderMethod">
        <div *ngSwitchCase="'text'" [innerHTML]="view | sanitizeHtml"></div>
        <ng-container *ngSwitchCase="'template'">
          <ng-container *ngTemplateOutlet="view; context: context"></ng-container>
        </ng-container>
        <ng-container *ngSwitchCase="'component'">
          <ng-container #ref></ng-container>
        </ng-container>
      </ng-container>
  `,
})

export class ContentLoaderComponent {
  renderMethod: 'template' | 'component' | 'text' = 'component';
  @ViewChild('ref', { read: ViewContainerRef }) ref: ViewContainerRef;
  @Input() node: WorkflowNode;
  @Input() workflowManager: WorkflowManager;
  @Input() inputs: KeyValue;
  @Input() outputs: ContentOutputs;
  context: KeyValue;
  view: NodeContent;

  constructor(private cdr: ChangeDetectorRef, private workFlowService: WorkflowService) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    const inputs: KeyValue = this.inputs || {};
    // TODO find cleaner way.
    inputs['node'] = this.node;
    inputs['workflowManager'] = this.workflowManager;
    const {view} = this.workFlowService.getNodeView(this.node.type);
    this.view = view;
    if (typeof this.view === 'string') {
      this.renderMethod = 'text';
    }
    else if (this.view instanceof TemplateRef) {
      this.renderMethod = 'template';
      this.context = inputs;
    } else {
      const componentRef: any = this.ref.createComponent(this.view);

      if(inputs) {
        for(let k in inputs) {
          componentRef.instance[k] = inputs[k];
        }
      }
      if(this.outputs) {
        for(let k in this.outputs) {
          if(componentRef.instance[k] && this.outputs[k]) {
            componentRef.instance[k].pipe(
              tap((v)=> this.outputs[k](v)),
              // untilDestroyed(this)
            ).subscribe()
          }
        }
      }
      componentRef.changeDetectorRef.detectChanges();
    }

    this.cdr.detectChanges();
  }
}
