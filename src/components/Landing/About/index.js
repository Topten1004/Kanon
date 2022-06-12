import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import { Button, Box, Typography, Link, Fade, Grid, useMediaQuery } from '@mui/material';

import RoadmapImage from '../../../assets/Landing/roadmap_image2.png';

const useStyles = makeStyles((theme) => ({
    aboutSection: {
        // marginTop : "200px" ,
        height: 460,
        backgroundSize: '100% 100%',
        backgroundColor: '#202036',
        display: 'flex',
        // justifyContent: 'center',
        position: 'relative',
        flexWrap: 'wrap',
        [theme.breakpoints.down('md')]: {
            height: 600,
        }
    },
    title: {
        top: 100,
        left: '50%',
        fontSize: '48px !important',
        fontWeight: 'bold !important',
        color: 'white',
        position:"absolute" ,
        zIndex: 9,
        [theme.breakpoints.down('lg')]: {
            left: '60%',
        },
        [theme.breakpoints.down('md')]: {
            width: '80%',
            left: '10%',
            textAlign: 'center',
        }
    },
    contentText: {
        top : 194 ,
        left: '50%',
        position:"absolute" ,
        zIndex: 9,
        marginTop: '20px !important',
        color: 'rgba(224, 224, 255, 0.6)',
        lineHeight: '30px !important',
        fontSize: '18px !important',
        width: '40%',
        [theme.breakpoints.down('lg')]: {
            left: '60%',
            fontSize: '16px !important',
            marginTop: '0px !important',
        },
        [theme.breakpoints.down('md')]: {
            width: '80%',
            left: '10%',
            fontSize: '16px !important',
            marginTop: '10px !important',
            textAlign: 'center',
        }
    },
    logoImage: {
        position: 'absolute',
        left: 129,
        top: 60,
        height: 450,
        width: 450,
        zIndex: 6,
        // backgroundImage: `url(${RoadmapImage})`,
        backgroundSize: '100% 100%',
        [theme.breakpoints.down('lg')]:{
            width: 400,
            height: 400,
        },
        [theme.breakpoints.down('md')]: {
            left: '10%',
            top: 400,
            width: '80%',
            objectFit: 'contain',

            // height: '60%',
        }
    },
    content: {
        width: '50%',
        display: 'flex',
        flexDirection: 'column !important',
        padding: 50,
    },
}));


const AboutSection = () => {

    const classes = useStyles();
    /* create an account  */
    return (
        <Box>
            <Link id="about" href="#about"/>
            <Grid  className={classes.aboutSection}>
                <Fade in={true} sx={{transitionDelay: '1000ms'}}>
                    <Box container>
                        <Box className={classes.logo}>
                            <img className={classes.logoImage} src={RoadmapImage} alt='logo'/> 
                        </Box>
                        <Box className={classes.content}>
                            <Box component={"div"} className={classes.title}>About Kanon</Box>
                            <Box component={"div"} className={classes.contentText}>Kanon Exchange is the native marketplace and NFT minting platform for the Synesis One ecosystem. Kanon NFT is an ontology primitive, a fractional ownership unit of the Web3 Data Utility being built by Synesis DAO. All Kanon NFT holders are entitled to receive claimable SNS, Synesis DAO's governance token, based on how frequently the underlying keyword is accessed by AI companies to help train their conversational models</Box>
                        </Box>
                    </Box>
                </Fade>
            </Grid>
        </Box>
    );
}

export default AboutSection;