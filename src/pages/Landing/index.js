import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import { WalletModalButton } from '@solana/wallet-adapter-react-ui';
import { Button, Box, Typography } from '@mui/material';
import HomeSection from '../../components/Landing/Home';
import AboutSection from '../../components/Landing/About';
import CollectionsSection from '../../components/Landing/Collections';
import NewGame from '../../components/Landing/NewGame';
import GameSection from '../../components/Landing/Game';
import RoadmapSection from '../../components/Landing/Roadmap';
import MarketplaceSection from '../../components/Landing/Marketplace';

const useStyles = makeStyles((theme) => ({
    landingPage: {
        fontFamily: 'Klavika'
    }
}));

const Home = () => {

    const classes = useStyles();
    /* create an account  */
    return (
        <Box className={classes.landingPage}>
            <HomeSection/>
            <AboutSection/>
            <CollectionsSection/>
            <NewGame/>
            {/* <GameSection/> */}
            {/* <RoadmapSection/> */}
            {/* <MarketplaceSection/> */}
        </Box>
    );
}

export default Home;