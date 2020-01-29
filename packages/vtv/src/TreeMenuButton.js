import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'
import TreeMenu from './TreeMenu'
import { Manager, Reference, Popper } from 'react-popper'

export default ({ treeMenuProps }) => {
  return (
    <button>
      <FontAwesomeIcon icon={faEllipsisH} size="sm" />
      <style jsx>{`
        button {
          outline: none;
          border: none;
          cursor: pointer;
          margin: 0;
          text-align: left;
          width: 22px;
          background: none;
        }
      `}</style>
    </button>
  )
}
