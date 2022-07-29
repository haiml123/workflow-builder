import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {WorkflowManager} from "@wf-services/workflow.manager";
import {WorkflowNode} from "@wf-models/node/node.model";
import {Point} from "@wf-models/point";
import {CommonModule} from "@angular/common";
import {combineLatest, fromEvent, Subscription, tap} from "rxjs";
import {filter} from "rxjs/operators";

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'multi-selection-addon',
  template: `<div [ngStyle]="rectangleSelection || {}" class="fc-select-rectangle"></div>`,
  styles: [`
    .fc-select-rectangle {
      border: 2px dashed #5262ff;
      position: absolute;
      background: rgba(20,125,255,0.1);
      z-index: 2;
    }
  `]
})
export class MultiSelectionAddon implements OnInit, OnDestroy {
  // @ts-ignore
  subscription: Subscription;
  rectangleSelection = {left: '0', top: '0', width: '0', height: '0', display: 'none'};
  private selectRect: any = {
    p1: {x: 0, y: 0},
    p2: {x: 0, y: 0},
  };
  // @ts-ignore
  @Input() workflowManager: WorkflowManager;

  resetSelection(): void {
    this.selectRect = {
      p1: {x: 0, y: 0},
      p2: {x: 0, y: 0},
    }
    this.rectangleSelection = {left: '0', top: '0', width: '0', height: '0', display: 'none'};
  }

  ngOnInit(): void {
    const onMouseDown$ = fromEvent<MouseEvent>(this.workflowManager.boundaryElement as HTMLElement, 'mousedown')
      .pipe(
        filter(({target}: MouseEvent)=> !this.workflowManager.selectedType),
        tap(this.onMouseDown.bind(this))
      )
    const onMouseMove$ = fromEvent<MouseEvent>(this.workflowManager.boundaryElement as HTMLElement, 'mousemove')
      .pipe(
        filter(({target}: MouseEvent)=> !this.workflowManager.selectedType),
        tap(this.onMouseMove.bind(this))
      )
    const onMouseUp$ = fromEvent<MouseEvent>(this.workflowManager.boundaryElement as HTMLElement, 'mouseup')
      .pipe(
        filter(({target}: MouseEvent)=> !this.workflowManager.selectedType),
        tap(this.onMouseUp.bind(this))
      );

    this.subscription = combineLatest([onMouseDown$, onMouseMove$, onMouseUp$]).subscribe();
  }


  onMouseDown = (event: MouseEvent): void => {
    const offset = this.workflowManager.boundary;
    if (this.rectangleSelection && this.rectangleSelection.display == 'none' && !event.ctrlKey && !event.metaKey && event.button === 0) {
      this.rectangleSelection.display = 'block';
      this.selectRect.p1.x = Math.round(event.pageX - offset.x - 2);
      this.selectRect.p1.y = Math.round(event.pageY - offset.y - 2);
      this.selectRect.p2.x = this.selectRect.p1.x;
      this.selectRect.p2.y = this.selectRect.p1.y;
      this.updateSelectRect();
    }
  }

  public onMouseMove(e: MouseEvent): void {
    if (!e.ctrlKey && !e.metaKey && e.button === 0
      && this.rectangleSelection && this.rectangleSelection.display === 'block') {
      const offset = this.workflowManager.boundary;
      this.selectRect.p2.x = Math.round(e.pageX - offset.x);
      this.selectRect.p2.y = Math.round(e.pageY - offset.y);
      // this.updateScroll(offset);
      this.updateSelectRect();
    }
  }

  onMouseUp = (event: MouseEvent): void => {
    if (this.rectangleSelection.display === 'block' && !event.ctrlKey && !event.metaKey && event.button === 0) {
      this.rectangleSelection.display = 'none';
      this.selectNodes();
      this.resetSelection();
    }
  }

  selectRectCord(): any {
    const x1 = Math.min(this.selectRect.p1.x, this.selectRect.p2.x);
    const x2 = Math.max(this.selectRect.p1.x, this.selectRect.p2.x);
    const y1 = Math.min(this.selectRect.p1.y, this.selectRect.p2.y);
    const y2 = Math.max(this.selectRect.p1.y, this.selectRect.p2.y);
    return { p1: {x :x1, y: y1}, p2: {x: x2, y: y2}};
  }

  updateSelectRect(): void {
    const {p1, p2}: any = this.selectRectCord();
    this.rectangleSelection.left = `${p1.x}px`;
    this.rectangleSelection.top = `${p1.y}px`;
    this.rectangleSelection.width = `${p2.x - p1.x}px`;
    this.rectangleSelection.height = `${p2.y - p1.y}px`;
  }

  private selectNodes(): void {
    const {p1, p2}: any = this.selectRectCord();
    const point = new Point(this.workflowManager.boundary.left, this.workflowManager.boundary.top);
    this.workflowManager.getNodes().forEach((node: WorkflowNode) => {
      if(node.isElementInRectangle(p1, p2, point)) {
        node.select();
      } else {
        const rr = node.isElementInRectangle(p1, p2, point);
        console.log('NODE UN SELECTED', rr);

        node.unSelect();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
