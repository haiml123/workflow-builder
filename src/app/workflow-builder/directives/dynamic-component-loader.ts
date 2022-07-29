import {AfterViewInit, ChangeDetectorRef, Directive, Input, OnInit, ViewContainerRef} from "@angular/core";
import {WorkflowService} from "@wf-services/workflow.service";

@Directive({
  selector: '[dynamic-component-loader]'
})
export class DynamicComponentLoaderDirective implements OnInit, AfterViewInit {
  @Input() comp: any;
  @Input() inputs: any;
  compRef: any;

  constructor(private workflowService: WorkflowService, private containerRef: ViewContainerRef, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.compRef = this.containerRef.createComponent(this.comp, this.containerRef);
    for(const k in this.inputs) {
      this.compRef.instance[k] = this.inputs[k];
    }
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
  }

}
