import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {getPriceInEth} from './coinExchangePrice';
import Home from './components/Home/Home';
import OwnerInfo from './components/OwnerInfo/OwnerInfo';
import DsaInfo from './components/DsaInfo/DsaInfo';
import batIcon from './icons/tokens/bat.svg';
import compIcon from './icons/tokens/comp.svg';
import daiIcon from './icons/tokens/dai.svg';
import ethIcon from './icons/tokens/eth.svg';
import kncIcon from './icons/tokens/knc.svg';
import mkrIcon from './icons/tokens/mkr.svg';
import repIcon from './icons/tokens/rep.svg';
import usdcIcon from './icons/tokens/usdc.svg';
import usdtIcon from './icons/tokens/usdt.svg';
import wbtcIcon from './icons/tokens/wbtc.svg';
import zrxIcon from './icons/tokens/zrx.svg';
import compoundIcon from './icons/defi/compound.svg';
import makerDaoIcon from './icons/defi/makerdao.svg';
import aaveIcon from './icons/defi/aave.svg';
import dydxIcon from './icons/defi/dydx.png';


function App() {
  const [address, setAddress] = useState('');
  const [tokenPricesInEth, setTokenPricesInEth] = useState({});
  const [receivedTokenPricesInEth, setReceivedTokenPricesInEth] = useState(false);
  const defiIcons = {
    compound: compoundIcon,
    maker: makerDaoIcon,
    aave: aaveIcon,
    dydx: dydxIcon
  }
  const tokenIcons = {
    bat: batIcon,
    comp: compIcon,
    dai: daiIcon,
    eth:ethIcon,
    knc: kncIcon,
    mkr: mkrIcon,
    rep: repIcon,
    usdc: usdcIcon,
    usdt: usdtIcon,
    wbtc: wbtcIcon,
    zrx: zrxIcon
  };
  const tokenNames = {
    bat: 'Basic Attention',
    dai: 'DAI Stable',
    comp:'Compound',
    eth:'Ethereum',
    knc: 'Kyber Network',
    mkr:'MakerDAO',
    rep:'Augur',
    usdc: 'USD Coin',
    usdt:'Tether USD Coin',
    wbtc: 'Wrapped BTC',
    zrx: '0x Protocol'
  };

  const initTokenPricesInEth = async () => {
    const tokensInEth={};
      for(const token in tokenNames) {
         const priceInEth = await getPriceInEth(token);
         tokensInEth[token]=priceInEth;
      }
      setTokenPricesInEth(tokensInEth);
      setReceivedTokenPricesInEth(true);
  }

  useEffect(() => {
      initTokenPricesInEth();

  }, [receivedTokenPricesInEth])

  return  <Router>
              <Switch>
                <Route path='/' 
                       exact 
                       render={props => <Home
                                                props={props}
                                                address={address}
                                                setAddress={setAddress}
                                                tokenIcons={tokenIcons}
                                        />}
                />
                <Route path={`/owner/:address`} 
                       exact 
                       render={props => <OwnerInfo
                                                    props={props}
                                                    address={address}
                                                    setAddress={setAddress}
                                                    tokenNames={tokenNames}
                                                    tokenIcons={tokenIcons}
                                                    tokenPricesInEth={tokenPricesInEth}
                                                    defiIcons={defiIcons}
                                        />}
                />
                <Route path={`/dsa/:address`} 
                       exact 
                       render={props => <DsaInfo
                                                    props={props}
                                                    address={address}
                                                    setAddress={setAddress}
                                                    tokenNames={tokenNames}
                                                    tokenIcons={tokenIcons}
                                                    defiIcons={defiIcons}
                                                    tokenPricesInEth={tokenPricesInEth}
                                        />}
                />
              </Switch>
          </Router>
}

export default App;
