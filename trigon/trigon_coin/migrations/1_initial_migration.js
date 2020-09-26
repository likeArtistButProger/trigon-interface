const Trigon = artifacts.require("Trigon");

module.exports = async function(deployer, network, accounts) {

  await deployer.deploy(Trigon);

  //You will be changing all the afters to befores for this when you copy/paste
  //First portion
  coin = await Trigon.deployed();
  coinSupply = parseInt(await coin.totalSupply.call());
  console.log("coinSupply originally is " + coinSupply );
  
  percent = parseInt(await coin.getCommissionTotal());
  console.log("totalCommissionPercentage:"+percent);

  percent = parseInt(await coin.getCommissionRef());
  console.log("refererCommissionPercentage:"+percent);

  percent = parseInt(await coin.getCommissionAdmin());
  console.log("adminCommissionPercentage:"+percent);

  percent = parseInt(await coin.getCommissionCost());
  console.log("toCostCommissionPercentage:"+percent);

  console.log("----------------------------------");

//  init = await coin.init({from: accounts[0],value: 10000000000000000});
  

  bank = parseInt(await coin.bank());
  console.log("bank:"+bank);

  price = parseInt(await coin.price());
  console.log("price:"+price);

  totalSupply = parseInt(await coin.totalSupply());
  console.log("totalSupply:"+totalSupply);

  balanceOf = parseInt(await coin.balanceOf(accounts[0]));
  console.log("balanceOf:"+balanceOf);
}