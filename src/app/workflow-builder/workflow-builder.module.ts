import {Inject, InjectionToken, ModuleWithProviders, NgModule, Optional} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {CommonModule} from "@angular/common";
import {NodeViewComponent} from "@wf-models/node/node-view.component";
import {NodeViewBaseModel} from "@wf-models/node/node-view-base.model";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModuleConfigOption} from "@wf-types/workflow-options.type";
import {WorkflowService} from "@wf-services/workflow.service";
import {WorkflowComponent} from "@workflow-builder/workflow.component";
import {SetElementToModelDirective} from "@workflow-builder/directives/set-element-to-model.directive";
import {DynamicComponentLoaderDirective} from "@workflow-builder/directives/dynamic-component-loader";
import {SanitizeHtmlPipe} from "@workflow-builder/pipes/sanitize-html.pipe";
import {ContentLoaderComponent} from "@workflow-builder/components/content-loader.component";
import {WorkflowSidebar} from "@workflow-builder/workflow-sidebar.component";
import {ConnectionLabelDirective} from "@workflow-builder/directives/connection-label.directive";
import {ConnectorLabelViewComponent} from "@workflow-builder/components/connector-label-view.component";

export const WORKFLOW_CONFIG = new InjectionToken<ModuleConfigOption[]>('WORKFLOW_CONFIG');

@NgModule({
  declarations: [
    WorkflowComponent,
    NodeViewComponent,
    SetElementToModelDirective,
    DynamicComponentLoaderDirective,
    ContentLoaderComponent,
    SanitizeHtmlPipe,
    WorkflowSidebar,
    ConnectionLabelDirective,
    ConnectorLabelViewComponent,
    NodeViewBaseModel,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule
  ],
  exports: [
    WorkflowComponent,
    WorkflowSidebar
  ],
  providers: [],
})
export class WorkflowBuilderModule {
  static forChild(config: ModuleConfigOption = {}): ModuleWithProviders<WorkflowBuilderModule> {
    return {
      ngModule: WorkflowBuilderModule,
      providers: [
        { provide: WORKFLOW_CONFIG, useValue: config, multi: true },
      ],
    };
  }

  constructor(workflowService: WorkflowService, @Optional() @Inject(WORKFLOW_CONFIG) configs: ModuleConfigOption[] = []) {
    if (!configs) {
      return;
    }
    configs.forEach((config) => workflowService.addConfig(config));
  }
}
