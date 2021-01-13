import type NodeModel from './NodeModel';

export default interface NodeAction {
  action: string;
  run(NodeModel): void;
  undo(NodeModel): void;
}