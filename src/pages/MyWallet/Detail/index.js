import React from "react";
import Detail from '../../../components/MyWallet/Detail';
import { makeStyles } from "@mui/styles";
import { Box } from "@mui/material";

const useStyles = makeStyles(theme =>({
    
    root: {
        display: 'flex',
        minHeight: "100vh",
        backgroundColor: "#202036",
        fontFamily: 'Klavika',
    },

}))
const WalletDetail = (props) => {

    const classes = useStyles();
    return(
        <Box className={classes.root}>
            <Detail/>
        </Box>
    );
}

export default WalletDetail;