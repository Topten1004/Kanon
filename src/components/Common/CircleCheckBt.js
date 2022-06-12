import React,{useState} from 'react' ;

import clsx from 'clsx';

import {
    Box
} from '@mui/material' ;

import CheckIcon from '@mui/icons-material/Check';

import { makeStyles } from '@mui/styles'; ;

const useStyles= makeStyles(() => ({
    root : {
        position : 'relative',

        border :"2px solid #FFFFFF",
        borderRadius : '50%',

        width : 25,
        height : 25,

        cursor : 'pointer',

        marginRight : 10
    },
    root1 : {
        border :"2px solid #df1f72 !important",
    },
    icon : {
        "& .MuiSvgIcon-root" :{
            color : "#df1f72",
            fontWeight: 'bold !important',
            fontSize : 24
        },
        position : 'absolute',

        left : 2,
        top : -6,

        zIndex : 40
    },
    eraseborder : {
        border : '5px solid #39354f',
        borderRadius : '50%',
        width : 5,
        height : 5,

        zIndex : 30,
        position : 'absolute',

        right : -3,
        top : 0,
        "&:hover" :{
            border : '5px solid #787878',
            borderRadius : '50%',
            width : 5,
            height : 5,
    
            zIndex : 500,
            position : 'absolute',
    
            right : -4,
            top : 2,
        }
    }
}))

const CircleChekcBt = (props) => {
    const classes = useStyles() ;

    const { checked } = props ;

    return (
        <Box className={clsx( classes.root ,checked &&  classes.root1)} >
            {
                checked && <>
                    <Box className={classes.icon}>
                        <CheckIcon />
                    </Box>
                    {/* <Box component={'span'} className={classes.eraseborder} /> */}
                </>
            }
        </Box>
    )
}

export default CircleChekcBt;