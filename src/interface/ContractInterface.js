import React, { Component } from 'react';
import getWeb3 from '../util/web3/getWeb3';

import contract from 'truffle-contract';

import './interface.css';

import FunctionsPanel from './FunctionsPanel';
import ConvertPanel from './ConvertPanel';
import EventsPanel from './EventsPanel';

import DSProxy from './contracts/DSProxy';

class ContractInterface extends Component {

  constructor(props) {
    super(props);

    this.state = {
      address: '',
      abi: '',
      web3: null,
      accounts: [],
      instance: null,
      loaded: false,
      balance: 0,
      name: '',
      functions: [],
      publicVariables: [],
      events: [],
      fallback: false,
      selected: '',
      contracts: [],
      network: ''
    }
  }

  componentWillMount() {

     this.exampleContracts();

     getWeb3
    .then(results => {

      const web3 = results.payload.web3Instance;

      web3.eth.getAccounts((error, accounts) => {

         this.setState({
            accounts,
            web3
          });

          this.getNetwork(web3);
      });

    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name] : event.target.value
    });
  }

  exampleContracts = () => {
    const contracts = [
      {
        name: "Pick a contract"
      },
      {
        name: "DSProxy",
        abi: JSON.stringify(DSProxy),
        address: ''
      },
    ];
    this.setState({
        contracts
    });

  }

  selectMethod = (event) => {

    const name = event.target.value;

    let contract = this.state.contracts.find(c => c.name === name);

    this.setState({
      selected: event.target.value,
      abi: contract.abi,
      address: contract.address
    });
  }

  loadABI = () => {
    const abi = JSON.parse(this.state.abi);

    if(abi.contract_name) {
      return abi;
    } else {
      return {
        contract_name: "Test Contract",
        abi: abi
      }
    }
  }

  loadContract = async () => {
    const ourContract = contract(this.loadABI());

    const name = this.loadABI().contract_name;

    ourContract.setProvider(this.state.web3.currentProvider);

    const instance = ourContract.at(this.state.address);

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
    let fallback = false;

    abi.forEach((row) => {
      if(row.constant === true && row.inputs.length === 0 && row.payable === false) { 
        publicVariables.push(row);
      }
      
      if(row.type === "function" && !(row.constant === true && row.inputs.length === 0 && row.payable === false)) {
        functions.push(row);
      }
      
      if(row.type === "event") {
        events.push(row);
      }

      if(row.type === "fallback") {
        fallback = row.payable;
      }

    });

    await Promise.all(publicVariables.map(p => instance[p.name].call().then(res => {
      p.resolvedValue = res.valueOf();
    })));

    this.setState({
      functions,
      publicVariables,
      events,
      fallback
    });
  }

  refresh = async () => {
    let publicVariables = this.state.publicVariables;

    await Promise.all(publicVariables.map(p => this.state.instance[p.name].call().then(res => {
      p.resolvedValue = res.valueOf();
    })));

    this.setState({
      publicVariables
    });
  }

  refreshBalance = () => {
      this.state.web3.eth.getBalance(this.state.address, (err, res) => {

      let balance = this.state.web3.fromWei(res.valueOf(), 'ether');

      this.setState({
          balance: balance,
        });
    });
  }

  getNetwork = (web3) => {

    let network = "";

    web3.version.getNetwork((err, netId) => {
      switch (netId) {
        case "1":
          network = "Mainnet";
          break;
        case "3":
          network = "Ropsten testnet";
          break;
        case "4":
          network = "Rinkbey testnet";
          break;
        case "42":
          network = "Kovan testnet";
          break;
        default:
          network = "Unknown network";
      }

      this.setState({ network });
    });
  }

  render() {

    if(!this.state.loaded) {
      return(
        <div className="container">
          <div className="row">
            <div className="col-lg-8"> 
              <div className="well bs-component" id="load-contract">
              <form className="form-horizontal">
                
                <fieldset >
                  <legend>Load Contract <button type="button" className="btn btn-link pull-right">{ this.state.network }</button></legend>
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
                        <button type="button" className="btn btn-primary" onClick={ this.loadContract }>Load!</button>
                      </div>
                    </div>
                </fieldset>
                </form>
              </div>
              </div>

              <div className="col-lg-4"> 
                <div className="well bs-component" id="load-contract">
                  <form className="form-horizontal">
                    <legend>Example contracts</legend>
                      <div className="row">
                        <div className="col-lg-10">
                            <select className="form-control" onChange={ this.selectMethod } value={ this.state.selected } id="select">
                                { 
                                  this.state.contracts.map(c => 
                                    <option value={ c.name } key={ c.name }> { c.name } - { c.address } </option>
                                  )
                                
                                }
                            </select>
                        </div>
                      </div>
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
                      <legend>Contract   { this.state.name } <button type="button" onClick={ this.refreshBalance } className="btn btn-link pull-right">Refresh</button></legend>
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
                      <legend>Constants <button type="button" onClick={ this.refresh } className="btn btn-link pull-right">Refresh</button></legend>
                      {
                        this.state.publicVariables.map(row => (
                          <p key={ row.name }> 
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
                <FunctionsPanel 
                  instance={ this.state.instance } 
                  functions={ this.state.functions } 
                  accounts={ this.state.accounts } 
                  web3={ this.state.web3 }
                  fallback={ this.state.fallback }
                />
                <ConvertPanel />
               </div>

               <EventsPanel instance={ this.state.instance } events={ this.state.events } />

          </div>
      );
    }
    
  }
};

export default ContractInterface;
