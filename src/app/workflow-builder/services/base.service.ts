import {Observable} from "rxjs";

export abstract class BaseService {
  boundaryElement: HTMLElement;
  dispatch: any;
  plugins: any = [];

  setBoundaryElement(boundaryElement: HTMLElement) {
    this.boundaryElement = boundaryElement;
    return this;
  }

  get boundary(): DOMRect {
    return this.boundaryElement?.getBoundingClientRect();
  }

  setPlugins(plugins: any[]): BaseService {
    this.plugins = plugins;
    return this;
  }

}
