import { fromByteArray } from "plotly.js/dist/plotly-cartesian";
import React, {Component} from 'react';

class TransactionCard extends Component {
    constructor(props) {
        super(props);

        this.state ={
            hash: this.props.hash
        }
    }

    componentDidMount() {
        console.log(typeof this.state.hash);
    }

    render() {

        return (
            <div className="grid grid-cols-3 my-1 pl-2 bg-trigon_gray-200 rounded-md justify between">
                <a href={`https://etherscan.io/${this.props.hash}`} className="text-xs">
                    {this.state.hash}...
                </a>
                <span className="">
                    {this.props.sum}
                </span>
                <span className="">
                    {this.props.type}
                </span>
            </div>
        )

    }

}

export default TransactionCard;