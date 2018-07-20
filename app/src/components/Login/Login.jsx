import React, { Component } from "react";

class Login extends Component {
  render() {
    return (
      <div>
       <p className="App-intro">Please Login</p>
        {!this.props.uid ? (
          <button onClick={this.props.authenticate}>Login with Facebook</button>
        ) : (
          <p>Logged in!</p>
        )}
      </div>
    );
  }
}

export default Login;
