import {AfterViewInit, HostBinding, OnInit} from '@angular/core';
import { Directive, Input, ElementRef } from '@angular/core';
import {EdgesConnection} from "@wf-models/edges-connection.model";
import {WorkflowManager} from "@wf-services/workflow.manager";


@Directive({
  selector: '[connection-label]'
})
export class ConnectionLabelDirective implements OnInit, AfterViewInit {
  @Input() connection: EdgesConnection;
  @Input() workflowManager: WorkflowManager;
  @HostBinding('attr.data-type') type = 'label-connector';
  @HostBinding('style.left')
  get left(): string {
    return this.connection.labelX + 'px';
  }

  @HostBinding('style.width')
  get width(): string {
    return this.connection.labelWidth + 'px';
  }

  @HostBinding('style.height')
  get height(): string {
    return this.connection.labelHeight + 'px';
  }

  @HostBinding('style.top')
  get top(): string {
    return (this.connection.labelY) + 'px';
  }

  constructor(public elementRef: ElementRef<HTMLElement>) {
  }

  ngOnInit(): void {
    // this.connection.element = this.elementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    this.connection.reconnect(this.workflowManager.boundary);
  }

}
