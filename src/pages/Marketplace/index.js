import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import { InputAdornment, Button, Grid, Box, Stack, Typography, InputBase, Paper, IconButton, Input, useMediaQuery, CircularProgress, Select, MenuItem, Container, Checkbox, FormControl, InputLabel, Radio, ListItemText } from '@mui/material';
import { Arrow, SearchIcon } from '../../components/Common/Arrow';
import ClearIcon from '@mui/icons-material/Clear';
import KanonDefaultButton from '../../components/Common/KanonDefaultButton';
import { useNavigate, useLocation } from 'react-router-dom';
import { KanonProgramAdapter } from 'kanon-marketplace-sdk';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import { Connection } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Program, Provider, BN, web3 } from '@project-serum/anchor';
import { Metadata, MetadataProgram } from '@metaplex-foundation/mpl-token-metadata';
import DetailModal from '../Marketplace/Detail'
import { Keypair, PublicKey } from '@solana/web3.js';
import { AccountInfo, MintInfo, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as anchor from '@project-serum/anchor';
import { allCollectionFilter1, MarketplacePgSize, getCollections, CallTime, ahgetlistednfts, ahgetlistednftsthumbnail } from '../../utils/helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toastConfig, NO_NFTS } from '../../components/Common/StaticData';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import CircleCheckBt from '../../components/Common/CircleCheckBt';
import { Clear, ImportantDevices } from '@mui/icons-material';
import { createSerializableStateInvariantMiddleware } from '@reduxjs/toolkit';
import { copy } from "copy-to-clipboard";
import { shortenAddress, calculateStep, getCollectionSummary } from '../../utils/helper'
import { maxWidth } from '@mui/system';
import LazyLoader from '../../assets/loader.png';
import CollectionItem1 from '../../assets/Landing/Collections/synesis_test01b400.jpg';
import CollectionItem2 from '../../assets/Landing/Collections/synesis_test01b20.jpg';
import { DelayInput } from 'react-delay-input';

const { REACT_APP_SERVER_URL, REACT_APP_PUBLIC_NETWORK, REACT_APP_ENDPOINT } = process.env;
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
        fontFamily: 'Klavika',
    },
    titleSection: {

        display: 'flex',
        // flexDirection: 'column',
        justifyContent: 'space-between',
        // [theme.breakpoints.down('sm')]: {
        //     flexDirection: 'column',
        // }
        ['@media (max-width:950px)']: {
            flexDirection: 'column',
        }
    },
    title: {
        paddingTop: "80px",
        fontSize: "48px !important",
        color: "white",
        paddingLeft: '140px',
        display: "flex",
        [theme.breakpoints.down('lg')]: {
            paddingLeft: '60px',
        },
        [theme.breakpoints.down('md')]: {
            paddingLeft: "100px",
        },
        ['@media (max-width:720px)']: {
            paddingLeft: '0px',
            justifyContent: 'center',
        }
    },
    smallTitle: {
        marginTop: "8px",
        fontSize: "20px !important",
        color: "rgba(224, 224, 255, 0.6)",
        paddingLeft: "160px",
        [theme.breakpoints.down('md')]: {
            paddingLeft: "calc(50% - 156px)",
        },
        [theme.breakpoints.down('sm')]: {
            fontSize: "16px !important",
        }
    },
    searchContent: {
        display: 'flex',
        [theme.breakpoints.down('md')]: {
            marginTop: '20px',
        },
        ['@media (max-width:600px)']: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        ['@media (max-width:950px)']: {
            justifyContent: 'space-between'
        }
    },
    search: {
        width: "300px",
        height: "48px",
        background: "rgba(224, 224, 255, 0.02)",
        borderRadius: "12px",
        display: "flex",
        marginRight: '20px',
        [theme.breakpoints.down('md')]: {
            marginRight: "20px",
        },
        [theme.breakpoints.down('sm')]: {
            marginRight: '0px'
        },
        ['@media (max-width:600px)']: {
            marginBottom: '20px',
            marginLeft: '0px'
        }
    },
    searchSelect: {
        width: "180px",
        height: "48px",
        background: "rgba(224, 224, 255, 0.02)",
        borderRadius: "12px",
        display: "flex",
        marginRight: '140px',
        [theme.breakpoints.down('lg')]: {
            marginRight: '140px',
        },
        ['@media (max-width:1200px)']: {
            marginRight: '60px',
            justifyContent: 'center',
        },
        [theme.breakpoints.down('md')]: {
            marginRight: '0px',
            justifyContent: 'center',
        },
        "& .MuiOutlinedInput-input": {
            "& .MuiBox-root": {
                visibility: 'hidden',
                width: 0,
                height: 0
            }
        }
    },
    select: {
        width: "180px",
        hegiht: "48px",
        color: "#FFFFFF"
    },
    searchIcon: {
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        width: '50px'
    },
    clearIcon: {
        justifyContent: 'center',
        paddingLeft: '4px !important',
        display: 'flex',
        alignItems: 'center'
    },
    searchText: {
        width: '100%',
        color: 'rgba(255, 255, 255, 0.6)',
        backgroundColor: 'transparent',
        textAlign: 'center',
        border: 0,
        inputProps: {
            style: { textAlign: 'center' },
        },
        "& before": {
            border: 0
        }
    },
    searchTextClear: {
        width: 210,
        color: 'rgba(255, 255, 255, 0.6)',
        backgroundColor: 'transparent',
        textAlign: 'center',
        border: 0,
        inputProps: {
            style: { textAlign: 'center' },
        },
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
            display: 'block',
            // flexDirection: 'column',
            // justifyContent: 'center',
            // alignItems: 'center',
        }
    },
    card: {
        width: '248px',
        padding: 24,
        paddingBottom: 12,
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
    },
    cardImage: {
        width: 200,
        height: 200,
        borderRadius: 12,
        // margin: 24,
        marginBottom: 0,
    },
    avatar: {
        width: "200px !important",
        height: "200px !important",
        borderRadius: '50% !important',
        border: "5px solid #FFFFFF",
        marginBottom: 0,
        opacity: 0.8,
    },
    solTitle: {
        wordBreak: 'break-word',
        fontSize: '14px !important',
        color: '#ce9cb4',
        marginTop: '5px !important',
        // marginLeft: '24px !important',
        // marginRight: '24px !important',
        lineHeight: '1.2 !important',
        cursor: 'pointer',
        "& hover": {
            textDecoration: 'underline'
        }
    },
    cardTitle: {
        wordBreak: 'break-word',
        fontSize: '14px !important',
        color: 'white',
        marginTop: '5px !important',
        // marginLeft: '24px !important',
        // marginRight: '24px !important',
        lineHeight: '1.2 !important',
        cursor: 'pointer',
        "& hover": {
            textDecoration: 'underline'
        }
    },
    divSearch: {
        display: 'flex',
        alignItems: 'flex-end',
        "& .MuiTypography-root": {
            color: 'white !important',
        },
        [theme.breakpoints.down('md')]: {
            justifyContent: 'center',
        },
        ['@media (max-width:950px)']: {
            justifyContent: 'center',
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
    loadMore: {
        marginLeft: 'calc(50% - 70px)',
        marginBottom: 32
    },
    layer: {
        display: 'flex', width: '100%', justifyContent: 'space-between',
        ['@media (max-width:720px)']: {
            justifyContent: 'center !important',
        },
    },
    blockLayer: {
        display: 'inline-block',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    card1: {
        width: '248px',
        marginTop: 24,
    },
    menuItem: {
        fontSize: '14px',
        "&:active": {
            "& .MuiBox-root": {
                "& span": {
                    backgroundColor: "#787878",
                }
            }
        },
        "&:hover": {
            "& .MuiBox-root": {
                "& span": {
                    backgroundColor: "#39354f",
                }
            }
        }
    },
    menuItemText: {
        color: "#FFFFFF"
    },
    menuItemTextClick: {
        color: "#b644f3"
    },
    selectText: {
        color: "#FFFFFF",
        width: "200px",
    },
    cardList1: {
        display: 'block',
        justifyContent: 'center',
        marginTop: 24,
        flexWrap: 'wrap',
        textAlign: 'center',
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
    btnItems: {
        display: 'block',
        background: '#1c1929 !important',
        color: '#FFFFFF !important',
        height: '72px !important',
        marginLeft: '10px !important',
        borderRadius: '10px',
    },
    ellipsis: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        paddingTop: '15px',
        paddingLeft: '10px',
        paddingRight: '10px',
        color: '#b4abba',
        textAlign: 'center',
        marginLeft: 1,
        marginRight: 1,
        fontSize: '11px !important'
    },
    valueTxt: {
        fontSize: '20px !important',
        color: 'white'
    },
    searchBtn: {
        '& svg': {
            fontSize: '18px !important',
            width: '18px !important',
            height: '18px !important',
            color: 'rgb(148, 147, 147)'
        }
    },
    iconBtn: {
        marginRight: '8px !important',
        padding: '0px !important',
        color: 'rgb(148, 147, 147) !important',
        " .MuiIconButton-root .": {
            padding: '0px !important',
            marginRight: '8px !important',
            color: 'rgb(148, 147, 147) !important',
        },
    }
}));

const searchItems = ["Name: Sort A to Z", "Name: Sort Z to A", "Price: Low to High", "Price: High to Low"];

const MarketPlace = () => {

    const interval = React.useRef();

    const match1 = useMediaQuery('(min-Width: 1800px)');
    const match2 = useMediaQuery('(min-Width: 1400px)');
    const match3 = useMediaQuery('(min-Width: 900px)');
    const match4 = useMediaQuery('(min-Width: 720px)');
    const match5 = useMediaQuery('(min-Width: 400px)');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const isXs1 = useMediaQuery("(min-width:1600px)");

    const classes = useStyles();
    const [searchText, setSearchText] = useState("");
    const [enterdTxt, setEnterdTxt] = useState("");
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [step, setStep] = useState(-1);
    const [nfttokens, setNftTokens] = useState([]);
    const [nfts, setNfts] = useState([]);
    const [rowCount, setRowCount] = useState(5);
    const [collectionSummary, setCollectionSummary] = useState([]);
    const [defaultNfts, setDefaultNfts] = useState([]);

    const wallet = useSelector(state => state.main.wallet)
    const provider = useSelector(state => state.main.provider);
    const KNProgram = useSelector(state => state.main.KNProgram);

    const [allcollections, setAllCollections] = useState([]);
    const [firstFlag, setFirstFlag] = useState(false);
    const [nonftsFlag, setNoNftsFlag] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sort, setSort] = useState(1);
    const [priceSelect, setPriceSelect] = useState(searchItems[0]);
    const [hover, setHover] = useState(false);
    const [updateFlag, setUpdateFlag] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const onClearSearch = () => {
        setSearchText("");
        setEnterdTxt("");
        setUpdateFlag(!updateFlag);
    }

    useEffect(() => {
        const timeOutId = setTimeout(() => { setEnterdTxt(searchText) }, 1000);
        return () => clearTimeout(timeOutId);
    }, [searchText]);

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
        let temp = await getCollectionSummary("Aquarius");
        setCollectionSummary(temp);
    }, [showDetailModal]);

    useEffect(async () => {
        let temp = await getCollectionSummary("Aquarius");
        setCollectionSummary(temp);
    }, []);

    useEffect(() => {
        if (nonftsFlag) {
            toast.warn(NO_NFTS, toastConfig);
        }
    }, [nonftsFlag]);

    useEffect(async () => {
        setLoading(true);
        clearInterval(interval.current);
        setNftTokens([]);

        if (enterdTxt.length !== 0) {
            setIsLoading(false);
            getData(2);
        }
        else {
            setIsLoading(true);
            getData(1);
        }
    }, [enterdTxt, priceSelect, updateFlag]);

    const getData = async (index) => {

        let order_field = '';
        let order_type = '';

        if (priceSelect == searchItems[0]) {
            order_field = "name";
            order_type = "asc"
        }
        else if (priceSelect == searchItems[1]) {
            order_field = "name";
            order_type = "desc"
        }
        else if (priceSelect == searchItems[2]) {
            order_field = "price";
            order_type = "asc"
        }
        else if (priceSelect == searchItems[3]) {
            order_field = "price";
            order_type = "desc"
        }

        let itemDatas = await ahgetlistednfts(order_field, order_type, enterdTxt, "");
        console.log("itemDatas::", itemDatas);

        if (itemDatas.length === 0) {
            setNftTokens([]);
            setLoading(false)
            return;
        }
        let mintaddress = [];

        itemDatas.map((item) => mintaddress.push(item.nft_mint_address));
        let temp = itemDatas.filter((item) => item.thumbnail != null)

        setNftTokens([...temp]);

        let showCount = -1;
        if (itemDatas.length > 10) {
            showCount++;
            let resdata = await ahgetlistednftsthumbnail(order_field, order_type, enterdTxt, "", 10, MarketplacePgSize);
            resdata.map((item) => {
                let index = itemDatas.findIndex((val) => val.nft_mint_address === item.nft_mint_address);
                if (index != -1) {
                    itemDatas[index].thumbnail = item.thumbnail
                }
            });
            temp = itemDatas.filter((item) => item.thumbnail != null)
            setNftTokens([...temp]);
            if ((10 + MarketplacePgSize) >= itemDatas.length) {
                setLoading(false);
                return;
            }
            interval.current = setInterval(() => {
                showCount++;
                ahgetlistednftsthumbnail(order_field, order_type, enterdTxt, "", (10 + showCount * MarketplacePgSize), MarketplacePgSize).then((resdata) => {
                    resdata.map((item) => {
                        let index = itemDatas.findIndex((val) => val.nft_mint_address == item.nft_mint_address);
                        if (index != -1) {
                            itemDatas[index].thumbnail = item.thumbnail
                        }
                    });
                    temp = [...itemDatas].filter((item) => item.thumbnail != null)
                    setNftTokens([...temp]);
                    if ((10 + (showCount + 1) * MarketplacePgSize) >= itemDatas.length) {
                        setLoading(false)
                    }
                });
                if ((10 + (showCount + 1) * MarketplacePgSize) >= itemDatas.length) {
                    clearInterval(interval.current);
                }
            }, CallTime);
        } else {
            setLoading(false);
        }
        if(index === 2)
        {
            setIsLoading(true);
        }
        // setFirstFlag(true);
        return () => {
            clearInterval(interval.current);
        };
    }

    const Tag = ({ type }) => {
        return (<Box className={classes.tag} style={{ backgroundColor: '#2D61E5', zIndex: 9 }}>{type}</Box>);
    }

    const handleChangePriceSelect = (value) => {
        setPriceSelect(value);
    }

    const showCard = () => {
        let length = parseInt(nfttokens.length);
        let count = length % rowCount;
        let len = parseInt(length / rowCount);
        let rows = [];

        if (isLoading === true) {
            for (let i = 0; i < len; i++) {
                let temp = [];
                for (let j = 0; j < rowCount; j++) {
                    let item = nfttokens[i * rowCount + j];

                    temp.push(<Box className={classes.card} key={i * rowCount + j} onClick={() => { setShowDetailModal(true); setSelectedItem(item); }}>
                        <Tag type={item.collection_name.toString()} />
                        <LazyLoadImage effect="opacity" src={`data:image/png;base64,${item.thumbnail}`} alt="collection" className={classes.cardImage} />
                        <Typography className={classes.cardTitle}>{item.nft_name.toString()}</Typography>
                        <Typography className={classes.solTitle}>{item.price.toString()} SOL</Typography>
                    </Box>)
                }
                rows.push(<Box key={i} className={match5 ? classes.layer : classes.blockLayer}>{temp}</Box>)
            }
            if (count !== 0) {
                let temp = [];
                for (let i = 0; i < rowCount; i++) {
                    let item = nfttokens[len * rowCount + i];
                    if ((rowCount * len + i) < length) {
                        temp.push(<Box className={classes.card} key={rowCount * len + i} onClick={() => { setShowDetailModal(true); setSelectedItem(item); }}>
                            <Tag type={item.collection_name.toString()} />
                            <LazyLoadImage effect="opacity" src={`data:image/png;base64,${item.thumbnail}`} alt="collection" className={classes.cardImage} />
                            <Typography className={classes.cardTitle}>{item.nft_name.toString()}</Typography>
                            <Typography className={classes.solTitle}>{item.price.toString()} SOL</Typography>
                        </Box>)
                    } else {
                        temp.push(<Box className={classes.card1} key={rowCount * len + i}>
                        </Box>);
                    }
                }
                rows.push(<Box key={len + 1} className={match5 ? classes.layer : classes.blockLayer}>{temp}</Box>)
            }
            return rows;
        }
    }
    /* create an account  */
    return (
        <Box className={classes.marketplagePage}>
            <Box className={classes.titleSection}>
                <Typography className={classes.title}>Marketplace</Typography>

                <Box className={classes.divSearch}>
                    <Box className={classes.searchContent}>
                        <Box className={classes.search}>
                            <Box className={classes.searchIcon} >
                                <IconButton className={classes.searchBtn}>
                                    <SearchIcon />
                                </IconButton>
                            </Box>
                            <Input className={classes.searchText} inputProps={{ style: { textAlign: 'center' } }}
                                endAdornment={
                                    <InputAdornment position="end">
                                        {
                                            searchText.length != 0 && <IconButton onClick={onClearSearch} edge="end" className={classes.iconBtn}>
                                                <ClearIcon />
                                            </IconButton>
                                        }
                                    </InputAdornment>
                                }
                                value={searchText} onChange={event => setSearchText(event.target.value)} placeholder='Search' onFocus={(e) => e.target.placeholder = ''} />
                        </Box>

                        <Box className={classes.searchSelect}>
                            <Select className={classes.select} id="demo-simple-select" value={priceSelect} onChange={e => handleChangePriceSelect(e.target.value)}>
                                {searchItems.map((item, index) =>
                                    <MenuItem className={classes.menuItem} key={index} value={searchItems[index]}>
                                        <CircleCheckBt checked={priceSelect === searchItems[index] ? true : false} />
                                        <ListItemText className={priceSelect === searchItems[index] ? classes.menuItemTextClick : classes.MenuItemText} primary={searchItems[index]} />
                                    </MenuItem>
                                )}
                            </Select>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box className={classes.centerDiv}>
                {collectionSummary.length != 0 &&
                    <Box className={classes.cardList1}>
                        <LazyLoadImage effect="opacity" placeholderSrc={window.location.origin + '/' + collectionSummary[0].collection_name + '_20.png'} src={window.location.origin + '/' + collectionSummary[0].collection_name + '.png'} alt="collection" className={classes.avatar} />
                        <Typography sx={{ fontWeight: '400', fontSize: '32px', marginBottom: '10px' }}>{collectionSummary[0].collection_name}</Typography>
                        <Box sx={{ marginLeft: '10%', marginRight: '10%' }}>
                            <Grid container spacing={6}>
                                <Grid item xs={6} lg={3}>
                                    <div className={classes.btnItems}>
                                        <Box className={classes.ellipsis}>TOTAL LISTED</Box>
                                        <Box className={classes.valueTxt}>{collectionSummary[0].total_listed_count}</Box>
                                    </div>
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <Box className={classes.btnItems}>
                                        <Box className={classes.ellipsis}>AVG TX PRICE</Box>
                                        <Box className={classes.valueTxt}>{collectionSummary[0].avg_sale_price_last_24h} SOL</Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <Box className={classes.btnItems} >
                                        <Typography className={classes.ellipsis}>TOTAL VOLUME</Typography>
                                        <Box className={classes.valueTxt}>{collectionSummary[0].total_volumn} SOL</Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <Box className={classes.btnItems}>
                                        <Box className={classes.ellipsis}>FLOOR PRICE</Box>
                                        <Box className={classes.valueTxt}>{collectionSummary[0].floor_price} SOL</Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                }
                {collectionSummary.length == 0 &&
                    <Box className={classes.cardList1}>
                        <LazyLoadImage effect="opacity" placeholderSrc={window.location.origin + '/' + "Aquarius" + '_20.png'} src={window.location.origin + '/' + "Aquarius" + '.png'} alt="collection" className={classes.avatar} />
                        <Typography sx={{ fontWeight: '400', fontSize: '32px', marginBottom: '10px' }}>Aquarius</Typography>
                        <Box sx={{ marginLeft: '10%', marginRight: '10%' }}>
                            <Grid container spacing={6}>
                                <Grid item xs={6} lg={3}>
                                    <div className={classes.btnItems}>
                                        <Box className={classes.ellipsis}>TOTAL LISTED</Box>
                                        <Box className={classes.valueTxt}>{0}</Box>
                                    </div>
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <Box className={classes.btnItems}>
                                        <Box className={classes.ellipsis}>AVG TX PRICE</Box>
                                        <Box className={classes.valueTxt}>{0} SOL</Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <Box className={classes.btnItems} >
                                        <Typography className={classes.ellipsis}>TOTAL VOLUME</Typography>
                                        <Box className={classes.valueTxt}>{0} SOL</Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} lg={3}>
                                    <Box className={classes.btnItems}>
                                        <Box className={classes.ellipsis}>FLOOR PRICE</Box>
                                        <Box className={classes.valueTxt}>{0} SOL</Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                }
                <Box className={classes.cardList}>
                    {showCard()}
                </Box>
            </Box>
            {loading && <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 5, paddingBottom: 5 }}>
                <CircularProgress disableShrink />
            </Box>}
            {selectedItem != null && <DetailModal open={showDetailModal} onClose={() => setShowDetailModal(false)} item={selectedItem} program={KNProgram} updatePage={() => setUpdateFlag(!updateFlag)} />}
            <ToastContainer />
        </Box>
    );
}
export default MarketPlace;