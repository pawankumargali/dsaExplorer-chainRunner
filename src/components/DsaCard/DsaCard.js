import React, { useState, useEffect, Fragment } from 'react';
import './DsaCard.css';
import { getAuthorizedAddresses, getBalances, getCompoundPosition, getMakerPosition, getAavePosition, getDydxPosition } from '../../dsaInterface';
import DsaPositions from '../core/DsaPositions/DsaPositions';
import DsaBalances from '../core/DsaBalances/DsaBalances';

function DsaCard({props, tokenNames, tokenIcons, tokenPricesInEth, defiIcons, dsaAddress, dsaId}) {

    // Positions state variables and functions
    const [compoundPosition, setCompoundPositon] = useState(null);
    const [makerPosition, setMakerPosition] = useState(null);

    const [aavePosition, setAavePosition] = useState(null);
    const [dydxPosition, setDydxPosition] = useState(null);

    const [compoundReceived, setCompoundReceived] =useState(false);
    const [makerReceived, setMakerReceived] = useState(false);
    const [aaveReceived, setAaveReceived] = useState(false);
    const [dydxReceived, setDydxReceived] = useState(false);

    const initPositions = async () => {
        const compoundPos = await getCompoundPosition(dsaAddress, 'token');
        setCompoundPositon(compoundPos);
        setCompoundReceived(true);


        const makerPos = await getMakerPosition(dsaAddress);
        const vaultIds=[];
            for(const vaultId in makerPos) {
                vaultIds.push(vaultId);
            }

        makerPos.vaultIds=[...vaultIds];
        if(vaultIds.length!==0) {
            for(const vaultId of makerPos.vaultIds) {

                if(!isNaN(makerPos[vaultId].col)) {
                    const token = makerPos[vaultId].token.toLowerCase();
                    makerPos[vaultId].colInEth = makerPos[vaultId].col*tokenPricesInEth[token];
                }

                if(!isNaN(makerPos[vaultId].debt)) {
                    const token = 'dai'
                    makerPos[vaultId].debtInEth=makerPos[vaultId].debt*tokenPricesInEth[token];
                }
            }
        }
        setMakerPosition(makerPos);
        // console.log(makerPos);
        setMakerReceived(true);

        const aavePos = await getAavePosition(dsaAddress);
        setAavePosition(aavePos);
        setAaveReceived(true);
        // console.log(aavePos);

        const dydxPos = await getDydxPosition(dsaAddress);
        setDydxPosition(dydxPos);
        setDydxReceived(true);
        // console.log(dydxPos);
    }

    useEffect(() => {
        initPositions();
    }, [compoundReceived, makerReceived, aaveReceived, dydxReceived]);


    // Balances state variables and functions
    const [balances, setBalances] = useState(null);
    const [totalBalanceInEth, setTotalBalanceInEth] = useState(0);

    const [balancesReceived, setBalancesReceived] = useState(false);

    const initBalances = async () => {
        
        const balanceData = await getBalances(dsaAddress);
        let totalEthBal=0;
        // console.log(balanceData);
        /* CoinGecko doesn't return prices for snx, lend and susd
            lend:'aave', snx:'synthetix-network-token', susd:'susd',
        */
        const bals={};
        for(const token in balanceData) {
            if(token!=='lend' && token!=='snx' && token!=='susd' && balanceData[token]!=0) {
                if(tokenPricesInEth[token]!==-1) {
                    bals[token]=balanceData[token];
                    totalEthBal+=balanceData[token]*tokenPricesInEth[token];
                }
            } 
        }
        setBalances(bals);
        setTotalBalanceInEth(totalEthBal);
        setBalancesReceived(true);
    }

    useEffect(() => {
        initBalances();
    }, [balancesReceived, totalBalanceInEth]);



    return <div className="dsa-account-item">

                <div className="dsa-address">
                    <span>DSA</span>
                    <a href={`https://etherscan.io/address/${dsaAddress}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    >
                        {dsaAddress}
                    </a>
                    <button  id="explore-dsa-btn"
                        // href={`../dsa/${dsaAddress}`}
                        onClick={() => props.history.push(`/dsa/${dsaAddress}`)}
                    >
                        Explore
                    </button>
                    <div id="dsa-id-overlay"># {dsaId}</div>
                </div>
                {compoundReceived && aaveReceived && dydxReceived && makerReceived &&
                    <DsaPositions 
                        tokenIcons={tokenIcons}
                        defiIcons={defiIcons}
                        dsaAddress={dsaAddress}
                        compoundPosition={compoundPosition}
                        makerPosition={makerPosition}
                        aavePosition={aavePosition}
                        dydxPosition={dydxPosition}
                        showPositionTable = {true}
                    />
                }
                {balancesReceived &&
                <DsaBalances 
                    tokenIcons={tokenIcons}
                    dsaAddress={dsaAddress}
                    balances={balances}
                    totalBalanceInEth={totalBalanceInEth}
                    showBalanceChart={false}
                />
                }
            </div>;
}

export default DsaCard;