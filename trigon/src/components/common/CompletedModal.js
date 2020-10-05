import React, { Component } from 'react';
import styled from 'styled-components';

const Modal = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 10;
    background: rgba(0, 0, 0, 0.6);

    & .modal_content {
        position: absolute;
        width: 18rem;
        height: 20rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 0px solid;
        border-radius: 20px;
        background: #606166;

        @media(min-width: 480px) {
            width: 30rem;
            height: 10rem;
        }

        & p {
            margin-top: 10px;
            text-align: center;
            font-family: "Open Sans", sans-serif;
            font-size: 19px;

            @media(min-width: 480px) {
                font-size: 20px;
            }
        }

        & .buttons {
            position: relative;
            display: flex;
            flex-direction: column;

            @media(min-width: 480px) {
               flex-direction: row;
            }

            & .button {
                display: table;
                width: 80%;
                text-align: center;
                font-size: 24px;
                cursor: pointer;
                padding: 20px 30px;
                margin: 0 auto;
                margin-top: 40px;
                margin-bottom: 10px;
                border-radius: 10px;
                background: #1D2024;

                @media(min-width: 480px) {
                    width: 30%;
                    margin-top: 30px;
                    font-size: 20px;
                }

                &:hover {
                    background: white;
                    border: 1px solid #1D2024;
                    color: #1D2024;
                }

            }
        }
    }
`


class CompletedModal extends Component {
    constructor(props) {
        super(props);
    }

    closeModal = () => {
        this.props.closeModal();
        window.location.pathname = "/";
    }
    
    toEtherscan = () => {
        if(this.props.transaction) {
            window.open(`https://ropsten.etherscan.io/tx/${this.props.transaction}`);
            return;
        }
        this.props.closeModal();
        window.location.reload();
    }

    render() {
        return (
            <Modal>
                <div className="modal_content">
                    {   this.props.processing 
                        ?   <p>Transaction processing</p>
                        :   <p style={{"color": this.props.success ? '#7AC231' : '#C11E0F'}} >{this.props.success ? 'Transaction Successful!' : 'Transaction Failed'}</p>
                    }
                    <div className="buttons">
                        <span onClick={this.toEtherscan} className="button">Tx Hash</span>
                        <span onClick={this.closeModal} className="button">Close</span>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default CompletedModal;
