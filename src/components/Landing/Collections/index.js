import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import { IconButton, Button, Box, Grid, Link, useMediaQuery } from '@mui/material';
import KanonColorButton from '../../Common/KanonColorButton';
import { RightArrow } from '../../Common/Arrow';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import CollectionItem1 from '../../../assets/Landing/Collections/synesis_test01b400.jpg';
import CollectionItem2 from '../../../assets/Landing/Collections/synesis_test01c400.jpg';
import CollectionItem3 from '../../../assets/Landing/Collections/synesis_test01d400.jpg';
import CollectionItem4 from '../../../assets/Landing/Collections/synesis_test02b400.jpg';
import CollectionItem5 from '../../../assets/Landing/Collections/synesis_test02c400.jpg';
import CollectionItem6 from '../../../assets/Landing/Collections/synesis_test02d400.jpg';
import CollectionItem7 from '../../../assets/Landing/Collections/synesis_test03b400.jpg';
import CollectionItem8 from '../../../assets/Landing/Collections/synesis_test03c400.jpg';
import CollectionItem9 from '../../../assets/Landing/Collections/synesis_test03d400.jpg';
import CollectionItem10 from '../../../assets/Landing/Collections/synesis_test04b400.jpg';
import CollectionItem11 from '../../../assets/Landing/Collections/synesis_test04c400.jpg';
import CollectionItem12 from '../../../assets/Landing/Collections/synesis_test04d400.jpg';
import CollectionItem13 from '../../../assets/Landing/Collections/synesis_test05b400.jpg';
import CollectionItem14 from '../../../assets/Landing/Collections/synesis_test05c400.jpg';
import CollectionItem15 from '../../../assets/Landing/Collections/synesis_test05d400.jpg';
import LazyCollectionItem1 from '../../../assets/Landing/Collections/synesis_test01b20.jpg';
import LazyCollectionItem2 from '../../../assets/Landing/Collections/synesis_test01c20.jpg';
import LazyCollectionItem3 from '../../../assets/Landing/Collections/synesis_test01d20.jpg';
import LazyCollectionItem4 from '../../../assets/Landing/Collections/synesis_test02b20.jpg';
import LazyCollectionItem5 from '../../../assets/Landing/Collections/synesis_test02c20.jpg';
import LazyCollectionItem6 from '../../../assets/Landing/Collections/synesis_test02d20.jpg';
import LazyCollectionItem7 from '../../../assets/Landing/Collections/synesis_test03b20.jpg';
import LazyCollectionItem8 from '../../../assets/Landing/Collections/synesis_test03c20.jpg';
import LazyCollectionItem9 from '../../../assets/Landing/Collections/synesis_test03d20.jpg';
import LazyCollectionItem10 from '../../../assets/Landing/Collections/synesis_test04b20.jpg';
import LazyCollectionItem11 from '../../../assets/Landing/Collections/synesis_test04c20.jpg';
import LazyCollectionItem12 from '../../../assets/Landing/Collections/synesis_test04d20.jpg';
import LazyCollectionItem13 from '../../../assets/Landing/Collections/synesis_test05b20.jpg';
import LazyCollectionItem14 from '../../../assets/Landing/Collections/synesis_test05c20.jpg';
import LazyCollectionItem15 from '../../../assets/Landing/Collections/synesis_test05d20.jpg';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    arrowStyles: {
        position: 'absolute !important',
        zIndex: 2,
        top: 'calc(50% - 15px)',
        width: 50,
        height: 50,
        cursor: 'pointer',
    },
    collectionsSection: {
        position: 'relative',
        backgroundColor: '#27273E',
        textAlign: 'center',
        [theme.breakpoints.down('md')]: {
        },
        paddingBottom: 50,
    },
    title: {
        paddingTop: 230,
        fontSize: 48,
        color: 'white',
        textAlign: 'center',
        lineHeight: '48px',
        fontWeight: 'bold'
    },
    marketplaceButton: {
        marginTop: '16px !important'
    },

    carousel: {
        marginRight: "200px",
        marginLeft: "200px",
        marginTop: 32,
        ['@media (max-width:1500px)']: {
            marginRight: "100px",
            marginLeft: "100px",
        },
        ['@media (max-width:1300px)']: {
            marginRight: "20px",
            marginLeft: "20px",
        },
        [theme.breakpoints.down('lg')]: {
            marginRight: "50px",
            marginLeft: "50px",
        },
        ['@media (max-width:1000px)']: {
            marginRight: "0px",
            marginLeft: "0px",
        },

        [theme.breakpoints.down('md')]: {
            marginRight: "100px",
            marginLeft: "100px",
        },
        [theme.breakpoints.down('sm')]: {
            marginRight: "20px",
            marginLeft: "20px",
        },
        '& .slide': {
            display: 'flex',
            alignItems: 'center'
        },
    },
    carouselLgMode: {
        marginRight: "50px",
        marginLeft: "50px",
        '& .slide': {
            display: 'flex',
            alignItems: 'center'
        },
    },
    card: {
        width: 448,
        // width: '30%',
        height: 448,

        background: '#212335',
        border: `1px solid rgba(245, 247, 250, 0.06)`,
        '&:hover': {
            border: '1px solid #2D61E5'
        },
        boxSizing: `border-box`,
        boxShadow: `0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04),
            8px 8px 24px rgba(20, 16, 41, 0.4)`,
        backdropFilter: `blur(108.731px)`,
        borderRadius: 40,
        position: 'relative',
        cursor: 'pointer',

        [theme.breakpoints.down('xl')]: {
            width: '450px !important',
            height: '450px !important',
        },
        [theme.breakpoints.down('lg')]: {
            width: '350px !important',
            height: '350px !important',
        },
        [theme.breakpoints.down('md')]: {
            width: '250px !important',
            height: '250px !important',
        },
        '& span': {
            zIndex: 9,
            width: '400px !important',
            height: 400,
            borderRadius: 24,
            margin: 24,
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
        }
    },
    cardImage: {

        width: '400px !important',
        height: 400,
        borderRadius: 24,

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
        fontSize: 20,
        color: 'white',
        marginLeft: 24,
        cursor: 'pointer',
        "& hover": {
            textDecoration: 'underline'
        }
    },
    tag: {
        fontSize: 13,
        fontFamily: "Montserrat",
        height: 24,
        borderRadius: 12,
        width: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        paddingLeft: 8,
        paddingRight: 8,
        // position: 'absolute',
        right: 40,
        top: 40,
    },
    collectionCard: {
        display: 'flex',
        justifyContent: 'center'
    }
}));

const CollectionsSection = () => {

    const classes = useStyles();
    const navigate = useNavigate();
    const isXs = useMediaQuery("(max-width: 1200px)");
    const isXsMin = useMediaQuery("(max-width: 900px)");
    const collectionImages = [CollectionItem1, CollectionItem2, CollectionItem3, CollectionItem4, CollectionItem5, CollectionItem6, CollectionItem7, CollectionItem8, CollectionItem9, CollectionItem10, CollectionItem11, CollectionItem12, CollectionItem13, CollectionItem14, CollectionItem15];
    const lazycollectionImages = [LazyCollectionItem1, LazyCollectionItem2, LazyCollectionItem3, LazyCollectionItem4, LazyCollectionItem5, LazyCollectionItem6, LazyCollectionItem7, LazyCollectionItem8, LazyCollectionItem9, LazyCollectionItem10, LazyCollectionItem11, LazyCollectionItem12, LazyCollectionItem13, LazyCollectionItem14, LazyCollectionItem15];

    const collenctionsLarge = () => {
        let rows = [];
        for (let i = 0; i < parseInt(collectionImages.length / 2); i++) {
            rows.push(<Grid key={i} container spacing={2}>
                <Grid item xs={6} className={classes.collectionCard}>
                    <Box className={clsx(classes.card)}>
                        <LazyLoadImage placeholderSrc={lazycollectionImages[i * 2]} effect="opacity" src={collectionImages[i * 2]} alt="collection" className={clsx(classes.cardImage, isXs && !isXsMin && classes.cardImageLgMode)} />
                    </Box>
                </Grid>
                <Grid item xs={6} className={classes.collectionCard}>
                    <Box className={clsx(classes.card)}>
                        <LazyLoadImage effect="opacity" placeholderSrc={lazycollectionImages[i * 2 + 1]} src={collectionImages[i * 2 + 1]} alt="collection" className={clsx(classes.cardImage, isXs && !isXsMin && classes.cardImageLgMode)} />
                    </Box>
                </Grid>
            </Grid>);
            if ((i + 1) * 2 + 1 == collectionImages.length) {
                rows.push(<Box className={clsx(classes.card)} key={collectionImages.length}>
                    <LazyLoadImage effect="opacity" placeholderSrc={lazycollectionImages[collectionImages.length - 1]} src={collectionImages[collectionImages.length - 1]} alt="collection" className={clsx(classes.cardImage, isXs && !isXsMin && classes.cardImageLgMode)} />
                </Box>)
            }
        }
        return rows;
    }
    /* create an account  */
    return (
        <Box>
            <Link id="collections" href="#collections" />
            <Box className={classes.collectionsSection}>
                <Box className={classes.title}>The Aquarius Collection</Box>
                <KanonColorButton className={classes.marketplaceButton} onClick={() => navigate("/marketplace")}>
                    Marketplace&nbsp;&nbsp;&nbsp;<RightArrow />
                </KanonColorButton>
                <Carousel className={clsx(classes.carousel)}
                    renderArrowPrev={(onClickHandler, hasPrev, label) =>
                        <Box className="control-arrow control-prev">
                            <IconButton onClick={onClickHandler} sx={{ width: 50, height: 50 }}>
                                <ArrowBackIosNewIcon />
                            </IconButton>
                        </Box>
                    }
                    renderArrowNext={(onClickHandler, hasNext, label) =>
                        <Box className="control-arrow control-next" >
                            <IconButton onClick={onClickHandler} sx={{ width: 50, height: 50 }}>
                                <ArrowForwardIosIcon />
                            </IconButton>
                        </Box>
                    }
                    showArrows={true}
                    emulateTouch={true}
                    showStatus={false}
                    autoPlay={true}
                    stopOnHover={true}
                    showThumbs={false}
                    infiniteLoop={true}
                    showIndicators={false}
                    centerMode={false} >
                    {isXsMin ? collectionImages.map((item, index) =>
                        <Box className={clsx(classes.card)} key={index}>
                            <LazyLoadImage placeholderSrc={lazycollectionImages[index]} effect="opacity" src={item} alt="collection" className={clsx(classes.cardImage)} />
                        </Box>
                    ) :
                        collenctionsLarge()
                    }
                </Carousel>
            </Box>
        </Box>
    );
}

export default CollectionsSection;