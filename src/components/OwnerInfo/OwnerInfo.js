import React, {Fragment, useEffect, useState } from 'react';
import Header from '../core/Header/Header';
import Footer from '../core/Footer/Footer';
import './OwnerInfo.css';
import { getAccounts } from '../../dsaInterface';
import DsaCard from '../DsaCard/DsaCard';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FetchingDataToast } from '../core/CustomToast/CustomToast';

toast.configure();

function OwnerInfo({props, address, setAddress, tokenNames, tokenIcons, tokenPricesInEth, defiIcons}) {

    const [toastCalled, setToastCalled] = useState(false);
    
    const ownerAddress = props.match.params.address;
    const [dsaAccounts, setDsaAccounts] = useState([]);
    const [dsaAccountsReceived, setDsaAccountsReceived] = useState(false);
    
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [selectAllAccounts, setSelectAllAccounts] = useState(false);


    const runInit = async () => {
        try {
            const accounts =  await getAccounts(ownerAddress);
            setDsaAccounts([...accounts]);
            setDsaAccountsReceived(true);
        }
        catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if(!toastCalled) {
            toast(<FetchingDataToast/>, {position: toast.POSITION.BOTTOM_RIGHT, autoClose:3000});
            setToastCalled(true);
        }
        runInit();
    },[dsaAccountsReceived, toastCalled]);

    useEffect(() => {
        if(selectAllAccounts) {
            setSelectedAccounts(dsaAccounts);
        }
        else {
            setSelectedAccounts([]);
        }

    }, [selectAllAccounts])

    const _selectedAccIndex = dsaId => {
        for(let i=0; i<selectedAccounts.length; i++) {
            if(selectedAccounts[i].id===dsaId)
                return i;
        }
        return -1;
    }

    const handleAccountSelect = account => {
        setToastCalled(true);
        const accIndex = _selectedAccIndex(account.id);
        const selAccs=[...selectedAccounts];
        if(accIndex===-1) {
            toast(<FetchingDataToast/>, {position: toast.POSITION.BOTTOM_RIGHT, autoClose:3000});
            selAccs.push(account);
        }
        else {
            selAccs.splice(accIndex,1);
        }
        setSelectedAccounts(selAccs);
    }

    const handleSelectAllAccounts = e => {
        if(e.target.checked) {
            toast(<FetchingDataToast/>, {position: toast.POSITION.BOTTOM_RIGHT, autoClose:3000});
        }
        setSelectAllAccounts(e.target.checked);
    }



    return <Fragment>
                <Header
                    props={props} 
                    address={address}
                    setAddress={setAddress}
                />
                <div id="owner-info-container">
                    <div id="owner-address">
                            <span>Owner</span>
                                <a href={`https://etherscan.io/address/${ownerAddress}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                >
                                {ownerAddress}
                            </a> 
                    </div>
                    <div id="owner-accounts-count-div">
                        <span>Accounts </span>
                        <span id="accounts-count">{dsaAccounts.length}</span>
                    </div>
                    <div id="select-dsa-heading">
                            <div>Explore Accounts</div>
                            <div>
                                <FormControlLabel
                                    control={
                                    <Switch
                                        checked={selectAllAccounts}
                                        onChange={handleSelectAllAccounts}
                                        name="selectAllAccounts"
                                        color="primary"
                                    />
                                    }
                                    label={<span className="value-item">All</span>}
                                />
                            </div>
                    </div>
                    <div id="dsa-addresses-container">
                    {dsaAccounts.length!==0 &&
                        dsaAccounts.map(account =>
                            <div key={account.id}
                                 style={_selectedAccIndex(account.id)===-1 ? {} : { color:'#fff', backgroundImage:'linear-gradient(to right,#067, #047)'}}
                                 onClick={() => handleAccountSelect(account)}
                            >
                                {account.address}
                            </div>
                    )}
                </div>    
                </div>
                <div id="dsa-cards-container">
                    {selectedAccounts.length!==0 &&
                        selectedAccounts.map(account =>
                            <DsaCard
                                props={props}
                                key={account.id}
                                tokenNames={tokenNames}
                                tokenIcons={tokenIcons}
                                defiIcons={defiIcons}
                                dsaAddress={account.address}
                                dsaId={account.id}
                                tokenPricesInEth={tokenPricesInEth}
                            />
                    )}
                    
                </div>     
                <Footer />
           </Fragment>
}

export default OwnerInfo;