import React from "react";
import '../css/footer.css';

function Footer(){
    return(
        <div className="footer-area">
                &copy; {new Date().getFullYear()} :  CopyRights
        </div>

    )
}

export default Footer