import {Component, ElementRef, Inject, Input, OnInit} from '@angular/core';
import {WorkflowNode} from "@wf-models/node/node.model";
import {WorkflowService} from "@wf-services/workflow.service";
import {NodeViewBaseModel} from "@wf-models/node/node-view-base.model";
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'node-view-with-modal',
  template: `
    <div class="display-1">Login</div>
    <div [formGroup]="loginForm">
      <mat-form-field appearance="outline">
        <input matInput formControlName="email" type="email">
      </mat-form-field>

      <mat-form-field appearance="outline">
        <input matInput formControlName="password" type="password">
      </mat-form-field>

      <button (click)="login()" mat-flat-button color="primary">Login</button>

    </div>
  `,
  styles: [`

  `]
})
export class LoginModal implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl()
  })
  constructor(public dialogRef: MatDialogRef<LoginModal>,
  @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {

  }

  login() {
    this.dialogRef.close(this.loginForm.value);
  }
}
