import React, { Component } from 'react';

// Styles
import './css/bootstrap.min.css';
import './css/custom.min.css';
import './css/theme.min.css';
import './App.css';

class App extends Component {
  render() {

    return (
      <div>
        <div className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <a href="../" className="navbar-brand">World Of Contracts</a>
              <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>
            <div className="navbar-collapse collapse" id="navbar-main">
              <ul className="nav navbar-nav">
                
                <li>
                  <a href="/interface">Contracts</a>
                </li>
                <li>
                  <a href="/interface">dApps</a>
                </li>
              </ul>

              <ul className="nav navbar-nav navbar-right">
                <li><a href="/interface">Interface</a></li>

              </ul>

            </div>
          </div>
        </div>

        {this.props.children}
      </div>
    );
  }
}

export default App
