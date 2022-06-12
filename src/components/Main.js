import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import { withStyles } from "@mui/styles";
import { makeStyles, useTheme } from '@mui/styles';
import Header from "./Layouts/Header/index.js";
import Footer from "./Layouts/Footer";
import Routing from "./Routes";
import { Box } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Scroll from "./Common/Scroll.js";
import LoadSpinner from '../components/Common/LoadSpinner/LoadSpinner';
import { useSelector, useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
    },
    loading: {
        top: 0,
        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: 9999999999999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(2px)',
        marginTop: 90
    }
}));

function Main(props) {
    const classes = useStyles();
    const isLoading = useSelector(state => state.main.loading);

    // useEffect(()=>{
    // window.addEventListener("load",handleLoading);
    // return () => window.removeEventListener("load",handleLoading);
    // },[])
    return (
        <Box>
            <Box className={classes.root}>
                {isLoading && <Box className={classes.loading}> <LoadSpinner /></Box>}
                <Header />
                <Routing />
                <Footer />
                <Scroll showBelow={250} />
            </Box>
        </Box>

    );
}


export default Main;
