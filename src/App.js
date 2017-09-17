import React, { Component } from 'react'
import { Link } from 'react-router'

// UI Components
import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'

// Styles
import './css/oswald.css';
import './css/open-sans.css';
import './css/bootstrap.min.css';
import './css/custom.min.css';
import './App.css';

class App extends Component {
  render() {

    return (
      <div className="App">
        {/*<nav className="navbar pure-menu pure-menu-horizontal">
          <Link to="/" className="pure-menu-heading pure-menu-link">Truffle Box</Link>
          <ul className="pure-menu-list navbar-right">
            <OnlyGuestLinks />
            <OnlyAuthLinks />
          </ul>
        </nav>*/}

        {this.props.children}
      </div>
    );
  }
}

export default App
