import React, { Component } from 'react';
import firebase from 'firebase';
import CssBaseline from 'material-ui/CssBaseline';
import { createMuiTheme } from 'material-ui/styles';
import logo from './logo.svg';
import './App.css';
import { base, firebaseApp } from '../../firebase/database';
import Login from '../Login/Login';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});

class App extends Component {
  state = {
    uid: null,
    owner: null,
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.authHanlder({ user });
      }
    });
  }
  facebookProvider = new firebase.auth.FacebookAuthProvider();

  authenticate = () => {
    firebaseApp
      .auth()
      .signInWithPopup(this.facebookProvider)
      .then(this.authHandler);
  };

  logout = async () => {
    console.log('Logging out!');
    await firebase.auth().signOut();
    this.setState({ uid: null });
  };

  authHandler = async (authData) => {
    // 1 .Look up the current store in the firebase database
    const store = await base.fetch('Login', { context: this });
    // console.log(store);
    // 2. Claim it if there is no owner
    if (!store.owner) {
      // save it as our own
      await base.post(`${this.props.storeId}/owner`, {
        data: authData.user.uid,
      });
    }
    // 3. Set the state of the inventory component to reflect the current user
    this.setState({
      uid: authData.user.uid,
      owner: store.owner || authData.user.uid,
    });
  };

  render() {
    return (
      <div>
        <CssBaseline>
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title"> Welcomes to Sofa Spud! </h1>
            </header>
            <Login uid={this.state.uid} authenticate={this.authenticate} />
          </div>
        </CssBaseline>
      </div>
    );
  }
}

export default App;
