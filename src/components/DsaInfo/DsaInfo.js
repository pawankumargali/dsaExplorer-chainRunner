import React, {Fragment, useEffect, useState} from 'react';
import Header from '../core/Header/Header';
import DsaBalances from '../core/DsaBalances/DsaBalances';
import PositionChart from '../charts/PositionChart';
import Footer from '../core/Footer/Footer';
import './DsaInfo.css';
import { getAuthorizedAddresses, getCompoundPosition, getAavePosition, getMakerPosition, getDydxPosition, getBalances } from '../../dsaInterface';
import compoundLogo from '../../icons/logos/compound.png';
import aaveLogo from '../../icons/logos/aave.svg';
import dydxLogo from '../../icons/logos/dydx.png';
import makerLogo from '../../icons/logos/maker.jpg';
import DefiPercentChart from '../charts/DefiPercentChart';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FetchingDataToast } from '../core/CustomToast/CustomToast';

toast.configure();

function DsaInfo({props, address, setAddress, tokenNames, tokenIcons, tokenPricesInEth, defiIcons}) {

    const [toastCalled, setToastCalled] = useState(false);
    // DSA Address and Owners
    const dsaAddress = props.match.params.address;
    const [ownerAddresses, setOwnerAddresses] = useState([]);
    const [ownersReceived, setOwnersReceived] = useState(false);
    const supportedAssets = {compound:'COMPOUND', aave:'AAVE', dydx:'dYdX', 'maker':'Maker DAO'}
    const [selectedAssets, setSelectedAssets] = useState({compound:false, aave:false, dydx:false, maker:false});

    // Balances state variables and functions
    const [balances, setBalances] = useState(null);
    const [totalBalanceInEth, setTotalBalanceInEth] = useState(0);
    const [balancePercentages, setBalancePercentages] = useState(null);

    const [balancesReceived, setBalancesReceived] = useState(false);
    const [isBalancePercentagesSet, setIsBalancePercentagesSet] = useState(false);

    const initBalances = async () => {
        
        const balanceData = await getBalances(dsaAddress);
        let totalEthBal=0;
        for(const token in balanceData) {
            if(token!=='lend' && token!=='snx' && token!=='susd' && balanceData[token]!=0) {
                if(tokenPricesInEth[token]!==-1) {
                    totalEthBal+=balanceData[token]*tokenPricesInEth[token];
                }
            } 
        }

        setBalances(balanceData);
        setTotalBalanceInEth(totalEthBal);
        setBalancesReceived(true);

        const balPercentages={};
        for(const token in balanceData) {
            if(token!=='lend' && token!=='snx' && token!=='susd' &&balanceData[token]!==0) {
                const tokenAmtInEth = balanceData[token]*tokenPricesInEth[token];
                const tokenBalPercent =tokenAmtInEth/totalEthBal;
                balPercentages[token]=tokenBalPercent;
            }
        }
        setBalancePercentages(balPercentages);
        setIsBalancePercentagesSet(true);
    }

    // Positions state variables and functions
    const [compoundPosition, setCompoundPositon] = useState(null);
    const [makerPosition, setMakerPosition] = useState(null);
    const [currentVaultId, setCurrentVaultId] = useState('');
    const [aavePosition, setAavePosition] = useState(null);
    const [dydxPosition, setDydxPosition] = useState(null);

    // Total Supply and Borrow for overall Position
    const [totalSupply, setTotalSupply] = useState(0);
    const [totalBorrow, setTotalBorrow] = useState(0);

    const [compoundReceived, setCompoundReceived] =useState(false);
    const [makerReceived, setMakerReceived] = useState(false);
    const [currentVaultIdSet, setCurrentVaultIdSet] = useState(false);
    const [aaveReceived, setAaveReceived] = useState(false);
    const [dydxReceived, setDydxReceived] = useState(false);

    const _getTotalSupply = () => {
        let totalSupply=0;
        if(compoundPosition!==null && aavePosition!==null && dydxPosition!==null)
            totalSupply = compoundPosition.totalSupplyInEth + aavePosition.totalSupplyInEth + dydxPosition.totalSupplyInEth;
        if(makerPosition!==null && makerPosition.vaultIds.length!==0) {   
            for(const vaultId of makerPosition.vaultIds) {
                if(!isNaN(makerPosition[vaultId].col)) 
                    totalSupply+=makerPosition[vaultId].colInEth;
            }
        }
        return totalSupply;
    };
    
    const _getTotalBorrow = () => {
        let totalBorrow=0;
        if(compoundPosition!==null && aavePosition!==null && dydxPosition!==null)
            totalBorrow = compoundPosition.totalBorrowInEth + aavePosition.totalBorrowInEth + dydxPosition.totalBorrowInEth;
        if(makerPosition!==null && makerPosition.vaultIds.length!==0) {
            for(const vaultId of makerPosition.vaultIds) {
                if(!isNaN(makerPosition[vaultId].debt))
                    totalBorrow+=makerPosition[vaultId].debtInEth;
            }
        }
        return totalBorrow;
    }

    const initPositions = async () => {
        const compoundPos = await getCompoundPosition(dsaAddress, 'token');
        setCompoundPositon(compoundPos);
        setCompoundReceived(true);

        // console.log(compoundPos);
        const makerPos = await getMakerPosition(dsaAddress);
        const vaultIds=[];
        let totalMkrColInEth=0;
        let totalMkrDebtInEth=0;
        for(const vaultId in makerPos) {
            vaultIds.push(vaultId);
        }

        makerPos.vaultIds=[...vaultIds];
        if(vaultIds.length!==0) {
            for(const vaultId of makerPos.vaultIds) {

                if(!isNaN(makerPos[vaultId].col)) {
                    const token = makerPos[vaultId].token.toLowerCase(); 
                    const tokenColInEth = makerPos[vaultId].col*tokenPricesInEth[token];
                    makerPos[vaultId].colInEth = tokenColInEth
                    totalMkrColInEth+=tokenColInEth;
                }

                if(!isNaN(makerPos[vaultId].debt)) {
                    const token = 'dai';
                    const tokenDebtInEth = makerPos[vaultId].debt*tokenPricesInEth[token];
                    makerPos[vaultId].debtInEth=tokenDebtInEth;
                    totalMkrDebtInEth+=tokenDebtInEth;
                    // console.log(tokenPriceInEth);
                    // console.log(makerPos[vaultId].debt);
                }
            }
            setCurrentVaultId(makerPos.vaultIds[0]);
            setCurrentVaultIdSet(true);
            makerPos.totalColInEth = totalMkrColInEth;
            makerPos.totalDebtInEth = totalMkrDebtInEth;
        }
        else {
            makerPos.totalColInEth=0;
            makerPos.totalDebtInEth=0;
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

        const supplyTotal = _getTotalSupply();
        const borrowTotal = _getTotalBorrow();
        setTotalSupply(supplyTotal);
        setTotalBorrow(borrowTotal);
    }
    
    
    

    // Handle Selected Assets
    const handleAssetSelect = asset => {
        // console.log(asset);
        const selAssets = {...selectedAssets};
        for(const each in selAssets) {
            if(each!==asset)
                selAssets[each]=false;
        }
        if(!selAssets[asset]) {
            selAssets[asset] = true;
        }
        else {
            selAssets[asset] = false;
        }
        setSelectedAssets(selAssets);
        // console.log(selAssets);
    };    

    const initOwners = async () => {
        const owners = await getAuthorizedAddresses(dsaAddress);
        // console.log(owners);
        setOwnerAddresses(owners);
        setOwnersReceived(true);
    }
    
    useEffect(() => {
        if(!toastCalled) {
            toast(<FetchingDataToast/>, {position: toast.POSITION.BOTTOM_RIGHT});
            setToastCalled(true);
        }
        initBalances();
    }, [balancesReceived, isBalancePercentagesSet, totalBalanceInEth, toastCalled]);
    
    useEffect(() => {
        initPositions();
    }, [compoundReceived, makerReceived, aaveReceived, dydxReceived, currentVaultIdSet, totalSupply, totalBorrow, toastCalled]);

    useEffect(() => {
        initOwners();  
    }, [ownersReceived, toastCalled]);

    return <Fragment>
                <Header
                    props={props} 
                    address={address}
                    setAddress={setAddress}
                /> 

                <div id="dsa-info-container">
                    <div id="dsa-address">
                            <span>DSA</span>
                            <a href={`https://etherscan.io/address/${dsaAddress}`}
                               target="_blank" 
                               rel="noopener noreferrer"
                            >
                                {dsaAddress}
                            </a> 
                    </div>
                    {balancesReceived && isBalancePercentagesSet && !isNaN(totalBalanceInEth) &&
                        <DsaBalances 
                            tokenIcons={tokenIcons}
                            dsaAddress={dsaAddress}
                            balances={balances}
                            balancePercentages={balancePercentages}
                            totalBalanceInEth={totalBalanceInEth}
                            showBalanceChart={true}
                        />
                    }
                </div>
                {compoundReceived && aaveReceived && dydxReceived && makerReceived && makerPosition.colInEth!=='NaN' &&
                <div id="position-chart-div">
                <div>
                    <PositionChart 
                        compound={compoundPosition}
                        aave={aavePosition}
                        dydx={dydxPosition}
                        maker={makerPosition}
                    />
                </div>
                <div>
                    <DefiPercentChart
                        compound={compoundPosition}
                        aave={aavePosition}
                        dydx={dydxPosition}
                        maker={makerPosition}
                    />
                </div>
                </div>
                }
                <div id="dsa-positions-item">
                    {compoundReceived && aaveReceived && dydxReceived && makerReceived && !isNaN(totalSupply) && !isNaN(totalBorrow) &&
                    <Fragment>
                        <div className="pos-div">
                            <div>
                                <span className="protocol-name">Overall Position</span>
                            </div>
                            <div>  
                                <span className="net-item">Net</span>
                                <span className="value-item">{Math.round((totalSupply-totalBorrow)*100)/100}</span>
                                {totalSupply ? <img src={tokenIcons['eth']} alt="eth-icon" /> : ''} 
                            </div>
                            <div>  
                                <span className="supply-item">Supply</span>
                                <span className="value-item">{Math.round((totalSupply)*100)/100}</span>

                                {totalSupply!==0 && <img src={tokenIcons['eth']} alt="eth-icon" />}
                            </div>
                            <div>
                                <span className="borrow-item">Borrow</span>
                                <span className="value-item">{Math.round((totalBorrow)*100)/100}</span>
                                {totalBorrow!==0 && <img src={tokenIcons['eth']} alt="eth-icon" />}
                            </div>
                            <div>
                                <span className="cf-item">C.F </span>
                                <span className="value-item">{totalSupply===0 ? 'NaN' : Math.round((totalBorrow/totalSupply)*10000)/100 +'%'}</span>
                            </div>
                        </div>
                    
                        <div id="select-positions">
                        {Object.keys(supportedAssets).map((asset,index) =>
                            <div className="select-position-item" 
                                 onClick={() => handleAssetSelect(asset)}
                                 key={index}
                                 style={selectedAssets[asset] ? {backgroundImage: 'linear-gradient(to right,#067, #047)', color:'#fff'} : {}}
                            >
                                {supportedAssets[asset]}
                            </div>
                        )}
                        </div>
                        
                        {/* COMPOUND */}
                        {selectedAssets['compound'] && compoundPosition && 
                        
                        <div className="detailed-pos-wrapper">
                            <div className="detailed-pos-header">
                                <img style={{width:'200px'}} src={compoundLogo} alt="compound" />
                                {/* <span className="protocol-name">Compound Position</span> */}
                            </div>
                            <div className="detailed-pos-div">
                                <div>  
                                    <span className="net-item">Net</span>
                                    <span className="value-item">{compoundPosition.totalSupplyInEth!==0 ? Math.round((compoundPosition.totalSupplyInEth-compoundPosition.totalBorrowInEth)*100)/100 : 0}</span>
                                    {compoundPosition.totalSupplyInEth!==0 && <img src={tokenIcons['eth']} alt="eth-icon" />} 
                                </div>
                                <div>  
                                    <span className="supply-item">Lent</span>
                                    <span className="value-item">{compoundPosition.totalSupplyInEth!==0 ? Math.round(compoundPosition.totalSupplyInEth*100)/100 : 0}</span>
                                    {compoundPosition.totalSupplyInEth!==0 && <img src={tokenIcons['eth']} alt="eth-icon" />}
                                </div>
                                <div>
                                    <span className="borrow-item">Borrowed</span>
                                    <span className="value-item">{compoundPosition.totalBorrowInEth!==0 ? Math.round(compoundPosition.totalBorrowInEth*100)/100 : 0}</span>
                                    {compoundPosition.totalBorrowInEth!==0 && <img src={tokenIcons['eth']} alt="eth-icon" />}
                                </div>
                                <div>
                                    <span className="cf-item">Status (Current / Max) </span>
                                    <span className="value-item"
                                          style={(compoundPosition.status/compoundPosition.liquidation)<=1 ? {color:'#2E8B57'}: {color:'#B83779'}}
                                    > 
                                        {!isNaN(compoundPosition.liquidation) ? 'Safe' : ' '}
                                    </span>
                                    <span className="value-item">
                                           (
                                           <span style={(compoundPosition.status/compoundPosition.liquidation)<=1 ? {color:'#2E8B57'} : {color:'#B83779'} }> {!isNaN(compoundPosition.status) ? Math.round(compoundPosition.status*10000)/100 +'%' : 'NaN'} </span> 
                                            / 
                                            <span style={{color:'#B83779'}}> {!isNaN(compoundPosition.liquidation) ? Math.round(compoundPosition.liquidation*10000)/100 + '%' : 'NaN'} </span>
                                           )
                            
                                    </span>
                                   
                                </div>
                            </div>
                                {compoundPosition.totalSupplyInEth===0 ? 
                                    (<div className="no-pos-div">
                                        <span className="value-item"
                                              style={{color:'C06D91'}}
                                        >
                                            No Position
                                        </span>
                                    </div>) :
                                
                                (<table className="hidden-pos-table">
                                    <thead>
                                        <tr>
                                            <th>Token</th>
                                            <th>Lent</th>
                                            <th>Borrowed</th>
                                            <th>Price in Eth</th>
                                            <th>Supply Rate %</th>
                                            <th>Borrow Rate %</th>
                                        </tr>
                                    </thead>
                                <tbody>
                                {Object.keys(compoundPosition).map((token, index) => {
                                    if(tokenNames[token]) 
                                    return <Fragment key={index}> 
                                                <tr>
                                                {(compoundPosition[token].supply!==0 || compoundPosition[token].borrow!==0) &&
                                                    (<Fragment>
                                                    <td>
                                                    <img src={tokenIcons[token]} alt={token} />
                                                    <span className="protocol-name">{token.toUpperCase()}</span>
                                                    </td>
                                                    
                                                        <td>
                                                            <span className="value-item">{Math.round((compoundPosition[token].supply)*100)/100}</span>
                                                        </td>
                                                        <td>
                                                            <span className="value-item">{Math.round((compoundPosition[token].borrow)*100)/100}</span>
                                                        </td>
                                                        <td>
                                                            <span className="value-item">{Math.round((compoundPosition[token].priceInEth)*10000)/10000}</span>
                                                        </td>
                                                        <td>
                                                            <span className="value-item">{Math.round((compoundPosition[token].supplyYield)*100)/100}</span>
                                                        </td>
                                                        <td>
                                                            <span className="value-item">{Math.round((compoundPosition[token].borrowYield)*100)/100}</span>
                                                        </td>
                                                    </Fragment>) 
                                                    }
                                                </tr>
                                            </Fragment>
                                    })
                                }
                                </tbody>
                                </table>)}
                            
                            </div>
                        }

                        {/* AAVE */}
                        {selectedAssets['aave'] && aavePosition &&
                        
                        <div className="detailed-pos-wrapper">
                            <div className="detailed-pos-header">
                                <img style={{width:'150px'}} src={aaveLogo} alt="aave" />
                                {/* <span className="protocol-name">aave Position</span> */}
                            </div>
                            <div className="detailed-pos-div">
                                <div>  
                                    <span className="net-item">Net</span>
                                    <span className="value-item">{aavePosition.totalSupplyInEth!==0 ? Math.round((aavePosition.totalSupplyInEth-aavePosition.totalBorrowInEth)*100)/100 : 0}</span>
                                    {aavePosition.totalSupplyInEth!==0 && <img src={tokenIcons['eth']} alt="eth-icon" />} 
                                </div>
                                <div>  
                                    <span className="supply-item">Lent</span>
                                    <span className="value-item">{aavePosition.totalSupplyInEth!==0 ? Math.round(aavePosition.totalSupplyInEth*100)/100 : 0}</span>
                                    {aavePosition.totalSupplyInEth!==0 && <img src={tokenIcons['eth']} alt="eth-icon" />}
                                </div>
                                <div>
                                    <span className="borrow-item">Borrowed</span>
                                    <span className="value-item">{aavePosition.totalBorrowInEth!==0 ? Math.round(aavePosition.totalBorrowInEth*100)/100 : 0}</span>
                                    {aavePosition.totalBorrowInEth!==0 && <img src={tokenIcons['eth']} alt="eth-icon" />}
                                </div>
                                <div>
                                    <span className="cf-item">Status (Current / Max) </span>
                                    <span className="value-item"
                                        style={(aavePosition.status/aavePosition.liquidation)<=1 ? {color:'#2E8B57'}: {color:'#B83779'}}
                                    > 
                                       {!isNaN(aavePosition.liquidation) ? 'Safe' : ' '}
                                    </span>
                                    <span className="value-item">
                                        (
                                        <span style={(aavePosition.status/aavePosition.liquidation)<=1 ? {color:'#2E8B57'} : {color:'#B83779'} }> { !isNaN(aavePosition.status) ? Math.round(aavePosition.status*10000)/100 +'%' : 'NaN'} </span> 
                                            / 
                                            <span style={{color:'#B83779'}}> {!isNaN(aavePosition.liquidation) ? Math.round(aavePosition.liquidation*10000)/100 + '%' :'NaN'} </span>
                                        )
                            
                                    </span>
                                
                                </div>
                            </div>
                            {aavePosition.totalSupplyInEth===0 ? 
                                    (<div className="no-pos-div">
                                        <span className="value-item"
                                              style={{color:'C06D91'}}
                                        >
                                            No Position
                                        </span>
                                    </div>) :
                                (<table className="hidden-pos-table">
                                    <thead>
                                        <tr>
                                            <th>Token</th>
                                            <th>Lent</th>
                                            <th>Borrowed</th>
                                            <th>Price in Eth</th>
                                            <th>Supply Rate %</th>
                                            <th>Borrow Rate %</th>
                                        </tr>
                                    </thead>
                                <tbody>
                                {Object.keys(aavePosition).map((token, index) => {
                                    if(tokenNames[token])
                                    return <Fragment key={index}> 
                                                <tr>
                                                {(aavePosition[token].supply!==0 || aavePosition[token].borrow!==0) &&
                                                    (<Fragment>
                                                    <td>
                                                    <img src={tokenIcons[token]} alt={token} />
                                                    <span className="protocol-name">{token.toUpperCase()}</span>
                                                    </td>
                                                    
                                                        <td>
                                                            <span className="value-item">{Math.round((aavePosition[token].supply)*100)/100}</span>
                                                        </td>
                                                        <td>
                                                            <span className="value-item">{Math.round((aavePosition[token].borrow)*100)/100}</span>
                                                        </td>
                                                        <td>
                                                            <span className="value-item">{Math.round((aavePosition[token].priceInEth)*10000)/10000}</span>
                                                        </td>
                                                        <td>
                                                            <span className="value-item">{Math.round((aavePosition[token].supplyYield)*100)/100}</span>
                                                        </td>
                                                        <td>
                                                            <span className="value-item">{Math.round((aavePosition[token].borrowYield)*100)/100}</span>
                                                        </td>
                                                    </Fragment>) 
                                                    }
                                                </tr>
                                            </Fragment>
                                    })
                                }
                                </tbody>
                                </table>)
                            }
                            
                            </div>
                        }
                       
                        {/* dYdX Position */}
                        {selectedAssets['dydx'] && dydxPosition &&
                        
                        <div className="detailed-pos-wrapper">
                            <div className="detailed-pos-header">
                                <img style={{width:'150px'}} src={dydxLogo} alt="dydx" />
                                {/* <span className="protocol-name">Compound Position</span> */}
                            </div>
                            <div className="detailed-pos-div">
                                <div>  
                                    <span className="net-item">Net</span>
                                    <span className="value-item">{dydxPosition.totalSupplyInEth!==0 ? Math.round((dydxPosition.totalSupplyInEth-dydxPosition.totalBorrowInEth)*100)/100 : 0}</span>
                                    {dydxPosition.totalSupplyInEth!==0 && <img src={tokenIcons['eth']} alt="eth-icon" />} 
                                </div>
                                <div>  
                                    <span className="supply-item">Lent</span>
                                    <span className="value-item">{dydxPosition.totalSupplyInEth!==0 ? Math.round(dydxPosition.totalSupplyInEth*100)/100 : 0}</span>
                                    {dydxPosition.totalSupplyInEth!==0 && <img src={tokenIcons['eth']} alt="eth-icon" />}
                                </div>
                                <div>
                                    <span className="borrow-item">Borrowed</span>
                                    <span className="value-item">{dydxPosition.totalBorrowInEth!==0 ? Math.round(dydxPosition.totalBorrowInEth*100)/100 : 0}</span>
                                    {dydxPosition.totalBorrowInEth!==0 && <img src={tokenIcons['eth']} alt="eth-icon" />}
                                </div>
                                <div>
                                    <span className="cf-item">Status (Current / Max) </span>
                                    <span className="value-item"
                                          style={(dydxPosition.status/dydxPosition.liquidation)<=1 ? {color:'#2E8B57'}: {color:'#B83779'}}
                                    > 
                                        {!isNaN(dydxPosition.liquidation) ? 'Safe' : ' '}
                                    </span>
                                    <span className="value-item">
                                           (
                                           <span style={(dydxPosition.status/dydxPosition.liquidation)<=1 ? {color:'#2E8B57'} : {color:'#B83779'} }> {!isNaN(dydxPosition.status) ? Math.round(dydxPosition.status*10000)/100 +'%' : 'NaN'} </span> 
                                            / 
                                            <span style={{color:'#B83779'}}> {!isNaN(dydxPosition.liquidation) ? Math.round(dydxPosition.liquidation*10000)/100 + '%' : 'NaN'} </span>
                                           )
                            
                                    </span>
                                   
                                </div>
                            </div> 
                            {dydxPosition.totalSupplyInEth===0 ? 
                                    (<div className="no-pos-div">
                                        <span className="value-item"
                                              style={{color:'C06D91'}}
                                        >
                                            No Position
                                        </span>
                                    </div>) :
                                (<table className="hidden-pos-table">
                                    <thead>
                                        <tr>
                                            <th>Token</th>
                                            <th>Lent</th>
                                            <th>Borrowed</th>
                                            <th>Price in Eth</th>
                                            <th>Supply Rate %</th>
                                            <th>Borrow Rate %</th>
                                        </tr>
                                    </thead>
                                <tbody>
                                {Object.keys(dydxPosition).map((token, index) => {
                                    if(tokenNames[token]) 
                                    return <Fragment key={index}> 
                                                <tr>
                                                {(dydxPosition[token].supply!==0 || dydxPosition[token].borrow!==0) &&
                                                    (<Fragment>
                                                    <td>
                                                    <img src={tokenIcons[token]} alt={token} />
                                                    <span className="protocol-name">{token.toUpperCase()}</span>
                                                    </td>
                                                    
                                                        <td>
                                                            <span className="value-item">{Math.round((dydxPosition[token].supply)*100)/100}</span>
                                                        </td>
                                                        <td>
                                                            <span className="value-item">{Math.round((dydxPosition[token].borrow)*100)/100}</span>
                                                        </td>
                                                        <td>
                                                            <span className="value-item">{Math.round((dydxPosition[token].priceInEth)*10000)/10000}</span>
                                                        </td>
                                                        <td>
                                                            <span className="value-item">{Math.round((dydxPosition[token].supplyYield)*100)/100}</span>
                                                        </td>
                                                        <td>
                                                            <span className="value-item">{Math.round((dydxPosition[token].borrowYield)*100)/100}</span>
                                                        </td>
                                                    </Fragment>) 
                                                    }
                                                </tr>
                                            </Fragment>
                                    })
                                }
                                </tbody>
                                </table>)
                            }
                            
                            </div>
                        }



                        {/* MAKER */}
                        {selectedAssets['maker'] && aavePosition &&
                        <div className="detailed-pos-wrapper">
                            <div className="detailed-pos-header">
                                <img style={{width:'200px'}} src={makerLogo} alt="maker" />
                                <div id="mkr-vault-div-detailed-pos"> 
                                    <span>Vault # </span>
                                    <select name="searchField"
                                        onChange={e => setCurrentVaultId(e.target.value)}
                                    >   
                                        {makerPosition.vaultIds.map(vaultId =>
                                        <option key={vaultId} value={vaultId}>{vaultId}</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="detailed-pos-div">
                                <div>  
                                    <span className="net-item">Net</span>
                                    <span className="value-item">{makerPosition[currentVaultId].colInEth!==0 ? Math.round((makerPosition[currentVaultId].colInEth-makerPosition[currentVaultId].debtInEth)*100)/100 : 0}</span>
                                    {makerPosition[currentVaultId].colInEth!==0 && <img src={tokenIcons['eth']} alt="eth-icon" />} 
                                </div>
                                <div>  
                                    <span className="supply-item">Collateral</span>
                                    <span className="value-item">{makerPosition[currentVaultId].colInEth!==0 ? Math.round(makerPosition[currentVaultId].colInEth*100)/100 : 0}</span>
                                    {makerPosition[currentVaultId].colInEth!==0 && <img src={tokenIcons['eth']} alt="eth-icon" />}
                                </div>
                                <div>
                                    <span className="borrow-item">Debt</span>
                                    <span className="value-item">{makerPosition[currentVaultId].debtInEth!==0 ? Math.round(makerPosition[currentVaultId].debtInEth*100)/100 : 0}</span>
                                    {makerPosition[currentVaultId].debtInEth!==0 && <img src={tokenIcons['eth']} alt="eth-icon" />}
                                </div>
                                <div>
                                    <span className="cf-item">Status (Current / Max) </span>
                                    <span className="value-item"
                                        style={(makerPosition[currentVaultId].status/makerPosition[currentVaultId].liquidation)<=1 ? {color:'#2E8B57'}: {color:'#B83779'}}
                                    > 
                                        {!isNaN(makerPosition[currentVaultId].liquidation) ? 'Safe' : ' '}
                                    </span>
                                    <span className="value-item">
                                        (
                                        <span style={(makerPosition[currentVaultId].status/makerPosition[currentVaultId].liquidation)<=1 ? {color:'#2E8B57'} : {color:'#B83779'} }> { !isNaN(makerPosition[currentVaultId].status) ? Math.round(makerPosition[currentVaultId].status*10000)/100 +'%' : 'NaN'} </span> 
                                            / 
                                            <span style={{color:'#B83779'}}> {!isNaN(makerPosition[currentVaultId].liquidation) ? Math.round(makerPosition[currentVaultId].liquidation*10000)/100 + '%' :'NaN'} </span>
                                        )
                                    </span>
                                
                                </div>
                            </div>
                                {(!makerPosition.vaultIds || makerPosition.vaultIds.length===0) ?
                                    (<div className="no-pos-div">
                                        <span className="value-item"
                                              style={{color:'C06D91'}}
                                        >
                                            No Position
                                        </span>
                                    </div>) :
                                (<table className="hidden-pos-table">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Token</th>
                                            <th>Amount</th>
                                            <th>Token Price In Eth</th>
                                        </tr>
                                    </thead>
                                <tbody>
                                {makerPosition.vaultIds.length!==0 && currentVaultId!=='' && 
                                    <Fragment> 
                                        <tr>
                                            <td>
                                                <span className="value-item">Collateral</span>
                                            </td>
                                            <td>
                                                <img src={tokenIcons[makerPosition[currentVaultId].token.toLowerCase()]} alt={makerPosition[currentVaultId].token} />
                                                <span className="protocol-name">{makerPosition[currentVaultId].token.toUpperCase()}</span>
                                            </td>
                                        
                                            <td>
                                                <span className="value-item">{Math.round((makerPosition[currentVaultId].col)*100)/100}</span>
                                            </td>
            
                                            <td>
                                                <span className="value-item">{Math.round((tokenPricesInEth[makerPosition[currentVaultId].token.toLowerCase()])*10000)/10000}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span className="value-item">Debt</span>
                                            </td>
                                            <td>
                                                <img src={tokenIcons['dai']} alt='dai' />
                                                <span className="protocol-name">DAI</span>
                                            </td>
                                        
                                            <td>
                                                <span className="value-item">{Math.round((makerPosition[currentVaultId].debt)*100)/100}</span>
                                            </td>
                                
                                            <td>
                                                <span className="value-item">{Math.round((tokenPricesInEth['dai'])*10000)/10000}</span>
                                            </td>
                                        </tr>
                                    </Fragment>
                                
                                }
                                </tbody>
                                </table>)
                                }
                            
                            </div>
                        }
                    </Fragment>
                    }
                </div>
                {/* Owner Addresses */}
                {ownersReceived &&
                <div id="owners-info-div">
                    <span className="value-item">Owners</span>
                    <div id="owner-address-container">
                    {ownerAddresses.length!==0 && ownerAddresses.map((ownerAddress, index) =>
                        <div className="owner-address" key={index}>
                            <a href={`https://etherscan.io/address/${ownerAddress}`}
                               target="_blank" 
                               rel="noopener noreferrer"
                            >
                                {ownerAddress} 
                            </a>
                        </div>
                    )}
                    </div>
                </div>
                }

                <Footer />
           </Fragment>;
}

export default DsaInfo;
















