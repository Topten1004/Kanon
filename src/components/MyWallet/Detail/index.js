import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box, Link, Typography, Button, List, Grid, ClickAwayListener, Accordion, AccordionSummary, AccordionDetails, TextField, FormControl, Dialog, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Stack, tableCellClasses, Tooltip } from "@mui/material";
import { useWallet } from '@solana/wallet-adapter-react';
import { LeftArrow } from '../../Common/Arrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Connection } from '@solana/web3.js';
import { Keypair, PublicKey } from '@solana/web3.js';
import { AccountInfo, MintInfo, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import axios from "axios";
import { Metadata, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import { KanonProgramAdapter } from 'kanon-marketplace-sdk';
import * as anchor from '@project-serum/anchor';
import { Program, Provider, BN, web3 } from '@project-serum/anchor';
import { setLoading } from '../../../redux/ducks/main';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import CloseIcon from '@mui/icons-material/Close';
import HtmlFile from "../../Layouts/Footer/HtmlFile";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import LazyLoader from '../../../assets/loader.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Lightbox } from "react-modal-image";
import {
    shortenAddress, calculateStep,
    serializeSellTransaction, listNftToMarket, checkIsListed,
    serializeUnlistTransaction, unlistFromMarket,
    getSaleHistory,
    EstHistoryTime, shortenTime
} from '../../../utils/helper';
import copy from 'copy-to-clipboard';
import AddStakeModal from '../StakeModal';
import DarafarmJson from '../../../contracts/Contract.json';
import { getParsedNftAccountsByOwner, isValidSolanaAddress, createConnectionConfig, getParsedAccountByMint } from "@nfteyez/sol-rayz";
import { NO_MORE_NFT, OUT_OF_NFTSAMOUNT, ERROR_CONDITION, errorData, toastConfig } from '../../Common/StaticData';
import { findAssociatedTokenAddress } from '../../../utils/helper';
import { LocalConvenienceStoreOutlined, SettingsSystemDaydream } from "@mui/icons-material";
import * as LANG from "../../../utils/constants";

const { REACT_APP_SERVER_URL, REACT_APP_PUBLIC_NETWORK, REACT_APP_ENDPOINT, REACT_APP_STAKE_NETWORK, REACT_APP_STAKE_PROGRAMID } = process.env;

const { createTokenAccount, sleep, token, getTokenAccount } = require("@project-serum/common");

const opts = {
    preflightCommitment: "processed"
}
const connection = new Connection(
    REACT_APP_ENDPOINT, opts.preflightCommitment
);

const useStyles = makeStyles(theme => ({
    detailContent: {
        marginTop: '100px',
        width: '100%',
    },
    backIcon: {
        height: '50px',
        marginLeft: '200px',
        display: 'flex',
        alignItems: 'center',
        ['@media (max-width:1400px)']: {
            marginLeft: '100px',
        },
        ['@media (max-width:1200px)']: {
            marginLeft: '50px',
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '50px',
        }
    },
    salesTable: {
        '& th': {
            fontSize: '12px !important',
        },
        '& td': {
            fontSize: '12px !important',
        },
    },
    tableCenter: {
        textAlign: 'center !important'
    },
    backBtn: {
        color: 'white !important',
        textTransform: 'none !important',
        cursor: 'pointer',
        marginBottom: '20px !important'
    },
    mainContent: {
        display: 'flex',
        minHeight: 1050,
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            flexDirection: 'column',
        }
    },
    rightSection: {
        width: '45%',
        marginRight: '200px',
        paddingLeft: '20px',
        ['@media (max-width:1400px)']: {
            marginRight: '100px',
        },
        ['@media (max-width:1200px)']: {
            marginRight: '50px',
        },
        [theme.breakpoints.down('md')]: {
            marginRight: '0px',
            width: '100%',
            paddingLeft: '50px',
            paddingRight: '50px',
        }
    },
    itemList: {

        marginLeft: '200px',
        ['@media (max-width:1400px)']: {
            marginLeft: '100px',
        },
        ['@media (max-width:1200px)']: {
            marginLeft: '50px',
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '0px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
        },

    },
    fullImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: '100%',
        width: '100%',
        objectFit: 'cover',
        cursor: 'pointer'
    },
    card: {
        marginRight: '24px',
        width: '550px',
        height: '550px',
        display: 'flex',
        cursor: 'pointer',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: `linear-gradient(
            135deg,
            rgba(245, 247, 250, 0.12) 0%,
            rgba(245, 247, 250, 0.06) 51.58%,
            rgba(245, 247, 250, 0.0001) 98.94%
        )`,
        border: `1px solid rgba(245, 247, 250, 0.06)`,
        boxSizing: `border-box`,
        boxShadow: `0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04),
            8px 8px 24px rgba(20, 16, 41, 0.4)`,
        borderRadius: 20,
        padding: '25px',
        [theme.breakpoints.down('md')]: {
            marginRight: '0px',
        },
        "& span": {
            width: '100%',
            height: '100%',
        },
        [theme.breakpoints.down('xl')]: {
            width: '500px',
            height: '500px',
        },
        [theme.breakpoints.down('lg')]: {
            width: '400px',
            height: '400px',
        },
        [theme.breakpoints.down('sm')]: {
            width: '300px',
            height: '300px',
        },
    },
    card1: {
        marginBottom: '100px',
        padding: '40px 40px',
        background: '#212335',
        border: `1px solid rgba(245, 247, 250, 0.06)`,
        boxSizing: `border-box`,
        boxShadow: `0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04),
            8px 8px 24px rgba(20, 16, 41, 0.4)`,
        borderRadius: 20,
        [theme.breakpoints.down('md')]: {
            background: 'none',
            border: 'none',
            boxShadow: `none`,
            padding: '0 0',
            marginTop: '30px',
        },

    },
    imageCard: {
        width: '100%',
        height: '100%',
        objectFit: 'fill',
        borderRadius: 20,

    },
    contentTitle: {
        marginBottom: '50px',
    },
    tag: {
        backgroundColor: '#2D61E5',
        width: "fit-content",
        fontSize: "13px !important",
        color: "white",
        background: "#2d61e5",
        borderRadius: "12px",
        padding: "4px 8px"
    },
    title: {
        fontSize: '25px !important',
        fontWeight: '500px',
        color: 'white',
        wordBreak: 'break-all',
    },
    creatorTitle: {
        fontSize: '12px !important',
        color: 'rgba(255, 255, 255, 0.6)',
    },
    creatorText: {
        fontSize: '16px !important',
        color: 'white',
    },
    accordion: {
        background: 'rgba(224, 224, 255, 0.02) !important',
        borderRadius: '12px !important',
        boxShadow: 'none !important',
        position: 'unset !important',
        marginTop: '10px !important'
    },
    expandIcon: {
        color: 'rgba(224, 224, 255, 0.4)',
    },
    accordionTitle: {
        color: 'white',
        fontSize: '20px !important',
    },
    accordionDetails: {
        display: 'flex',
        width: '100%',
    },
    propertiesDiv: {
        background: 'rgba(224, 224, 255, 0.02)',
        borderRadius: '12px',
        padding: '24px 24px',
        marginBottom: '10px',
    },
    detailDiv: {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: '10px 10px',
        marginRight: '10px',
        wordBreak: 'break-all',
        [theme.breakpoints.down('lg')]: {
            display: 'flex',
            flexDirection: 'column',
        }
    },
    detailTitle: {
        color: 'rgba(224, 224, 255, 0.6) !important',
        fontSize: '12px !important',
    },
    detailText: {
        color: 'white !important',
        fontSize: '12px !important',
        wordBreak: 'break-all',
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginLeft: 1,
        marginRight: 1,
        cursor: 'pointer',
    },
    card2: {
        width: '70%',
        height: '180px',
        padding: 20,
        background: 'rgba(224, 224, 255, 0.02)',
        borderRadius: 12,
        [theme.breakpoints.down('lg')]: {
            width: '100%',
        },
    },
    title2: {
        fontSize: '20px !important',
        color: 'white !important',
        marginBottom: '20px !important',
    },
    title3: {
        fontSize: '18px !important',
        color: 'white !important',
        marginLeft: '10px !important',
    },
    title22: {
        fontSize: '10px !important',
        color: 'rgba(255, 255, 255, 0.6) !important',
    },
    content2: {
        display: 'flex',
        justifyContent: 'space-between',
        // display: 'flex',
        alignItems: 'center',
    },
    text2: {
        fontSize: '24px !important',
        color: 'white !important',
    },
    unlistButton: {
        minWidth: '100px !important',
        height: '48px',
        textTransform: 'none !important',
        fontSize: '18px !important',
        color: 'white !important',
        fontFamily: 'Klavika !important',
        padding: '0px 0px !important',
        background: 'grey !important',
        // background: `linear-gradient(135deg, #2d61e5 0%, #8a62f6 53.09%, #e3477e 100%) !important`,
        // boxShadow: `0px 0px 1px rgba(45, 97, 229, 0.24), 0px 2px 4px -1px rgba(10, 70, 82, 0.12),
        //     0px 16px 24px rgba(45, 97, 229, 0.24), 0px 8px 8px -4px rgba(45, 97, 229, 0.12) !important`,
        borderRadius: `12px !important`,
    },
    listButton: {
        minWidth: '100px !important',
        height: '48px',
        textTransform: 'none !important',
        fontSize: '18px !important',
        color: 'white !important',
        fontFamily: 'Klavika !important',
        padding: '0px 0px !important',
        background: `linear-gradient(135deg, #2d61e5 0%, #8a62f6 53.09%, #e3477e 100%) !important`,
        // boxShadow: `0px 0px 1px rgba(45, 97, 229, 0.24), 0px 2px 4px -1px rgba(10, 70, 82, 0.12),
        //     0px 16px 24px rgba(45, 97, 229, 0.24), 0px 8px 8px -4px rgba(45, 97, 229, 0.12) !important`,
        borderRadius: `12px !important`,
    },
    card3: {
        width: '35%',
        height: '180px',
        // display: 'inline-block',
        display: 'flex',
        flexDirection: 'column !important',
        padding: 20,
        paddingLeft: 5,
        paddingRight: 5,
        background: 'rgba(224, 224, 255, 0.02)',
        borderRadius: 12,
        [theme.breakpoints.down('lg')]: {
            width: '100%',
        },
    },
    detailsButtonDis: {
        width: 100,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        // background: `linear-gradient(135deg, #33334B 0%, #27273E 51.37%, #202036 99.14%)`,
        background: 'grey !important',
        // boxShadow: `0px 0px 1px rgba(45, 97, 229, 0.12), 0px 2px 4px -1px rgba(27, 10, 82, 0.06), 0px 16px 24px rgba(45, 97, 229, 0.12), 0px 8px 8px -4px rgba(45, 97, 229, 0.06), inset 0px 2px 6px rgba(45, 97, 229, 0.4)`,
        borderRadius: "12px !important",
        "& .MuiButton-root": {
            padding: '0px 0px !important',
        }
    },
    detailsButtonEna: {
        display: 'flex',
        width: '100px',
        height: '48px',
        cursor: 'pointer',
        borderRadius: '12px !important',
        color: 'white',
        background: 'linear-gradient(135deg, #2D61E5 0%, #8A62F6 53.09%, #E3477E 100%)',
        boxShadow: `0px 0px 1px rgba(45, 97, 229, 0.24), 0px 2px 4px -1px rgba(10, 70, 82, 0.12),
        0px 16px 24px rgba(45, 97, 229, 0.24), 0px 8px 8px -4px rgba(45, 97, 229, 0.12) !important`,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItem: {
        display: 'flex',
        justifyContent: 'space-between',
        [theme.breakpoints.down('lg')]: {
            display: 'block',
        }

    },
    outLinedInput: {
        "& .MuiTypography-root": {
            color: 'white'
        }
    },
    tableBox: {
        textAlign: 'right !important',
        minWidth: '80px !important',
        align: 'right !important'
    },
    tableBox1: {
        border: '3px solid #3378ff',
        textAlign: 'center',
        borderRadius: '20px'
    },
    detailModal: {
        marginTop: '90px',
        fontFamily: 'Klavika',
        "& .MuiPaper-root": {
            background: '#212335',
            border: '1px solid rgba(245, 247, 250, 0.06)',
            boxSizing: 'border-box',
            boxShadow: ` 0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04),
                8px 8px 24px rgba(20, 16, 41, 0.4)`,
            backdropFilter: 'blur(108.731px)',
            borderRadius: 24,
            padding: '50px 30px',
            [theme.breakpoints.down('md')]: {
                width: '80%',
            }
        },
        "& .MuiPaper-root>:nth-Child(0)": {
        },
    },
    btnTip: {
        padding: '0px !important',
        fontSize: '12px',
        color: 'white !important',
        textAlign: 'left',
        minWidth: '0px !important',
        fontSize: '12px !important',
        wordBreak: 'break-all',
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginLeft: 1,
        marginRight: 1,

        "&:hover": {
            background: 'none !important',
            color: 'none !important',
        },
        "& .MutButton-root": {
            padding: '0px ! important',
            fontSize: '12px !important',
        }
    },
    btnTo: {
        padding: '0px !important',
        fontSize: '12px',
        color: '#6E56F8 !important',
        textAlign: 'left',
        minWidth: '0px !important',
        fontSize: '12px !important',
        wordBreak: 'break-all',
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginLeft: 1,
        marginRight: 1,

        "&:hover": {
            background: 'none !important',
            color: 'none !important',
        },
        "& .MutButton-root": {
            padding: '0px ! important',
            fontSize: '12px !important',
            color: '#6E56F8 !important',
        }
    },

    rightCell: {
        align: 'right !important',
        textAlign: 'right !important'
    },
    centerCell: {
        align: 'center !important',
        textAlign: 'center !important'
    },
    termText: {
        display: 'flex',
        overflowX: 'hidden',
        paddingRight: '10px',
        "&::-webkit-scrollbar": {
            width: '6px !important',
        },

        "&::-webkit-scrollbar-track": {
            background: "#e4e2e2",
            borderRadius: "10px",
        },

        "&::-webkit-scrollbar-thumb": {
            borderRadius: "10px",
            background: "rgb(148, 147, 147)",
        },

        "&::-webkit-scrollbar-thumb:hover": {
            background: "rgb(119, 118, 118)",
        },
    },
}));


const StakingType = {
    SNS: 1,
    NFT: 2,
    BOTH: 3,
};

const Detail = () => {

    // const cardCtrl = useRef();
    // const [ setRef, { width, height } ] = useMeasure() ;

    const classes = useStyles();
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [metadata, setMetaData] = useState(null);
    // const [KNProgram, setProgram] = useState(null);
    const [solValue, setSolValue] = useState(0);
    const [fullscreen, setFullScreen] = useState(false);
    const [stakeProgram, setStakeProgram] = useState(null);
    const [stakeConnection, setStakeConnection] = useState(null);
    const [stakeProvider, setStakeProvider] = useState(null);

    const [titleOne, setTitleOne] = useState("Not Staked");
    const [titleTwo, setTitleTwo] = useState("Stake")

    const [tipFrom, setTipFrom] = useState([]);
    const [tipTo, setTipTo] = useState([]);
    const [tipAttr, setTipAttr] = useState([]);
    const [alertFlag, setAlertFlag] = useState(false);

    const { Keypair } = web3;
    const [nfts, setNfts] = useState([]);

    const [stake, setStake] = useState(false);
    const fromArray = [];
    const toArray = [];

    const [poolNftStaked, setPoolNftStaked] = useState(false);
    const [poolMode, setPoolMode] = useState(-1);
    const [poolSnsStaked, setPoolSnsStaked] = useState(false);
    const [type, setType] = useState(0);

    const TokenInstructions = require("@project-serum/serum").TokenInstructions;

    const StakeProgramID = new PublicKey(REACT_APP_STAKE_PROGRAMID);
    const anchor = require('@project-serum/anchor');

    const [mintAddress, setMintAddress] = useState("");
    const [isListed, setListedStatus] = useState(false);
    const [listedPrice, setListedPrice] = useState(0);
    const [salesHistory, setSalesHistory] = useState([]);

    const wallet = useSelector(state => state.main.wallet);
    const provider = useSelector(state => state.main.provider);
    const KNProgram = useSelector(state => state.main.KNProgram);
    const AHProgram = useSelector(state => state.main.AHProgram);
    const ReduxAhIdl = useSelector(state => state.main.ReduxAhIdl);

    const tipAttrOpen = (index) => {
        let temp = [...tipAttr];
        temp[index] = true;
        setTipAttr([...temp]);
    }

    const tipAttrClose = (index) => {
        let temp = [...tipAttr];
        temp[index] = false;
        setTipAttr([...temp]);
    }

    const tipFromOpen = (index) => {
        let temp = [...tipFrom];
        temp[index] = true;
        setTipFrom([...temp]);
    }

    const tipFromClose = (index) => {
        let temp = [...tipFrom];
        temp[index] = false;
        setTipFrom([...temp]);
    }

    const tipToOpen = (index) => {
        let temp = [...tipTo];
        temp[index] = true;
        setTipTo([...temp]);
    }

    const tipToClose = (index) => {
        let temp = [...tipTo];
        temp[index] = false;
        setTipTo([...temp]);
    }

    const copyAttr = (index, value) => {
        copy(value);
        tipAttrOpen(index);
    }

    useEffect(async () => {
        let tempfrom = [];
        if (metadata != null) {
            metadata.metadataExternal.attributes.map((item) => tempfrom.push(false));
        }
        setTipAttr([...tempfrom]);
    }, [metadata])

    const createPoolStakeAccount = async (type) => {
        try {
            const network = REACT_APP_STAKE_NETWORK;
            const stakeConnection = new Connection(network, opts.preflightCommitment);

            const provider = new Provider(
                stakeConnection, wallet, opts.preflightCommitment,
            );

            setStakeConnection(stakeConnection);
            setStakeProvider(provider);

            const programs = new Program(DarafarmJson, StakeProgramID, provider);
            setStakeProgram(programs);

            const [stakeAccount, bump] = await PublicKey.findProgramAddress(
                [
                    wallet.publicKey.toBuffer(),
                    Buffer.from(anchor.utils.bytes.utf8.encode("SNS:STAKE"))
                ],
                programs.programId
            );
            const [poolSetting, _a] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(anchor.utils.bytes.utf8.encode("SNS:STATE"))],
                programs.programId
            );
            await programs.rpc.poolCreateStakeAccount((type === 1 ? StakingType.SNS : (type === 2 ? StakingType.NFT : StakingType.BOTH)), {
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
            setError(1, err);
            // alert(err);
        }
    }

    const setError = async (type, err) => {
        let error_code = 0;
        let data = err.message.replace(/\s/g, ' ');

        if (type == 1) {
            await toast.error(data, toastConfig);
            setAlertFlag(!alertFlag);
        }
        if (type == 2) {
            await toast.success(err, toastConfig);
        }

        setStake(false);
    }

    const handleSol = (event) => {
        setSolValue(event.target.value)
    }

    const getProvider = async () => {
        try {
            if (KNProgram == null) return;
            if (location.state == null) {
                navigate('/mywallet')
            } else {
                dispatch(setLoading(true));
                try {
                    const nftsss = await getParsedAccountByMint({
                        mintAddress: new PublicKey(location.state.nft_mint_address),
                        connection: connection,
                    });
                    const tempKeypair = anchor.web3.Keypair.generate();
                    const t = new Token(connection, new PublicKey(location.state.nft_mint_address), TOKEN_PROGRAM_ID, tempKeypair);
                    const ta = await t.getAccountInfo(new PublicKey(nftsss.pubkey))

                    let metadataPDA = await Metadata.getPDA(location.state.nft_mint_address);
                    let tokenMetadata = await Metadata.load(connection, metadataPDA);
                    let metadataExternal = (await axios.get(tokenMetadata.data.data.uri)).data;

                    let temp = {
                        splTokenInfo: ta,
                        metadataExternal: metadataExternal
                    };

                    setMetaData(temp);
                    let res = await checkIsListed(wallet.publicKey.toBase58(), location.state.nft_mint_address);

                    if (res) {
                        if (res.data.result !== null) {
                            setListedStatus(true);
                            setListedPrice(res.data.result.price);
                        } else {
                            setListedStatus(false);
                        }
                    }
                    else {
                        toast.error(LANG.ERR_WE_ARE_SORRY, toastConfig);
                    }
                    res = await getSaleHistory(location.state.nft_mint_address);
                    setSalesHistory([...res]);
                } catch (err) {
                    console.log(err)
                }
                dispatch(setLoading(false));
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        dispatch(setLoading(true));
    }, [])

    useEffect(() => {

        if (wallet && wallet.connected && !wallet.disconnecting) {
            getProvider();
        } else {
            dispatch(setLoading(false));
            navigate('/mywallet');
        }
    }, [wallet]);

    useEffect(async () => {
        let tempfrom = [];
        salesHistory.map((item) => tempfrom.push(false));
        setTipFrom([...tempfrom]);
        setTipTo([...tempfrom]);
    }, [salesHistory])

    useEffect(() => {
        if (type === 0) {
            setTitleOne("Not Staked");
            setTitleTwo("Stake");
        }
        if (type === 1) {
            setTitleOne("Not Staked");
            setTitleTwo("Stake");
        }
        if (type === 2) {
            setTitleOne("Staked");
            setTitleTwo("Staked");
        }

    }, [type]);


    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const onFullScreenClose = () => {
        setFullScreen(false);
    }

    const onFullScreenImage = () => {
        setFullScreen(true);
    }

    const copyFrom = (index, value) => {
        copy(value);
        tipFromOpen(index);
    }

    const copyValue = (value, index) => {
        copy(value);
    }

    const copyTo = (index, value) => {
        copy(value);
        tipToOpen(index);
    }

    const onSolscan = (url) => {
        let home = "https://explorer.solana.com/tx/" + url;
        window.open(home);
    }

    const onStake = () => {
        if (poolNftStaked == false) {
            stakeNftToPool(0);
        }
        if (type === 2) {
            setStake(true);
        }
    }

    const handleListNft = async () => {
        if (AHProgram == null) return;
        if (ReduxAhIdl == null) return;
        if (wallet == null) return;
        if (wallet.publicKey == null) return;
        if (parseFloat(solValue) <= 0) return;
        dispatch(setLoading(true));
        try {
            let mint = location.state.nft_mint_address;
            let listInfo = {
                "nft_mint_address": mint,
                "price": solValue,
                "user": wallet.publicKey.toBase58()
            }
            // List Nft transaction
            let info = await serializeSellTransaction(listInfo);
            if (info === null || info.instruction === null) {
                dispatch(setLoading(false));
                toast.error(LANG.ERR_WE_ARE_SORRY, toastConfig);
                return;
            }

            // deserialize transaction made in NFT server
            const tx = web3.Transaction.from(info.instruction);

            await wallet.signTransaction(tx);

            const ret = await listNftToMarket({
                reservedOrderNumber: info.reservedOrderNumber,
                tx: [...new Uint8Array(tx.serialize())]
            });
            if (ret !== null) {
                toast.success(LANG.MSG_NFT_HAS_BEEN_LISTED_SUCCESSFULLY);
            }
            else {
                toast.error(LANG.ERR_WE_ARE_SORRY, toastConfig);
            }
        } catch (error) {
            console.log(error)
            dispatch(setLoading(false));
            let error_code = 0;
            let data = error.message.replace(/\s/g, '');
            let tmparray = data.split(':');
            let index = tmparray.indexOf("customprogramerror");
            if (index != -1) {
                error_code = tmparray[index + 1];
            }
            error_code = Number(error_code);
            let error_index;
            error_index = ReduxAhIdl.errors.findIndex(item => item.code == error_code);
            if (error_index == -1) {
                toast.error(LANG.ERR_WE_ARE_SORRY, toastConfig);
            } else {
                toast.error(errorData[error_index].msg, toastConfig);
            }
        }
        let res = await checkIsListed(wallet.publicKey.toBase58(), location.state.nft_mint_address);

        if (res) {
            if (res.data.result !== null) {
                setSolValue(0);
                setListedStatus(true);
                setListedPrice(res.data.result.price);
            } else {
                setListedStatus(false);
            }
        }
        dispatch(setLoading(false));
    }

    const handleUnlistNft = async () => {
        if (AHProgram == null) return;
        if (ReduxAhIdl == null) return;
        if (wallet == null) return;
        if (wallet.publicKey == null) return;
        if (parseFloat(listedPrice) <= 0) return;
        dispatch(setLoading(true));
        try {
            let mint = location.state.nft_mint_address;
            let listInfo = {
                "nft_mint_address": mint,
                "price": listedPrice,
                "seller": wallet.publicKey.toBase58()
            }
            // List Nft transaction
            let info = await serializeUnlistTransaction(listInfo);
            if (info === null || info.instruction === null) {
                dispatch(setLoading(false));
                toast.error(LANG.ERR_WE_ARE_SORRY, toastConfig);
                return;
            }

            // deserialize transaction made in NFT server
            const tx = web3.Transaction.from(info.instruction);

            await wallet.signTransaction(tx);

            const ret = await unlistFromMarket({
                reservedOrderNumber: info.reservedOrderNumber,
                tx: [...new Uint8Array(tx.serialize())]
            });

            if (ret !== null) {
                toast.success(LANG.MSG_NFT_HAS_BEEN_UNLISTED_SUCCESSFULLY);
            } else {
                toast.error(LANG.ERR_WE_ARE_SORRY, toastConfig);
            }
        } catch (error) {
            console.log(error)
            dispatch(setLoading(false));
            let error_code = 0;
            let data = error.message.replace(/\s/g, '');
            let tmparray = data.split(':');
            let index = tmparray.indexOf("customprogramerror");
            if (index != -1) {
                error_code = tmparray[index + 1];
            }
            error_code = Number(error_code);
            let error_index;
            error_index = ReduxAhIdl.errors.findIndex(item => item.code == error_code);
            if (error_index == -1) {
                toast.error(LANG.ERR_WE_ARE_SORRY, toastConfig);
            } else {
                toast.error(errorData[error_index].msg, toastConfig);
            }
        }
        let res = await checkIsListed(wallet.publicKey.toBase58(), location.state.nft_mint_address);

        if (res) {
            if (res.data.result !== null) {
                setListedStatus(true);
                setListedPrice(res.data.result.price);
            } else {
                setListedStatus(false);
            }
        }
        dispatch(setLoading(false));
    }

    const stakeNftToPool = async (index) => {
        dispatch(setLoading(true))
        try {
            const [pda, bump_sns] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(anchor.utils.bytes.utf8.encode("SNS"))],
                stakeProgram.programId
            );
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

            let stakes = await stakeProgram.account.stakeAccount.fetch(stakeAccount);

            const metas = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
            let nftTokenAccount = await findAssociatedTokenAddress(wallet.publicKey, new anchor.web3.PublicKey(location.state.nft_mint_address));
            const userTokenAccount = new anchor.web3.PublicKey(nftTokenAccount.toBase58());
            const tokenAddress = new anchor.web3.PublicKey(location.state.nft_mint_address);
            let pdaToken = await createTokenAccount(provider, tokenAddress, pda);
            let [tokenMetadata, _bs] = await anchor.web3.PublicKey.findProgramAddress(
                [
                    Buffer.from("metadata"),
                    metas.toBuffer(),
                    tokenAddress.toBuffer()
                ],
                metas
            );
            await stakeProgram.rpc.poolNftStake(
                {
                    accounts: {
                        stakeAccount,
                        authority: wallet.publicKey,
                        userTokenAccount,
                        tokenMetadata,
                        poolSetting,
                        pdaToken,
                        pda,
                        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
                        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
                    }
                });
        } catch (err) {
            console.log(err);
            setError(1, err);
        }
    }
    return (
        <Box className={classes.detailContent}>
            <ToastContainer />
            <Box className={classes.backIcon}>
                <Button className={classes.backBtn} onClick={() => navigate('/mywallet')}>
                    <LeftArrow /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Typography className={classes.backTitle} > Get back</Typography>
                </Button>
            </Box>
            {metadata != null && <Box className={classes.mainContent}>
                {/* <Box className={classes.leftSection}> */}
                {/* <Box className={classes.collectionSection}> */}
                <Box className={classes.itemList}>
                    <Box className={classes.card}>
                        <LazyLoadImage placeholderSrc={LazyLoader} effect="opacity" onClick={onFullScreenImage} src={metadata.metadataExternal.image} alt="collection" className={classes.imageCard} />
                    </Box>
                </Box>
                {/* </Box> */}
                {/* </Box> */}
                <Box className={classes.rightSection}>
                    <Box className={classes.card1}>
                        <Box className={classes.content}>
                            <Box className={classes.contentTitle}>
                                <Box className={classes.tag}>{metadata.metadataExternal.collection.name}</Box>
                                <Typography className={classes.title}>{metadata.metadataExternal.name}</Typography>
                                <Typography className={classes.creatorTitle}> {metadata.metadataExternal.description} </Typography>
                                {/* <Typography className={classes.creatorText}> @custom_person </Typography> */}
                            </Box>
                            <Box className={classes.listItem}>
                                <Box sx={{ mb: 2, mr: 3 }} className={classes.card2}>
                                    <Typography className={classes.title2} sx={{ width: '100%' }}>{isListed ? 'Listed' : 'Not Listed'} </Typography>
                                    <Box className={classes.content2}>
                                        {!isListed ?
                                            <Box sx={{ display: 'flex', width: '100%', pr: 2 }}>
                                                <FormControl variant="outlined" sx={{ width: '100%', height: '48px', paddingLeft: 0, }}>
                                                    <OutlinedInput
                                                        id="outlined-adornment-weight"
                                                        placeholder="List Price(SOL)"
                                                        // value={solValue}
                                                        onChange={handleSol}
                                                        // endAdornment={<InputAdornment position="end" className={classes.outLinedInput}>sol</InputAdornment>}
                                                        aria-describedby="outlined-weight-helper-text"
                                                        inputProps={{
                                                            'aria-label': 'weight',
                                                        }}
                                                        type="number"
                                                        sx={{ background: '#37334a', borderRadius: '10px !important', "& .MuiOutlinedInput-notchedOutline": { borderColor: '#37334a' }, "& .MuiOutlinedInput-input": { height: '16px' } }}
                                                    // InputLabelProps={{shrink: true,}}
                                                    />
                                                </FormControl>
                                            </Box> :
                                            <Box sx={{ width: '100%', pr: 2, }}>
                                                <Box sx={{ background: '#37334a', width: '100%', borderRadius: '10px !important', height: '48px', display: 'flex', alignItems: 'center' }}>
                                                    <Typography className={classes.title3} sx={{ width: '100%' }}>{listedPrice} SOL</Typography>
                                                </Box>
                                            </Box>
                                        }
                                        <Button disabled={false} className={!isListed ? classes.listButton : classes.unlistButton} onClick={isListed ? handleUnlistNft : handleListNft}>{isListed ? `UnList Now` : `List Now`}</Button>
                                    </Box>
                                    <Typography sx={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', mt: 3 }}> By clicking List Now you agree to <Link onClick={handleOpen} sx={{ color: 'white', textDecorationColor: 'white', cursor: 'pointer' }}>Terms&nbsp;of&nbsp;Service</Link></Typography>
                                </Box>
                                <Box sx={{ mb: 2 }} className={classes.card3}>
                                    <Typography sx={{ display: 'flex', justifyContent: 'center' }} className={classes.title2}>{titleOne}</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        {/* <Button sx={{ color: 'white' }} disabled={type === 1 ? true : false} className={type === 1 ? classes.detailsButtonDis : classes.detailsButtonEna} onClick={onStake}>{titleTwo}</Button> */}
                                        <Button sx={{ color: 'white' }} disabled={true} className={type === 1 ? classes.detailsButtonDis : classes.detailsButtonEna} onClick={null}>Stake</Button>
                                    </Box>
                                    <Typography sx={{ mt: 3, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}> Read more about &nbsp;<Link sx={{ color: 'white', textDecorationColor: 'white', cursor: 'pointer' }}>Staking</Link> </Typography>
                                </Box>
                            </Box>
                            <Accordion className={classes.accordion} defaultExpanded={true} >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon className={classes.expandIcon} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography className={classes.accordionTitle}> Attributes </Typography>
                                </AccordionSummary>
                                <AccordionDetails className={classes.accordionDetails}>
                                {(metadata.metadataExternal.attributes.length != 0 && tipAttr.length !== 0) &&
                                    <Grid container spacing={1}>
                                        {metadata.metadataExternal.attributes.map((element, index) =>
                                            <Grid item xl={(metadata.metadataExternal.attributes.length == 1 ? 1 : 0 || index == 0 ? 1 : 0) == 1 ? 12 : 4} lg={(metadata.metadataExternal.attributes.length == 1 ? 1 : 0 || index == 0 ? 1 : 0) == 1 ? 12 : 4} sm={(metadata.metadataExternal.attributes.length == 1 ? 1 : 0 || index == 0 ? 1 : 0) == 1 ? 12 : 6} xs={12} key={index}>
                                                <ClickAwayListener onClickAway={() => tipAttrClose(index)}>
                                                    <div>
                                                        <Tooltip
                                                            PopperProps={{
                                                                disablePortal: true,
                                                            }}
                                                            onClose={() => tipAttrClose(index)}
                                                            open={tipAttr[index]}
                                                            disableFocusListener
                                                            disableHoverListener
                                                            disableTouchListener
                                                            title="Copied"
                                                        >
                                                            <Box onClick={() => copyAttr(index, element.value)} className={classes.propertiesDiv} key={index}>
                                                                <Typography className={classes.detailTitle}> {element.trait_type} </Typography>
                                                                <Typography onClick={() => copyAttr(element.value, index)} className={classes.detailText}> {element.value} </Typography>
                                                            </Box>
                                                        </Tooltip>
                                                    </div>
                                                </ClickAwayListener>
                                            </Grid>
                                        )}
                                    </Grid> 
                                }
                                </AccordionDetails>
                            </Accordion>
                            <Accordion className={classes.accordion} defaultExpanded={true}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon className={classes.expandIcon} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography className={classes.accordionTitle}> Details </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box className={classes.detailDiv}>
                                        <Typography className={classes.detailText}> Mint address </Typography>
                                        <Typography className={classes.detailTitle}> {metadata.splTokenInfo.mint.toBase58()} </Typography>
                                    </Box>
                                    <Box className={classes.detailDiv}>
                                        <Typography className={classes.detailText}> Token address </Typography>
                                        <Typography className={classes.detailTitle}> {metadata.splTokenInfo.address.toBase58()} </Typography>
                                    </Box>
                                    <Box className={classes.detailDiv}>
                                        <Typography className={classes.detailText}> Owner </Typography>
                                        <Typography className={classes.detailTitle}> {metadata.splTokenInfo.owner.toBase58()} </Typography>
                                    </Box>
                                    <Box className={classes.detailDiv}>
                                        <Typography className={classes.detailText}> Artist Royalties </Typography>
                                        <Typography className={classes.detailTitle}> {metadata.metadataExternal.seller_fee_basis_points / 100}% </Typography>
                                    </Box>
                                    <Box className={classes.detailDiv}>
                                        <Typography className={classes.detailText}> Transaction Fee </Typography>
                                        <Typography className={classes.detailTitle}> 0% </Typography>
                                    </Box>
                                    <Box className={classes.detailDiv}>
                                        <Typography className={classes.detailText}> Listing/Biding/Cancel </Typography>
                                        <Typography className={classes.detailTitle}> Free </Typography>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion className={classes.accordion} defaultExpanded={true}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon className={classes.expandIcon} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography className={classes.accordionTitle}> Sales history </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <TableContainer className={classes.salesTable} >
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>PRICE</TableCell>
                                                    <TableCell className={classes.centerCell}>FROM</TableCell>
                                                    <TableCell className={classes.centerCell}>TO</TableCell>
                                                    <TableCell className={classes.centerCell}>TxID</TableCell>
                                                    <TableCell align='right'>TIME</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            {(salesHistory.length !== 0 && tipTo.length !== 0) &&
                                            <TableBody>
                                                {salesHistory.map((row, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell component="th" scope="row">{row.price} SOL</TableCell>
                                                        <TableCell sx={{ cursor: 'pointer', color: '#6E56F8 !important' }} >
                                                            <ClickAwayListener onClickAway={() => tipFromClose(index)}>
                                                                <div>
                                                                    <Tooltip
                                                                        PopperProps={{
                                                                            disablePortal: true,
                                                                        }}
                                                                        onClose={() => tipFromClose(index)}
                                                                        open={tipFrom[index]}
                                                                        disableFocusListener
                                                                        disableHoverListener
                                                                        disableTouchListener
                                                                        title="Copied"
                                                                    >
                                                                        <Button className={classes.btnTo} onClick={() => copyFrom(index, row.seller_wallet_address)} >{shortenAddress(row.seller_wallet_address)}</Button>
                                                                    </Tooltip>
                                                                </div>
                                                            </ClickAwayListener>
                                                        </TableCell>
                                                        <TableCell align='left' sx={{ cursor: 'pointer', color: '#6E56F8 !important' }} >
                                                            <ClickAwayListener onClickAway={() => tipToClose(index)}>
                                                                <div>
                                                                    <Tooltip
                                                                        PopperProps={{
                                                                            disablePortal: true,
                                                                        }}
                                                                        onClose={() => tipToClose(index)}
                                                                        open={tipTo[index]}
                                                                        disableFocusListener
                                                                        disableHoverListener
                                                                        disableTouchListener
                                                                        title="Copied"
                                                                    >
                                                                        <Button className={classes.btnTo} onClick={() => copyTo(index, row.buyer_wallet_address)} >{shortenAddress(row.buyer_wallet_address)}</Button>
                                                                    </Tooltip>
                                                                </div>
                                                            </ClickAwayListener>
                                                        </TableCell>
                                                        <TableCell sx={{ cursor: 'pointer', color: '#6E56F8 !important' }} onClick={() => onSolscan(row.transaction_id)}>{shortenAddress(row.transaction_id)}</TableCell>
                                                        <TableCell className={classes.rightCell}>{shortenTime(row.sale_date)}</TableCell>
                                                    </TableRow>
                                                ))
                                                }
                                            </TableBody>
                                        }
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </Box>
                </Box>
            </Box>}
            {
                fullscreen && <Lightbox medium={metadata.metadataExternal.image} large={metadata.metadataExternal.image}
                    hideZoom={false} showRotate={true}
                    onClose={onFullScreenClose}
                />
            }
            {<AddStakeModal open={stake} program={stakeProgram} warn={setError} onClose={() => setStake(false)} />}
            <Dialog
                className={classes.detailModal}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{ position: 'absolute', right: 10, top: 10, display: 'flex', justifyContent: 'flex-end' }}>
                    <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                </Box>
                <Box className={classes.termText}>
                    <HtmlFile />
                </Box>
            </Dialog>
        </Box>
    );
}

export default Detail;