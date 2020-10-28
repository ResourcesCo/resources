import { makeAutoObservable } from "mobx";
import isEmpty from 'lodash/isEmpty';
import NodeAction from './NodeAction';

function determineType(value) {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return 'object';
  } else if (Array.isArray(value)) {
    return 'array';
  } else if (typeof value === 'string') {
    return 'string';
  }
}

export type NodeKey = string | number;

export default class NodeModel {
  key?: NodeKey;
  value: any;
  path: NodeKey[];
  type: string;
  isContainer: boolean;
  children?: NodeModel[];
  isEmpty?: boolean;
  isExpanded?: boolean;
  isExpandable?: boolean;
  document?: NodeModel;
  actions?: NodeAction[];

  constructor({key=null, value, path=[], expanded = undefined}) {
    this.key = key;
    this.value = value;
    this.type = determineType(value);
    this.path = path;
    this.isContainer = this.type === 'object' || this.type === 'array';
    if (this.isContainer) {
      this.isEmpty = isEmpty(this.value);
      this.isExpandable = !this.isEmpty;
      this.isExpanded = expanded === undefined ? false : expanded
      this.updateChildren();
    }
    makeAutoObservable(this);
  }

  expand() {
    if (this.isExpandable) {
      this.isExpanded = true;
      this.updateChildren();
    }
  }

  collapse() {
    if (this.isExpandable) {
      this.isExpanded = false;
      this.children = null;
    }
  }

  updateChildren() {
    if (this.type === 'object' && !this.isEmpty && this.isExpanded) {
      this.children = Object.keys(this.value).map(key => (
        new NodeModel({key, value: this.value[key], path: [...this.path, key]})
      ));
    }
  }
}