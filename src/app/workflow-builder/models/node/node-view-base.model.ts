import {AfterViewInit, Component, DoCheck, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges} from "@angular/core";
import {debounceTime, fromEvent, merge, Subscription, tap} from "rxjs";
import {WorkflowManager} from "@wf-services/workflow.manager";
import {WorkflowNode} from "@wf-models/node/node.model";


@Component({
  selector: 'node-view-base',
  template: `
   <div class="node-view-base">
     Node {{node?.id}}
   </div>
  `,
  styles: [`
   .node-view-base {
     border: solid 1px;
     width: 100px;
     height: 100px;
     display: flex;
     align-items: center;
     justify-content: center;
   }
  `]
})
export class NodeViewBaseModel implements OnDestroy {
  @Input() node: WorkflowNode;
  @Input() workflowManager: WorkflowManager;
  @Input() type: string;
  subscription: Subscription;
  constructor(private el: ElementRef) {
    this.listenToDomEvents();
  }

  listenToDomEvents(): void {
   this.subscription = merge(
      fromEvent(this.el.nativeElement, 'click'),
      fromEvent(this.el.nativeElement, 'keyup')
    ).pipe(
      debounceTime(100),
      tap(()=> {
        this.node && this.workflowManager?.reCalculate(this.node);
      })
    ).subscribe()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
