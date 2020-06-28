import React from 'react';
import './CustomToast.css';
import logo from '../../../icons/logo.png';


const FetchingDataToast = () => <div className="toast-div">
                                    <p className="toast-title">
                                    <img src={logo} alt="logo"/>
                                    <span>Fetching Data...</span>
                                    </p>
                                </div>



export { FetchingDataToast };