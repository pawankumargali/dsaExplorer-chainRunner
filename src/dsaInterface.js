import Web3 from 'web3';
import DSA from 'dsa-sdk';
import { instaEventContract} from './instaEventContract';

const WEB3_PROVIDER_URL='https://mainnet.infura.io/v3/8d6142b291c84deba374beb2bf83834f';
const web3 =  new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER_URL));

if(!web3) {
  console.log('Error with Provider Url');
}

const dsa = new DSA(web3);

// Function to get all accounts owned by an address
async function getAccounts(ownerAddress) {
  try {
    const accounts = await dsa.getAccounts(ownerAddress);
    return accounts;
  }
  catch(err) {
    console.log(err);
    return -1;
  }
}

// Function to get all the authorised address(es) of a DSA by address.
async function getAuthorizedAddresses(dsaAddress) {
  try {
    const accounts = await dsa.getAuthByAddress(dsaAddress);
    return accounts;
  }
  catch(err) {
    console.log(err);
    return -1;
  }
}

async function getBalances(address) {
  try {
    const balances = await dsa.balances.getBalances(address, 'token');
    return balances;
  }
  catch(err) {
    console.log(err);
  }
}


// Function to get compound position
async function getCompoundPosition(address) {
  try {
    const position = await dsa.compound.getPosition(address,'token');
    return position;
  }
  catch(err) {
    console.log(err);
  }
}

// Function to get MKR position
async function getMakerPosition(address) {
  try {
    const position = await dsa.maker.getVaults(address);
    return position;
  }
  catch(err) {
    console.log(err);
  }
}

// Function to get Aave Position 
async function getAavePosition(address) {
  try{
    const position = await dsa.aave.getPosition(address, 'token');
    return position;
  }
  catch(err) {
    console.log(err);
  }
}


// Function to get dYdX position
async function getDydxPosition(address) {
  try{
    const position = await dsa.dydx.getPosition(address, 'token');
    return position;
  }
  catch(err) {
    console.log(err);
  }
}


// Function to get Latest Txns in DSA
async function getLatestTxns() {
  try {
    const EventContract = new web3.eth.Contract(instaEventContract.abi, instaEventContract.address);
    const latest = await web3.eth.getBlockNumber();
    const result = await EventContract.getPastEvents('LogEvent', { fromBlock: latest-1000, toBlock: 'latest'});
    let txnHashes=[];
    if(result) {
      const txnHashSet = new Set();
      for(const event of result) {
          txnHashSet.add(event.transactionHash);
      }
      txnHashes=Array.from(txnHashSet);
    }
    
    const latestTxns = [];
    for(let i=txnHashes.length-1; i>txnHashes.length-6; i--) {
      const txHash = txnHashes[i];
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      if(receipt) {
        latestTxns.push({ txHash: txHash, from: receipt.from, to: receipt.to, gasUsed: receipt.gasUsed });
      }
    }
    // console.log(latestTxns);
    return latestTxns;
  }
  catch(err) {
    console.log(err);
  }
}

async function getGlobalDsaCount() {
  try {
    const count = await dsa.count();
    return count;
  }
  catch(err) {
    console.log(err);
  }
}

  


export { getAccounts, getAuthorizedAddresses, getBalances, getCompoundPosition, getMakerPosition, getAavePosition, getDydxPosition, getLatestTxns, getGlobalDsaCount };
