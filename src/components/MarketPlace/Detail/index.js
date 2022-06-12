import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box, Typography, Button, List, ListItem, Accordion, AccordionSummary, AccordionDetails, Grid } from "@mui/material";

import CollectionItem1 from '../../../assets/Landing/Collections/synesis_test01b.jpg';
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
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useSelect } from "@mui/base";

const { REACT_APP_SERVER_URL, REACT_APP_PUBLIC_NETWORK, REACT_APP_ENDPOINT } = process.env;
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
        marginLeft: '10%',
        display: 'flex',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            marginLeft: '0',

            justifyContent: 'center',
        }
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
    leftSection: {
        width: '50%',
        marginLeft: '20px',
        display: 'flex',
        justifyContent: 'flex-end',
        [theme.breakpoints.down('md')]: {
            marginLeft: '0px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '50px',
        }
    },
    rightSection: {
        width: '50%',
        paddingLeft: '20px',
        [theme.breakpoints.down('md')]: {
            paddingLeft: '0px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
        }
    },
    collectionSection: {
        width: '85%',
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            justifyContent: 'center',
        }
    },
    itemList: {
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        "&::after": {
            content: "",
            display: 'block',
            paddingBottom: "100%",
        },
        [theme.breakpoints.down('md')]: {
            justifyContent: 'center',
        },

    },
    card: {
        width: '720px',
        height: '720px',
        marginRight: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#212335',
        border: `1px solid rgba(245, 247, 250, 0.06)`,
        boxSizing: `border-box`,
        boxShadow: `0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04),
            8px 8px 24px rgba(20, 16, 41, 0.4)`,
        borderRadius: 40,
        [theme.breakpoints.down('lg')]: {
            width: '500px',
            height: '500px',
        },
        [theme.breakpoints.down('md')]: {
            marginRight: '0px',
            width: '400px',
            height: '400px',
        },
        [theme.breakpoints.down('sm')]: {
            marginRight: '0px',
            width: '300px',
            height: '300px',
        },

    },
    card1: {
        width: '85%',
        // height: '1050px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '100px',
        background: '#212335',
        border: `1px solid rgba(245, 247, 250, 0.06)`,
        boxSizing: `border-box`,
        boxShadow: `0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04),
            8px 8px 24px rgba(20, 16, 41, 0.4)`,
        borderRadius: 20,
    },
    imageCard: {
        width: '90%',
        height: '90% !important',
        objectFit: 'cover',
        borderRadius: 40
    },
    content: {
        width: '90%',
        height: '90%',
        marginTop: 50,
        marginBottom: 50,
    },
    contentTitle: {
        width: '50%',
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
        position: 'unset !important'
    },
    expandIcon: {
        color: 'rgba(224, 224, 255, 0.4)',
    },
    accordionTitle: {
        color: 'white',
        fontSize: '20px !important',
    },
    accordionDetails: {
        display: 'flex !important',
        justifyContent: 'space-between !important',
        width: '100% !important',
        flexWrap: 'wrap !important',
        paddingRight: '10px !important',
    },
    propertiesDiv: {
        background: 'rgba(224, 224, 255, 0.02)',
        borderRadius: '12px',
        height: '80px',
        padding: '20px 10px',
        marginRight: '10px',
        marginBottom: '10px',
    },
    detailDiv: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 10px',
        marginRight: '10px',
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
        width: '60%',
        height: '140px',
        padding: 20,
        background: 'rgba(224, 224, 255, 0.02)',
        borderRadius: 12,
        [theme.breakpoints.down('lg')]: {
            width: '100%',
        },
        [theme.breakpoints.down('md')]: {
            width: '60%',
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        }
    },
    title2: {
        fontSize: '20px !important',
        color: 'white !important',
        marginBottom: '20px !important',
    },
    title22: {
        fontSize: '10px !important',
        color: 'rgba(255, 255, 255, 0.6) !important',
    },
    content2: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    text2: {
        fontSize: '24px !important',
        color: 'white !important',
    },
    unlistButton: {
        width: 89,
        height: 48,
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
    card3: {
        width: '30%',
        height: '140px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(224, 224, 255, 0.02)',
        borderRadius: 12,
        [theme.breakpoints.down('lg')]: {
            width: '100%',
        },
        [theme.breakpoints.down('md')]: {
            width: '30%',
        },
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        }
    },
    detailsButton: {
        width: 95,
        height: 48,
        background: `linear-gradient(135deg, #33334B 0%, #27273E 51.37%, #202036 99.14%)`,
        boxShadow: `0px 0px 1px rgba(45, 97, 229, 0.12), 0px 2px 4px -1px rgba(27, 10, 82, 0.06), 0px 16px 24px rgba(45, 97, 229, 0.12), 0px 8px 8px -4px rgba(45, 97, 229, 0.06), inset 0px 2px 6px rgba(45, 97, 229, 0.4)`,
        borderRadius: "12px !important",
    },
    listItem: {
        display: 'flex',
        [theme.breakpoints.down('lg')]: {
            display: 'block',
        },
        [theme.breakpoints.down('md')]: {
            display: 'flex',
        },
        [theme.breakpoints.down('sm')]: {
            display: 'block',
        }

    },
    outLinedInput: {
        "& .MuiTypography-root": {
            color: 'white'
        }
    }
}));
const Detail = () => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [metadata, setMetaData] = useState(null);
    const [userWallet, setUserWallet] = useState(null);
    // const [program, setProgram] = useState(null);

    const wallet = useSelector(state => state.main.wallet);
    const provider = useSelector(state => state.main.provider);
    const KNProgram = useSelector(state => state.main.KNProgram);
    const AHProgram = useSelector(state => state.main.AHProgram);

    const getProvider = async () => {

        try {
            setUserWallet(wallet);
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(async () => {
        if (wallet && wallet.connected && !wallet.disconnecting) {
            getProvider();
        } else {
            let wallets = { ...wallet }
            const random = anchor.web3.Keypair.generate();
            wallets.publicKey = random.publicKey;
            const prov = new Provider(
                connection, wallets, {
                preflightCommitment: "confirmed",
            }
            );
            setUserWallet(wallets);
        }
    }, [wallet]);

    useEffect(async () => {
        if (KNProgram == null) return;
        if (userWallet == null) return;
        if (userWallet.publicKey == null) return;
        if (location.state == null) {
            navigate('/marketplace')
        } else {
            dispatch(setLoading(true));
            try {
                let nfts = await KNProgram.getNFTsbyPDA();
                let index = nfts.findIndex((item) => item.mint.toBase58() == location.state);
                if (index == -1) {
                    dispatch(setLoading(false));
                    return;
                }
                let metadataPDA = await Metadata.getPDA(new PublicKey(location.state));
                let tokenMetadata = await Metadata.load(connection, metadataPDA);
                const tempKeypair = anchor.web3.Keypair.generate();
                const t = new Token(connection, new PublicKey(location.state), TOKEN_PROGRAM_ID, tempKeypair);
                const ta = await t.getAccountInfo(nfts[index].address)
                let metadataExternal = (await axios.get(tokenMetadata.data.data.uri)).data;

                let temp = {
                    splTokenInfo: ta,
                    nftTokens: location.state,
                    metadataPDA: metadataPDA,
                    tokenMetadata: tokenMetadata,
                    metadataExternal: metadataExternal
                };
                setMetaData(temp);
            } catch (err) {
                console.log(err)
            }
            dispatch(setLoading(false));
        }
    }, [KNProgram])


    return (
        <Box className={classes.detailContent}>
            <Box className={classes.backIcon}>
                <Button className={classes.backBtn}>
                    <LeftArrow /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Typography className={classes.backTitle} onClick={() => navigate('/marketplace')}> Get back</Typography>
                </Button>
            </Box>
            {metadata != null && <Box className={classes.mainContent}>
                <Box className={classes.leftSection}>
                    <Box className={classes.collectionSection}>
                        <Box className={classes.itemList}>
                            <Box className={classes.card}>
                                <LazyLoadImage effect="opacity" src={metadata.metadataExternal.image} alt="collection" className={classes.imageCard} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
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
                                <Grid item sx={{ mb: 2, mr: 5 }} className={classes.card2}>
                                    <Typography className={classes.title2}> Not Listed </Typography>
                                    <Box className={classes.content2}>
                                        <Box className={classes.titleContent}>
                                            <Typography className={classes.title22}> Price </Typography>
                                            <Typography className={classes.text2}> 10.1301 SOL </Typography>
                                        </Box>
                                        <Button className={classes.unlistButton} >Unlist</Button>
                                    </Box>
                                </Grid>
                                <Grid item className={classes.card3}>
                                    <Box sx={{ display: 'block' }}>
                                        <Typography sx={{ display: 'flex', justifyContent: 'center' }} className={classes.title2}> Staked </Typography>
                                        <Button className={classes.detailsButton}> Details </Button>
                                    </Box>
                                </Grid>
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
                                   <Grid container>                                
                                        {metadata.metadataExternal.attributes.map((element, index) =>
                                            <Grid item  xl = { (metadata.metadataExternal.attributes.length == 1 ? 1 : 0|| index == 0 ? 1: 0) ? 12: 4} lg = {(metadata.metadataExternal.attributes.length == 1 ? 1 : 0|| index == 0 ? 1: 0) == 1? 12 : 4 } xs = {12} sm = { (metadata.metadataExternal.attributes.length == 1 ? 1 : 0|| index == 0 ? 1: 0) == 1?12 : 6} key = {index}>
                                                <Box className={classes.propertiesDiv} key={index}>
                                                    <Typography className={classes.detailTitle}> {element.trait_type} </Typography>
                                                    <Typography onClick = {() => copyValue(element.value)} className={classes.detailText}> {element.value} </Typography>
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
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
                                        <Typography className={classes.detailTitle}> 7.5% </Typography>
                                    </Box>
                                    <Box className={classes.detailDiv}>
                                        <Typography className={classes.detailText}> Transaction Fee </Typography>
                                        <Typography className={classes.detailTitle}> 2% </Typography>
                                    </Box>
                                    <Box className={classes.detailDiv}>
                                        <Typography className={classes.detailText}> Listing/Biding/Cancel </Typography>
                                        <Typography className={classes.detailTitle}> Free </Typography>
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                            <Accordion className={classes.accordion} >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon className={classes.expandIcon} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography className={classes.accordionTitle}> Sales history </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                </AccordionDetails>
                            </Accordion>
                        </Box>
                    </Box>
                </Box>
            </Box>}
        </Box>
    );
}

export default Detail;