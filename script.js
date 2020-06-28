// Web3 and Instadapp Creation Contract
const Web3 = require('web3');
const providerUrl = 'https://mainnet.infura.io/v3/8d6142b291c84deba374beb2bf83834f';
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
const dsaCreationContract = require('./helpers/dsaCreationContract');

async function getDsaCreationPastMonth() {
    try {
        const instaDappContract = new web3.eth.Contract(dsaCreationContract.abi, dsaCreationContract.address);
        const accCreatedOnDate = {};
        const latest = await web3.eth.getBlockNumber();
        let startBlock=10172785;
        while(startBlock<=latest) {
            const result = await instaDappContract.getPastEvents('LogAccountCreated', { fromBlock: startBlock, toBlock: startBlock+10000});
            if(startBlock+10000>latest) {
                startBlock+(startBlock-latest);
            }
            startBlock+=10000;
            const blockHashSet = new Set();
            if(result) {
                for(const event of result) {
                    blockHashSet.add(event.blockHash);
                }
            }
            const blockHashes = Array.from(blockHashSet);
            for(let i=0; i<blockHashes.length; i++) {
                const blockData = await web3.eth.getBlock(blockHashes[i]);
                const date = new Date(blockData.timestamp*1000);
                if(date.getMonth()===5) {
                    const day = date.getDate();
                    const month = date.getMonth()+1;
                    const dateStr=day+'/'+month;
                    if(accCreatedOnDate[dateStr])
                        accCreatedOnDate[dateStr]+=1;
                    else
                        accCreatedOnDate[dateStr]=1;
                }
                // console.log(accCreatedOnDate);
            }
        }
        return accCreatedOnDate;
    }
    catch(err) {
        console.log(err);
    }
}

module.exports = getDsaCreationPastMonth;