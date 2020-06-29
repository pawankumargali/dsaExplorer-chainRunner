import React, {Fragment, useState, useEffect} from 'react';
import Header from '../core/Header/Header';
import Footer from '../core/Footer/Footer';
import './Home.css';
import DsaCountChart from '../charts/DsaCountChart';
import { getGlobalDsaCount, getLatestTxns } from '../../dsaInterface';
import Web3 from 'web3';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FetchingDataToast } from '../core/CustomToast/CustomToast';


const WEB3_PROVIDER_URL='https://mainnet.infura.io/v3/8d6142b291c84deba374beb2bf83834f';
const web3 =  new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER_URL));

toast.configure();

function Home({props, address, setAddress, tokenIcons}) {

    const [toastCalled, setToastCalled] = useState(false);

    const [ globalDsaCount, setGlobalDsaCount ] = useState(0);
    const [latestTxns, setLatestTxns] = useState([]);
    const [latestTxnsReceived, setLatestTxnsReceived] = useState(false);
    const [accCreatedThisMonth, setAccCreatedThisMonth] = useState({});
    const [accCreationDataReceived, setAccCreationDataReceived] = useState(false);

    const initGlobalDsaCount = async () => {
        const count = await getGlobalDsaCount();
        // console.log(count);
        setGlobalDsaCount(count);
    }

    async function getDsaCreationPerDay() {
        try {
            const response = await axios.get('https://dsacreation-info.herokuapp.com/api/data');
            if(!response.data.success) {
                console.log(response.data.error);
            }
            const data = response.data.data;
            setAccCreatedThisMonth(data);
            setAccCreationDataReceived(true);
        }
        catch(err) {
            console.log(err);
        }
    }

    const initLatestTxns = async () => {
        const txns = await getLatestTxns();
        setLatestTxns(txns);
        // console.log(txns);
        setLatestTxnsReceived(true);
    }

    useEffect(() => {
        initGlobalDsaCount();
    }, [globalDsaCount]);

    useEffect(() => {
        if(!toastCalled) {
            toast(<FetchingDataToast/>, {position: toast.POSITION.BOTTOM_RIGHT});
            setToastCalled(true);
        }
        initLatestTxns();
    }, [latestTxnsReceived, toastCalled]);

    useEffect(() => {
        getDsaCreationPerDay();
    }, [accCreationDataReceived]);

    return <Fragment>
                <Header 
                    props={props}
                    address={address}
                    setAddress={setAddress}
                />
                <div id="dsa-count-chart-div">
                    <div id="dsa-count-title">DSA Creation Past Month</div>
                    <div>
                        { accCreationDataReceived &&
                        <DsaCountChart 
                            accCreationData = {accCreatedThisMonth}
                        />
                        }
                    </div>
                    <div id="dsa-total-count">
                        Global # {globalDsaCount}
                    </div>
                </div>
                <div id="latest-txn-div">
                    <div id="dsa-recent-txn-title">Recent Transactions</div>
                    <table>
                        <thead>
                            <th>Transaction Hash</th>
                            <th>From</th>
                            <th>To</th>
                            <th>
                                <span>Gas</span>
                                <img src={tokenIcons['eth']} alt="eth-icon" />
                            </th>
                        </thead>
                        <tbody>
                        {latestTxns.length!==0 && 
                        latestTxns.map((tx,index) =>
                            <tr key={index}>
                                <td className="value-item">
                                    <a href={`https://etherscan.io/tx/${tx.txHash}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    >
                                        {tx.txHash.substring(0,12)+'...'+tx.txHash.substring(tx.txHash.length-5,tx.txHash.length-1)}
                                    </a>
                                </td>
                                <td className="value-item">
                                    <a href={`https://etherscan.io/address/${tx.from}`}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        {tx.from.substring(0,12)+'...'+tx.from.substring(tx.from.length-5,tx.from.length-1)}
                                    </a>
                                </td>
                                <td className="value-item">
                                    <a href={`https://etherscan.io/address/${tx.to}`}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        {tx.to.substring(0,12)+'...'+tx.to.substring(tx.to.length-5,tx.to.length-1)}
                                    </a>
                                </td>
                                <td className="value-item" style={{color:'#000'}}>
                                    {tx.gasUsed/Math.pow(10,9)}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                
                <Footer 
                    stickAtBottom={false}
                />
           </Fragment>
}

export default Home;