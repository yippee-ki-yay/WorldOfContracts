import React, { Component } from 'react';
import getWeb3 from '../util/web3/getWeb3';

import contract from 'truffle-contract';

import FunctionsPanel from './FunctionsPanel';
import ConvertPanel from './ConvertPanel';
import EventsPanel from './EventsPanel';

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
      name: '',
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

    const name = JSON.parse(this.state.abi).contract_name;

    dnsContract.setProvider(this.state.web3.currentProvider);

    const instance = dnsContract.at(this.state.address);

    await this.parseAbi(instance.abi, instance);

    this.state.web3.eth.getBalance(this.state.address, (err, res) => {

    let balance = this.state.web3.fromWei(res.valueOf(), 'ether');

    this.setState({
        instance: instance,
        loaded: true,
        balance: balance,
        name: name
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

    if(this.state.loaded) {
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
                      <legend>Contract   { this.state.name } </legend>
                      <h4>Contract name: <span className="text-success"> { this.state.name } </span> </h4>
                      <h4>Contract address: <span className="text-success">{ this.state.address } </span> </h4>
                      <h4>Contract balance: <span className="text-success"> { this.state.balance } ether </span> </h4>
                    </fieldset>
                </form>
              </div>

              </div>
                <div className="col-lg-4"> 
                   <div className="well bs-component" id="load-contract">
                    <form className="form-horizontal">
                      <legend>Variables & Constant methods</legend>
                      {
                        this.state.publicVariables.map(row => (
                          <p> 
                            <span className="text-primary">{ row.outputs[0].type } </span>
                            <span className="text-success">{ row.name } = </span>
                            <span className="text-info"> { row.resolvedValue }</span>
                          </p>
                        )
                        
                        )
                      }
                    </form>
                   </div>
                </div>
              </div>

               <div className="row">
                <FunctionsPanel instance={ this.state.instance } functions={ this.state.funtions } />
                <ConvertPanel web3={ this.state.web3 }/>
               </div>

               <EventsPanel instance={ this.state.instance } events={ this.state.events } />

          </div>
      );
    }
    
  }
};

export default ContractInterface;
