import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import { Link, Box, Typography, Button, useMediaQuery } from '@mui/material';
import KanonColorButton from '../../Common/KanonColorButton';
import { useNavigate } from 'react-router-dom';
import { RightArrow } from '../../Common/Arrow';

import LandingVideo from '../../../assets/Landing2/KanonLanding.mp4';
import LandingBackground from '../../../assets/Landing2/KanonLanding.png';
import { useSelector, useDispatch } from "react-redux";

import * as anchor from '@project-serum/anchor';

import { Connection, PublicKey, clusterApiUrl, Keypair, Transaction, TransactionSignature } from '@solana/web3.js';
import ArcProgress from 'react-arc-progress';
import { useWallet } from '@solana/wallet-adapter-react';
import { Program, Provider, BN, web3 } from '@project-serum/anchor';
import { WalletModalButton } from '@solana/wallet-adapter-react-ui';
import { setLoading } from '../../../redux/ducks/main';
import { EstTime, UpdateMetadataDuration } from '../../../utils/helper';
import { programs } from '@metaplex/js';
import { KanonProgramAdapter } from 'kanon-marketplace-sdk';

const { REACT_APP_PUBLIC_NETWORK, REACT_APP_ENDPOINT } = process.env;
const opts = {
    preflightCommitment: "processed"
}
const connection = new Connection(
    REACT_APP_ENDPOINT,
    opts.preflightCommitment
);


const useStyles = makeStyles(theme => ({
    homeSection: {
        height: '100vh',
        // marginTop : "30px" ,
        // backgroundImage: 'none', 
        minHeight: 700,
        display: 'flex',
        alignItems: 'items',
        [theme.breakpoints.down('md')]: {
            justifyContent: 'center',
        },
        [theme.breakpoints.down('sm')]: {
            backgroundImage: `url(${LandingBackground})`,
        }
    },
    landingVideo: {
        position: 'absolute',
        width: '100%',
        height: '100vh',
        minHeight: 700,
        objectFit: 'cover',
        top: 0
    },
    exploreButton: {
        width: '160px',
        height: 72,
        textTransform: 'none !important',
        fontSize: '18px !important',
        color: 'white !important',
        fontFamily: 'Klavika !important',
        padding: '0px 14px !important',
        background: `linear-gradient(135deg, #2d61e5 0%, #8a62f6 53.09%, #e3477e 100%) !important`,
        boxShadow: `0px 0px 1px rgba(45, 97, 229, 0.24), 0px 2px 4px -1px rgba(10, 70, 82, 0.12),
            0px 16px 24px rgba(45, 97, 229, 0.24), 0px 8px 8px -4px rgba(45, 97, 229, 0.12) !important`,
        borderRadius: `12px !important`,
    },
    content: {
        padding: 50,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 140,
        [theme.breakpoints.down('md')]: {
            padding: 0,
            paddingTop: 0,
            alignItems: 'center',
        },
    },
    title: {
        // textAlign: 'center',
        [theme.breakpoints.down('md')]: {
            marginTop: '50px',
            textAlign: 'center',
        },

    },

    text1: {

        fontSize: '56px !important',
        fontWeight: 'bold !important',
        color: 'white',
        // padding: '10px',
        paddingLeft: '0px',
    },
    text11: {

        fontSize: '42px !important',
        fontWeight: 'bold !important',
        color: 'white',
        // padding: '10px',
        paddingLeft: '0px',
        [theme.breakpoints.down('md')]: {
            fontSize: '36px !important',
        }

    },
    text2: {
        // width: 436,
        color: 'white',
        marginTop: '16px !important',
        lineHeight: '40px !important',
        fontSize: '32px !important',
        fontWeight: '800 !important',

    },
    text22: {
        // width: 436,
        color: 'white',
        marginTop: '16px !important',
        lineHeight: '40px !important',
        fontSize: '32px !important',
        [theme.breakpoints.down('md')]: {
            fontSize: '24px !important',
        }
    },
    text3: {
        // width: 500,
        color: 'white',
        marginTop: '5px !important',
        fontSize: '24px !important'
    },
    text33: {
        // width: 400,
        color: 'white',
        marginTop: '5px !important',
        fontSize: '24px !important'
    },
    countDownText: {
        fontSize: '54px !important',
        color: 'white',
        marginTop: '36px !important'
    },
    countDownText1: {
        fontSize: '36px !important',
        color: 'white',
        marginTop: '36px !important',
        [theme.breakpoints.down('md')]: {
            fontSize: '30px !important',
        }
    },
    cardList: {
        marginTop: 30,
        display: 'flex',
        // justifyContent: 'center',
        // width: '600px',
        marginBottom: '40px !important',
        [theme.breakpoints.down('md')]: {
            marginBottom: '10px !important',
            justifyContent: 'center',
            // width: '90%',
            // flexWrap: 'wrap',
        },

    },
    card: {
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 20,
        height: 120,
        [theme.breakpoints.down('md')]: {
            height: '100px',
        },
        [theme.breakpoints.down('sm')]: {
            height: '70px',
            marginBottom: 0,
        }
    },
    btnLayer: {
        // marginTop: '40px !important',
        paddingLeft: 100,
        paddingRight: 100,
        display: "flex",
        justifyContent: 'center',
        // width: '600px',
        [theme.breakpoints.down('md')]: {
            width: '60%',
            paddingLeft: 20,
            paddingRight: 20,
        },
    },
    mintEvent: {
        width: '160px',
        padding: '0px 16px !important',
        height: 72,
        fontSize: '18px !important',
        color: 'white !important',
        textAlign: 'center',

        background: '#212335',
        boxShadow: `0px 0px 1px rgba(45, 97, 229, 0.12), 0px 12px 24px rgba(45, 97, 229, 0.16),
            0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04),
            8px 8px 24px rgba(20, 16, 41, 0.4), 0px 8px 8px -4px rgba(45, 97, 229, 0.06),
            inset 0px 2px 6px rgba(45, 97, 229, 0.4)`,
        backdropFilter: 'blur(108.731px)',
        borderRadius: '12px !important',
        textTransform: 'none !important'
    },
    watchNow: {
        padding: '16px 40px',
        paddingLeft: '0px',
        background: '#fff !important',
        borderRadius: 8,
        lineHeight: '24px',
        marginRight: 16,
        fontFamily: "Klavika",
        textTransform: 'none',
        width: 250,
        color: 'black !important',
        textDecoration: 'none !important',
        textTransform: 'none !important',
        fontWeight: 700,
        fontSize: '20px !important',
    },
    watchNow1: {
        padding: '16px 40px',
        background: '#fff !important',
        borderRadius: 8,

        lineHeight: '24px',

        marginRight: 16,
        fontFamily: "Klavika",
        textTransform: 'none',
        width: 250,
        "& a": {
            color: '#050625',
            textDecoration: 'none',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '20px !important',
            fontFamily: "Klavika",
            width: '100%'
        }
    },
    watchNowInactive: {
        padding: '16px 40px',
        background: '#fff !important',
        // marginLeft: '10px !important',
        borderRadius: 8,
        lineHeight: '24px',
        marginRight: 16,
        fontFamily: "Klavika",
        textTransform: 'none',
        color: 'grey !important',
        width: 250,
        textDecoration: 'none !important',
        textTransform: 'none !important',
        fontWeight: 700,
        fontSize: '20px !important',
    },
    loading: {
        top: 0,
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: 9999999999999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(2px)',
        marginTop: 90
    },
    timeLine: {
        display: 'flex',
    },
    date: {
        width : 90,
        textAlign: 'center',
    }
}));

let interval;
let totalIndex = 0;

const HomeSection = () => {

    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isLoading = useSelector(state => state.main.loading);

    const isXsMin = useMediaQuery("(min-width:900px)");
    const isXs = useMediaQuery("(min-width:600px)");
    const [stepTxt, setStepTxt] = useState("");
    const [step, setStep] = useState(-1); // 0 is preparing, 1 is countdown, 2 is premint, 3 is blocking, 4 is FREELYMINT, 5 is published
    const [duration, setDuration] = useState(0);
    const [contDown, setCountDown] = useState(0);
    const [premint, setPremint] = useState(0);
    const [blocking, setBlocking] = useState(0);
    const [freelyMint, setFreelyMint] = useState(0);

    const [collectiontxt, setCollectionTxt] = useState("AQUARIUS COLLECTION COMING SOON!");
    const [detailtxt, setDetailTxt] = useState("");
    const [moredetailtxt, setMoreDetailTxt] = useState("");

    const wallet = useSelector(state => state.main.wallet)
    const provider = useSelector(state => state.main.provider);
    const proof = useSelector(state => state.main.proof);
    const KNProgram = useSelector(state => state.main.KNProgram);

    const [userWallet, setUserWallet] = useState(null);
    const [showmint, setShowMint] = useState(false);

    const getProvider = async () => {
        try {
            const collectionState = await KNProgram.getProgram().account.collectionAccount.fetch(KNProgram._collection_state_account_pubkey);
            if (collectionState.seasonOpenedTimestamp.toNumber() == 0) {
                setStep(0);
                setStepTxt("");
                setCollectionTxt("AQUARIUS COLLECTION COMING SOON!");
                setDetailTxt("");
                return;
            }
            setCountDown(collectionState.countdownDuration.toNumber());
            setPremint(collectionState.premintDuration.toNumber());
            setBlocking(collectionState.premintBlockingDuration.toNumber());
            setFreelyMint(collectionState.mintWave3Duration.toNumber());
            setDuration(collectionState.seasonOpenedTimestamp.toNumber());

            // console.log(collectionState.countdownDuration.toNumber());
            // console.log(collectionState.premintDuration.toNumber());
            // console.log(collectionState.premintBlockingDuration.toNumber());
            // console.log(collectionState.mintWave3Duration.toNumber());
            // console.log(collectionState.seasonOpenedTimestamp.toNumber());
            // let current_timestamp = Math.floor(Date.now() / 1000);
            // console.log((current_timestamp - collectionState.seasonOpenedTimestamp.toNumber()) / 3600);
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(async () => {
        dispatch(setLoading(true));
        if (wallet && wallet.connected && !wallet.disconnecting && provider != null) {
            setUserWallet(wallet);
            getProvider();
        } else {
            setStepTxt("");
            try {
                let wallets = { ...wallet }
                const random = anchor.web3.Keypair.generate();
                wallets.publicKey = random.publicKey;
                setUserWallet(wallets);
                const prov = new Provider(
                    connection, wallets, {
                    preflightCommitment: "confirmed",
                }
                );
                const programs = new KanonProgramAdapter(prov, {
                     isDevNet: REACT_APP_PUBLIC_NETWORK == 'devnet'
                });
                await programs.refreshByWallet();
                const collectionState = await programs.getProgram().account.collectionAccount.fetch(programs._collection_state_account_pubkey);
                if (collectionState.seasonOpenedTimestamp.toNumber() == 0) {
                    setStep(0);
                    setStepTxt("");
                    setCollectionTxt("AQUARIUS COLLECTION COMING SOON!");
                    setDetailTxt("");
                    return;
                }
                setCountDown(collectionState.countdownDuration.toNumber());
                setPremint(collectionState.premintDuration.toNumber());
                setBlocking(collectionState.premintBlockingDuration.toNumber());
                setFreelyMint(collectionState.mintWave3Duration.toNumber());
                setDuration(collectionState.seasonOpenedTimestamp.toNumber());
            } catch (err) {
                console.log(err)
            }
        }
        dispatch(setLoading(false));
    }, [wallet, provider]);

    const [timeLeft, setTimeLeft] = React.useState([
        '0',
        '0',
        '0',
        '0'
    ]);
    const [percentage, setPercentage] = React.useState([
        0,
        0,
        0,
        0
    ]);
    const titles = ["DAYS", "HRS", "MINS", "SECS"];

    const BelowButton = () => {
        if (step === 1) {
            if (showmint) {
                return (<Button variant="contained" className={classes.watchNow} onClick={() => navigate('/mint')}>Minting page</Button>);
            }
        }
        if (step === 2) {
            return (<Button variant="contained" className={classes.watchNow} onClick={() => navigate('/mint')}>Minting page</Button>);
        }
        if (step === 3) {
            return (<Button variant="contained" className={classes.watchNow} onClick={() => navigate('/mint')}>Minting page</Button>);
        }
        if (step === 4) {
            return (<Button variant="contained" className={classes.watchNowInactive} disabled={true}>Marketplace</Button>);
        }
        if (step === 5) {
            return (<Button variant="contained" className={classes.watchNow} disabled={false} onClick={() => navigate('/marketplace')}>Marketplace</Button>);
        }
        return (<Button variant="contained" className={classes.watchNow1}><Link href="https://youtu.be/82QgHhQlBDg" target="_blank" rel="noreferrer" >Watch Video</Link></Button>);
    }

    useEffect(() => {
        function setProgress(dif, duration, txt) {
            totalIndex++;
            let timeLefts = [0, 0, 0, 0];
            let percentages = [0, 0, 0, 0];
            setTimeLeft([...timeLefts]);
            setPercentage([...percentages]);
            timeLefts = [
                parseInt(dif / (60 * 60 * 24)),
                parseInt((dif / (60 * 60)) % 24),
                parseInt((dif / 60) % 60),
                parseInt((dif) % 60)
            ];
            percentages = [
                (timeLefts[0] == 0 && (totalIndex % 2 == 1)) ? 0.001 : (timeLefts[0] / duration * 24),
                (timeLefts[1] == 0 && (totalIndex % 2 == 1)) ? 0.001 : (timeLefts[1] / 24),
                (timeLefts[2] == 0 && (totalIndex % 2 == 1)) ? 0.001 : (timeLefts[2] / 60),
                (timeLefts[3] == 0 && (totalIndex % 2 == 1)) ? 0.001 : (timeLefts[3] / 60),
            ];
            setStepTxt(txt);
            setTimeLeft([...timeLefts]);
            setPercentage([...percentages]);
        }
        interval = setInterval(() => {
            if (duration != 0) {
                let current_timestamp = Math.floor(Date.now() / 1000);
                let difference = (current_timestamp - duration) / 3600;
                difference -= contDown;
                if (difference <= 0) {
                    let dif = duration + contDown * 3600 - current_timestamp;
                    setStep(1);
                    setCollectionTxt("AQUARIUS COLLECTION COMING SOON!");
                    setDetailTxt("");
                    if (dif / 3600 <= 12) {
                        setShowMint(true);
                    }
                    setProgress(dif, contDown, "CountDown to whitelist sale");
                    return;
                }
                difference -= (premint + blocking);
                if (difference <= 0) {
                    let dif = (duration + (premint + contDown + blocking) * 3600) - current_timestamp;
                    setStep(2);
                    setCollectionTxt("Aquarius Collection:");
                    setDetailTxt("Whitelist sale is now live!")
                    setProgress(dif, premint + blocking, "CountDown to public sale")
                    return;
                }
                difference -= freelyMint;
                if (difference <= 0) {
                    let dif = (duration + (premint + contDown + blocking + freelyMint) * 3600) - current_timestamp;
                    setStep(3);
                    setCollectionTxt("Aquarius Collection:");
                    setDetailTxt("Public sale is now live!")
                    setProgress(dif, blocking, "")
                    return;
                }
                difference -= UpdateMetadataDuration;
                let txt = EstTime(duration + (premint + contDown + blocking + freelyMint + UpdateMetadataDuration) * 3600);
                if (difference <= 0) {
                    let dif = (duration + (premint + contDown + blocking + freelyMint + UpdateMetadataDuration) * 3600) - current_timestamp;
                    setStep(4);
                    setCollectionTxt("Aquarius Collection:");
                    setDetailTxt("Minting has completed");
                    // setMoreDetailTxt("Marketplace opening " + txt)
                    setMoreDetailTxt("Marketplace opening Mar 11 9am PST")
                    setProgress(dif, blocking, "")
                    return;
                }
                setCollectionTxt("Aquarius Collection");
                setDetailTxt('')
                setStep(5);
                setProgress(0, 1, "")
                clearInterval(interval);
                return;
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [duration]);
    /* create an account  */
    return (
        <Box className={classes.homeSection}>


            <Link id="home" href="#" />
            {isXs &&
                <video
                    autoPlay
                    loop
                    muted
                    className={classes.landingVideo}
                >
                    <source
                        type="video/mp4"
                        src={LandingVideo}
                    />
                </video>
            }
            {step !== -1 &&
                <Box className={classes.content}>
                    <Box className={classes.title}>
                        <Typography className={isXsMin ? classes.text1 : classes.text11}>Own A Word</Typography>
                        <Typography className={isXsMin ? classes.text2 : classes.text22}>{collectiontxt}</Typography>
                        <Typography className={isXsMin ? classes.text3 : classes.text33}>{detailtxt}</Typography>
                        {step == 4 && <Box sx={{ marginTop: 5, }}><Typography className={isXsMin ? classes.text3 : classes.text33}>{moredetailtxt}</Typography></Box>}
                        <Box sx={{ marginTop: 5, }}>
                            <BelowButton />
                        </Box>
                        <Typography className={isXsMin ? classes.countDownText : classes.countDownText1}>{stepTxt}</Typography>
                    </Box>
                    {(step != 5 && step != 4 && step != 3 && step != 0) && <Box className={classes.cardList}>
                        {
                            titles.map((val, index) =>
                                // <Box className={classes.card} key={index} >
                                //     <ArcProgress
                                //         size={120}
                                //         animation={false}
                                //         arcStart={-90}
                                //         arcEnd={270}
                                //         progress={percentage[index]}
                                //         thickness={3}
                                //         emptyColor='#3d2a69'
                                //         fillColor='#fff'
                                //         text={timeLeft[index].toString()}
                                //         textStyle={{ size: '42px', color: '#FFF', font: "Klavika", y: 45 }}
                                //         customText={[{ text: val, size: '17', color: 'rgba(224,224,255,.6)', font: "Klavika", y: 80, x: 60 }]}
                                //     />
                                // </Box>
                                <Box className={classes.card} key={index} >
                                    <ArcProgress
                                        size={isXsMin ? 120 : (isXs ? 100 : 70)}
                                        animation={false}
                                        arcStart={-90}
                                        arcEnd={270}
                                        progress={percentage[index]}
                                        thickness={3}
                                        emptyColor='#3d2a69'
                                        fillColor='#fff'
                                        text={timeLeft[index].toString()}
                                        textStyle={{ size: isXsMin ? '42px' : (isXs ? '36px' : '28px'), color: '#FFF', font: "Klavika", y: isXsMin ? 45 : (isXs ? 40 : 35) }}
                                        customText={[{ text: val, size: isXs ? '17px' : '15px', color: '#FFF', font: "Klavika", y: isXsMin ? 80 : (isXs ? 75 : 100), x: isXsMin ? 60 : (isXs ? 50 : 35) }]}
                                    />
                                </Box>
                            )
                        }
                    </Box>}
                    {(!isXs && step != 5 && step != 4 && step != 3 && step != 0) &&
                        <Box className={classes.timeLine}>
                            <Box className={classes.date}>
                                Days
                            </Box>
                            <Box className={classes.date}>
                                HRS
                            </Box >
                            <Box className={classes.date}>
                                MINS
                            </Box>
                            <Box className={classes.date}>
                                SECS
                            </Box>
                        </Box>
                    }
                    <Box className={classes.btnLayer}>
                        {/* <WalletModalButton className={classes.exploreButton}>
                        Connect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<RightArrow />
                    </WalletModalButton> */}
                        {/* {step == 0 && <WalletModalButton className={classes.exploreButton}>
                        Connect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<RightArrow />
                    </WalletModalButton>} */}
                    </Box>
                </Box>}
        </Box>
    );
}

export default HomeSection;