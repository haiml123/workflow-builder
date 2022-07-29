import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NodeTypesModule} from "./components/node-types/node-types.module";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {WorkflowBuilderModule} from "@workflow-builder/workflow-builder.module";
import {ModuleConfigOption} from "@wf-types/workflow-options.type";
import {CorePlugin} from "@wf-plugins/core.plugin";
import {MultiSelectionPlugin} from "@wf-plugins/multi-selection-plugin/multi-selection.plugin";
import {NodeViewWithModalComponent} from "./components/node-types/node-view-with-modal.component";
import {NodeViewMultipleTypesComponent} from "./components/node-types/node-view-multiple-types.component";

const workflowConfig: ModuleConfigOption = {
  plugins: [CorePlugin, MultiSelectionPlugin],
  nodes: [
    { key: 'plain', comp:  '<div class="node-box">Alert</div>' },
    { key: 'user-login', comp:  NodeViewWithModalComponent, inputs: 2, outputs: 2 },
    { key: 'status-type', comp:  NodeViewMultipleTypesComponent, inputs: 2, outputs: 2 },
    { key: 'image-type', comp:  NodeViewMultipleTypesComponent, inputs: 1, outputs: 1 },
  ]
}


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    WorkflowBuilderModule.forChild(workflowConfig),
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    NodeTypesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
