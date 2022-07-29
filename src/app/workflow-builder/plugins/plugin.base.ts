import {WorkflowManager} from "@wf-services/workflow.manager";


export abstract class PluginBase {
  constructor(protected workflowManager: WorkflowManager) {
  }
}
