

import React from 'react' ;

import { useState } from 'react' ;

import {
    Accordion ,
    AccordionSummary,
    AccordionDetails,
    Box,
    Typography,
    List,
    ListItem
} from '@mui/material' ;


import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { makeStyles } from '@mui/styles' ;

const useStyles = makeStyles((theme) => ({
    root :{
        // propertyDiv: {
            marginTop: "24px",
            padding: 10,
            backgroundColor: "rgba(224, 224, 255, 0.02) !important",
            borderRadius: "12px !important",
            fontFamily: "Montserrat",
            color : "white !important" ,
        // },
        "&::before": {
            content: 'none !important'
        },
    
        "& svg" :{
            color: "rgba(224, 224, 255, 0.6) !important"
        },
        "& .MuiTypography-root": {
            fontSize: '18px !important',
        }
    }
})) ;

const AccordionPanel = (props) => {
    
    const classes = useStyles() ;

    const {
        title , 
        context,
        defaultExpanded,
    } = props ;

    const [expanded , setExpaned] = useState(defaultExpanded) ;

    const onChangeExpanded = () => {
        setExpaned(!expanded) ;
    }

    return (

        <Accordion  className={classes.root} defaultExpanded={defaultExpanded}>
            <AccordionSummary
                expandIcon={expanded ===false ? <AddIcon className={classes.expandIcon}/> : <RemoveIcon className={classes.expandIcon}/>}
                aria-controls={`panel1a-content-${title}`}
                id={`panel1a-header-${title}`}
                onClick={() => onChangeExpanded()}
            >
                <Typography sx={{fontSize: 18,}} >{title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                <Typography sx={{fontSize: 14, color: 'rgba(224, 224, 255, 0.8)'}} component="span"> {context} </Typography>
                </List>
            </AccordionDetails>
        </Accordion>

    )
}
export default AccordionPanel ;