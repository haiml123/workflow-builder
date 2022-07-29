import {Constructor} from "@wf-types/general.types";

export function DraggingElement<TBase extends Constructor>(Base: TBase) {
  return class Dragging extends Base {
    // Mixins may not declare private/protected properties
    // however, you can use ES2020 private fields
    dragging: boolean = false;

    draggingOn(): Dragging {
      this.dragging = true;
      return this;
    }

    draggingOff(): Dragging {
      this.dragging = false;
      return this;
    }

    isDragging(): boolean {
      return this.dragging;
    }
  };
}
