import React from 'react'
import { Link } from 'react-router-dom'

class ErrorMessage extends React.Component {
  render() {
    return (
      <div className="error">
        <article
          className={`message ${
            this.props.colour ? this.props.colour : 'is-danger'
          }`}
        >
          <div className="message-body">
            {this.props.error}&nbsp;{this.props.showLogin ? (
              <Link to="/signin">login</Link>
            ) : null}
          </div>
        </article>
      </div>
    )
  }
}
export default ErrorMessage
