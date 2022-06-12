import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import axios from 'axios';
import { Button, Grid, Box, Typography, InputBase, Paper, IconButton, CircularProgress, useMediaQuery } from '@mui/material';
import { Arrow, SearchIcon } from '../../components/Common/Arrow';
import KanonDefaultButton from '../../components/Common/KanonDefaultButton';
import AddClaimModal from '../../components/MyWallet/ClaimModal';
import { useSelector, useDispatch } from "react-redux";
import { Connection } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import { Program, Provider, BN, web3 } from '@project-serum/anchor';
import { Metadata, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { KanonProgramAdapter } from 'kanon-marketplace-sdk';
import KanonColorButton from '../../components/Common/KanonColorButton';
import { useNavigate, useLocation } from 'react-router-dom';
import * as anchor from '@project-serum/anchor';
import { getParsedNftAccountsByOwner, isValidSolanaAddress, createConnectionConfig, } from "@nfteyez/sol-rayz";
import { allCollectionFilter1, getreservednftsbywallet, filtering, getMetadataByMintaddresses, calculateAirdropStep, getthumbnailbymintaddresses, getAddressCollections, MywalletPgSize, CallTime, checkreservednftamountbywallet, checkIsListed } from '../../utils/helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastConfig, NO_NFTS } from '../../components/Common/StaticData';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import LoaderImage from '../../assets/loader.png';
import DarafarmJson from '../../contracts/Contract.json';
import { AppRegistrationRounded } from '@mui/icons-material';

const { REACT_APP_SERVER_URL, REACT_APP_PUBLIC_NETWORK, REACT_APP_ENDPOINT, REACT_APP_STAKE_NETWORK, REACT_APP_STAKE_PROGRAMID } = process.env;

const StakingType = {
    SNS: 1,
    NFT: 2,
    BOTH: 3,
};

const opts = {
    preflightCommitment: "processed"
}

const connection = new Connection(
    REACT_APP_ENDPOINT, opts.preflightCommitment
);

const useStyles = makeStyles((theme) => ({
    marketplagePage: {
        minHeight: "100vh",
        backgroundColor: "#202036",
        position: "relative",
        fontFamily: 'Klavika'
    },
    title: {
        fontSize: "48px !important",
        color: "white",
    },
    notitle: {
        fontSize: "24px !important",
        color: "white",
    },
    titleLayout: {
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            display: 'block'
        },
    },
    makeList: {
        height: 40,
        [theme.breakpoints.down('md')]: {
            marginTop: '10px !important',
        },
    },
    blockLayer : {
        display : 'inline-block',
        marginLeft : 'auto',
        marginRight : 'auto'
    },
    claim: {
        marginLeft: '25px !important',
        height: 40,
        [theme.breakpoints.down('md')]: {
            marginLeft: '0px !important',
        },
    },
    smallTitle: {
        marginTop: "8px",
        fontSize: "20px !important",
        color: "rgba(224, 224, 255, 0.6)",
        paddingLeft: "180px"
    },
    search: {
        width: "300px",
        height: "48px",
        background: "rgba(224, 224, 255, 0.02)",
        borderRadius: "12px",
        display: "flex"
    },
    searchIcon: {
        margin: 18
    },
    searchText: {
        width: 230,
        color: 'rgba(255, 255, 255, 0.6)',
        backgroundColor: 'transparent',
        border: 0,
        "& before": {
            border: 0
        }
    },
    centerDiv: {
        marginLeft: '140px',
        marginRight: '140px',
        [theme.breakpoints.down('lg')]: {
            marginLeft: '60px',
            marginRight: '60px',
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '100px',
            marginRight: '100px',
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '0px',
            marginRight: '0px',
        },
    },
    cardList: {
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 24,
        flexWrap: 'wrap',
        paddingBottom: 48,
        overflow: 'hidden',
        position: 'relative',
        zIndex: 3,
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
            // justifyContent: 'center',
            // alignItems: 'center',
        }
    },
    card: {
        width: '248px',
        padding: 24,
        marginBottom: '20px',
        background: '#212335',
        border: '1px solid rgba(245, 247, 250, 0.06)',
        boxSizing: 'border-box',
        boxShadow: `0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04),
            8px 8px 24px rgba(20, 16, 41, 0.4)`,
        backdropFilter: 'blur(108.731px)',
        borderRadius: 24,
        position: 'relative',
        cursor: 'pointer',
        '&:hover': {
            border: '1px solid #2D61E5'
        },
        '& span': {
            width: '200px !important',
            height: '200px !important',
            borderRadius: 12,
        }
    },
    card1: {
        width: '248px',
        marginTop: 24,
    },
    cardImage: {
        width: "200px !important",
        height: "200px !important",
        borderRadius: 12,
        // margin: 24,
        marginBottom: 0,
    },
    cardTitle: {
        wordBreak: 'break-word',
        fontSize: '14px !important',
        color: 'white',
        marginTop: '5px !important',
        marginRight: '24px !important',
        lineHeight: '1.2 !important',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        "& hover": {
            textDecoration: 'underline'
        }
    },
    listed: {
        wordBreak: 'break-word',
        fontSize: '14px !important',
        color: '#ce9cb4 !important',
        marginTop: '5px !important',
        marginRight: '24px !important',
        lineHeight: '1.2 !important',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        "& hover": {
            textDecoration: 'underline'
        }
    },
    tag: {
        fontSize: "13px !important",
        fontFamily: "Montserrat",
        height: 24,
        borderRadius: 12,
        width: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        paddingLeft: 8,
        paddingRight: 8,
        position: 'absolute',
        right: 40,
        top: 40
    },
    stake: {
        fontSize: '14px !important',
        fontFamily: "Montserrat",
        fontWeight: "bold",
        height: 24,
        borderRadius: 12,
        width: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        paddingLeft: 8,
        paddingRight: 8,
        position: 'absolute',
        right: 40,
        top: 70,
    },
    loadMore: {
        marginLeft: 'calc(50% - 70px)',
        marginBottom: 32
    },
    titleSection: {
        display: 'flex',
        paddingTop: "80px",
        paddingLeft: "140px",
        paddingRight: '140px',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        [theme.breakpoints.down('lg')]: {
            paddingLeft: '60px',
            paddingRight: '60px',
        },
        [theme.breakpoints.down('md')]: {
            paddingLeft: '100px !important',
            paddingRight: '100px !important',
        },
        ['@media (max-width:720px)']: {
            justifyContent: 'center !important',
        },
        [theme.breakpoints.down('sm')]: {
            paddingLeft: '20px !important',
            paddingRight: '20px !important',
        }
    },
    layer: {
        display: 'flex', width: '100%', justifyContent: 'space-between',
        ['@media (max-width:720px)']: {
            justifyContent: 'center !important',
        }
    }
}));

let interval;

const MyWallet = () => {

    const match1 = useMediaQuery('(min-Width: 1800px)');
    const match2 = useMediaQuery('(min-Width: 1400px)');
    const match3 = useMediaQuery('(min-Width: 900px)');
    const match4 = useMediaQuery('(min-Width: 720px)');
    const match5 = useMediaQuery('(min-Width: 400px)');
    const classes = useStyles();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [step, setStep] = useState(-1);
    const [nfttokens, setNftTokens] = useState([]);
    const [airdropedlist, setAirdropedList] = useState([]);
    const [rowCount, setRowCount] = useState(5);

    const wallet = useSelector(state => state.main.wallet)
    const provider = useSelector(state => state.main.provider);
    const KNProgram = useSelector(state => state.main.KNProgram);

    const [nonftsFlag, setNoNftsFlag] = useState(false);
    const [enable, setEnable] = useState(false);
    const [checkEnable, setCheckEnable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [checkLast, setCheckLast] = useState(false);
    const [stakeProgram, setStakeProgram] = useState(null);
    const [poolNftStaked, setPoolNftStaked] = useState(false);
    const [nfts, setNfts] = useState([]);
    const [metadata, setMetaData] = useState(null);
    const [stopTimer, setStopTimer] = useState(false);

    const TokenInstructions = require("@project-serum/serum").TokenInstructions;

    useEffect(() => {

        if (match1)
            setRowCount(5);
        else if (match2)
            setRowCount(4);
        else if (match3)
            setRowCount(3);
        else if (match4)
            setRowCount(2);
        else if (match5)
            setRowCount(1);
    })

    useEffect(async () => {
        if (checkEnable) {
            if (checkLast) {
                setEnable(false);
            }
            let nftsPda = await KNProgram.getNFTsbyPDA();
            if (nftsPda.length == 0) {
                setEnable(false);
                return;
            }
            let real = [];
            let nfts = await getreservednftsbywallet(wallet.publicKey.toBase58());
            real = nfts.filter((item) => {
                if (nftsPda.findIndex((val) => val.mint.toBase58() == item.nft_mint_address) != -1) {
                    return true;
                } else {
                    return false;
                }
            });
            if (real.length == 0) {
                setEnable(false);
            } else {
                if (real.length == 1) {
                    setCheckLast(true);
                }
                if (wallet && wallet.connected && !wallet.disconnecting) {
                    setEnable(true);
                } else {
                    setEnable(false);
                }

            }
            // setEnable(result != 0)
            setCheckEnable(false);
        }
    }, [checkEnable])

    useEffect(() => {
        if (stopTimer) {
            clearInterval(interval);
        }
    }, [nfttokens]);
    
    const createPoolStakeAccount = async (type) => {
        try {
            const [stakeAccount, bump] = await PublicKey.findProgramAddress(
                [
                    wallet.publicKey.toBuffer(),
                    Buffer.from(anchor.utils.bytes.utf8.encode("SNS:STAKE"))
                ],
                stakeProgram.programId
            );
            const [poolSetting, _a] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(anchor.utils.bytes.utf8.encode("SNS:STATE"))],
                stakeProgram.programId
            );
            await stakeProgram.rpc.poolCreateStakeAccount((type === 1 ? StakingType.SNS : (type === 2 ? StakingType.NFT : StakingType.BOTH)), {
                accounts: {
                    stakeAccount,
                    poolSetting,
                    authority: wallet.publicKey,
                    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
                }
            });
        } catch (err) {
            console.log(err);
            alert(err);
        }
    }

    const getProvider = async () => {
        try {
            setCheckEnable(true);
            setLoading(true);
            let nfts = await KNProgram.getNFTsbyWallet(wallet.publicKey);

            if (nfts.length == 0) {
                if (wallet && wallet.connected && !wallet.disconnecting) {
                    setNftTokens([...airdropedlist]);
                } else {
                    setNftTokens([]);
                }
                setLoading(false)
                return;
            }

            let mintaddress = [];
            nfts.map((item) => mintaddress.push(item.mint.toBase58()));
            let apiresult = await getMetadataByMintaddresses(null, mintaddress);

            let temp = [...apiresult];
            if (airdropedlist.length != 0) {
                airdropedlist.map((item) => temp.push(item));
            }

            setNftTokens([...temp]);

            let showCount = -1;
            if ( apiresult.length > 10) {
                showCount++;
                let resdata = await getthumbnailbymintaddresses(null, 10, MywalletPgSize, mintaddress);
                resdata.map((item) => {
                    let index = apiresult.findIndex((val) => val.nft_mint_address == item.nft_mint_address);
                    if (index != -1) {
                        apiresult[index].thumbnail = item.thumbnail
                    }
                });
                temp = [...apiresult];
                if (airdropedlist.length != 0) {
                    airdropedlist.map((item) => temp.push(item));
                }

                setNftTokens([...temp]);
                if ((10 + MywalletPgSize) >= (apiresult.length)) {
                    setLoading(false);
                    return;
                }

                interval = setInterval(() => {
                    showCount++;
                    getthumbnailbymintaddresses(null, (10 + showCount * MywalletPgSize), MywalletPgSize, mintaddress).then((resdata) => {
                        resdata.map((item) => {
                            let index = apiresult.findIndex((val) => val.nft_mint_address == item.nft_mint_address);
                            if (index != -1) {
                                apiresult[index].thumbnail = item.thumbnail
                            }
                        });
                        temp = [...apiresult];
                        if (airdropedlist.length != 0) {
                            airdropedlist.map((item) => temp.push(item));
                        }
                        setNftTokens([...temp]);
                        
                        if ((10 + (showCount + 1) * MywalletPgSize) >= ( apiresult.length )) {
                            setLoading(false)
                        }
                    });
                    if ((10 + (showCount + 1) * MywalletPgSize) >= ( apiresult.length )) {
                        clearInterval(interval);
                    }
                }, CallTime);
            } else {
                setLoading(false);
            }

        } catch (err) {
            console.log(err)
        }
    }
    
    useEffect(() => {
        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (nonftsFlag) {
            toast.warn(NO_NFTS, toastConfig);
        }
    }, [nonftsFlag]);


    useEffect(() => {
        if (wallet && wallet.connected && !wallet.disconnecting) {
            setNftTokens([]);
            setAirdropedList([]);
            getProvider();
            setStopTimer(false);
        }
        else {
            clearInterval(interval);
            setStep(0);
            setEnable(false);
            // setProgram(null);
            setNftTokens([]);
            setLoading(false);
            setAirdropedList([]);
            setStopTimer(true);
        }
    }, [wallet]);


    const addNewAirdrop = (new_val) => {
        let temp = [...nfttokens];
        let tmp1 = [...airdropedlist];
        temp.push(new_val);
        tmp1.push(airdropedlist);
        setNftTokens([...temp]);

        setAirdropedList([...tmp1]);
    }

    const Tag = ({ type }) => {
        return (<Box className={classes.tag} style={{ backgroundColor: '#2D61E5', zIndex: 9 }}>{type}</Box>);
    }

    const Staked = () => {
        return (<Box className={classes.stake} style={{ color: '#f2d600', zIndex: 9 }}>Staked</Box>);
    }

    const showCard = () => {
        let tempnfts = nfttokens.filter((val) => val.thumbnail != null);
        let length = parseInt(tempnfts.length);
        let count = length % rowCount;
        let len = parseInt(length / rowCount);
        let rows = [];

        for (let i = 0; i < len; i++) {
            let temp = [];
            for (let j = 0; j < rowCount; j++) {
                if (j == 0 && i == 0 && poolNftStaked === true) {
                    let item = tempnfts[i * rowCount + j];
                    temp.push(<Box className={classes.card} key={i * rowCount + j} onClick={() => { navigate('/mywallet/detail', { state: item }); }}>
                        <Tag type={item.collection_name.toString()} />
                        <Staked />
                        <LazyLoadImage placeholderSrc={LoaderImage} effect="opacity" src={item.thumbnail} alt="collection" className={classes.cardImage} />
                        <Typography className={classes.cardTitle}>{item.nft_name.toString()}</Typography>
                        <Typography className={classes.listed}>{ item.is_listed? "Listed" : ""}</Typography>
                    </Box>)
                }
                else {
                    let item = tempnfts[i * rowCount + j];
                    temp.push(<Box className={classes.card} key={i * rowCount + j} onClick={() => { navigate('/mywallet/detail', { state: item }); }}>
                        <Tag type={item.collection_name.toString()} />
                        <LazyLoadImage placeholderSrc={LoaderImage} effect="opacity" src={`data:image/png;base64,${item.thumbnail}`} alt="collection" className={classes.cardImage} />
                        <Typography className={classes.cardTitle}>{item.nft_name.toString()}</Typography>
                        <Typography className={classes.listed}>{ item.is_listed? "Listed" : ""}</Typography>
                    </Box>)
                }
            }
            rows.push(<Box key={i} className={ match5? classes.layer : classes.blockLayer}>{temp}</Box>)
        }
        if (count !== 0) {
            let temp = [];
            for (let i = 0; i < rowCount; i++) {
                let item = tempnfts[len * rowCount + i];
                if ((rowCount * len + i) < length) {
                    temp.push(<Box className={classes.card} key={rowCount * len + i} onClick={() => { navigate('/mywallet/detail', { state: item }); }}>
                        <Tag type={item.collection_name.toString()} />
                        <LazyLoadImage placeholderSrc={LoaderImage} effect="opacity" src={`data:image/png;base64,${item.thumbnail}`} alt="collection" className={classes.cardImage} />
                        <Typography className={classes.cardTitle}>{item.nft_name.toString()}</Typography>
                        <Typography className={classes.listed}>{ item.is_listed? "Listed" : ""}</Typography>
                    </Box>)
                } else {
                    temp.push(<Box className={classes.card1} key={rowCount * len + i}>
                    </Box>);
                }
            }
            rows.push(<Box key={len + 1} className={ match5? classes.layer : classes.blockLayer}>{temp}</Box>)
        }
        return rows;
    }
    return (
        <Box className={classes.marketplagePage}>
            <Box className={classes.titleSection}>
                <Box className={classes.titleLayout}>
                    <Typography className={classes.title}>My Wallet</Typography>
                    {enable && <KanonColorButton className={classes.claim} onClick={() => setShowDetailModal(true)}>Claim Airdrop</KanonColorButton>}
                </Box>
            </Box>
            {enable && <AddClaimModal open={showDetailModal} setAirdropedList={addNewAirdrop} setClaimFlag={() => setCheckEnable(true)} onClose={() => setShowDetailModal(false)} />}
            {stopTimer ?
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5, paddingBottom: 5 }}>
                    <Typography className={classes.notitle}>No Kanon NFTs yet in your wallet</Typography>
                </Box>
                :<>
                    {<Box className={classes.centerDiv}>
                        <Box className={classes.cardList}>
                            {showCard()}
                        </Box>
                    </Box>
                    }
                    {loading && <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5, paddingBottom: 5 }}>
                        <CircularProgress disableShrink />
                    </Box>}
                    {(nfttokens.length == 0 && !loading) &&
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5, paddingBottom: 5 }}>
                            <Typography className={classes.notitle}>No Kanon NFTs yet in your wallet</Typography>
                        </Box>
                    }
                </>
            }
            <ToastContainer />
        </Box>
    );
}

export default MyWallet;