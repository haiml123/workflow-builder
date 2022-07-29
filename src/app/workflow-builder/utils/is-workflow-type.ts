import {ELEMENT_TYPE} from "@workflow-builder/consts/element.consts";


export function isWorkflowType(type: string = ''): boolean {
  return [ELEMENT_TYPE.NODE, ELEMENT_TYPE.EDGE, ELEMENT_TYPE.CONNECTOR, ELEMENT_TYPE.LABEL_CONNECTOR].includes(type);
}
