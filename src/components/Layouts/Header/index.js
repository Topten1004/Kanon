import React, { useEffect, useState, useMemo } from 'react';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles'
import { Box, Button, MenuItem, Menu, useMediaQuery, IconButton, Drawer, ListItemIcon, List, ListItem, ListItemText } from '@mui/material';
import { HashLink as Link } from 'react-router-hash-link';
import MenuIcon from '@mui/icons-material/Menu';
import { WalletModalButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { shortenAddress, calculateStep } from '../../../utils/helper';
import CustomMenuItem from './CustomMenuItem';
import MobileMenuItem from './MobileMenuItem';
import DarkMenuItem from './DarkMenuItem';
import { Program, Provider, BN, web3 } from '@project-serum/anchor';
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useSelector, useDispatch } from "react-redux";
import { Connection, PublicKey, clusterApiUrl, Keypair, Transaction, TransactionSignature } from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import clsx from 'clsx';
import CloseIcon from "@mui/icons-material/Close";
import { AboutImage, CollectionsImage, GamesImage, RoadmapImage, MarketPlaceImage, FaqImage, DarkImage, TwitterImage, DiscordImage } from '../../Common/Arrow';
import Logo from '../../../assets/logo.png';
import { KanonProgramAdapter } from 'kanon-marketplace-sdk';
import { KanonAuctionHouseAdapter } from "kanon-auctionhouse-sdk";
import { setGlobalState, setProvider, getmintablenfts, setWallet, setLoading, setreadyflag, setKNProgram, setAHProgram, setReduxAhIdl } from '../../../redux/ducks/main';
import ColorModeContext from '../../Common/ColorModeContext';
import { setSchedule } from '../../../redux/ducks/main';


const { REACT_APP_SERVER_URL, REACT_APP_PUBLIC_NETWORK, REACT_APP_ENDPOINT } = process.env;
const opts = {
    preflightCommitment: "processed"
}
const connection = new Connection(
    REACT_APP_ENDPOINT,
    opts.preflightCommitment
);


const useStyles = makeStyles((theme) => ({
    navigation: {
        position: 'fixed',
        width: '100%',
        height: 90,
        display: 'flex',
        top: 0,
        zIndex: 5,
        fontFamily: "Klavika",
        justifyContent: 'space-between',
        alignItems: "center",
        zIndex: '999 !important',
        "& .wallet-adapter-button": {
            background: 'rgb(0,0,0,0.5)',
            border: '2px solid #6f4376',
            color: '#f7c5de',
            borderRadius: '34px !important',
        },

    },
    navBack: {
        background: '#141424'
    },
    connectDay: {
        width: '160px',
        padding: '0px 16px !important',
        height: 48,
        fontSize: '16px !important',
        fontFamily: 'Klavika !important',
        fontWeight: '500 !important',
        color: 'white !important',
        textAlign: 'center',
        background: '#212335 !important',
        boxShadow: `0px 0px 1px rgba(45, 97, 229, 0.12), 0px 12px 24px rgba(45, 97, 229, 0.16),
            0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04),
            8px 8px 24px rgba(20, 16, 41, 0.4), 0px 8px 8px -4px rgba(45, 97, 229, 0.06),
            inset 0px 2px 6px rgba(45, 97, 229, 0.4)`,
        backdropFilter: 'blur(108.731px)',
        borderRadius: '12px !important',
    },
    connectNight: {
        width: '100px',
        height: 48,
        fontSize: '16px !important',
        color: 'white !important',
        textAlign: 'center',
        padding: '0px 16px !important',
        background: '#212335',
        boxShadow: `0px 8px 8px -4px rgba(156, 66, 245, 0.06), 0px 0px 1px rgba(156, 66, 245, 0.12),
            0px 16px 24px rgba(156, 66, 245, 0.12), 0px 1px 1px rgba(20, 16, 41, 0.4),
            -4px -4px 8px rgba(224, 224, 255, 0.04), 8px 8px 24px rgba(20, 16, 41, 0.4),
            inset 0px 2px 6px rgba(156, 66, 245, 0.4)`,
        backdropFilter: 'blur(108.731px)',
        borderRadius: '12px !important'
    },

    logo: {
        cursor: 'pointer',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
    },
    logoImage: {
        // width: '100%',
        height: 90,
        cursor: 'pointer'
    },
    menu: {
        display: 'flex',
        justifyContent: 'flex-start !important',
        width: '100vw',
        marginLeft: 53,
        [theme.breakpoints.down('lg')]: {
            // marginLeft: -30,
        },
    },
    homeMenu: {
        display: 'flex',
        position: 'absolute',
        justifyContent: 'center',
        width: '100%',
    },
    right: {
        display: 'flex',
        position: 'absolute',
        alignItems: 'center',
        right: 20,
        [theme.breakpoints.down('sm')]: {
            right: 30,
        }
    },
    dropdownMenu: {
        zIndex: '99999 !important',
        "& .MuiPaper-root": {
            position: 'absolute !important',
            color: 'white',
            background: '#212335',
            boxShadow: `0px 0px 1px rgba(45, 97, 229, 0.12), 0px 12px 24px rgba(45, 97, 229, 0.16),
                0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04),
                8px 8px 24px rgba(20, 16, 41, 0.4), 0px 8px 8px -4px rgba(45, 97, 229, 0.06),
                inset 0px 2px 6px rgba(45, 97, 229, 0.4);
            backdrop-filter: blur(108.731px)`,
            borderRadius: 12
        },
        "& ul": {
            width: '160px',
            height: 48,
        },
        "& li": {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    },
    navigation2: {
        position: "absolute",
        width: "100%",
        height: "90px",
        display: "flex",
        zIndex: "5",
        top: "0px",
        fontFamily: "Klavika",
        alignItems: "center"
    },
    flex: {
        display: 'flex'
    },
    menuItem: {
        width: "27px",
        objectFit: "contain",
        marginRight: "32px",
        cursor: "pointer",
        display: "flex",
    },
    mr50: {
        marginRight: '20px',
    },
    iconButton: {
        marginRight: '10px !important',
        color: 'white !important',
        minWidth: '36px !important',
        height: 36,
        background: 'linear-gradient(135deg, #33334B 0%, #27273E 51.37%, #202036 99.14%)',
        boxShadow: '0px 0px 1px rgba(45, 97, 229, 0.12), 0px 2px 4px -1px rgba(27, 10, 82, 0.06), 0px 16px 24px rgba(45, 97, 229, 0.12), 0px 8px 8px -4px rgba(45, 97, 229, 0.06), inset 0px 2px 6px rgba(45, 97, 229, 0.4)',
        borderRadius: '12px !important',
    },
    menuDiv: {
        backgroundColor: '#27273E',
        height: '100%',
        "& a": {
            textDecoration: 'none ',
            color: 'white',
        },
    },
    drawer: {
        width: '100%',
        zIndex: '999999999999999 !important',
        "& .MuiPaper-root": {
            width: '100%',
            backgroundColor: '#27273E',
            backgroundImage: 'none'
        }
    },
    menuBody: {
        zIndex: 9999
    },
    mobileMenu: {
        display: 'flex !important',
        justifyContent: 'space-between !important',
        paddingRight: '0px !important'
    },
    surfaceImage: {
        position: 'relative',
        border: "1px solid yellow"
    },
    closeIcon: {
        minWidth: '36px !important',
        height: 36,
        background: 'linear-gradient(135deg, #33334B 0%, #27273E 51.37%, #202036 99.14%)',
        boxShadow: '0px 0px 1px rgba(45, 97, 229, 0.12), 0px 2px 4px -1px rgba(27, 10, 82, 0.06), 0px 16px 24px rgba(45, 97, 229, 0.12), 0px 8px 8px -4px rgba(45, 97, 229, 0.06), inset 0px 2px 6px rgba(45, 97, 229, 0.4)',
        borderRadius: '12px !important',
        right: 25,
        color: 'white !important',
    },
    walletButton: {
        width: 100,
        height: 50,
        textTransform: 'none !important',
        fontSize: '16px !important',
        color: 'white !important',
        fontFamily: 'Klavika !important',
        padding: '0px 14px !important',
        background: `linear-gradient(135deg, #2d61e5 0%, #8a62f6 53.09%, #e3477e 100%) !important`,
        boxShadow: `0px 0px 1px rgba(45, 97, 229, 0.24), 0px 2px 4px -1px rgba(10, 70, 82, 0.12),
            0px 16px 24px rgba(45, 97, 229, 0.24), 0px 8px 8px -4px rgba(45, 97, 229, 0.12) !important`,
        borderRadius: `12px !important`,
        fontSize: 16,
        width: '80%',
    },
    walletconnectedButton: {
        height: 50,
        textTransform: 'none !important',
        fontSize: '16px !important',
        color: 'white !important',
        fontFamily: 'Klavika !important',
        padding: '0px 14px !important',
        borderRadius: `12px !important`,
        background: '#212335',
        boxShadow: `0px 0px 1px rgba(45, 97, 229, 0.12), 0px 12px 24px rgba(45, 97, 229, 0.16),
            0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04),
            8px 8px 24px rgba(20, 16, 41, 0.4), 0px 8px 8px -4px rgba(45, 97, 229, 0.06),
            inset 0px 2px 6px rgba(45, 97, 229, 0.4)`,
        backdropFilter: 'blur(108.731px)',
        fontSize: 16,
        width: '80%',
    },
    walletButtonSection: {
        marginTop: '50px',
        display: 'flex',
        justifyContent: 'center !important',
        backgroundColor: '#27273E'
    },
    mobilemenuBtn: {
        paddingRight: '0px !important'
    },
    darkImageDiv: {
        background: 'rgba(45, 97, 229, 0.03)',
        borderRadius: "12px",
    },
    darkButton: {
        width: '48px',
        height: '48px',
        marginRight: '25px !important',
        background: 'rgba(45, 97, 229, 0.03) !important',
        borderRadius: '12px !important',
        [theme.breakpoints.down('lg')]: {
            marginRight: '12px !important',
        }
    }
}));

function Header(props) {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    const homeMenuTitles = [
        { title: "Home", link: "/" },
        { title: "Marketplace", link: "/marketplace" },
        { title: "FAQ", link: "/faq" },
    ];
    const menuTitles = [
        { title: "Home", link: "/" },
        { title: "Marketplace", link: "/marketplace" },
        { title: "FAQ", link: "/faq" },
    ];

    const walletImage = <MarketPlaceImage />;
    const classes = useStyles();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = useState(null);
    const [runflag, setRunflag] = useState(false)
    const location = useLocation();
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const isXs = useMediaQuery("(min-width: 900px)");
    const isXs1 = useMediaQuery("(min-width: 600px)");
    const [state, setState] = useState(false);
    const wallet = useWallet();
    const [step, setStep] = useState(0);
    const [KNProgram, setProgram] = useState(null);
    const [AHProgram, setProgramAH] = useState(null);
    const [AhIdlProgram, setAhIdl] = useState(null);
    const [show, setShow] = useState(false)

    const handleScroll = () => {
        if (location.pathname == '/mint') {
            setShow(true);
        }
        else {
            if (window.pageYOffset > 40) {
                if (!show) setShow(true)
            } else {
                if (show) setShow(false)
            }
        }
    }
   

    useEffect(() => {

        window.addEventListener(`scroll`, handleScroll)
        return () => window.removeEventListener(`scroll`, handleScroll)
    })

    const getProvider = async () => {
        const prov = new Provider(
            connection, wallet, {
            preflightCommitment: "confirmed",
        }
        );

        const prog = new KanonProgramAdapter(prov, {
            isDevNet: REACT_APP_PUBLIC_NETWORK == 'devnet'
        });

        await prog.refreshByWallet();
        setProgram(prog);


        const ahProgram = new KanonAuctionHouseAdapter(prov, {
            isAuctionHouseAuthority: false,
            auctionHouseKeyString: process.env.REACT_APP_AUCTIONHOUSE_KEY,
            isCustomAuctionHouse: process.env.REACT_APP_ISCUSTOMAUCTIONHOUSE === 'true',
        });
        await ahProgram.refreshByWallet();

        setProgramAH(ahProgram);

        const ah_idl = await ahProgram.getAuctionHouseIDL();
        setAhIdl(ah_idl);
        dispatch(setReduxAhIdl(ah_idl));

        dispatch(setKNProgram(prog));
        dispatch(setAHProgram(ahProgram));
        dispatch(setWallet(wallet));
        dispatch(setProvider(prov));
        // //verification
        // let val = await prog.getCollectionAuthorityAccountPubkey();
        // console.log(val.toBase58())
        dispatch(setLoading(false));
    }

    useEffect(async() => {
        window.scrollTo(0, 0);
        var interval_id = window.setInterval(() => { }, 99999);
        for (var i = 0; i < interval_id; i++)
            window.clearInterval(i);
        dispatch(setLoading(false));
        if (location.pathname == '/mint') {
            dispatch(await getmintablenfts());
            setShow(true);
        } else {
            setShow(false);
        }
    }, [location.pathname]);
    //verification
    useEffect(async () => {
        // Disable MarketPlace
        // if (location.pathname == '/marketplace') {
        //     navigate('/');
        // }
        setState(false);
        if (KNProgram != null) {
            //verification
            let steps = 0;
            const collectionState = await KNProgram.getProgram().account.collectionAccount.fetch(KNProgram._collection_state_account_pubkey);
            if (collectionState.seasonOpenedTimestamp.toNumber() == 0) {
                steps = 0;
            } else {
                steps = calculateStep(collectionState);
            }
            setStep(steps);
            dispatch(setSchedule(steps));

            // disable MarketPlace
            if (location.pathname == '/marketplace' && steps != 5) {
                 navigate('/');
            }

            if (steps == 2 || steps == 3) {

                dispatch(setreadyflag(true));
            } else {
                dispatch(setreadyflag(false));
            }
        }
        if (wallet && !wallet.connecting && !wallet.connected) {
            wallet.disconnect();
        }
    }, [location.pathname, KNProgram])


    useEffect(async () => {
        dispatch(setLoading(true));
        if (wallet && wallet.connected && !wallet.disconnecting) {
            if (!runflag) {
                getProvider();
                setRunflag(true);
            }
        } else {
            setRunflag(false)
            let wallets = { ...wallet }
            const random = anchor.web3.Keypair.generate();
            wallets.publicKey = random.publicKey;
            dispatch(setWallet(wallets));
            const prov = new Provider(
                connection, wallets, {
                preflightCommitment: "confirmed",
            }
            );
            const programs = new KanonProgramAdapter(prov, {
                isDevNet: REACT_APP_PUBLIC_NETWORK == 'devnet'
            });
            await programs.refreshByWallet();
            setProgram(programs);


            const ahProgram = new KanonAuctionHouseAdapter(prov, {
                isAuctionHouseAuthority: false,
                auctionHouseKeyString: process.env.REACT_APP_AUCTIONHOUSE_KEY,
                isCustomAuctionHouse: process.env.REACT_APP_ISCUSTOMAUCTIONHOUSE === 'true',
            });
            await ahProgram.refreshByWallet();

            setProgramAH(ahProgram);

            dispatch(setAHProgram(ahProgram));

            const ah_idl = await ahProgram.getAuctionHouseIDL();
            setAhIdl(ah_idl);
            dispatch(setReduxAhIdl(ah_idl));

            dispatch(setLoading(false));

            // if(wallet != null && !wallet.ready ) {
            //     wallet.disconnect()
            // }
        }
    }, [wallet]);


    const isKanonUI = () => {
        if (location.pathname === "/")
            return true;
        return false;
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const mobileMenuItems = [
        {
            label: 'Home',
            link: "/",
            image: <MarketPlaceImage />
        },
        {
            label: 'Marketplace',
            link: "/marketplace",
            image: <MarketPlaceImage />
        },
        {
            label: 'FAQ',
            link: "/faq",
            image: <FaqImage />
        },
    ]
    const mobileMenuItems1 = [
        {
            label: 'Home',
            link: "/",
            image: <MarketPlaceImage />
        },
        {
            label: 'Marketplace',
            link: "/marketplace",
            image: <MarketPlaceImage />
        },
        {
            label: 'FAQ',
            link: "/faq",
            image: <FaqImage />
        },
    ]
    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState(open);
    };
    const list = () => (
        <Box
            sx={{ width: 'auto' }}
            role="presentation"
            className={classes.menuBody}
        >

            <List className={classes.menuDiv}>

                <ListItem className={classes.mobileMenu}>
                    <img src={Logo} alt="logo" className={classes.logoImage} />

                    <Button className={classes.closeIcon} onClick={toggleDrawer(false)}>
                        <CloseIcon />
                    </Button>
                </ListItem>
                {(isKanonUI() ? mobileMenuItems : mobileMenuItems1).map((text, index) => (
                    <MobileMenuItem title={text.label} image={text.image} key={index} link={(text.link === '/marketplace' && step !== 5) ? '#' : text.link} onClose={toggleDrawer(false)} />

                ))}
                {wallet.publicKey != null &&
                    <MobileMenuItem title="My Wallet" image={walletImage} link='/mywallet' onClose={toggleDrawer(false)} />
                }
                {/* <DarkMenuItem status={theme.palette.mode} title='Dark mode' onclick={colorMode.toggleColorMode} image={<DarkImage />} /> */}
                {!isXs1 && <ListItem className={classes.walletButtonSection}>
                    {wallet.publicKey == null ?
                        <WalletModalButton className={classes.walletButton} onClick={toggleDrawer(false)}>Connect wallet</WalletModalButton>
                        :
                        <Button className={classes.walletconnectedButton}>{shortenAddress(wallet.publicKey.toBase58() || "")}</Button>
                    }
                </ListItem>}
                {wallet.publicKey != null && !isXs1 &&
                    <ListItem className={classes.walletButtonSection} sx={{ marginTop: '10px !important' }}>
                        <Button className={classes.walletconnectedButton} onClick={() => { wallet.disconnect(); toggleDrawer(false); }}>Disconnect</Button>
                    </ListItem>
                }
            </List>
        </Box>
    );
    return (
        <Box className={clsx(classes.navigation, show && classes.navBack)}>
            <Box className={classes.logo}>
                <img src={Logo} alt="logo" className={classes.logoImage} />
            </Box>
            <Box className={clsx(classes.homeMenu)}>
                {isXs &&
                    (isKanonUI() ? homeMenuTitles : menuTitles).map((val, index) => <CustomMenuItem title={val.title} key={index} link={val.link} step={step} />)
                }
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box className={clsx(isXs && classes.right, !isXs && classes.mr50)}>
                    {/* {isXs && <ListItem button className={classes.darkButton}><DarkImage /></ListItem>} */}
                    {(wallet.publicKey != null && isXs) && <CustomMenuItem title={'My Wallet'} link='/mywallet' step={step} />}
                    {isXs1 && <Box ><WalletMultiButton></WalletMultiButton></Box>}
                </Box>
                <Box sx={{ display: { xs: 'block', md: 'none' }, }}>
                    <React.Fragment key="top" >
                        <IconButton
                            className={classes.iconButton}
                            aria-label="Menu"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor={"right"}
                            open={state}
                            onClose={toggleDrawer(false)}
                            className={classes.drawer}
                        >
                            {list()}
                        </Drawer>
                    </React.Fragment>
                </Box>
            </Box>
        </Box>
    );
}



export default Header