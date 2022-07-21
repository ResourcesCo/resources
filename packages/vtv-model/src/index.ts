export {
  getNodeType,
  getNodeInfo,
  getCollectionPaths,
  hasChildren,
  isUrl,
} from "./analyze";
export { parseCommand } from "./parse";
export {
  getState,
  getStateKey,
  updateTree,
  removeTemporaryState,
  getChildState,
  getNestedState,
  getNodeState,
  draftState,
} from "./state";
export { codeTypes } from "./constants";
export { default as RuleList } from "./rules/RuleList";

type EditingNameType = boolean | "new";

interface Action {
  name: string;
  title?: string;
  primary?: boolean;
  show?: string;
}

interface Attachments {
  open: boolean;
}

export interface State {
  _expanded?: boolean;
  _showOnly?: string[];
  _editingName?: EditingNameType;
  _actions?: Action[];
  _hidden?: boolean;
  _view?: string | null;
  _attachments?: Attachments;
  [key: string]:
    | State
    | boolean
    | string[]
    | EditingNameType
    | Action[]
    | string
    | Attachments
    | null;
}
