import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import { Button, Box, Typography, useMediaQuery, Grid } from '@mui/material';
import KanonColorButton from '../../Common/KanonColorButton';
import { RightArrow } from '../../Common/Arrow';
import { Carousel } from 'react-responsive-carousel';
import { useSelector, useDispatch } from "react-redux";
import CollectionItem1 from '../../../assets/Landing/Collections/synesis_test01b.jpg';
import CollectionItem2 from '../../../assets/Landing/Collections/synesis_test05b.jpg';
import CollectionItem3 from '../../../assets/Landing/Collections/synesis_test02c.jpg';
import CollectionItem4 from '../../../assets/Landing/Collections/synesis_test04b.jpg';
import CollectionItem5 from '../../../assets/Landing/Collections/synesis_test01d.jpg';
import CollectionItem6 from '../../../assets/Landing/Collections/synesis_test02d.jpg';
import CollectionItem7 from '../../../assets/Landing/Collections/synesis_test03b.jpg';
import CollectionItem8 from '../../../assets/Landing/Collections/synesis_test05d.jpg';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import MarketplaceImage from '../../../assets/Landing/marketplace_image.png';

const useStyles = makeStyles((theme) => ({
    marketplaceSection: {
        backgroundColor: "#202036",
        paddingBottom: 50,
        position: "relative",
        [theme.breakpoints.down('md')]: {
        }
    },
    titleSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '150px',
        paddingLeft: "180px",
        paddingRight: "180px",
        [theme.breakpoints.down('md')]: {
            paddingLeft: "30px",
            paddingRight: "px",
            paddingBottom: '30px',
            paddingTop: '100px',
            flexDirection: 'column',
            justifyContent: 'center',
        },
    },
    title: {
        fontSize: "36px !important",
        color: "white",
        fontWeight: "bold !important",
        [theme.breakpoints.down('md')]: {
            paddingLeft: '0px',
            paddingBottom: '30px',
            textAlign: 'center',
        }
    },
    marketplaceButton: {
        marginTop: "24px !important",
        marginRight: '180px',
        marginTop: '115px',
        [theme.breakpoints.down('md')]: {
        },
    },
    cardList: {
        display: "flex",
        marginTop: "50px",
        marginLeft: '10%',
        marginRight: '10%',
        justifyContent: "center",
        flexWrap: "wrap",
        overflow: "hidden",
        position: "relative",
        zIndex: "12"
    },
    card: {
        width: 300,
        height: 'fit-content',
        marginRight: 24,
        marginTop: 24,
        '&:hover': {
            border: '1px solid #2D61E5',
            cursor: 'pointer'
        },
        background: '#212335',
        border: '1px solid rgba(245, 247, 250, 0.06)',
        boxSizing: 'border-box',
        boxShadow: `0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04),
        8px 8px 24px rgba(20, 16, 41, 0.4)`,
        backdropFilter: 'blur(108.731px)',
        borderRadius: 24,
        position: 'relative'
    },
    cardImage: {
        width: "250px",
        height: "264px",
        borderRadius: "12px",
        margin: "24px",
        marginBottom: 0,
    },
    carousel: {
        marginRight: "50px",
        marginLeft: "50px",
        marginTop: 32,
        marginLeft: 32,
        display: 'none',
        [theme.breakpoints.down('md')]: {
            marginRight: "20px",
            marginLeft: "20px",
            display: 'block'
        },
        '& .slide': {
            display: 'flex',
            alignItems: 'center'
        },
    },
    card1: {
        '&:hover': {
            border: '1px solid #2D61E5'
        },
        width: 648,
        // width: '30%',
        // height: 648,
        background: '#212335',
        border: `1px solid rgba(245, 247, 250, 0.06)`,
        boxSizing: `border-box`,
        boxShadow: `0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04),
            8px 8px 24px rgba(20, 16, 41, 0.4)`,
        backdropFilter: `blur(108.731px)`,
        borderRadius: 24,
        position: 'relative',
        cursor: 'pointer',

        [theme.breakpoints.down('xl')]: {
            width: '450px !important',
            // height: '450px !important',
        },
        [theme.breakpoints.down('lg')]: {
            width: '350px !important',
            // height: '350px !important',
        },
        [theme.breakpoints.down('md')]: {
            width: '250px !important',
            // height: '250px !important',
        },
    },
    cardImage1: {
        width: '600px !important',
        height: 600,
        borderRadius: 24,
        margin: 24,
        marginBottom: 5,
        [theme.breakpoints.down('xl')]: {
            width: '400px !important',
            height: '400px !important',
        }, [theme.breakpoints.down('lg')]: {
            width: '300px !important',
            height: '300px !important',
        },
        [theme.breakpoints.down('md')]: {
            width: '200px !important',
            height: '200px !important',
        },
    },
    cardTitle: {
        fontSize: "14px !important",
        color: "white",
        marginLeft: "24px",
        marginRight: 24,
        marginTop: 5,
        marginBottom: 15,
        [theme.breakpoints.down('md')]: {
            textAlign: 'left'
        },
        // cursor: "pointer",
        "& hover": {
            textDecoration: 'underline'
        }
    },
    tag: {
        fontSize: "13px",
        fontFamily: 'Montserrat',
        height: "24px",
        borderRadius: "12px",
        width: "fit-content",
        display: "flex",
        alignItems: "center",
        color: "white",
        paddingLeft: "8px",
        paddingRight: "8px",
        position: "absolute",
        right: "40px",
        top: "40px"
    },
}));

const MarketplaceSection = () => {

    const schedule = useSelector(state => state.main.schedule);
    const allcollections = useSelector(state => state.main.allcollections);
    const [collections, setCollections] = useState([]);

    const collectionImages = [CollectionItem1, CollectionItem2, CollectionItem3, CollectionItem4, CollectionItem5, CollectionItem6, CollectionItem7, CollectionItem8];
    const titleList = ["Technology#234", 'Reality#310', 'Brain#110', 'You#201', 'Technology#403', 'Brain#222', 'Inconsequential#100', 'Reality#222']
    const typeList = [1, 3, 4, 2, 4, 2, 3, 1];
    const classes = useStyles();
    const dispatch = useDispatch();

    const Tag = ({ type }) => {
        return (<Box className={classes.tag} sx={{ backgroundColor: '#2D61E5', zIndex: 9 }}>{type}</Box>);
    }
    useEffect(() => {
        setCollections([]);
        if (allcollections.length !== 0) {
            let len = 0;
            let datas = [];
            for (let i = allcollections.length - 1; i >= 0; i--) {
                if (allcollections[i].metadata != null) {
                    datas.push(allcollections[i]);
                    len++;
                }
            }
        }
    }, [allcollections])
    /* create an account  */
    return (
        <Box className={classes.marketplaceSection}>
            <Box className={classes.titleSection}>
                <Typography className={classes.title}>Featured items</Typography>
                <KanonColorButton className={classes.marketplaceButton}>
                    See all&nbsp;&nbsp;<RightArrow />
                </KanonColorButton>
            </Box>
            {schedule != 5 ? <> <Box className={classes.cardList} sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}>
                {collectionImages.map((item, index) =>
                    <Box className={classes.card} key={index} sx={index % 2 === 1 ? { marginTop: '100px' } : {}}>
                        <Tag type={"Aquarius"} />
                        <LazyLoadImage effect="opacity" src={item} alt="collection" className={classes.cardImage} />
                        <Box className={classes.cardTitle}>{titleList[index]}</Box>
                    </Box>
                )}
            </Box>
                <Carousel
                    className={classes.carousel}
                    showArrows={false}
                    emulateTouch={true}
                    showStatus={false}
                    autoPlay={true}
                    stopOnHover={true}
                    showThumbs={false}
                    infiniteLoop={true}
                    showIndicators={false}
                    centerMode={false} >
                    {collectionImages.map((item, index) =>
                        <Box className={classes.card1} key={index}>
                            <Tag type={"Aquarius"} />
                            <LazyLoadImage effect="opacity" src={item} alt="collection" className={classes.cardImage1} />
                            <Box className={classes.cardTitle}>{titleList[index]}</Box>
                        </Box>
                    )}
                </Carousel></> :
                <> <Box className={classes.cardList} sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }}>
                    {collections.map((item, index) =>
                        <Box className={classes.card} key={index} sx={index % 2 === 1 ? { marginTop: '100px' } : {}}>
                            <Tag type={item.metadata.metadataExternal.collection.name} />
                            <LazyLoadImage effect="opacity" src={`data:image/png;base64,${item.metadata.thumb}`} alt="collection" className={classes.cardImage} />
                            <Box className={classes.cardTitle}>{item.metadata.metadataExternal.name}</Box>
                        </Box>
                    )}
                </Box>
                    <Carousel
                        className={classes.carousel}
                        showArrows={false}
                        emulateTouch={true}
                        showStatus={false}
                        autoPlay={true}
                        stopOnHover={true}
                        showThumbs={false}
                        infiniteLoop={true}
                        showIndicators={false}
                        centerMode={false} >
                        {collections.map((item, index) =>
                            <Box className={classes.card1} key={index}>
                                <Tag type={item.metadata.metadataExternal.collection.name} />
                                <LazyLoadImage effect="opacity" src={`data:image/png;base64,${item.metadata.thumb}`} alt="collection" className={classes.cardImage1} />
                                <Box className={classes.cardTitle}>{item.metadata.metadataExternal.name}</Box>
                            </Box>
                        )}
                    </Carousel></>
            }
        </Box>
    );
}

export default MarketplaceSection;