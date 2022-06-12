import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import { Button, Box, Grid, Link, CircularProgress, Typography, useMediaQuery } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import GameItem1 from '../../../assets/Landing/aaa.png';
import GameItem2 from '../../../assets/Landing/game4.png';
import GameItem3 from '../../../assets/Landing/game6.png';
import GameItem4 from '../../../assets/Landing/game2.png';
import GameItem5 from '../../../assets/Landing/game1.png';
import GameItem6 from '../../../assets/Landing/game6.png';
import GameItem7 from '../../../assets/Landing/game3.png';
import GameItem8 from '../../../assets/Landing/game7.png';

const useStyles = makeStyles((theme) => ({
    gamesSection: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#27273e',
        position: 'relative',
        paddingTop: 150,
        paddingBottom: 100,
        // padding: '50px !important',
    },
    mask: {
        position: 'absolute',
        // top: 16,
        // left: 180,
        width: '100%',
        height: '100%',
        borderRadius: 24,
        zIndex: 6,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1,
    },
    maskText1: {
        fontSize: '48px !important',
        fontWeight: 'bold !important',
        color: 'white',
        marginTop: '24px !important'
    },
    maskText2: {
        fontSize: '20px !important',
        fontWeight: 'bold !important',
        color: 'white',
        marginTop: '12px !important'
    },
    cardList: {
        display: 'flex',
        width: '90%',
        borderRadius: 24,
        justifyContent: 'center',
        flexWrap: 'wrap',
        height: 'calc(100% - 100px)',
        // overflow: 'hidden',
        zIndex: 3,
        position: 'relative',
        // minWidth: '700px !important',
        [theme.breakpoints.down('md')]: {
            // width: 'calc(100% - 100px) !important',
            // height: 'clac(100%-150px) !important',
            minWidth: '380px !important',
            minHeight: '380px !important'
        },
    },
    card: {
        marginRight: 12,
        marginLeft: 12,
        marginTop: 24,
        paddingLeft: 24,
        paddingRight: 24,

        paddingTop: 24,
        background: `linear-gradient(
            135deg,
            rgba(245, 247, 250, 0.12) 0%,
            rgba(245, 247, 250, 0.06) 51.58%,
            rgba(245, 247, 250, 0.0001) 98.94%
        )`,
        borderRadius: 24,
        position: 'relative',
        [theme.breakpoints.down('md')]: {
            maxHeight: '400px !important'
        },
    },
    surface: {
        background: 'rgba(224, 224, 255, 0.02)',
        borderRadius: '24px',
        filter: 'blur(83px)',
    },
    cardImage: {
        width: '100% !important',
        borderRadius: '12px !important',
    },
    cardImage1: {
        // width: 264,
        // height: 264,
        width: '100% !important',
        height: '100% !important',
        borderRadius: 12,
    },
    cardTitle: {
        wordBreak: 'break-word',
        fontSize: '20px !important',
        color: 'white',
        marginTop: '5px !important',
        marginBottom: '15px !important',
        lineHeight: '1.2 !important',
        alignItems: 'center',
        [theme.breakpoints.down('lg')]: {
            fontSize: '16px !important',
        }
    },

}));


const GameSection = () => {

    const classes = useStyles();
    const isXs = useMediaQuery("(min-width:600px)");
    const gameImages = [GameItem1, GameItem2, GameItem3, GameItem4, GameItem5, GameItem6, GameItem7, GameItem8];
    const gameTitles = ['Quantum Noesis', 'Tile manipulation', 'Powerball', 'Tile manipulation', 'Powerball', 'Tile manipulation', 'Powerball', 'Tile manipulation'];

    /* create an account  */
    return (
        <Box>
            <Link id="games" href="#" />
            <Box className={classes.gamesSection}>

                <Box className={classes.cardList}>
                    <Box className={classes.mask}>
                        <CircularProgress size={120} thickness={2} />
                        <Typography className={classes.maskText1}>Games</Typography>
                        <Typography className={classes.maskText2}>Coming soon</Typography>
                    </Box>
                    <Grid container>
                        {gameImages.map((item, index) =>
                            <Grid item md={3} sm={6} xs={6} sx={{ display: 'flex', justifyContent: 'center', }} key={index}>
                                <Box className={classes.card}>
                                    <Box className={index !== 0 && classes.surface}>
                                        <LazyLoadImage effect="opacity" src={item} alt="collection" className={classes.cardImage} />

                                        <Typography className={classes.cardTitle}>{gameTitles[index]}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Box>


        </Box>
    );
}

export default GameSection;
