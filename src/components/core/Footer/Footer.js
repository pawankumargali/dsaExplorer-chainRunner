import React from 'react';
import './Footer.css';

function Footer({stickAtBottom}) {
    const today = new Date();
    const currentYear = today.getFullYear();
    return <footer style={stickAtBottom ? {position:'fixed', bottom:'0px'} : {}}>
                Copyrights &#169; {currentYear} DefiExplorer
           </footer>
}

export default Footer;