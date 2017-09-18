import React, { Component } from 'react';

class ConvertPanel extends Component {

    constructor(web3) {
        super();

        this.state = {
            web3,
        };
    }

    render() {
        return (
                <div className="col-lg-4"> 
                  <div className="well bs-component">
                     <form className="form-horizontal">
                      <legend>Converter</legend>

                     </form>
                  </div>
                </div>
        )
    }
}

export default ConvertPanel;