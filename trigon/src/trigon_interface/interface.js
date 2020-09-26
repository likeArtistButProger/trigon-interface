import Web3 from 'web3';
import { abi } from './trigon_abi';
import HDWalletProvider from '@truffle/hdwallet-provider';

const mnemonic = 'enroll wise better shaft network laptop aspect ritual army surface drastic miracle type glide insect';
const HTTPProvider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/b2edf0df4af84cbca265c8a384f27db3');

export const provider = window.ethereum ? window.ethereum : HTTPProvider;

const w3 = new Web3(provider);

// const owner = '0xD9e0C0398959ea516E727832B741B86035d519FC';
// const pk = '42c4533550a20c4eeeee891ad012febe19268bc59f9da9e99b001bc503676c24';

// const ual = '0xBC72E655f84CaB4831845B64bB58184d63a0D0D9';
// const pkl = '0xb34341006bea8e3275f7399c10db52a25dc86923aca0f0d88c2c048fd6d91cef';

let trigon = '0x77a1835381e98820651dEF3b8c8F04dD22983527';
trigon = w3.utils.toChecksumAddress(trigon);

export const contract = new w3.eth.Contract(abi, trigon); 
export const methods = contract.methods;
export const events = contract.events;
export const owner_address = "0xcB61a16dA5A785b16A0FA4f2567AbF6BDFB55626";
console.log(events);