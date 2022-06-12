import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import { Button, Box, Typography, Link, Grid, useMediaQuery } from '@mui/material';
import { LeftArrow, RightArrow } from '../../Common/Arrow';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import KanonDefaultButton from '../../Common/KanonDefaultButton';
import KanonDefaultButton1 from '../../Common/KanonDefaultButton1';
import roadmapImage2 from '../../../assets/Landing/roadmap_image2.png';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    roadmapSection: {
        minHeight: "428px",
        backgroundColor: "#27273e",
        position: "relative",
        paddingLeft: "10%",
        paddingRight: "10%",
        paddingTop: 100,
        [theme.breakpoints.down('md')]:{
            paddingLeft: "80px",
            display: 'flex',
            flexDirection: 'column',
            minHeight: "700px",
        }
    },
    roadmapSection1: {
        minHeight: "428px",
        backgroundColor: "#27273e",
        position: "relative",
        paddingTop: 120,
        display: 'flex',
        justifyContent: 'flex-start',
    },
    titleSection: {
        minWidth: '15%',
        [theme.breakpoints.down('md')]: {
            minWidth: '15%',
            display: 'flex',
            flexDirection: 'column-reverse',
            height: 150,
        }
    },
    backButton: {
        minWidth: "48px",
        padding: "0px 17px !important",
    },
    nextButton: {
        marginLeft: '16px !important'
    },
    title: {
        marginTop: "32px !important",
        fontWeight: "bold !important",
        fontSize: "48px !important",
        lineHeight: "48px !important",
        letterSpacing: "-1px",
        color: "white",
        [theme.breakpoints.down('lg')]: {
            fontSize: "40px !important",
        }
    },
    cardList: {
        left: '30%',
        width: '60%',
        marginTop: "0px !important",
        zIndex: "3",
        position: "absolute",
        [theme.breakpoints.down('md')]: {
            left: '5%',
            marginTop: "200px !important",
            marginLeft: '60px !important',
            width: '80%',
            // width: '90%',
            // minWidth: '400px !important'
        }
    },
    card: {
        paddingTop: '0px !important',
        [theme.breakpoints.down('md')]:{
            display: 'flex',
            justifyContent: 'flex-start',
            // alignItems: 'center',
            marginBottom: '50px !important',
        },
    },
    cardDate: {
        color: "white",
        maxWidth: "64px !important",
        height: "64px",
        background: "linear-gradient(135deg, #2d61e5 0%, #8a62f6 53.09%, #e3477e 100%)",
        boxShadow: "0px 0px 1px rgba(45, 97, 229, 0.24), 0px 2px 4px -1px rgba(10, 70, 82, 0.12),\n                    0px 16px 24px rgba(45, 97, 229, 0.24), 0px 8px 8px -4px rgba(45, 97, 229, 0.12)",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column !important",
        alignItems: "center",
        justifyContent: "center",
        // [theme.breakpoints.down('lg')]:{
        //     width: '48px',
        //     height: '48px'
        // }
    },
    cardDateText1: {
        fontSize: "14px !important",
        fontWeight: "bold !important",
        // [theme.breakpoints.down('lg')]:{
        //     fontSize: "18px !important",
        // }
    },
    cardDateText2: {
        fontSize: "13px !important",
        fontWeight: "bold !important",
        color: "rgba(255, 255, 255, 0.8)",
        // [theme.breakpoints.down('lg')]:{
        //     fontSize: "10px !important",
        // }
    },
    cardContext: {
        
        [theme.breakpoints.down('md')]:{
            // maxWidth: '300px !important',
        },
    },
    cardTitle: {
        // marginTop: "24px !important",
        color: "white",
        fontSize: "24px !important",
        fontWeight: "bold !important"
    },
    cardText: {
        
        marginTop: "16px !important",
        color: "rgba(224, 224, 255, 0.6)",
        fontSize: "13px !important",
        lineHeight: "20px",
        mixBlendMode: "normal",
        zIndex: 9,
    },
    bar: {
        position: "relative",
        marginTop: 25,
        width: "100%",
        height: "6px",
        background: "rgba(224, 224, 255, 0.03)",
        mixBlendMode: "normal",
        borderRadius: "4px",
        [theme.breakpoints.down('md')]: {
            width: "6px",
            height: "300px",
            left: 30,
            // marginTop: 50,
        },
        // border: '1px solid red',
    },
    cardgrid: {
        position: 'absolute',
        top: '10px',
        [theme.breakpoints.down('md')]: {
            top: 0,
            left: 0,
        },
        [theme.breakpoints.down('sm')]: {
            top: 0,
            left: 0,
        }
    },
    roadmapImage2: {
        position: "absolute",
        backgroundImage: `url(${roadmapImage2})`,
        backgroundSize: "contain",
        width: "208px",
        height: "208px",
        top: "324px",
        left: "60%",
        zIndex: "3"
    },
    viewMore: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 100,
    },
    viewText: {
        marginBottom: "100px !important",
        color: "white",
        fontSize: "13px !important",
        lineHeight: "20px",
        mixBlendMode: "normal",
        fontSize: '18px !important',
        cursor: 'pointer',
    },
    mr30: {
        marginRight: '10% !important',
    },
    btnDiv: {
        
        // top: 200,
        
        // width: '80%',
        // objectFit: 'contain',
    },
    cardWrap:
    {
        maxWidth: '200px !important',
    }
}));

const roadmapList = [
    { date: "Feb 25-28", title: "Kanon NFT Minting:", text: "Aquarius Collection" },
    { date: "Mar 14", title: "Kanon NFT Staking Pool", text: "" },
    { date: "Mar 31", title: "Quantum Noesis Game,", text: "Book 1" },
    { date: "Aug 31", title: "Data Yield Farming ", text: "Mainnet Launch" },
]

const RoadmapSection = () => {

    const classes = useStyles();
    const isXs = useMediaQuery("(min-width:900px)");
    const [startCard, setStartCard] = useState(0);
    const [endCard, setEndCard] = useState(3);
    const [disabled1, setEnable1] = useState(true);
    const [disabled2, setEnable2] = useState(false);
    
    const onNextEvent = () =>{
        let temp1,temp2;
        temp1 = startCard + 1;
        setStartCard(temp1);
        temp2 = endCard + 1;
        setEndCard(temp2);
        if(temp1 >= 1)
            setEnable1(false);
        if(temp2 >= parseInt(roadmapList.length))
            setEnable2(true);
    } 
    const onPrevEvent = () =>{
        let temp1,temp2;
        temp1 = startCard - 1;
        setStartCard(temp1);
        temp2 = endCard - 1;
        setEndCard(temp2);
        if(temp1 < 1)
            setEnable1(true);
        if(temp1 < 3)
            setEnable2(false);
    } 
    /* create an account  */
    return (
        <Box>
            <Link id="roadmap" href="#" />
            <Grid container className={classes.roadmapSection} spacing={5}>
                <Box  className={classes.titleSection}>
                        
                    <Grid className={classes.btnDiv}>
                        <KanonDefaultButton disabled={disabled1} onClick={()=>onPrevEvent()} className={classes.backButton}>
                            <LeftArrow />
                        </KanonDefaultButton>
                        <KanonDefaultButton1 disabled={disabled2} onClick={()=>onNextEvent()} className={classes.nextButton}>
                            Next&nbsp;&nbsp;<RightArrow />
                        </KanonDefaultButton1>
                    </Grid>
                    <Grid item xs={12}>
                    <Typography className={classes.title}>Roadmap</Typography>
                    </Grid>
                </Box>
                <Box className={classes.cardList}>
                    <Box className={classes.bar} />
                    <Grid container spacing={2} className={classes.cardgrid}>
                        {roadmapList.slice(startCard,endCard).map((item, index) =>
                            <Grid item xs={isXs?4:12} className={classes.card} key={index}>
                                    <Grid item xs={isXs?12:3} className={clsx(classes.cardDate,classes.mr30)}>
                                        <Typography className={classes.cardDateText1}>{item.date}</Typography>
                                        <Typography className={classes.cardDateText2}>2022</Typography>
                                    </Grid>
                                    <Grid item xs={isXs?12:9} className={clsx(classes.cardContext)} style={{}} >
                                        <Typography className={classes.cardTitle}>
                                            {item.title}
                                        </Typography>
                                        <Typography className={classes.cardTitle}>
                                            {item.text}
                                        </Typography>
                                    </Grid>
                            </Grid>
                        )}
                    </Grid>

                </Box>
                {isXs &&<Box className={ classes.roadmapImage2} />}
            </Grid>
        </Box>
    );
}

export default RoadmapSection;