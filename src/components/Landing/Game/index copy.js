import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import { Button, Box, Link, CircularProgress, Typography, useMediaQuery } from '@mui/material';

import GameItem1 from '../../../assets/Landing/game1.png';
import GameItem2 from '../../../assets/Landing/game2.png';
import GameItem3 from '../../../assets/Landing/game3.png';
import GameItem4 from '../../../assets/Landing/game4.png';
import GameItem5 from '../../../assets/Landing/game5.png';
import GameItem6 from '../../../assets/Landing/game6.png';
import GameItem7 from '../../../assets/Landing/game7.png';
import GameItem8 from '../../../assets/Landing/game5.png';



import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    gamesSection: {
        display : "flex" ,
        justifyContent : "center" ,
        alignItems : "center" ,
        // minHeight: '600px !important',
        backgroundColor: '#27273e',
        position: 'relative',
        padding: '50px !important',
        [theme.breakpoints.down('md')]: {
            height: 'auto'
        } ,
    },
    mask: {
        position: 'absolute',
        // top: 16,
        // left: 180,
        width: '100%',
        height: '100%',
        backdropFilter: 'blur(108.731px)',
        borderRadius: 40,
        zIndex: 6,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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
        // marginLeft: 180,
        // width: 'calc(100% - 500px)',
        width: '90%',
        justifyContent: 'center',
        flexWrap: 'wrap',
        height: 'calc(100% - 100px)',
        // overflow: 'hidden',
        zIndex: 3,
        position: 'relative',
        // minWidth: '700px !important',
        [theme.breakpoints.down('md')]:{
            // width: 'calc(100% - 100px) !important',
            // height: '600px !important',
            minWidth: '380px !important',
            minHeight: '380px !important'
        },
    },
    cardDiv:{
        "&:hover": {
            transform: 'scale(1.5)',
            transition: '1s',
            cursor: 'pointer',
        },
    },
    card: {
        // width: 312,
        // height: 364,
        width: '20%',
        height: '30%',
        marginRight: 12,
        marginLeft: 12,
        marginTop: 24,
        borderRadius: 24,
        position: 'relative',
        [theme.breakpoints.down('md')]: {
            // maxHeight: '130px !important',
            width: '40%',
            height: '30% !important',
        },
        overflow : "hidden" ,
    },

    cardImage: {
        width: '100% !important',
        height: '100% !important',
        borderRadius: 12,
        backgroundRepeat: 'no-repeat !important',
        backgroundSize: 'auto !important',
        [theme.breakpoints.down('md')]: {
            height: '60%',
        },
    },
    cardTitle: {
        // position: 'absolute',
        fontSize: '20px !important',
        color: 'white',
        marginLeft: '24px !important',
        cursor: 'pointer',
        [theme.breakpoints.down('lg')]: {
            marginLeft: '24px !important',
            fontSize: '14px !important',
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '24px !important',
            fontSize: '20px !important',
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '24px !important',
            fontSize: '14px !important',
        },
    },
    titlePos: {
        position: 'absolute',
        width: 'calc(100% - 24px)',
        display: 'flex',
        top: '40%',
        justifyContent: 'center',
    },

}));


const GameSection = () => {

    const classes = useStyles();
    const isXs = useMediaQuery("(min-width:600px)");
    const gameImages = [GameItem1, GameItem2, GameItem3, GameItem4, GameItem5, GameItem6, GameItem7, GameItem8];
    const gameTitles = ['Powerball', 'Tile manipulation', 'Powerball', 'Tile manipulation', 'Powerball', 'Tile manipulation', 'Powerball', 'Tile manipulation'];

    /* create an account  */
    return (
        <Box>
            <Link id="games" href="#" />
            <Box className={classes.gamesSection}>
               
                <Box className={clsx(classes.cardList)}>
					{gameImages.map((item, index) =>
						<Box className={classes.card} key={index}>
                            <Box className={classes.cardDiv}>
                                <img src={item} alt="collection"  className={classes.cardImage}/>
                                <Box className={classes.titlePos}>
                                    <Typography className={classes.cardTitle}>{gameTitles[index]}</Typography>
                                </Box>
                            </Box>
						</Box>
					)}
				</Box>

            </Box>
        </Box>
    );
}

export default GameSection;