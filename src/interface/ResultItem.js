import React, { Component } from 'react';

class ResultItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            etherscan: "https://ropsten.etherscan.io/tx/"
        }

    }

    render() {

        const url = this.state.etherscan + this.state.data.transactionHash;

        if(this.state.data.isCall) {
              return (
                    <div key={ this.state.data.index } className="alert alert-dismissible alert-info">
                        <button type="button" className="close" data-dismiss="alert">&times;</button>
                        <div>Call to  { this.state.data.name } executed </div>
                        <strong>Result: { this.state.data.result }</strong>.
                    </div>
                );

        } else {
              return (
                <div key={ this.state.data.index } className="alert alert-dismissible alert-info">
                    <button type="button" className="close" data-dismiss="alert">&times;</button>
                    <div>{ this.state.data.name } has been mined </div>
                    <div> <a href={ url } target="_blank" className="alert-link">Transaction hash: { this.state.data.transactionHash }</a> </div>
                    <strong>Gas cost: { this.state.data.gas }</strong>
                </div>
            );
        }

    }

}

export default ResultItem;