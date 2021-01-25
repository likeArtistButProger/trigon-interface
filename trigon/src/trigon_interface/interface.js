import Web3 from 'web3';
import { abi } from './trigon_abi';

const HTTPProvider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/ad81060272384c98b3f60da6439aa355');

export const provider = window.ethereum ? window.ethereum : HTTPProvider;

const w3 = new Web3(provider);

// let trigon_old = '0x77a1835381e98820651dEF3b8c8F04dD22983527';
export let trigon_new = '0x5CecE14b95578285EA6eb393e84A6DF84fC521b9';
trigon_new = w3.utils.toChecksumAddress(trigon_new);

export const contract = new w3.eth.Contract(abi, trigon_new); 
export const methods = contract.methods;
export const events = contract.events;
export const owner_address = "0xcB61a16dA5A785b16A0FA4f2567AbF6BDFB55626";

window.web3 = w3;