import { Fragment, Suspense, lazy } from "react";
import React, { useEffect, useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline, useTheme, createTheme } from '@mui/material';

// Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { darktheme, lighttheme } from "./utils/theme";
import './App.css';
import { getPhantomWallet, getSolletWallet, getSolflareWallet, getSolletExtensionWallet, getLedgerWallet } from '@solana/wallet-adapter-wallets';
// import { PhantomWalletAdapter} from '@solana/wallet-adapter-wallets';
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  clusterApiUrl
} from '@solana/web3.js';
import ColorModeContext from './components/Common/ColorModeContext'

const {  REACT_APP_PUBLIC_NETWORK, REACT_APP_ENDPOINT } = process.env;
require('@solana/wallet-adapter-react-ui/styles.css');

const MainComponent = lazy(() => import("./components/Main"));

function App() {

  const [mode, setMode] = useState('dark');
  
  const wallets =  [
    getPhantomWallet(),
    getLedgerWallet(),
    getSolletWallet(),
    getSolletExtensionWallet(),
    getSolflareWallet()      
  ];

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      mode == 'light' ? lighttheme : darktheme,
    [mode],
  );

  return (

    <BrowserRouter>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Suspense fallback={<Fragment />}>
            <ConnectionProvider endpoint={REACT_APP_ENDPOINT}>
              <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  <Routes>
                    <Route path="*" element={<MainComponent />} />
                  </Routes>
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider>
          </Suspense>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </BrowserRouter>

  );
}

export default App;
