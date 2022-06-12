import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import { Button, Box, Typography, useMediaQuery, CircularProgress } from '@mui/material';
import { KanonProgramAdapter } from 'kanon-marketplace-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import { Program, Provider, BN, web3 } from '@project-serum/anchor';
import { WalletModalButton } from '@solana/wallet-adapter-react-ui';
import { Connection } from '@solana/web3.js';

import CollectionItem1 from '../../assets/Landing/Collections/synesis_test01b.jpg';
import CollectionItem2 from '../../assets/Landing/Collections/synesis_test01c.jpg';
import CollectionItem3 from '../../assets/Landing/Collections/synesis_test01d.jpg';
import CollectionItem4 from '../../assets/Landing/Collections/synesis_test02b.jpg';
import CollectionItem5 from '../../assets/Landing/Collections/synesis_test02c.jpg';
import CollectionItem6 from '../../assets/Landing/Collections/synesis_test02d.jpg';
import CollectionItem7 from '../../assets/Landing/Collections/synesis_test03b.jpg';
import CollectionItem8 from '../../assets/Landing/Collections/synesis_test03c.jpg';
import CollectionItem9 from '../../assets/Landing/Collections/synesis_test03d.jpg';
import CollectionItem10 from '../../assets/Landing/Collections/synesis_test04b.jpg';
import CollectionItem11 from '../../assets/Landing/Collections/synesis_test04c.jpg';
import CollectionItem12 from '../../assets/Landing/Collections/synesis_test04d.jpg';
import CollectionItem13 from '../../assets/Landing/Collections/synesis_test05b.jpg';
import CollectionItem14 from '../../assets/Landing/Collections/synesis_test05c.jpg';
import CollectionItem15 from '../../assets/Landing/Collections/synesis_test05d.jpg';


import { useSelector, useDispatch } from "react-redux";
import { setnftTokens, setreservedNfts, setLoading } from '../../redux/ducks/main';
import { ConstructionOutlined, Lens } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import AccordionPanel from '../../components/FAQ/AccordionPanel';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { mintAccordionContent, NO_MORE_NFT, OUT_OF_NFTSAMOUNT, ERROR_CONDITION, errorData, toastConfig } from '../../components/Common/StaticData';
import { randomIntFromInterval, calculateStep, EstTime, getwhitelistproofinfo, mintfiltering, shuffle } from '../../utils/helper';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const { REACT_APP_SERVER_URL, REACT_APP_PUBLIC_NETWORK, REACT_APP_ENDPOINT } = process.env;
const opts = {
    preflightCommitment: "processed"
}
const connection = new Connection(
    REACT_APP_ENDPOINT, opts.preflightCommitment
);

const useStyles = makeStyles((theme) => ({
    faqPage: {
        background: '#202036',
        position: 'relative',
    },
    imageItem: {
        width: 200,
        height: 200,
        borderRadius: 24,
        margin: 12
    },
    faqHeader: {
        marginTop: -112,
        overflow: 'hidden',
    },
    header1: {
        marginLeft: -160,
        width: '200vw',
        height: 220,
        overflow: 'hidden',
    },

    header2: {
        marginLeft: -960,
        width: '400vw',
        height: 220,
        overflow: 'hidden'
    },
    faqContent: {
        padding: "100px 180px",
        [theme.breakpoints.down('md')]: {
            padding: "140px 90px",
            paddingLeft: '80px !important',
        },
        [theme.breakpoints.down('sm')]: {
            padding: "140px 30px",
            paddingLeft: '80px !important',
        }
    },

    title: {
        fontWeight: 'bold !important',
        fontSize: '48px !important',
        lineHeight: 48,
        letterSpacing: -1,
        color: '#ffffff',
        marginBottom: 32
    },
    connectDiv: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        top: "650px",
        [theme.breakpoints.down('md')]: {
            top: 300,
        }
    },
    walletConnectContent: {
        width: 648,
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // background: `linear-gradient(
        //     135deg,
        //     rgba(245, 247, 250, 0.12) 0%,
        //     rgba(245, 247, 250, 0.06) 51.58%,
        //     rgba(245, 247, 250, 0.0001) 98.94%
        // )`,
        background: '#212335',
        border: "1px solid rgba(245, 247, 250, 0.06)",
        boxSizing: 'border-box',
        boxShadow: "0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04), 8px 8px 24px rgba(20, 16, 41, 0.4)",
        backdropFilter: "blur(108.731px)",

        "border-radius": '24px',
        [theme.breakpoints.down('md')]: {
            width: 300,
        }
    },
    text: {
        marginLeft: '73px',
        marginRight: '73px',
        fontWeight: 'bold',
        fontSize: "48px",
        lineHeight: "48px",
        textAlign: 'center',
        letterSpacing: "-1px",
        color: "#ffffff",
        marginTop: "36px",
        [theme.breakpoints.down('md')]: {
            marginLeft: '0px',
            marginRight: '0px',
            fontSize: '30px',
        }
    },
    text1: {
        marginLeft: '10px',
        marginRight: '10px',
        fontSize: "30px",
        lineHeight: "32px",
        textAlign: 'center',
        letterSpacing: "-1px",
        color: "#ffffff",
        marginTop: "10px",
        [theme.breakpoints.down('md')]: {
            marginLeft: '0px',
            marginRight: '0px',
            fontSize: '20px',
        }
    },
    connectButton: {
        marginTop: "24px !important",
        marginBottom: "25px !important",
        fontSize: '20px !important',
        color: 'white !important',
        padding: '10px 30px !important',
        textTransform: 'none !important',
        textAlign: 'center',
        background: `linear-gradient(135deg, #2d61e5 0%, #8a62f6 53.09%, #e3477e 100%) !important`,
        boxShadow: `0px 0px 1px rgba(45, 97, 229, 0.24), 0px 2px 4px -1px rgba(10, 70, 82, 0.12),
            0px 16px 24px rgba(45, 97, 229, 0.24), 0px 8px 8px -4px rgba(45, 97, 229, 0.12) !important`,
        borderRadius: `12px !important`,
        // [theme.breakpoints.down('md')]: {
        // 	width: 300,
        // }
    },

}));


const Mint = () => {
    const defaultExpanded = false;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // const [KNProgram, setProgram] = useState(null);
    const { sendTransaction } = useWallet();
    const [limitFlag, setLimitFlag] = useState(false);
    const [detailtxt, setDetailTxt] = useState('');

    const wallet = useSelector(state => state.main.wallet)
    const provider = useSelector(state => state.main.provider);
    const mintablenfts = useSelector(state => state.main.mintablenfts);
    const loading = useSelector(state => state.main.loading);
    const isReadyMintableNFTs = useSelector(state => state.main.isReadyMintableNFTs);
    const KNProgram = useSelector(state => state.main.KNProgram);

    const [steps, setSteps] = useState(0);
    const imageList2 = [CollectionItem5, CollectionItem7, CollectionItem3, CollectionItem5, CollectionItem4, CollectionItem6, CollectionItem14, CollectionItem11, CollectionItem4, CollectionItem2, CollectionItem12, CollectionItem1, CollectionItem8, CollectionItem9, CollectionItem15];
    const imageList1 = [CollectionItem8, CollectionItem1, CollectionItem12, CollectionItem2, CollectionItem13, CollectionItem11, CollectionItem14, CollectionItem6, CollectionItem4, CollectionItem5, CollectionItem3, CollectionItem7, CollectionItem8, CollectionItem9, CollectionItem11];
    const [alertFlag, setAlertFlag] = React.useState(false);

    useEffect(async () => {
        let collectionState = null;
        if (wallet && wallet.connected && !wallet.disconnecting) {
            try {
                collectionState = await KNProgram.getProgram().account.collectionAccount.fetch(KNProgram._collection_state_account_pubkey);
            } catch (err) {
                console.log(err)
            }
        } else {
            let wallets = { ...wallet }
            const random = anchor.web3.Keypair.generate();
            wallets.publicKey = random.publicKey;
            const prov = new Provider(
                connection, wallets, {
                preflightCommitment: "confirmed",
            }
            );
            const programs = new KanonProgramAdapter(prov, {
                isDevNet: REACT_APP_PUBLIC_NETWORK == 'devnet'
            });
            await programs.refreshByWallet();
            collectionState = await programs.getProgram().account.collectionAccount.fetch(programs._collection_state_account_pubkey);
        }
        let step = 0;
        if (collectionState.seasonOpenedTimestamp.toNumber() == 0) {
            step = 0;
        } else {
            step = calculateStep(collectionState);
        }
        setSteps(step);
        if (step == 0) {
            setDetailTxt("");
        }
        if (step == 1) {
            let txt = EstTime(collectionState.seasonOpenedTimestamp.toNumber() + collectionState.countdownDuration.toNumber() * 3600);
            setDetailTxt("Whitelist sale starting at " + txt);
        }
        if (step == 2) {
            setDetailTxt("Whitelisted users can mint now!");
        }
        if (step == 3) {
            setDetailTxt("Minting is live!");
        }
        if (step == 4) {
            setDetailTxt("Minting has completed");
        }
        if (step == 5) {
            setDetailTxt("Minting has completed");
        }
    }, [wallet]);


    const handleMint = async (event) => {
        if (loading) {
            return;
        }
        if (wallet == null) {
            await toast.warn('Please connect with your wallet!', toastConfig);
            setAlertFlag(!alertFlag);
            return;
        }
        if (wallet.publicKey == null) {
            await toast.warn('Please connect with your wallet!', toastConfig);
            setAlertFlag(!alertFlag);
            return;
        }
        const balance = await connection.getBalance(wallet.publicKey);
        if (balance == 0) {
            await toast.warn('The balance not enough now!', toastConfig);
            setAlertFlag(!alertFlag);
            return;
        }
        if (limitFlag) {
            await toast.warn(OUT_OF_NFTSAMOUNT, toastConfig);
            setAlertFlag(!alertFlag);
            return;
        }
        if (mintablenfts.length == 0) {
            await toast.warn('The nfts not loading yet!', toastConfig);
            setAlertFlag(!alertFlag);
            return;
        }
        dispatch(setLoading(true))
        try {
            let nfts;
            let step = 0;
            let collectionState = await KNProgram.getProgram().account.collectionAccount.fetch(KNProgram._collection_state_account_pubkey);
            if (collectionState.seasonOpenedTimestamp.toNumber() == 0) {
                step = 0;
            } else {
                step = calculateStep(collectionState);
            }

            if (KNProgram != null) {
                nfts = await KNProgram.getNFTsbyPDA();
            }
            if (nfts.length == 0) {
                dispatch(setLoading(false));
                await toast.warn('There is no nfts!', toastConfig);
                setAlertFlag(!alertFlag);
                return;
            }
            let whitelist;
            if (step == 2) {
                whitelist = await getwhitelistproofinfo(wallet.publicKey.toBase58());
                if (whitelist == null) return;
                if (whitelist.length == 0) {
                    dispatch(setLoading(false))
                    await toast.warn('Can`t find in whitelist!', toastConfig);
                    setAlertFlag(!alertFlag);
                    return;
                }
            }
            let randomList = [];
            nfts.map((item, index) => randomList.push(index));
            let rand = shuffle(randomList);
            for (let i = 0; i < nfts.length; i++) {
                let lanIndex = rand[i];

                let index = mintablenfts.findIndex((val) => val.mintable_nft_mint_address == nfts[lanIndex].mint.toBase58());

                if (index != -1) {
                    try {
                        let tx = null;
                        if (step == 2) {
                            tx = await KNProgram.mintWhiteListNftOne(whitelist[0].proof.map(x => Buffer.from(x.data)), nfts[lanIndex].mint.toBase58());
                        }
                        if (step == 3) {
                            tx = await KNProgram.freelyMintNftOne(nfts[lanIndex].mint.toBase58());
                        }
                        let signature = await sendTransaction(tx, connection);
                        const sx = await connection.confirmTransaction(signature, "processed");
                        dispatch(setLoading(false))
                        await toast.success('Success. Please go to My Wallet page to see your NFT', toastConfig);
                        setAlertFlag(!alertFlag);
                        return;
                    } catch (err) {
                        console.log(err)
                        let error_code = 0;
                        let data = err.message.replace(/\s/g, '');
                        let tmparray = data.split(':');
                        let index = tmparray.indexOf("customprogramerror");
                        if (index != -1) {
                            error_code = tmparray[index + 1];
                        } else {
                            dispatch(setLoading(false))
                            await toast.error(ERROR_CONDITION, toastConfig);
                            setAlertFlag(!alertFlag);
                            return;
                        }

                        let error_codes = Number(error_code);
                        let error_index;
                        error_index = KNProgram.getProgram()._idl.errors.findIndex(item => item.code == error_codes);

                        if (error_index == -1) {
                            dispatch(setLoading(false))
                            await toast.error(ERROR_CONDITION, toastConfig);
                            setAlertFlag(!alertFlag);
                        } else {

                            let n_index = errorData.findIndex(item => item.name == KNProgram.getProgram()._idl.errors[error_index].name);

                            if (n_index == -1) {
                                toast.error(ERROR_CONDITION, toastConfig);
                            } else {
                                dispatch(setLoading(false))
                                await toast.error(errorData[n_index].msg, toastConfig);
                                setAlertFlag(!alertFlag);
                            }
                            if (KNProgram.getProgram()._idl.errors[error_index].name == "OutOfNftsAmount") {
                                setLimitFlag(true);
                            }
                        }

                        return;
                    }
                }
                if (i == nfts.length - 1) {
                    dispatch(setLoading(false))
                    await toast.warn(NO_MORE_NFT, toastConfig);
                    setAlertFlag(!alertFlag);
                }
            }
            navigate('/mint');
        } catch (err) {
            console.log(err)
        }

    }

    const ImageSlide1 = () => (
        <Box>
            {imageList1.map((item, index) => <LazyLoadImage effect="opacity" src={item} key={index} alt="slide" className={classes.imageItem} />)}
        </Box>

    );
    const ImageSlide2 = () => (
        <Box>
            {imageList2.map((item, index) => <LazyLoadImage effect="opacity" src={item} key={index} alt="slide" className={classes.imageItem} />)}
        </Box>

    );
    const classes = useStyles();

    const BelowButton = () => {
        if (steps === 2 || steps === 3) {
        return (<Button className={classes.connectButton} onClick={handleMint}>Mint</Button>);
        }
        return (<Box sx={{ height: 40 }}></Box>);
    }

    const isXs = useMediaQuery("(max-width: 900px)");
    /* create an account  */
    return (
        <Box className={classes.faqPage}>
            <ToastContainer />
            <Box className={classes.faqHeader}>
                <Box sx={{ display: isXs ? 'none' : 'flex' }} className={classes.header1}><ImageSlide1 /></Box>
                <Box sx={{ display: isXs ? 'none' : 'flex' }} className={classes.header2}><ImageSlide2 /></Box>
                <Box className={classes.header1}><ImageSlide1 /></Box>
                <Box className={classes.header2}><ImageSlide2 /></Box>
            </Box>
            <Box className={classes.faqContent}>
                <Typography className={classes.title}>FAQ</Typography>
                {
                    mintAccordionContent.map((value, index) => {
                        return (
                            <AccordionPanel
                                key={index}
                                title={value.title}
                                context={value.context}
                                defaultExpanded={defaultExpanded}
                            />
                        )
                    })
                }
            </Box>

            <Box className={classes.connectDiv}>
                <Box className={classes.walletConnectContent}>
                    <Box className={classes.text}>Aquarius Collection</Box>
                    {((steps == 2 || steps == 3) && mintablenfts.length == 0) ? <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5, paddingBottom: 5 }}>
                        <CircularProgress disableShrink />
                    </Box> :
                        <>
                            <Box className={classes.text1}>{detailtxt}</Box>
                            {wallet != null ? ((wallet && wallet.connected && !wallet.disconnecting) ?
                                <BelowButton /> :
                                <WalletModalButton className={classes.connectButton}>Connect wallet</WalletModalButton>

                            ) : <WalletModalButton className={classes.connectButton}>Connect wallet</WalletModalButton>
                            }
                        </>
                    }

                </Box>
            </Box>

        </Box>
    );
}

export default Mint;