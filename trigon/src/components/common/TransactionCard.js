import { fromByteArray } from "plotly.js/dist/plotly-cartesian";
import React, {Component} from 'react';
import moment from 'moment';

class TransactionCard extends Component {
    constructor(props) {
        super(props);

        this.state ={
            timeStamp: this.props,
            years: "",
            months: "",
            days: "",
            hours: "",
            minutes: ""
        }
    }

    openTransaction = () => {
        window.open(`https://ropsten.etherscan.io/tx/${this.props.hash}`);
    }

    calculateDate = () => {
        const now = new Date();
        const date = new Date(parseFloat(this.props.timeStamp));

        const difference = now.getTime() - date.getTime();
        const years = parseInt(difference / (1000 * 3600 * 24 * 365));
        const months = parseInt(difference / (1000 * 3600 * 24 * 31)) % 12;
        const days = parseInt(difference / (1000 * 3600 * 24)) % 31;
        const hours = parseInt((difference / (1000 * 3600))) % 24;
        const minutes = parseInt((difference / (1000 * 60))) % 60

        this.setState({
            years: years > 0 ? `${years} years\xa0` : '',
            months: months > 0 ? `${months} months\xa0` : '',
            days: days > 0 ? `${days} days\xa0` : '',
            hours: hours > 0 ? `${hours} hours\xa0` : '',
            minutes: minutes > 0 ? `${minutes} minutes\xa0` : ''
        })
    }

    toFixed = (num, fixed) => {
        var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
        return num.toString().match(re)[0];
    }

    componentDidMount() {
        this.calculateDate();
    }

    render() {

        let {years, months, days, hours, minutes} = this.state;
        const toFixed = this.toFixed;

        return (
            <div style={{padding: window.innerWidth >= 1280 ? "1px 5px" : ""}} className="grid grid-cols-3 md:py-1 pl-2 bg-trigon_gray-200 rounded-md justify between">
                <div className="flex flex-row justify-start">
                    <a onClick={this.openTransaction} className="md:text-xs lg:text-md xl:text-base cursor-pointer hover:text-trigon_green">
                        {this.props.hash.slice(0, 10)}...
                    </a>
                </div>
                {
                    window.innerWidth >= 470 &&
                    <div style={{fontSize: window.innerWidth >= 768 && window.innerWidth <= 980 ? '8px' : ''}} className="flex text-xs md:text-xs lg:text-xs xl:text-sm flex-row justify-center">
                        <span>
                            {years !== '' && years}
                            {months !== '' && months}
                            {days !== '' && years === '' && days}
                            {hours !== '' && months === '' && hours}
                            {minutes !== '' && days === '' && minutes}
                            ago
                        </span>
                    </div>
                }
                    <div style={{fontSize: window.innerWidth > 1400 ? "16px" : ""}} className="flex col-start-3 md:text-xs lg:text-md flex-row justify-center">
                        <span>
                            {   window.innerWidth > 1160 
                                ? this.props.sum 
                                : window.innerWidth > 580
                                ? toFixed(this.props.sum, 10) 
                                : toFixed(this.props.sum, 7)
                            }
                        </span>
                    </div>
            </div>
        )

    }

}

export default TransactionCard;