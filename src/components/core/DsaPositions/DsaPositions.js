import React, { useState, useEffect, Fragment } from 'react';
import './DsaPositions.css';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

function DsaPositions({tokenNames, tokenIcons, defiIcons, dsaAddress, dsaId, compoundPosition, makerPosition, aavePosition, dydxPosition, showPositionTable}) {

    
    const [currentVaultId, setCurrentVaultId] = useState('');
    const [showAllPositions, setShowAllPositions] = useState(false);
    const [totalSupply, setTotalSupply] = useState(0);
    const [totalBorrow, setTotalBorrow] = useState(0);

    const handleVaultIdSelect = e =>  {
        setCurrentVaultId(e.target.value);
        console.log(currentVaultId);
    }

    const runInit =  () => {
        if(currentVaultId==='' && !!makerPosition)
            setCurrentVaultId(makerPosition.vaultIds[0]);
        const supplyTotal = _getTotalSupply();
        const borrowTotal = _getTotalBorrow();
        setTotalSupply(supplyTotal);
        setTotalBorrow(borrowTotal);
    }

    useEffect(() => {
        runInit();
    }, [totalSupply, totalBorrow, currentVaultId]);

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
    
    return  <Fragment>
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
                {showPositionTable &&
                <div>
                    <FormControlLabel
                        control={
                        <Switch
                            checked={showAllPositions}
                            onChange={e =>  setShowAllPositions(e.target.checked)}
                            name="showAllPositions"
                            color="primary"
                        />
                        }
                        label={<span className="value-item">View</span>}
                    />
                </div>
                }

        </div>


        {showAllPositions && 
            <table className="hidden-pos-table">
                <thead>
                    <tr>
                        <th id="defi-cell-header">Defi</th>
                        <th>
                            <span>Net</span>
                            <img src={tokenIcons['eth']} alt="eth-icon" />
                        </th>
                        <th>Supply <img src={tokenIcons['eth']} alt="eth-icon" /></th>
                        <th>Borrow <img src={tokenIcons['eth']} alt="eth-icon" /></th>
                        <th>C.F(status/max)</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Compound Position */}
                        <tr>
                            <td>
                            <img src={defiIcons['compound']} alt="compound-icon" />
                            <span className="protocol-name">Compound</span>
                            </td>
                            {(compoundPosition && compoundPosition.totalSupplyInEth!==0) ?
                            (<Fragment>
                                <td>
                                    <span className="value-item">{Math.round((compoundPosition.totalSupplyInEth-compoundPosition.totalBorrowInEth)*100)/100}</span>
                                </td>
                                <td>
                                    <span className="value-item">{Math.round((compoundPosition.totalSupplyInEth)*100)/100}</span>
                                </td>
                                <td>
                                    <span className="value-item">{Math.round((compoundPosition.totalBorrowInEth)*100)/100}</span>
                                </td>
                                <td>
                                    <span style={(compoundPosition.status < compoundPosition.liquidation) ? {color:'#2E8B57'} : {color:'#AF3779'}} className="value-item">{isNaN(compoundPosition.status) ? 'NaN' : `${Math.round(compoundPosition.status*10000)/100}`}</span>
                                    <span className="value-item">{' / '}</span>
                                    <span  style={{color:'#AF3779'}} className="value-item">{isNaN(compoundPosition.liquidation) ? 'NaN' : `${Math.round(compoundPosition.liquidation*10000)/100}` }</span>
                                </td>
                            </Fragment>) :
                            (<td>
                                <span style={{color:'#AF377A'}} className="value-item">No Position</span>
                            </td>)
                            }
                        </tr>
                        
                        {/* Aave Position */}
                        <tr id="aave-row">
                            <td>
                            <img src={defiIcons['aave']} alt="aave-icon" />
                            </td>
                            {(aavePosition && aavePosition.totalSupplyInEth!==0) ?
                            (<Fragment>
                                <td>
                                    <span className="value-item">{Math.round((aavePosition.totalSupplyInEth-aavePosition.totalBorrowInEth)*100)/100}</span>
                                </td>
                                <td>
                                    <span className="value-item">{Math.round((aavePosition.totalSupplyInEth)*100)/100}</span>
                                </td>
                                <td>
                                    <span className="value-item">{Math.round((aavePosition.totalBorrowInEth)*100)/100}</span>
                                </td>
                                <td>
                                    <span style={(aavePosition.status < aavePosition.liquidation) ? {color:'#2E8B57'} : {color:'#AF3779'}} className="value-item">{isNaN(aavePosition.status) ? 'NaN' : `${Math.round(aavePosition.status*10000)/100}`}</span>
                                    <span className="value-item">{' / '}</span>
                                    <span  style={{color:'#AF3779'}} className="value-item">{isNaN(aavePosition.liquidation) ? 'NaN' : `${Math.round(aavePosition.liquidation*10000)/100}` }</span>
                                </td>
                            </Fragment>) :
                            (<td>
                                <span style={{color:'#AF377A'}} className="value-item">No Position</span>
                            </td>)
                            }
                        </tr>

                        {/* dYdX Position */}
                        <tr id="dydx-row">
                            <td>
                            <img src={defiIcons['dydx']} alt="dydx-icon" />
                            </td>
                            {(dydxPosition && dydxPosition.totalSupplyInEth!==0) ?
                            (<Fragment>
                                <td>
                                    <span className="value-item">{Math.round((dydxPosition.totalSupplyInEth-dydxPosition.totalBorrowInEth)*100)/100}</span>
                                </td>
                                <td>
                                    <span className="value-item">{Math.round((dydxPosition.totalSupplyInEth)*100)/100}</span>
                                </td>
                                <td>
                                    <span className="value-item">{Math.round((dydxPosition.totalBorrowInEth)*100)/100}</span>
                                </td>
                                <td>
                                    <span style={(dydxPosition.status < dydxPosition.liquidation) ? {color:'#2E8B57'} : {color:'#AF3779'}} className="value-item">{isNaN(dydxPosition.status) ? 'NaN' : `${Math.round(dydxPosition.status*10000)/100}`}</span>
                                    <span className="value-item">{' / '}</span>
                                    <span  style={{color:'#AF3779'}} className="value-item">{isNaN(dydxPosition.liquidation) ? 'NaN' : `${Math.round(dydxPosition.liquidation*10000)/100}` }</span>
                                </td>
                            </Fragment>) :
                            (<td>
                                <span style={{color:'#AF377A'}} className="value-item">No Position</span>
                            </td>)
                            }
                        </tr>

                        {/* Maker Position */}
                        <tr>
                            <td id="maker-name-cell">
                            <img src={defiIcons['maker']} alt="dydx-icon" />
                            <span className="value-item">MakerDaO</span>
                            {makerPosition && makerPosition.vaultIds && makerPosition.vaultIds.length!==0 &&
                            <div id="mkr-vault-div">
                                <span className="protocol-name">Vault#</span>
                                <select name="searchField"
                                    onChange={handleVaultIdSelect}
                                >   
                                    {makerPosition.vaultIds.map(vaultId =>
                                    <option key={vaultId} value={vaultId}>{vaultId}</option>
                                    )}
                                </select>
                            </div>
                            }
                            </td>
                            {(makerPosition && makerPosition.vaultIds && makerPosition.vaultIds.length!==0) ?
                            (<Fragment>
                                <td>
                                    <span className="value-item">{isNaN(makerPosition[currentVaultId].colInEth) ? 'NaN' : Math.round((makerPosition[currentVaultId].colInEth-makerPosition[currentVaultId].debtInEth)*100)/100}</span>
                                </td>
                                <td>
                                    <span className="value-item">{currentVaultId==='' ? 'NaN' : Math.round((makerPosition[currentVaultId].colInEth)*100)/100}</span>
                                </td>
                                <td>
                                    <span className="value-item">{currentVaultId==='' ? 'NaN' : Math.round((makerPosition[currentVaultId].debtInEth)*100)/100}</span>
                                </td>
                                <td>
                                    <span style={(makerPosition[currentVaultId].status < makerPosition[currentVaultId].liquidation) ? {color:'#2E8B57'} : {color:'#AF3779'}} className="value-item">{isNaN(makerPosition[currentVaultId].status) ? 'NaN' : `${Math.round(makerPosition[currentVaultId].status*10000)/100}`}</span>
                                    <span className="value-item">{' / '}</span>
                                    <span  style={{color:'#AF3779'}} className="value-item">{isNaN(makerPosition[currentVaultId].liquidation) ? 'NaN' : `${Math.round(makerPosition[currentVaultId].liquidation*10000)/100}` }</span>
                                </td>
                            </Fragment>) :
                            (<td>
                                <span style={{color:'#AF377A'}} className="value-item">No Position</span>
                            </td>)
                            }
                        </tr>

                </tbody>
            </table>
            }
            </Fragment>;
}

export default DsaPositions;