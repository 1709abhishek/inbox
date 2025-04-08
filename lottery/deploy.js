const HDWalletProvider = require('@truffle/hdwallet-provider');
const { Web3 } = require('web3');
const { interface, bytecode } = require('./compile'); // compile.js file
//updated web3 and hdwallet-provider imports added for convenience

// deploy code will go here

const provider = new HDWalletProvider(
  'wallet pnemonic',
  'sepolia deployed contract key '
)

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
  console.log('interface is', interface)
  provider.engine.stop();
}
deploy();
