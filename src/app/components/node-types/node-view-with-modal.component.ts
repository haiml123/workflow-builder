import {Component, ElementRef, Input, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import {MatDialog} from "@angular/material/dialog";
import {LoginModal} from "./node-componets/login-modal";
import {NodeViewBaseModel} from "@workflow-builder/models/node/node-view-base.model";

@Component({
  selector: 'node-view-with-modal',
  template: `
    <div class="node-box">
      <div class="m-b-10 text-center">
        <mat-icon color="primary">account_circle</mat-icon>
      </div>
        <button *ngIf="!node.data.inputs['email'];else alert" (click)="openLoginModal()" mat-flat-button color="primary">Login</button>
        <ng-template #alert>
          <div>{{node.data.inputs['email']}}</div>
        </ng-template>
    </div>
  `,
  styles: [`

  `]
})
export class NodeViewWithModalComponent extends NodeViewBaseModel implements OnInit {
  editable = false;
  ctl = new FormControl('');
  @Input() user: any = {name: 'Haim'};
  constructor(el: ElementRef, private dialog: MatDialog) {
    super(el);
  }

  ngOnInit(): void {

  }

  openLoginModal(): void {
    const dialogRef = this.dialog.open(LoginModal,{
      width: '250px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      debugger;
      if(result) {
        this.node.setDataInput('email', result.email)
          .setDataInput('password', result.password);
      }
    });
  }
}
