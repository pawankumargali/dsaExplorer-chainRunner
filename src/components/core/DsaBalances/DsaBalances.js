import React, { useState, useEffect, Fragment } from 'react';
import './DsaBalances.css';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import BalanceChart from '../../charts/BalanceChart';

function DsaBalances({tokenNames, tokenIcons, defiIcons, dsaAddress, dsaId, balances, balancePercentages, totalBalanceInEth, showBalanceChart}) {
    
    const [showAllBalances, setShowAllBalances] = useState(false);

    /* CoinGecko doesn't return prices for snx, lend and susd
    lend:'aave', snx:'synthetix-network-token', susd:'susd',
    */
   
    return  <Fragment>
                <div className="pos-div" style={showBalanceChart ? {} : {marginBottom:'0px'}}>
                            <div>
                                <span className="protocol-name">Balances</span>
                            </div>
                            <div>  
                                <span className="net-item">Total</span>
                                <span className="value-item">{isNaN(totalBalanceInEth) ?  0 : Math.round((totalBalanceInEth)*100)/100}</span>
                                {totalBalanceInEth!==0 ? <img src={tokenIcons['eth']} alt="eth-icon" /> : ''} 
                            </div>
                            <div>
                                <FormControlLabel
                                    control={
                                    <Switch
                                        checked={showAllBalances}
                                        onChange={e =>  setShowAllBalances(e.target.checked)}
                                        name="showAllBalances"
                                        color="primary"
                                    />
                                    }
                                    label={<span className="value-item">View</span>}
                                />
                            </div>
                </div>

                {showAllBalances && (Object.keys(balances).length!==0) &&
                <div id="hidden-balance-container" style={showBalanceChart ? {} : {marginTop:'0px'}}>
                    <div id="hidden-bal-div" style={showBalanceChart ? {width:'40%'} : {}}>
                    {Object.keys(balances).map((token, index) => {
                        if(balances[token]!==0)
                            return  <div key={index}>
                                        <span  className="value-item">{token.toUpperCase()} :</span>
                                        <span className="value-item">{Math.round(balances[token]*100)/100}</span>
                                        <img src={tokenIcons[token]} alt={token} />
                                    </div>;
                    }
                    )}
                    </div>
                    {showBalanceChart &&
                    <div id="balance-chart-div">
                                <BalanceChart balances={balancePercentages} />
                    </div>
                    }
                </div>
                }
            </Fragment>
}

export default DsaBalances;