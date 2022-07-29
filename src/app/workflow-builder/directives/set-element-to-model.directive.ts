import {Directive, ElementRef, Input, OnInit} from "@angular/core";
import {ElementBase} from "@wf-models/element.base.model";
import {idGenerator} from "@wf-utils/id-generator";

@Directive({
  selector: '[set-element-to-model]'
})
export class SetElementToModelDirective implements OnInit {
  @Input() model: ElementBase | undefined;
  constructor(public elementRef: ElementRef<HTMLElement>) {

  }

  ngOnInit(): void {
    if(this.model) {
      if(!this.model.id) {
        this.model.id = idGenerator();
      }
      this.model.element = this.elementRef.nativeElement;
    }
  }
}
