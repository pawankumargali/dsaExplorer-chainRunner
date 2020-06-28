import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import logoIcon from '../../../icons/logo.png';
import './Header.css';

function Header({props, address, setAddress }) {

    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showSearchIcon, setShowSearchIcon] = useState(true);
    const [searchField, setSearchField] = useState('dsaAddress');
    const [error, setError] = useState(false);

    const handleSearchFieldSelect = e => setSearchField(e.target.value);

    const handleSearchShow = () => {
        setShowSearchIcon(false);
        setShowSearchBar(true);    
    }

    const handleSearchClose = () => {
        setShowSearchBar(false);
        setShowSearchIcon(true);
        setAddress('');
        setError(false);
    }

    const handleAddressChange = e => {
        setError(false);
        setAddress(e.target.value);
    }

    const initiateSearch = () => {
        if(!address) {
            return setError('Address cannot be empty');
        }
        if(searchField==='dsaAddress') {
            props.history.push(`/dsa/${address}`);
        }
        if(searchField==='ownerAddress') {
            props.history.push(`/owner/${address}`);
        }
        setShowSearchBar(false);
        setShowSearchIcon(true);
        setAddress('');
    }

    const _handleKeyDown = e => {
        if(e.keyCode===27) {
            setError(false);
            handleSearchClose();
        }
            
        if(e.keyCode===13)  {
            setError(false);
            initiateSearch();
        }
    }
    const addKeyDownEventListener = async () => {
        if(showSearchBar) 
            document.addEventListener('keydown', _handleKeyDown);
    }
    

    useEffect(() => {
            addKeyDownEventListener();
    }, [showSearchBar]);
    

    return  <header>
                <nav>
                    <Link to='/' id="brand-name">
                    <div id="brand-div">
                        <img id="logo-img" src={logoIcon} alt="logo" />
                        <div >DSAExplorer</div>
                    </div>
                    </Link>
                    <span id="nav-search-btn" onClick={handleSearchShow}>
                        Search DSA
                       { showSearchIcon && <i className="fa fa-search"></i> }
                    </span>
            </nav>
            
            {showSearchBar &&
            <Fragment>
                <div id="overlay"></div>
                <div id="search-div">
                    <button id="close-search-btn" onClick={handleSearchClose}>x</button>
                    <div>DSA Explorer</div>
                    <div id="search-bar">
                        <select name="searchField"
                            onChange={handleSearchFieldSelect}
                        >
                            <option value="dsaAddress">DSA</option>
                            <option value="ownerAddress">Owner</option>
                        </select>
                        <input type="text" 
                            placeholder="Search by Address" 
                            name="address"
                            value={address}
                            autoFocus={true}
                            onChange={handleAddressChange}    
                        />
                        <button onClick={initiateSearch}>Search</button>
                    </div>
                    {error && <div style={{color:'red'}}>{error}</div>} 
                </div>
            </Fragment>
            }
           </header>

}

export default Header;

// 
// </Link>