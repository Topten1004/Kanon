import React, { memo } from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import MarketPlace from "../pages/Marketplace";
import MyWallet from "../pages/MyWallet";
import Faq from "../pages/Faq";
import Mint from "../pages/Mint";
import WalletDetail from "../pages/MyWallet/Detail";
import NotFound from "./Common/NotFound";

function Routing(props) {


    return (
        <Routes>
            <Route path="/marketplace" element={< MarketPlace />}  />
            <Route path="/mywallet" element={< MyWallet />}  />
            <Route path="/faq" element={< Faq />}  />
            <Route path="/mint" element={< Mint />}  />
            <Route path="/mywallet/detail" element={< WalletDetail />}  />
            <Route path="/" element={< Landing />} />
            <Route path="/*" element={<NotFound/>} />
        </Routes>
    );
}


export default Routing;
