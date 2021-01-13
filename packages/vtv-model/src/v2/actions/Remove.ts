import NodeAction from '../NodeAction';

class Remove implements NodeAction {
  action: 'remove';
  run(node) {
  }
  undo(node) {
  }
}

export default Remove;