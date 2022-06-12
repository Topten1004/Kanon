import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import {
    Button, Box, Typography,
    Dialog,
    DialogContent,
    IconButton,
    useMediaQuery,
    CircularProgress,
    Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import { useWallet } from '@solana/wallet-adapter-react';
import { Program, Provider, BN, web3 } from '@project-serum/anchor';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Connection } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import { Metadata, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import KanonColorButton from '../../Common/KanonColorButton';
import { KanonProgramAdapter } from 'kanon-marketplace-sdk';
import axios from "axios";
import { setLoading } from '../../../redux/ducks/main';
import { ToastContainer, toast } from 'react-toastify';
import { AirdropPgSize, CallTime, getreservednftsbywallet, getreservednftproofbymintaddressandwallet, getthumbnailbymintaddresses } from '../../../utils/helper';
import clsx from 'clsx';
import * as anchor from '@project-serum/anchor';
import 'react-toastify/dist/ReactToastify.css';
import { NO_MORE_NFT, OUT_OF_NFTSAMOUNT, ERROR_CONDITION, errorData, toastConfig } from '../../Common/StaticData';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import LoaderImage from '../../../assets/loader.png';

const { REACT_APP_SERVER_URL, REACT_APP_PUBLIC_NETWORK, REACT_APP_ENDPOINT } = process.env;
const opts = {
    preflightCommitment: "processed"
}
const connection = new Connection(
    REACT_APP_ENDPOINT,
    opts.preflightCommitment
);

const useStyles = makeStyles((theme) => ({
    detailModal: {
        fontFamily: 'Klavika',
        // height: 'auto',
        height: '90vh',
        zIndex: '10000 !important',
        "& .MuiPaper-root": {
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
            [theme.breakpoints.down('md')]: {
                display: 'block',
            },
            [theme.breakpoints.down('sm')]: {
                display: 'block',
                marginTop: '200px !important',
            },
        },
        "& .MuiPaper-root>:nth-Child(0)": {
            paddingTop: 40
        },
        "& .MuiTouchRipple-root": {
            width: '0px !important',
            height: '0px !important',
        }
    },
    detailModalContent: {
        display: 'flex',
        overflowX: 'hidden',
        maxHeight: '430px',


        [theme.breakpoints.down('md')]: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxHeight: 'initial',

            // padding: "0px 0px !important"
        },

    },
    closeButtonDiv: {
        display: 'flex',
        justifyContent: 'flex-end',
        height: '50px',
        width: '100%',
        paddingTop: '10px',
        paddingRight: '25px',
        position: 'absolute',
        zIndex: 1000,
        [theme.breakpoints.down('sm')]: {
            // position: 'fixed',
            zIndex: 1000,
        }
    },
    closeButton: {

        "& .MuiSvgIcon-root": {
            color: 'rgba(224, 224, 255, 0.24)'

        },
        height: '40px !important',
    },
    itemContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            alignItems: 'flex-start',
        },
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'center',
            width: '80%',
        },
    },
    image: {
        width: 400,
        height: 400,
        borderRadius: 12,
        padding: 5,
        display: 'flex',
        [theme.breakpoints.down('lg')]: {
            width: 350,
            height: 350,
        },
        [theme.breakpoints.down('md')]: {
            width: 250,
            height: 250,
        },
        [theme.breakpoints.down('sm')]: {
            width: 300,
            height: 300,
        },
    },
    content: {
        paddingLeft: 40,
        paddingTop: 20,
        width: '350px',
        height: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
        "&::-webkit-scrollbar": {
            width: '6px',
            height: '6px',
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
        [theme.breakpoints.down('md')]: {
            width: '300px !important',
            "&::-webkit-scrollbar": {
                display: 'none',
            },
        },
        [theme.breakpoints.down('sm')]: {
            paddingLeft: 0
        },
    },
    title: {
        fontSize: "25px !important",
        marginTop: "16px !important",
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
    trait: {
        width: "fit-content",
        fontSize: "13px !important",
        color: "white",
        padding: "4px 4px"
    },
    attrValue: {
        width: "fit-content",
        fontSize: "12px !important",
        color: "rgba(255, 255, 255, 0.6)",
        padding: 4,
        paddingTop: 0,
        wordBreak: 'break-all',
        whiteSpace: 'normal',
    },
    creatorText: {
        fontWeight: '500 !important',
        fontSize: '20px !important',
        lineHeight: 24,
        marginTop: '10px !important',
        letterSpacing: '-0.4px',
        color: '#ffffff',
        [theme.breakpoints.down('md')]: {
            fontSize: "14px !important",
        },
    },
    creatorTitle: {
        fontSize: "13px !important",
        lineHeight: "16px !important",
        marginTop: '10px !important',
        color: "rgba(255, 255, 255, 0.6)",
        [theme.breakpoints.down('md')]: {
            fontSize: "10px !important",
        },
    },
    buyDiv: {
        width: "299px",
        marginTop: 60,
        marginBottom: 20,
        borderRadius: "12px",
        display: "flex",
        position: "relative",
        alignItems: 'center',
        justifyContent: 'center',
    },
    attribute: {
        flexWrap: 'wrap',
        display: 'flex',
    },
    attributeDiv: {
        height: 70,
        padding: 5,
        marginTop: '10px',
        marginBottom: '10px',
        marginRight: '10px',
        background: "rgba(224, 224, 255, 0.02)",
        borderRadius: "12px",
        wordBreak: 'break-all',
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
        fontWeight: "500",
        fontSize: "24px !important",
        lineHeight: "32px !important",
        letterSpacing: "-0.4px !important",
        color: "white"
    },
    buyButton: {
    },
    itemList: {
        width: 100,
        paddingTop: 5,
        height: 300,
        [theme.breakpoints.down('md')]: {
            "&::-webkit-scrollbar": {
                display: 'none',
            },
            width: '100%',
            height: 120,
            display: 'flex',
        },
        "&::-webkit-scrollbar": {
            height: '6px',
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
    itemList1: {
        marginTop: '45px',
        minWidth: '110px',
        marginBottom: 45,
        overflowY: 'auto',
        overflowX: 'hidden',
        [theme.breakpoints.down('md')]: {
            marginBottom: 20,
            marginTop: 30,
            width: '80%',
            height: '130px !important',
            display: 'flex',
            justifyContent: 'center',
            overflowY: 'hidden',
            overflowX: 'scroll',
        },
        "&::-webkit-scrollbar": {
            width: '6px',
            height: '6px',
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
    imageCardBtn: {
        width: 90,
        height: 90,
        borderRadius: 12,
        marginBottom: '10px !important',
        [theme.breakpoints.down('md')]: {
            margin: '10px 20px !important',
        },

    },
    imageCard: {
        width: 90,
        height: 90,
        // objectFit: 'cover',
        borderRadius: 12,
    },
    imageCardActive: {
        border: '1px solid #2D61E5 !important'
    },
    progressSection: {
        display: 'flex !important',
        width: '750px !important',
        justifyContent: 'center !important',
        alignItems: 'center !important',
    },
    accordion: {
        background: 'rgba(224, 224, 255, 0.02) !important',
        borderRadius: '12px !important',
        marginTop: 10,
        boxShadow: 'none !important',
        position: 'unset !important',
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
    },
}));

let interval;

const AddClaimModal = ({ open, onClose, setClaimFlag, setAirdropedList }) => {

    const [current, setCurrent] = useState(0);
    const isXs = useMediaQuery("(min-width:600px)");
    const { sendTransaction } = useWallet();

    const provider = useSelector(state => state.main.provider);
    const wallet = useSelector(state => state.main.wallet);
    const loading = useSelector(state => state.main.loading);
    const KNProgram = useSelector(state => state.main.KNProgram);

    // const [KNProgram, setProgram] = useState(null);
    const [nfttokens, setNftTokens] = useState([]);
    const dispatch = useDispatch();
    const [loadings, setLoadings] = useState(true);
    const [nfts, setNfts] = useState([]);
    const [alertFlag, setAlertFlag] = React.useState(false);

    // const interval = React.useRef();

    React.useEffect(() => {
        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(async () => {
        if (!open) {
            setCurrent(0);
            setNfts([]);
            setNftTokens([]);
            clearInterval(interval);
            return;
        }
        else {
            
            dispatch(setLoading(true));
            if (wallet && wallet.connected && !wallet.disconnecting) {
                let nfts = await getreservednftsbywallet(wallet.publicKey.toBase58());
                let temp = await KNProgram.getNFTsbyPDA();

                let real = [];
                nfts.filter((item) => {
                    if (temp.findIndex((val) => val.mint.toBase58() == item.nft_mint_address) != -1) {
                        real.push(item);
                        return true;
                    } else {
                        return false;
                    }
                });
                setNfts([...real]);
                dispatch(setLoading(false));
            }
        }
    }, [wallet, provider, open]);

    useEffect(async () => {
        if (nfts.length != 0) {
            setNftTokens([]);
            setLoadings(true);
            let mintaddress = [];
            let firstIndex = -1;
            let temp = [];
            nfts.map((item, index) => {
                mintaddress.push(item.nft_mint_address);
                let val = item;
                val.metadata = null;
                temp.push(val);
                if (index == 10 && firstIndex == -1) {
                    firstIndex = 10;
                }
                if (item.thumbnail == null && firstIndex == -1) {
                    firstIndex = index;
                }
            });
           
            let temval = temp.filter((item) => item.thumbnail != null);
            setNftTokens([...temval]);

            let showCount = -1;
            if(firstIndex != -1) {
                if (nfts.length > firstIndex) {
                    showCount++;
                    // const state = await program._program.account.globalAccount.fetch(program._global_state_account_pubkey);
                    const state = await KNProgram._program.account.globalAccount.fetch(KNProgram._global_state_account_pubkey);

                    let resdata = await getthumbnailbymintaddresses(state.seasonNumber, firstIndex, AirdropPgSize, mintaddress);
                    resdata.map((item) => {
                        let index = temp.findIndex((val) => val.nft_mint_address == item.nft_mint_address);
                        if (index != -1) {
                            temp[index].thumbnail = item.thumbnail
                        }
                    });
                    temval = temp.filter((item) => item.thumbnail != null);
                    setNftTokens([...temval]);
                    if ((firstIndex + AirdropPgSize) >= nfts.length) {
                        setLoadings(false);
                    } else {
                        interval = setInterval(async () => {
    
                            // const state = await program._program.account.globalAccount.fetch(program._global_state_account_pubkey);
                            const state = await KNProgram._program.account.globalAccount.fetch(KNProgram._global_state_account_pubkey);

                            showCount++;
                            getthumbnailbymintaddresses(state.seasonNumber, (firstIndex + showCount * AirdropPgSize), AirdropPgSize, mintaddress).then((resdata) => {
                                resdata.map((item) => {
                                    let index = temp.findIndex((val) => val.nft_mint_address == item.nft_mint_address);
                                    if (index != -1) {
                                        temp[index].thumbnail = item.thumbnail
                                    }
                                });
                                temval = temp.filter((item) => item.thumbnail != null);
                                setNftTokens([...temval]);
                                if ((firstIndex + (showCount + 1) * AirdropPgSize) >= nfts.length) {
                                    setLoadings(false)
                                }
                            });
                            if ((firstIndex + (showCount + 1) * AirdropPgSize) >= nfts.length) {
                                clearInterval(interval);
                            }
                        }, CallTime);
                    }
                    
                }
            } 
            
            else {
                setLoadings(false);
            }
            try {
                let metadataPDA = await Metadata.getPDA(temp[0].nft_mint_address);
                let tokenMetadata = await Metadata.load(connection, metadataPDA);
                let metadataExternal = (await axios.get(tokenMetadata.data.data.uri)).data;
                temval[0].metadata = metadataExternal;
            } catch(err){
                console.log(err);
                temval[0].metadata = null;
            }
            setNftTokens([...temval]);
        } else {
            setCurrent(0);
            setNftTokens([]);
            setLoadings(false);
            onClose();
        }
    }, [nfts])

    useEffect(async () => {
        if (nfttokens.length == 0) return;
        if (nfttokens[current].metadata != null) {
            return;
        } else {
            let metadataExternal;
            try{
                let metadataPDA = await Metadata.getPDA(nfttokens[current].nft_mint_address);
                let tokenMetadata = await Metadata.load(connection, metadataPDA);
                metadataExternal = (await axios.get(tokenMetadata.data.data.uri)).data;
            }catch(err) {
                console.log(err)
                metadataExternal = null;
            }
            let temp = [...nfttokens];
            temp[current].metadata = metadataExternal;
            setNftTokens([...temp]);
        }
    }
        , [current])

    const addClaim = async (event) => {
        const balance = await connection.getBalance(wallet.publicKey);
        if (balance == 0) {
            await toast.warn('The balance not enough now!', toastConfig);
            setAlertFlag(!alertFlag);
            return;
        }
        dispatch(setLoading(true))
        try {
            let proof = await getreservednftproofbymintaddressandwallet(wallet.publicKey.toBase58(), nfttokens[current].nft_mint_address);
            const tx = await KNProgram.claimAirdrop(proof[0].proof.map(x => Buffer.from(x.data)), nfttokens[current].nft_mint_address);
            let signature = await sendTransaction(tx, connection);
            const sx = await connection.confirmTransaction(signature, "processed");
            dispatch(setLoading(false))
            setClaimFlag()
            await toast.success('Successful!', toastConfig);
            setAlertFlag(!alertFlag);
            setAirdropedList(nfttokens[current]);
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
                    dispatch(setLoading(false))
                    await toast.error(ERROR_CONDITION, toastConfig);
                    setAlertFlag(!alertFlag);
                } else {
                    dispatch(setLoading(false))
                    await toast.error(errorData[n_index].msg, toastConfig);
                    setAlertFlag(!alertFlag);
                }
            }
        }

        onClose()
    }

    const Tag = ({ type }) => {
        return (<Box className={classes.tag} style={{ zIndex: 9 }}>{type}</Box>);
    }
    const classes = useStyles();
    /* create an account  */
    return (
        <Dialog
            className={classes.detailModal}
            open={open}
            onClose={() => {
                if (!loading) {
                    setCurrent(0);
                    setNfts([]);
                    setNftTokens([]);
                    onClose();
                    clearInterval(interval);
                }
            }}
            fullScreen={!isXs}
            maxWidth={'100%'}
            aria-labelledby="responsive-dialog-title"
        >
            <ToastContainer />
            <Box className={classes.closeButtonDiv}>
                <IconButton onClick={onClose} aria-label="close" className={classes.closeButton}>
                    <CloseIcon color={'white'} />
                </IconButton>
            </Box>
            {nfttokens.length != 0 && <DialogContent className={classes.detailModalContent}>

                <Box className={classes.itemList1}>
                    <Box className={classes.itemList}>
                        {nfttokens.map((val, index) =>
                            <Button className={classes.imageCardBtn} key={index} onClick={() => { setCurrent(index) }}>
                                <LazyLoadImage placeholderSrc={LoaderImage} effect="opacity" src={`data:image/png;base64,${val.thumbnail}`} alt="collection" className={clsx(classes.imageCard, index == current && classes.imageCardActive)} />
                            </Button>)}
                        {loadings &&
                            <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: '30px !important', }}>
                                <CircularProgress disableShrink />
                            </Box>
                        }
                    </Box>
                </Box>
                <Box className={classes.itemContent}>
                    {nfttokens[current].metadata != null ?
                        <>
                            <LazyLoadImage effect="opacity"
                                placeholderSrc={LoaderImage}
                                src={nfttokens[current].metadata.image} alt="collection" className={classes.image} />
                            <Box className={classes.content}>
                                <Tag type={nfttokens[current].metadata.collection.name} />
                                <Typography className={classes.title}>{nfttokens[current].metadata.name}</Typography>
                                <Typography className={classes.creatorTitle}>{nfttokens[current].metadata.description}</Typography>
                                <Accordion className={classes.accordion} defaultExpanded={false} >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon className={classes.expandIcon} />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        <Typography className={classes.accordionTitle}>{nfttokens[current].metadata.attributes.length} Attributes </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails className={classes.accordionDetails}>
                                        <Box className={classes.attribute}>
                                            {nfttokens[current].metadata.attributes.map((val, index) => <Box key={index} className={classes.attributeDiv}>
                                                <Typography className={classes.trait}>{val.trait_type}</Typography>
                                                <Typography className={classes.attrValue} >{val.value}</Typography>
                                            </Box>)}
                                        </Box>
                                    </AccordionDetails>
                                </Accordion>
                                <Box className={classes.buyDiv}>
                                    <KanonColorButton className={classes.buyButton} onClick={addClaim}>Claim</KanonColorButton>
                                </Box>
                            </Box>
                        </>
                        :
                        <Box className={classes.progressSection}>
                            <CircularProgress disableShrink />
                        </Box>
                    }
                </Box>
            </DialogContent>}

        </Dialog>
    );
}

export default AddClaimModal;