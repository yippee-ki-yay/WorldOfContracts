import React, { Component } from 'react';
import getWeb3 from '../util/web3/getWeb3';

import contract from 'truffle-contract';

class ContractInterface extends Component {

  constructor(props) {
    super(props);

    this.state = {
      address: '0xb1C94B6dE745100F4c7805Ff24aA787a53f44A5F',
      abi: '',
      web3: null,
      instance: null,
      loaded: false,
      balance: 0,
      funtions: [],
      publicVariables: [],
      events: []
    }
  }

  componentWillMount() {
     getWeb3
    .then(results => {
      console.log(results);

      this.setState({
        web3: results.payload.web3Instance
      });

    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    })
  }

  loadContract = async () => {
    const dnsContract = contract(JSON.parse(this.state.abi));

    dnsContract.setProvider(this.state.web3.currentProvider);

    const instance = dnsContract.at(this.state.address);

    console.log(instance.transactionHash);

    await this.parseAbi(instance.abi, instance);

    this.state.web3.eth.getBalance(this.state.address, (err, res) => {

      let balance = this.state.web3.fromWei(res.valueOf(), 'ether');

      this.setState({
        instance: instance,
        loaded: true,
        balance: balance
      });
    });

  }

  parseAbi = async (abi, instance) => {

    let functions = [];
    let publicVariables = [];
    let events = [];

    abi.forEach((row) => {
      if(row.constant === true && row.inputs.length === 0) { 
        publicVariables.push(row);
      } else if(row.constant === false && row.type === "function") {
        functions.push(row);
      } else if(row.type === "event") {
        events.push(row);
      }
    });

    await Promise.all(publicVariables.map(p => instance[p.name].call().then(res => {
      p.resolvedValue = res.valueOf();
    })));

    this.setState({
      functions,
      publicVariables,
      events
    });
  }

  render() {

    if(!this.state.loaded) {
      return(
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-lg-offset-2"> 
              <div className="well bs-component" id="load-contract">
              <form className="form-horizontal">
                
                <fieldset >
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
    } else {
      return (
          <div className="container">
            <div className="row">
              <div className="col-lg-8"> 
                <div className="well bs-component" id="load-contract">
                  <form className="form-horizontal">
                    <fieldset >
                      <legend>Contract : { this.state.address } </legend>
                      <label>Contract balance: { this.state.balance } ether</label>
                    </fieldset>
                </form>
              </div>

              </div>
                <div className="col-lg-4"> 
                   <div className="well bs-component" id="load-contract">
                    <form className="form-horizontal">
                      <legend>Variables & Constant methods</legend>
                      {
                        this.state.publicVariables.map(row => 
                          <p className="text-info"> {row.outputs[0].type}  { row.name } = { row.resolvedValue } </p>
                        
                        )
                      }
                    </form>
                   </div>
                </div>
              </div>
          </div>
      );
    }
    
  }
};

export default ContractInterface;
