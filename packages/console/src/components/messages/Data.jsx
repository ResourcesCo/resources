import React, { PureComponent } from 'react'

class Data extends PureComponent {
  state = {
    pageSize: 5,
  }

  constructor(props) {
    super(props)
    this.buttonRef = React.createRef()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.buttonRef.current && prevState.pageSize !== this.state.pageSize) {
      this.buttonRef.current.scrollIntoView({ block: 'end' })
    }
  }

  increasePageSize = () => {
    this.setState({ pageSize: this.state.pageSize + 5 })
  }

  decreasePageSize = () => {
    this.setState({ pageSize: this.state.pageSize - 5 })
  }

  render() {
    const {
      data,
      keyField,
      link = 'html_url',
      title,
      theme,
      pickPrefix = '',
      onPickId,
    } = this.props
    const { pageSize } = this.state
    return (
      <div className="data">
        {data.slice(0, pageSize).map(record => {
          const titleEl = record[title] ? record[title] : <i>(empty)</i>
          const url = link && record[link]
          return (
            <div key={record[keyField]}>
              <button
                className="id"
                onClick={() => onPickId(`${pickPrefix}${record[keyField]}`)}
              >
                {record[keyField]}
              </button>{' '}
              {url ? (
                <a target="_blank" href={url}>
                  {titleEl}
                </a>
              ) : (
                titleEl
              )}
            </div>
          )
        })}
        <div ref={this.buttonRef}>
          {data.length > pageSize && (
            <button className="action" onClick={this.increasePageSize}>
              show more
            </button>
          )}
          {pageSize > 5 && (
            <button className="action" onClick={this.decreasePageSize}>
              show less
            </button>
          )}
        </div>
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

          div.data {
            marginleft: 5px;
          }
        `}</style>
      </div>
    )
  }
}

export default Data
