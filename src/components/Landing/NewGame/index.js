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

import CollectionItem1 from '../../../assets/Landing/Game/page_1.jpg';
import CollectionItem2 from '../../../assets/Landing/Game/page_2.jpg';
import CollectionItem3 from '../../../assets/Landing/Game/page_3.jpg';
import CollectionItem4 from '../../../assets/Landing/Game/page_4.jpg';
import LazyCollectionItem1 from '../../../assets/Landing/Game/page_1_loader.jpg';
import LazyCollectionItem2 from '../../../assets/Landing/Game/page_2_loader.jpg';
import LazyCollectionItem3 from '../../../assets/Landing/Game/page_3_loader.jpg';
import LazyCollectionItem4 from '../../../assets/Landing/Game/page_4_loader.jpg';
import GameVideo from '../../../assets/Landing/Game/page_5.mp4';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Slider from 'react-slick';

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
        paddingTop: 30,
        backgroundColor: '#27273E',
        textAlign: 'center',
        [theme.breakpoints.down('md')]: {
        },
        paddingBottom: 50,
    },
    title: {
        fontSize: 48,
        color: 'white',
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
    },
    marketplaceButton: {
        marginTop: '16px !important'
    },

    carousel: {
        marginTop: 32,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        '& .slide': {
            display: 'flex',
            alignItems: 'center'
        },
        '& .slick-prev': {
            display: 'none !important'
        },
        '& .slick-next': {
            display: 'none !important'
        },
        '& .slick-dots li button:before': {
            color: 'grey',
            opacity: '0.25',
            fontSize: '16px',
        },
        '& .slick-dots li button:hover:before': {
            opacity: '1',
        },
        '& .slick-dots li.slick-active button:before': {
            opacity: '0.75',
        },
        '& .slick-dots li': {
            margin :'0px 10px !important',
        }
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
        position: 'relative',
        cursor: 'pointer',
        width: '75% !important',
        [theme.breakpoints.down('xl')]: {
            width: '75% !important',
        }, [theme.breakpoints.down('lg')]: {
            width: '80% !important',
        },
        [theme.breakpoints.down('md')]: {
            width: '85% !important',
        },
        [theme.breakpoints.down('sm')]: {
            width: '90% !important',
        },
        '& span': {
            width: '100%',
            height: 700,
            [theme.breakpoints.down('xl')]: {
                height: '650px !important',
            }, [theme.breakpoints.down('lg')]: {
                height: '550px !important',
            },
            [theme.breakpoints.down('md')]: {
                height: '425px !important',
            },
            [theme.breakpoints.down('sm')]: {
                height: '300px !important',
            }
        }
    },
    cardImage: {

        // width: '1000px !important',
        width: '100%',
        height: 700,
        objectFit: 'fill',
        [theme.breakpoints.down('xl')]: {
            height: '650px !important',
        }, [theme.breakpoints.down('lg')]: {
            height: '550px !important',
        },
        [theme.breakpoints.down('md')]: {
            height: '425px !important',
        },
        [theme.breakpoints.down('sm')]: {
            height: '300px !important',
        }
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

const NewGame = () => {

    
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
    };

    const classes = useStyles();
    const navigate = useNavigate();
    const isXs = useMediaQuery("(max-width: 1200px)");
    const isXsMin = useMediaQuery("(max-width: 900px)");
    const collectionImages = [CollectionItem1, CollectionItem2, CollectionItem3, CollectionItem4, GameVideo];
    const LazycollectionImages = [LazyCollectionItem1, LazyCollectionItem2, LazyCollectionItem3, LazyCollectionItem4];


    /* create an account  */
    return (
        <Box>
            <Link id="collections" href="#collections" />
            <Box className={classes.collectionsSection}>
                
                <Box className={classes.title}>Games</Box>
                <Box className={classes.subTitle}>Quantum Noesis (coming soon)</Box>
                <Slider {...settings} className={clsx(classes.carousel)}
                >
                    {collectionImages.map((item, index) =>
                        <Box className={classes.card} key={index}>
                            {(index !== 4)?
                            <LazyLoadImage placeholderSrc={LazycollectionImages[index]} effect="opacity" src={item} alt="collection" className={clsx(classes.cardImage)} />:
                            <video
                                autoPlay
                                loop
                                muted
                                className={clsx(classes.cardImage)}
                            >
                                <source
                                    type="video/mp4"
                                    src={item}
                                    alt="collection"
                                />
                            </video>
                            }
                        </Box>
                    )}
                </Slider>
            </Box>
        </Box>
    );
}

export default NewGame;