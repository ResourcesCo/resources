import { faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PureComponent } from 'react'

class ExpandButton extends PureComponent {
  render() {
    const { onClick, expanded } = this.props
    return (
      <span>
        <button onClick={onClick}>
          <FontAwesomeIcon icon={expanded ? faCaretDown : faCaretRight} />
        </button>
        <style jsx>{`
          span {
            padding-right: 5px;
          }
          button {
            outline: none;
            border: none;
            cursor: pointer;
            padding: 0;
            margin: 0;
            font-size: 100%;
          }
        `}</style>
      </span>
    )
  }
}

class DataNode extends PureComponent {
  state = {
    expanded: false
  }

  toggleExpanded = () => {
    const { expanded } = this.state
    this.setState({expanded: !expanded})
  }

  render() {
    const { record, keyField, link = 'html_url', title, theme, pickPrefix='', onPickId} = this.props
    const { expanded } = this.state
    const titleEl = record[title] ? record[title] : <i>(empty)</i>
    const url = link && record[link]
    return (
      <div key={record[keyField]}>
        <div>
          <ExpandButton expanded={expanded} onClick={this.toggleExpanded} />
          <button className="id" onClick={() => onPickId(`${pickPrefix}${record[keyField]}`)}>{record[keyField]}</button>
          {' '}
          {
            url ? <a target="_blank" href={url}>{titleEl}</a> : titleEl
          }
        </div>
        {expanded && Object.keys(record).map(key => (
          <div key={key}>
            <button className="id">{key}</button>
            {' '}
            {JSON.stringify(record[key])}
          </div>
        ))}
        <style jsx>{`
          button {
            cursor: pointer;
            background-color: ${theme.bubble1};
            border-radius: 9999px;
            outline: none;
          }

          button.id {
            padding: 3px;
          }

          button.action {
            padding: 4px 12px;
          }
        `}</style>
      </div>
    )
  }
}

class DataTree extends PureComponent {
  render() {
    const { data, ...props } = this.props
    return (
      <div>
        {
          data.map(record => <DataNode record={record} {...props} />)
        }
      </div>
    )
  }
}

export default DataTree
