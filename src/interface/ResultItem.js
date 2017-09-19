import React, { Component } from 'react';

class ResultItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: props.data
        }

    }

    render() {
        return (
            <div className="alert alert-dismissible alert-info">
                <button type="button" className="close" data-dismiss="alert">&times;</button>
                <strong>Well done!</strong> You successfully read <a href="#" className="alert-link">this important alert message</a>.
            </div>
        );
    }

}

export default ResultItem;