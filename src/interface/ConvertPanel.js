import React, { Component } from 'react';

import getWeb3 from '../util/web3/getWeb3';


class ConvertPanel extends Component {

    constructor() {
        super();

        this.state = {
            web3: null,
            wei: '',
            ether: '',
            address: '',
            balance: 0
        };
    }

    componentWillMount() {
        getWeb3 
        .then(results => {
            this.setState({
                web3: results.payload.web3Instance
            });
        })
        .catch(() => {
            console.log('Error finding web3.')
        });
    }

    convertWei = (event) => {

        let weiValue = event.target.value;
        let etherValue = this.state.web3.fromWei(weiValue, 'ether');

        this.setState({
            wei: weiValue,
            ether: etherValue
        });
    }

    convertEther = (event) => {

        let etherValue = event.target.value;
        let weiValue = this.state.web3.toWei(etherValue, 'ether');

        this.setState({
            wei: weiValue,
            ether: etherValue
        });
    }

    getBalance = () => {
        this.state.web3.eth.getBalance(this.state.address, (err, res) => {

            let balance = this.state.web3.fromWei(res.valueOf(), 'ether');

            this.setState({
                balance
            });

        });
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    render() {
        return (
                <div className="col-lg-4"> 
                  <div className="well bs-component">
                     <form className="form-horizontal">
                      <legend>Tools</legend>
                        <div className="row">
                            <div className="col-lg-8">
                                <input name="wei" value={ this.state.wei } onChange={ this.convertWei } type="number" className="form-control" placeholder="Value in Wei" />
                            </div>

                            <div className="col-lg-4">
                                <input name="ether" value={ this.state.ether } onChange={ this.convertEther } type="number" className="form-control" placeholder="Ether" />
                            </div>
                        </div>

                        <hr />

                        <div className="row">
                            <div className="col-lg-8">
                                <input name="address" value={ this.state.address } onChange={ this.handleChange } type="text" className="form-control" placeholder="Address" />
                            </div>
                            <div className="col-lg-2">
                                <button type="button" className="btn btn-info" onClick={ this.getBalance }>Balance</button>
                            </div>
                        </div>

                        {
                            this.state.balance !== 0 &&
                            <h4>
                                Balance: { this.state.balance } ether
                            </h4>
                        }
                        
                     </form>
                  </div>
                </div>
        )
    }
}

export default ConvertPanel;