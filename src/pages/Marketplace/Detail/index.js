import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import {
    Button, Box, Typography, Stack,
    Dialog,
    DialogContent,
    IconButton,
    Grid,
    ClickAwayListener, Accordion, AccordionSummary, AccordionDetails, TextField, FormControl, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, tableCellClasses, Tooltip
} from '@mui/material';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import { getParsedNftAccountsByOwner, isValidSolanaAddress, createConnectionConfig, getParsedAccountByMint } from "@nfteyez/sol-rayz";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { WalletModalButton } from '@solana/wallet-adapter-react-ui';
import KanonColorButton from '../../../components/Common/KanonColorButton';
import { ChildCare } from '@mui/icons-material';
import { KanonProgramAdapter } from 'kanon-marketplace-sdk';
import LazyLoader from '../../../assets/loader.png';
import { Connection } from '@solana/web3.js';
import { Keypair, PublicKey } from '@solana/web3.js';
import { AccountInfo, MintInfo, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import axios from "axios";
import { Metadata, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import * as anchor from '@project-serum/anchor';
import { Program, Provider, BN, web3 } from '@project-serum/anchor';
import { setLoading } from '../../../redux/ducks/main';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useMediaQuery } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    serializeBuyTransaction, buyNFT, checkIsListed, getSaleHistory, shortenTime, shortenAddress, EstHistoryTime
} from '../../../utils/helper';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import * as LANG from "../../../utils/constants";
import { errorData, toastConfig } from '../../../components/Common/StaticData';
import { height } from '@mui/system';

const propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    item: PropTypes.object,
};
const { REACT_APP_SERVER_URL, REACT_APP_PUBLIC_NETWORK, REACT_APP_ENDPOINT } = process.env;
const opts = {
    preflightCommitment: "processed"
}
const connection = new Connection(
    REACT_APP_ENDPOINT, opts.preflightCommitment
);


const useStyles = makeStyles((theme) => ({
    detailModal: {
        fontFamily: 'Klavika',
        display: 'flex',
        justifyContent: 'center',
        zIndex: '1000 !important',

        "& .MuiDialog-paper": {
            background: ` linear-gradient(
                135deg,
                rgba(245, 247, 250, 0.12) 0%,
                rgba(245, 247, 250, 0.06) 51.58%,
                rgba(245, 247, 250, 0.0001) 98.94%
            )`,
            border: '1px solid rgba(245, 247, 250, 0.06)',
            boxSizing: 'border-box',
            boxShadow: ` 0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04),
                8px 8px 24px rgba(20, 16, 41, 0.4)`,
            backdropFilter: 'blur(108.731px)',
            borderRadius: 24,
            width: '1070px',
            height: '548px',
            ['@media (max-width : 1400px)']: {
                width: 'auto',
            },
            [theme.breakpoints.down('lg')]: {
                width: 'auto',
                marginLeft: '30px !important'
            },
            [theme.breakpoints.down('md')]: {
                width: 'auto',
                height: 'auto',
                marginLeft: '20px !important',
                marginRight: '20px !important',
            },
            [theme.breakpoints.down('sm')]: {
                width: '100%',
                height: '85%',
                marginTop: '200px',
                padding: 0,
            }
        },
        "& .MuiDialog-container": {
            width: '100%',
        },
        "& .MuiPaper-root>:nth-Child(0)": {
            paddingTop: 40
        }
    },
    rightCell: {
        align: 'right !important',
        textAlign: 'right !important'
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
    btnTip: {
        padding: '0px !important',
        fontSize: '12px',
        color: '#FFFFFF !important',
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
            minWidth: '0px !important'
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
    imageContent: {
        display: 'flex !important',
        justifyContent: 'center',
        alignItems: 'center',
        width: '426px',
        height: '426px',
        [theme.breakpoints.down('lg')]: {
            display: 'flex !important',
            alignItems: 'center',
            marginTop: '40px',
            width: '350px !important',
            height: '350px !important',
        },
        [theme.breakpoints.down('md')]: {
            display: 'flex !important',
            justifyContent: 'center',
            width: '420px !important',
            height: '420px !important',
        },
        [theme.breakpoints.down('sm')]: {
            width: '300px !important',
            height: '300px !important',
            marginBottom: '50px'
        },
        '& span': {
            width: '420px',
            height: '420px',
            marginBottom: '5px',
            borderRadius: '12px',
            [theme.breakpoints.down('lg')]: {
                width: '350px !important',
                height: '350px !important',
            },
            [theme.breakpoints.down('md')]: {
                display: 'flex !important',
                justifyContent: 'center',
                width: '420px !important',
                height: '420px !important',
                // marginBottom : '50px'
            },
            [theme.breakpoints.down('sm')]: {
                width: '300px !important',
                height: '300px !important',
                marginBottom: '50px'
            },
        }
        // minWidth : '500px'
    },
    contextContent: {
        display: 'flex',
        justifyContent: 'center',
        width: '600px',
        [theme.breakpoints.up('md')]: {
            overflowY: 'auto',
        },
        [theme.breakpoints.down('lg')]: {
            width: '440px !important',
        },
        [theme.breakpoints.down('md')]: {
            width: '450px !important',
            marginTop: '20px',
        },
        [theme.breakpoints.down('sm')]: {
            width: '350px !important',
        },
        "&::-webkit-scrollbar": {
            width: '4px !important',
            marginTop: '20px !important',
            marginBottom: '20px !important',
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
    detailModalContent: {
        paddingBottom: '60px !important',
        paddingTop: '60px !important',
        paddingLeft: '40px !important',
        paddingRight: '40px !important',
        display: 'flex',
        [theme.breakpoints.down('lg')]: {
            marginLeft: '5px',
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '5px',
            overflowY: 'auto',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
        },
        [theme.breakpoints.down('sm')]: {
        },

    },
    closeButton: {
        position: 'absolute !important',
        top: 16.,
        right: 16,

        "& .MuiSvgIcon-root": {
            color: 'rgba(224, 224, 255, 0.24)'
        }
    },
    image: {
        width: 420,
        height: 420,
        borderRadius: '12px',
        [theme.breakpoints.down('lg')]: {
            width: 350,
            height: 350,
        },
        [theme.breakpoints.down('md')]: {
            marginBottom: 20,
        },
    },
    content: {
        marginLeft: 40,
        [theme.breakpoints.down('md')]: {
            marginLeft: 0,
            marginBottom: 50,
        }
    },
    title: {
        wordBreak: 'break-word',
        fontSize: "25px !important",
        marginTop: "5px !important",
        color: "white",
        fontWeight: "bold !important",
    },
    tag: {
        width: "fit-content",
        fontSize: "13px !important",
        color: "white",
        background: "#2d61e5",
        borderRadius: "12px",
        padding: "4px 8px"
    },
    creatorText: {
        fontWeight: '500 !important',
        fontSize: '16px !important',
        lineHeight: 20,
        letterSpacing: '-0.4px',
        color: '#ffffff',
    },
    creatorTitle: {
        fontSize: "13px !important",
        lineHeight: "16px !important",
        color: "rgba(255, 255, 255, 0.6)",
        marginTop: '10px !important',
        marginBottom: '10px !important',
    },
    buyDiv: {
        width: "250px",
        height: "96px",
        background: "rgba(224, 224, 255, 0.02)",
        borderRadius: "12px",
        display: "flex",
        position: "relative",
        justifyContent: "space-between",
        marginTop: "30px",
        marginBottom: '30px',
        [theme.breakpoints.down('md')]: {
            marginTop: 50,
        },
        [theme.breakpoints.down('sm')]: {
            width: "250px",
        }
    },
    priceDiv: {
        margin: 24,
    },
    priceTitle: {
        fontWeight: "500",
        fontSize: "13px !important",
        lineHeight: "16px !important",
        color: "rgba(255, 255, 255, 0.6)"
    },
    priceText: {
        fontWeight: "700",
        fontSize: "20px !important",
        lineHeight: "20px !important",
        letterSpacing: "-0.4px !important",
        color: "white",
    },
    buyButton: {
        position: "absolute",
        top: "24px",
        right: "16px",
        left: "-12px"
    },
    buyButtonDis: {
        position: "absolute",
        top: "24px",
        right: "16px",
        left: "-12px",
        cursor: "none !important",
        color: "grey !important",
    },
    accordion: {
        background: 'rgba(224, 224, 255, 0.02) !important',
        borderRadius: '12px !important',
        boxShadow: 'none !important',
        position: 'unset !important',
        width: '500px !important',
        margin: '0px !important',
        marginTop: '10px !important',
        [theme.breakpoints.down('lg')]: {
            width: '320px !important',
        },
        [theme.breakpoints.down('md')]: {
            width: '420px !important',
        },
        [theme.breakpoints.down('sm')]: {
            width: '320px !important',
        },
        "&::before": {
            content: 'none !important'
        }
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
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '90%',
        marginRight: '12px !important'
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
    propertiesDiv: {
        cursor: 'pointer',
        background: 'rgba(224, 224, 255, 0.02)',
        borderRadius: '12px',
        padding: '24px 24px',
        marginBottom: '10px'
    },
    connectBtn: {
        width: "250px",
        height: "60px",
        margin: '10px !important',
        fontSize: '22px !important'
    },
    buyDivDis: {
        width: "180px",
        height: "80px",
        background: "rgba(224, 224, 255, 0.02)",
        borderRadius: "12px",
        display: "flex",
        position: "relative",
        justifyContent: "space-between",
        marginTop: "30px",
        marginBottom: '30px',
        [theme.breakpoints.down('md')]: {
            marginTop: 50,
        },
        [theme.breakpoints.down('sm')]: {
            width: "250px",
        }
    },
    connectButton: {
        width: '160px !important',
        height: '60px !important',
        margin: '10px !important',
        fontSize: '16px !important',
        color: 'white !important',
        textTransform: 'none !important',
        textAlign: 'center',
        background: `linear-gradient(135deg, #2d61e5 0%, #8a62f6 53.09%, #e3477e 100%) !important`,
        boxShadow: `0px 0px 1px rgba(45, 97, 229, 0.24), 0px 2px 4px -1px rgba(10, 70, 82, 0.12),
            0px 16px 24px rgba(45, 97, 229, 0.24), 0px 8px 8px -4px rgba(45, 97, 229, 0.12) !important`,
        borderRadius: `12px !important`,
    },
}));

const DetailModal = ({ open, onClose, item, program, updatePage }) => {

    const classes = useStyles();
    const isXs = useMediaQuery("(min-width:600px)");
    const [metadata, setMetadata] = useState(null);
    const dispatch = useDispatch();
    const [salesHistory, setSalesHistory] = useState([]);
    const wallet = useSelector(state => state.main.wallet);
    const provider = useSelector(state => state.main.provider);
    const AHProgram = useSelector(state => state.main.AHProgram);
    const ReduxAhIdl = useSelector(state => state.main.ReduxAhIdl);
    const [tipFrom, setTipFrom] = useState([]);
    const [tipTo, setTipTo] = useState([]);
    const [tipAttr, setTipAttr] = useState([]);
    const [walletFlag, setWalletFlag] = useState(false);
    const [disableBuy, setDisableBuy] = useState(true);

    useEffect(async () => {
        if (open == false) {
            setMetadata(null);
            return;
        }
        if (wallet && wallet.connected && !wallet.disconnecting) {
            if(item.seller_wallet_address == wallet.publicKey.toBase58())
            {
                setDisableBuy(true);
            }
            else
            {
                setDisableBuy(false);
            }
            setWalletFlag(true);
        }
        else {
            setWalletFlag(false);
        }

        dispatch(setLoading(true))

        try {
            const nftsss = await getParsedAccountByMint({
                mintAddress: new PublicKey(item.nft_mint_address),
                connection: connection,
            });
            const tempKeypair = anchor.web3.Keypair.generate();
            const t = new Token(connection, new PublicKey(item.nft_mint_address), TOKEN_PROGRAM_ID, tempKeypair);
            const ta = await t.getAccountInfo(new PublicKey(nftsss.pubkey))

            let metadataPDA = await Metadata.getPDA(item.nft_mint_address);
            let tokenMetadata = await Metadata.load(connection, metadataPDA);
            let metadataExternal = (await axios.get(tokenMetadata.data.data.uri)).data;

            let temp = {
                splTokenInfo: ta,
                metadataExternal: metadataExternal
            };

            setMetadata(temp);
            dispatch(setLoading(false));
            let res = await getSaleHistory(item.nft_mint_address);
            setSalesHistory([...res]);

            if(item.seller_wallet_address == wallet.publicKey.toBase58())
            {
                setDisableBuy(true);
            }
            else
            {
                setDisableBuy(false);
            }

            res = await checkIsListed(item.seller_wallet_address, item.nft_mint_address);
            if (res) {
                if (res.data.result.length === 0 || res.data.result == null) {
                    toast.error(LANG.ERR_ALREADY_SOLD, toastConfig);
                    updatePage();
                    onClose();
                    return;
                } else {
                }
            }

        } catch (err) {
            console.log(err)
        }
        dispatch(setLoading(false))
    }, [open]);

    useEffect(async () => {
        if (wallet && wallet.connected && !wallet.disconnecting) {
            if(item.seller_wallet_address == wallet.publicKey.toBase58())
                setDisableBuy(true);
            else
                setDisableBuy(false);

            setWalletFlag(true);
        }
        else {
            setWalletFlag(false);
        }
    }, [wallet])
    const copyFrom = (index, value) => {
        copy(value);
        tipFromOpen(index);
    }

    const copyTo = (index, value) => {
        copy(value);
        tipToOpen(index);
    }

    const copyAttr = (index, value) => {
        copy(value);
        tipAttrOpen(index);
    }

    const onSolscan = (url) => {
        let home = "https://explorer.solana.com/tx/" + url;
        window.open(home);
    }

    useEffect(async () => {
        let tempfrom = [];
        salesHistory.map((item) => tempfrom.push(false));
        setTipFrom([...tempfrom]);
        setTipTo([...tempfrom]);
    }, [salesHistory])

    useEffect(async () => {
        let tempfrom = [];
        if (metadata != null) {
            metadata.metadataExternal.attributes.map((item) => tempfrom.push(false));
        }
        setTipAttr([...tempfrom]);
    }, [metadata])

    const handleBuyNFT = async () => {
        if (AHProgram == null) return;
        if (ReduxAhIdl == null) return;
        if (wallet == null) return;
        if (wallet.publicKey == null) return;
        if (parseFloat(item.price) <= 0) return;
        dispatch(setLoading(true));
        try {

            let listInfo = {
                "nft_mint_address": item.nft_mint_address,
                "price": item.price,
                "seller": item.seller_wallet_address,
                "buyer": wallet.publicKey.toBase58()
            }
            // List Nft transaction
            let info = await serializeBuyTransaction(listInfo);
            if (info === null || info.instruction === null) {
                dispatch(setLoading(false));
                toast.error(LANG.ERR_WE_ARE_SORRY, toastConfig);
                return;
            }

            // deserialize transaction made in NFT server
            const tx = web3.Transaction.from(info.instruction);

            await wallet.signTransaction(tx);

            const ret = await buyNFT({
                reservedOfferNumber: info.reservedOfferNumber,
                tx: [...new Uint8Array(tx.serialize())],
                buyer: wallet.publicKey.toBase58()
            });
            if (ret !== null) {
                toast.success(LANG.MSG_NFT_HAS_BEEN_TRANSFERED_SUCCESSFULLY);
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
        updatePage();
        onClose();
        dispatch(setLoading(false));
    }

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
    /* create an account  */
    return (
        <Dialog
            className={classes.detailModal}
            open={open}
            onClose={onClose}
            fullScreen={!isXs}
            maxWidth={'100%'}

        >
            {metadata != null && <DialogContent className={classes.detailModalContent}>
                <IconButton onClick={onClose} aria-label="close" className={classes.closeButton}>
                    <CloseIcon color={'white'} />
                </IconButton>
                <Box className={classes.imageContent}>
                    <LazyLoadImage effect="opacity" placeholderSrc={`data:image/png;base64,${item.thumbnail}`} src={metadata.metadataExternal.image.toString()} alt="collection" className={classes.image} />
                </Box>
                <Box className={classes.contextContent}>
                    <Box className={classes.content}>
                        <Typography className={classes.tag}>{metadata.metadataExternal.collection.name}</Typography>
                        <Typography className={classes.title}>{metadata.metadataExternal.name.toString()}</Typography>
                        <Typography className={classes.creatorTitle}>{metadata.metadataExternal.description}</Typography>
                        {
                            walletFlag == true && 
                            <Box className={classes.buyDiv}>
                                <Stack direction="column" sx={{ marginTop: "12px", marginLeft: "24px" }}>
                                    <Typography className={classes.creatorTitle}>Price</Typography>
                                    <Typography className={classes.priceText}>{item.price} SOL</Typography>
                                </Stack>
                                {
                                    <KanonColorButton className={ classes.buyButton} disabled = { disableBuy }onClick={() => handleBuyNFT()}>Buy NFT</KanonColorButton>
                                }
                            </Box>
                        }
                        {
                            walletFlag == false && 
                            <Box className={classes.buyDivDis}>
                                <WalletModalButton className={classes.connectButton}>Connect wallet</WalletModalButton>
                            </Box>
                        }
                        <Box>
                            <Accordion className={classes.accordion} >
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
                                                                    <Typography className={classes.detailText}> {element.value} </Typography>
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
                            <Accordion className={classes.accordion} >
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
                                    <TableContainer className={classes.salesTable}>
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell align='left'>PRICE</TableCell>
                                                    <TableCell align='left'>FROM</TableCell>
                                                    <TableCell align='left'>TO</TableCell>
                                                    <TableCell align='left'>TxID</TableCell>
                                                    <TableCell align='right'>TIME</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            {(salesHistory.length !== 0 && tipTo.length !== 0) &&
                                                <TableBody>
                                                    {salesHistory.map((row, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell >{row.price} SOL</TableCell>
                                                            <TableCell sx={{ cursor: 'pointer' }} >
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
                                                            <TableCell align='left' sx={{ cursor: 'pointer' }} >
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
                                                </TableBody>}
                                        </Table>
                                    </TableContainer>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>}
        </Dialog>
    );
}

export default DetailModal;