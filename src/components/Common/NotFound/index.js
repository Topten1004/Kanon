import React from "react";

import { makeStyles } from "@mui/styles";

import { Box } from "@mui/material";
import styles from './style.css';

const useStyles = makeStyles((theme) => ({

    root: {
        position: 'relative',
        height: 'calc(100vh-40px)',
        background: '#202036',
    },
}))
const NotFound = () => {

    const classes = useStyles();
    return (

        <Box id="notfound" className={classes.root}>
            <Box className="notfound">
                <Box className="notfound-404">
                    <h3>Oops! Page not found</h3>
                    <h1><span>4</span><span>0</span><span>4</span></h1>
                </Box>
                <h2>we are sorry, but the page you requested was not found</h2>
            </Box>
        </Box>
    );
}

export default NotFound;