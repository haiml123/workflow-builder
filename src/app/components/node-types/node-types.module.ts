import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NodeViewMultipleTypesComponent} from "./node-view-multiple-types.component";
import {NodeViewWithModalComponent} from "./node-view-with-modal.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {LoginModal} from "./node-componets/login-modal";
import {MatInputModule} from "@angular/material/input";
@NgModule({
  declarations: [
    NodeViewMultipleTypesComponent,
    NodeViewWithModalComponent,
    LoginModal
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  providers: [],
  exports: [
    NodeViewMultipleTypesComponent,
    NodeViewWithModalComponent,
  ]
})
export class NodeTypesModule { }
