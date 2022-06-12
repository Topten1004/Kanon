import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import {
    Button, Box, Typography, Grid,
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
import { Metadata, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import KanonColorButton from '../../Common/KanonColorButton';
import { KanonProgramAdapter } from 'kanon-marketplace-sdk';
import axios from "axios";
import { setLoading } from '../../../redux/ducks/main';
import { ToastContainer, toast } from 'react-toastify';
import { AirdropPgSize, CallTime, getreservednftsbywallet, getreservednftproofbymintaddressandwallet, getthumbnailbymintaddresses, EstTime} from '../../../utils/helper';
import clsx from 'clsx';
import * as anchor from '@project-serum/anchor';
import 'react-toastify/dist/ReactToastify.css';
import { NO_MORE_NFT, OUT_OF_NFTSAMOUNT, ERROR_CONDITION, errorData, toastConfig } from '../../Common/StaticData';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import LoaderImage from '../../../assets/loader.png';
import { Connection, PublicKey } from '@solana/web3.js';
import DarafarmJson from '../../../contracts/Contract.json';
import { getParsedNftAccountsByOwner, isValidSolanaAddress, createConnectionConfig, } from "@nfteyez/sol-rayz";
import { findAssociatedTokenAddress } from '../../../utils/helper';

const { createTokenAccount, sleep, token, getTokenAccount } = require("@project-serum/common");

const { REACT_APP_SERVER_URL, REACT_APP_PUBLIC_NETWORK, REACT_APP_ENDPOINT, REACT_APP_STAKE_NETWORK, REACT_APP_STAKE_PROGRAMID} = process.env;
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
        width: '100%',
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
        },
    },
    detailModalContent: {
        display: 'block',
        overflowX: 'hidden',
        marginLeft: '40px',
        marginRight: '40px',
        width: '800px',

        [theme.breakpoints.down('lg')]: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: '30px',
            marginRight: '30px',    
            width: 650,
        },
        [theme.breakpoints.down('md')]: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: "450px",
            marginLeft: '5px',
            marginRight: '5px'
        },
        [theme.breakpoints.down('sm')]: {
            display: 'flex',
            width: "300px",
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: '5px',
            marginRight: '5px'
        }
        ,
        [theme.breakpoints.down('xs')]: {
            display: 'flex',
            width: "200px",
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: '0px',
            marginRight: '0px',
        }
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
        fontSize: "24px !important",
        marginTop: "40px !important",
        color: "white",
        fontWeight: "bold !important",
    },
    progressSection: {
        display: 'flex !important',
        width: '750px !important',
        justifyContent: 'center !important',
        alignItems: 'center !important',
    },
    smallTitle: {
        fontWeight: '500',
        fontSize: '13px',
        lineHeight: '16px',
        color: 'rgba(255, 255, 255, 0.6);',
    },
    mainTitle: {
        fontSize: '24px',
        lineHeight: '32px',
        color: '#FFFFFF',
    },
    stakeFrom: {
        height: '96px',
        paddingLeft: '24px',
        paddingTop: '24px',
        background: 'rgba(224, 224, 255, 0.02)',
        borderRadius: '12px',
    },
    smallStakeFrom: {
        height: '96px',
        paddingLeft: '24px',
        paddingTop: '24px',
        background: 'rgba(224, 224, 255, 0.02)',
        borderRadius: '12px',
    },
    btnUnstake: {
        display: 'flex',
        height: '48px',
        cursor: 'pointer',
        borderRadius: '12px',
        color: 'white',
        background: 'linear-gradient(135deg, #2D61E5 0%, #8A62F6 53.09%, #E3477E 100%)',
        boxShadow: `0px 0px 1px rgba(45, 97, 229, 0.24), 0px 2px 4px -1px rgba(10, 70, 82, 0.12),
        0px 16px 24px rgba(45, 97, 229, 0.24), 0px 8px 8px -4px rgba(45, 97, 229, 0.12) !important`,
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnRewards: {
        display: 'flex',
        height: '48px',
        cursor: 'pointer',
        borderRadius: '12px',
        color: 'white',
        background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.12) 0%, rgba(245, 247, 250, 0.06) 51.58%, rgba(245, 247, 250, 0.0001) 98.94%)',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    }
}));

let interval;

const AddStakeModal = ({ open, onClose, program, warn }) => {

    const [current, setCurrent] = useState(0);
    const isXs = useMediaQuery("(min-width:320px)");
    const { sendTransaction } = useWallet();
    const provider = useSelector(state => state.main.provider);
    const wallet = useSelector(state => state.main.wallet);
    const loading = useSelector(state => state.main.loading);
    const [connected, setConnected] = useState(false);
    const [nfttokens, setNftTokens] = useState([]);
    const dispatch = useDispatch();
    const [loadings, setLoadings] = useState(true);
    const [nfts, setNfts] = useState([]);
    const [poolSnsStaked, setPoolSnsStaked] = useState(false);
    const [providers, setProviders] = useState(null);
    const [alertFlag, setAlertFlag] = React.useState(false);
    const [poolNftStaked, setPoolNftStaked] = useState(false);
    const [poolMode, setPoolMode] = useState(-1);
    const [connections, setConnections] = useState(null);
    const [firstRun, setFirstRun] = useState(false);
    const [stakeDate, setStakeDate] = useState("");
    const TokenInstructions = require("@project-serum/serum").TokenInstructions;
    const ProgramID = new PublicKey(REACT_APP_STAKE_PROGRAMID);

    const { Keypair } = web3;

    const Tag = ({ type }) => {
        return (<Box className={classes.tag} style={{ zIndex: 9 }}>{type}</Box>);
    }
    const classes = useStyles();


  

    useEffect(async() => {
        if(program != null)
        {
            const [poolSetting, _a] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(anchor.utils.bytes.utf8.encode("SNS:STATE"))],
                program.programId
            );

            const pool = await program.account.poolSetting.fetch(poolSetting);
            
            let numbers = pool.openPool.toNumber();
            setStakeDate(EstTime(numbers));
        }
    }, [program]);

   


    const unstakeNftFromPool = async (event) => {
        try {
            const [pda, bump_sns] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(anchor.utils.bytes.utf8.encode("SNS"))],
                program.programId
            );

            const [stakeAccount, bump] = await PublicKey.findProgramAddress(
                [
                    wallet.publicKey.toBuffer(),
                    Buffer.from(anchor.utils.bytes.utf8.encode("SNS:STAKE"))
                ],
                program.programId
            );
            const [poolSetting, _a] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(anchor.utils.bytes.utf8.encode("SNS:STATE"))],
                program.programId
            );
            
            let stakes = await program.account.stakeAccount.fetch(stakeAccount);
            const token_address = stakes.token;
            const tokenParse = await provider.connection.getParsedAccountInfo(token_address);
            const nft_mint = new anchor.web3.PublicKey(tokenParse.value.data.parsed.info.mint);

            const metas = new anchor.web3.PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
            let nftTokenAccount = await findAssociatedTokenAddress(wallet.publicKey, nft_mint);
            const userTokenAccount = new anchor.web3.PublicKey(nftTokenAccount.toBase58());
            const tokenAddress = nft_mint;

            let [tokenMetadata, _bs] = await anchor.web3.PublicKey.findProgramAddress(
                [
                    Buffer.from("metadata"),
                    metas.toBuffer(),
                    tokenAddress.toBuffer()
                ],
                metas
            );

            stakes = await program.account.stakeAccount.fetch(stakeAccount);
            let pdaToken = stakes.token;
            await program.rpc.poolNftUnstake(
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
                        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY
                    }
                });
        } catch (err) {
            warn(1, err);
            onClose();
        }
    }

    const claimNftReward = async (event) => {
        try {
            const [pda, bump_sns] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(anchor.utils.bytes.utf8.encode("SNS"))],
                program.programId
            );

            const [stakeAccount, bump] = await PublicKey.findProgramAddress(
                [
                    wallet.publicKey.toBuffer(),
                    Buffer.from(anchor.utils.bytes.utf8.encode("SNS:STAKE"))
                ],
                program.programId
            );
            const [poolSetting, _a] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(anchor.utils.bytes.utf8.encode("SNS:STATE"))],
                program.programId
            );
            const pool = await program.account.poolSetting.fetch(poolSetting);
            let userTokenAccount = await createTokenAccount(provider, pool.mint, wallet.publicKey);
            await program.rpc.poolNftClaimReward(
                {
                    accounts: {
                        stakeAccount,
                        authority: wallet.publicKey,
                        userTokenAccount,
                        poolSetting,
                        poolVault: pool.vault,
                        pda,
                        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
                        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY
                    }
                });
        } catch (err) {
            warn(1, err);
            onClose();
        }
    }
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
            <Box className={classes.closeButtonDiv}>
                <IconButton onClick={onClose} aria-label="close" className={classes.closeButton}>
                    <CloseIcon color={'white'} />
                </IconButton>
            </Box>
            <DialogContent className={classes.detailModalContent}>
                <Box className={classes.title}>Stake details</Box>
                <Grid container>
                    <Grid item xs={12} sm={12} lg={12}>
                        <Box className={classes.stakeFrom}>
                            <Box className={classes.smallTitle}>Staked from</Box>
                            <Box className={classes.mainTitle}>Kanon NFT staking pool</Box>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container justifyContent='center' alignItems='center' spacing={3} sx = {{ marginTop:'0px'}}>
                    <Grid item xs={12} sm={6} lg={6}>
                        <Box className={classes.smallStakeFrom}>
                            <Box className={classes.smallTitle}>Staked at</Box>
                            <Box className={classes.mainTitle}>{ stakeDate }</Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6}>
                        <Box className={classes.smallStakeFrom}>
                            <Box className={classes.smallTitle}>Accumulated rewards</Box>
                            <Box className={classes.mainTitle}>0 SNS</Box>
                        </Box>
                    </Grid>
                </Grid>
                <Grid container justifyContent='center' alignItems='center' spacing={4} sx = {{ marginBottom:'40px', marginTop: '0px'}}>
                    <Grid item xs={12} sm={6} lg={6}>
                        <Box className={classes.btnUnstake} onClick = {unstakeNftFromPool}>Unstake</Box>
                    </Grid>
                    <Grid item xs={12} sm={6} lg={6}>
                        <Box className={classes.btnRewards} onClick = {claimNftReward}>Redeem rewards</Box>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default AddStakeModal;