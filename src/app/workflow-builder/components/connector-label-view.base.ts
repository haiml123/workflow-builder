import {Component, HostBinding, Input} from "@angular/core";
import {EdgesConnection} from "@wf-models/edges-connection.model";
import {WorkflowManager} from "@wf-services/workflow.manager";


@Component({
  selector: '',
  template: ''
})
export abstract class ConnectorLabelViewBase {
  @Input() connector: EdgesConnection;
  @Input() workflowManager: WorkflowManager;
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.pointer-events') pointerEvents = 'all';
  @HostBinding('attr.data-type') type = 'label-connector'
  @HostBinding('style.transform')
  get rotate() {
    return 'rotate(' + this.connector.labelDeg  + 'deg)';
  }

  // TODO move to connector model.
  reconnect(): void {
    if(this.connector && this.workflowManager) {
      setTimeout(()=> {
        this.connector.reconnect(this.workflowManager.boundary);
      }, 1)
    }
  }
}
