import React, { Component } from 'react';

class FunctionsPanel extends Component {

    constructor(instance, functions) {
        super();

        this.state = {
            instance,
            functions
        };
    }

    render() {
        return (
                <div className="col-lg-8"> 
                  <div className="well bs-component">
                     <form className="form-horizontal">
                      <legend>Functions</legend>
                     
                     </form>
                  </div>
                </div>
        )
    }
}

export default FunctionsPanel;