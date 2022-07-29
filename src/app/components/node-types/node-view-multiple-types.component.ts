import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {NodeViewBaseModel} from "@workflow-builder/models/node/node-view-base.model";

@Component({
  selector: 'node-view-multiple-types',
  template: `
    <ng-container [ngSwitch]="node.type">
       <div *ngSwitchCase="'status-type'" class="node-box">
           <div *ngIf="node.viewOnly else canvasMode" class="text-center">
             <mat-icon color="primary" class="m-b-10">account_circle</mat-icon>
             <h3>STATUS</h3>
           </div>
         <ng-template #canvasMode>
           <div>
             <h3>STATUS</h3>
             <mat-form-field appearance="outline">
               <mat-select>
                 <mat-option [value]="1">ACTIVE</mat-option>
                 <mat-option [value]="2">PENDING</mat-option>
                 <mat-option [value]="3">BLOCKED</mat-option>
               </mat-select>
             </mat-form-field>
           </div>
         </ng-template>
       </div>

      <div *ngSwitchCase="'image-type'" class="node-box">
        <div *ngIf="node.viewOnly else imageViewMode" class="text-center">
          <mat-icon color="primary" class="m-b-10">image</mat-icon>
          <h3>IMAGE</h3>
        </div>
        <ng-template #imageViewMode>
          <img class="fw small-img" src="https://image.pngaaa.com/384/3822384-middle.png" />
        </ng-template>
      </div>
    </ng-container>
  `,
  styles: [`

  `]
})
export class NodeViewMultipleTypesComponent extends NodeViewBaseModel implements OnInit {
  constructor(el: ElementRef) {
    super(el);
  }

  ngOnInit(): void {

  }
}
