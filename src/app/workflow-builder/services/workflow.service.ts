import { Injectable } from '@angular/core';
import {combineLatest, fromEvent, Subject, Subscription} from "rxjs";
import {WorkflowManager} from "@wf-services/workflow.manager";
import {MOUSE_EVENT, NodeContent, RegistryView} from "@wf-types/general.types";
import {ModuleConfigOption, WorkflowOptions} from "@wf-types/workflow-options.type";
import {WorkflowPlugin} from "@wf-types/plugin.types";
import {WorkflowDefaultOptions} from "@workflow-builder/consts/workflow-default.options";

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  instances: {[key: string]: WorkflowManager} = {};
  private options = WorkflowDefaultOptions;
  eventManager = new Subject();
  plugins: Set<WorkflowPlugin> = new Set<WorkflowPlugin>();
  viewsRegistry: {[key: string] : RegistryView} = {};
  eventManager$ = this.eventManager.asObservable();
  mainListenerSub: Subscription;
  constructor() {
    this.runMainListeners();
  }

  runMainListeners() {

    const mouseMove$ = fromEvent(window, 'mousemove', (event: any)=> {
      this.getInstancesList().forEach(workspace => workspace.handleEventOutsideBoundary(MOUSE_EVENT.MOUSE_MOVE))
    });


    const mouseUp$ = fromEvent(window, 'mouseup', (event: any)=> {
      this.getInstancesList().forEach(workspace => workspace.handleEventOutsideBoundary(MOUSE_EVENT.MOUSE_UP))
    });

    this.mainListenerSub = combineLatest([mouseMove$, mouseUp$]).subscribe();
  }

  getInstancesList(): WorkflowManager[] {
    return Object.values(this.instances);
  }

  addConfig(config: ModuleConfigOption = {}): void {
    if(config) {
      if(config.plugins) {
        this.addGlobalPlugins(config.plugins);
      }
      if(config.options) {
        this.setGlobalOptions(config.options);
      }
      if(config.nodes) {
        config.nodes.forEach(node => {
          this.registerNodeType(node.key, node.comp, node.outputs || 0, node.inputs || 0)
        });
      }
    }
  }


  addGlobalPlugins(plugins: WorkflowPlugin[] = []): void {
    plugins.forEach(newPlugins => {
      this.plugins.add(newPlugins);
    });
    this.getInstancesList().forEach((wm)=> {
      wm.iniPlugins(plugins);
    });
  }

  setGlobalOptions(config: WorkflowOptions): void {
    this.options = {...this.options, ...config};
  }

  setInstanceOptions(id: string, options: WorkflowOptions): void {
    if(this.instances[id]) {
      this.instances[id].setOptions(options);
    }
  }

  getWorkspaceByPos(x: number, y: number): WorkflowManager {
    return Object.values(this.instances).find(ws => ws.isPosInBoundary(x, y));
  }

  registerNodeType(key: string, view: NodeContent, outputs: number = 0, inputs: number = 0): void {
    this.viewsRegistry[key] = {view, outputs, inputs};
  }

  getNodeView(key: string): RegistryView {
    return this.viewsRegistry[key] || this.options.defaultNodeComponent;
  }

  private getPluginsForInstance(plugins: WorkflowPlugin[]): WorkflowPlugin[] {
    return [...this.plugins.values()].concat(plugins.filter(plugin => !this.plugins.has(plugin)));
  }

  initInstance(id: string, workspaceRef: HTMLElement, options: WorkflowOptions = {}, plugins: any[] = []): WorkflowManager {
    const wm = new WorkflowManager(id, workspaceRef);
    wm.setWorkflowService(this)
      .iniPlugins(this.getPluginsForInstance(plugins))
      .setOptions({...this.options, ...options});
    this.instances[id] = wm;
    return wm;
  }

  destroyInstance(id: string): void {
    // TODO
  }
}
