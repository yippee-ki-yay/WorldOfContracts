import React, { Component } from 'react';

class ContractInterface extends Component {

  constructor(props) {
    super(props);

    this.state = {
      address: '',
      abi: ''
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    })
  }

  loadContract = () => {
    console.log(this.state.address, this.state.abi);

    this.setState({
      address: '',
      abi: ''
    });
    
  }

  render() {
    return(
      <div className="container">
        <div className="row">
          <div className="col-lg-8 col-lg-offset-2"> 
            <div className="well bs-component" id="load-contract">
            <form className="form-horizontal">
              <fieldset>
                <legend>Load Contract</legend>
                <div className="form-group">
                  <div className="col-lg-10">
                    <input name="address" value={ this.state.address } onChange={ this.handleChange } type="text" className="form-control" id="inputEmail" placeholder="Contract Address" />
                  </div>
                </div>

                 <div className="form-group">
                    <div className="col-lg-10">
                      <textarea name="abi" value={ this.state.abi } onChange={ this.handleChange } className="form-control" placeholder="Enter Contract ABI (that .json file)" rows="6" id="textArea"></textarea>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="col-lg-10">
                      <button type="button" className="btn btn-primary" onClick={ this.loadContract }>Submit</button>
                    </div>
                  </div>
              </fieldset>
              </form>
            </div>
            </div>
            </div>
        </div>

    )
  }
};

export default ContractInterface;
