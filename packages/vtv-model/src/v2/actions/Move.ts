import NodeAction from '../NodeAction';

class Move implements NodeAction {
  action: 'move';
  run(node) {
  }
  undo(node) {
  }
}

export default Move;