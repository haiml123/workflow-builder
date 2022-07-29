import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {SaveIconUrl} from "@wf-icons/save.icon";
import {ConnectorLabelViewBase} from "@workflow-builder/components/connector-label-view.base";
import {RemoveIconUrl} from "@wf-icons/remove.icon";

@Component({
  selector: 'connector-label',
  template: `
    <div class="connector-label">
      <div class="text-field" (click)="edit()" *ngIf="!editable;else input">{{connector.label}}</div>
      <ng-template #input>
        <div class="label-editor">
          <input class="label-input" type="text" [formControl]="ctl">
          <div class="btns-wrapper">
            <button [disabled]="!ctl.value" (click)="save()" class="label-button">
              <img [src]="saveIconUrl">
            </button>

            <button [disabled]="!ctl.value" (click)="disconnect()" class="label-button">
              <img [src]="removeIconUrl">
            </button>
          </div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .label-editor {
      display: flex;
      align-items: center;
    }
    .connector-label {
      height: 30px;
      min-width: 100px;
      z-index: 99;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: default;
      border: solid #4697f5;
      border-radius: 10px;
      color: #4697f5;
      background-color: hsl(0deg 0% 100% / 85%);
      padding: 3px 5px;
    }

    .label-button {
      cursor: pointer;
      background: transparent;
      border: none;
    }

    .btns-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .label-input {
        border: none;
        &:focus {
        outline: none;
       }
    }

    .text-field {
      cursor: pointer;
    }
  `]
})
export class ConnectorLabelViewComponent extends ConnectorLabelViewBase implements OnInit {
  saveIconUrl = SaveIconUrl;
  removeIconUrl = RemoveIconUrl;
  editable: boolean = false;
  ctl = new FormControl('');
  size: any;
  constructor(elementRef: ElementRef<HTMLElement>, private cdr: ChangeDetectorRef) {
    super();
    this.size = () => {
     const s = elementRef.nativeElement.getBoundingClientRect();
      return {
        height: s.height.toFixed(),
        width: s.width.toFixed()
      }
    }
  }

  ngOnInit(): void {
    this.ctl.patchValue(this.connector.label);
  }

  disconnect() {
    this.workflowManager.disconnect(this.connector);
  }

  edit(): void {
    this.editable = !this.editable;
    this.cdr.detectChanges();
    this.reconnect();
  }

  save(): void {
    this.connector.setLabel(this.ctl.value);
    this.editable = false;
    this.reconnect();
  }


}
