import {WorkflowManager} from "@wf-services/workflow.manager";
import {WorkflowPlugin} from "@wf-types/plugin.types";
import {NgComponentType} from "@wf-types/general.types";
import {MultiSelectionAddon} from "@wf-plugins/multi-selection-plugin/multi-selection.addon";
import {PluginBase} from "@wf-plugins/plugin.base";


export class MultiSelectionPlugin extends PluginBase implements WorkflowPlugin {
  static key: string =  'multi-selection-plugin';
  static priority: number = 1;
  workspaceAddon: NgComponentType = MultiSelectionAddon;
  constructor(workflowManager: WorkflowManager) {
    super(workflowManager);
  }
}
