import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import { Button, Box, Typography } from '@mui/material';
import FAQPage from '../../components/FAQ';

const useStyles = makeStyles((theme) => ({

    landingPage: {
        fontFamily: 'Klavika'
    }
    
}));

const Faq = () => {

    const classes = useStyles();
    /* create an account  */
    return (
        <Box className={classes.landingPage}>
            <FAQPage/>
        </Box>
    );
}

export default Faq;