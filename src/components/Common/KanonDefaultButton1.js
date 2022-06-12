import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import cn from 'classnames';
import { makeStyles, withStyles } from '@mui/styles';

const propTypes = {
    setValue: PropTypes.func,
    className: PropTypes.string,
};

const useStyles = makeStyles((theme) => ({

    kanonDefaultButton: {
        width: "fit-content",
        height: "48px",
        padding: "0px 24px !important",
        fontSize: "16px !important",
        fontWeight: "500 !important",
        color: "white !important",
        textTransform: "none !important",
        fontFamily: "Klavika !important",
        background: "linear-gradient(\n        135deg,\n        rgba(245, 247, 250, 0.12) 0%,\n        rgba(245, 247, 250, 0.06) 51.58%,\n        rgba(245, 247, 250, 0.0001) 98.94%\n    ) !important",
        boxShadow: "0px 0px 1px rgba(45, 97, 229, 0.12), 0px 12px 24px rgba(45, 97, 229, 0.16),\n        0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04), 8px 8px 24px rgba(20, 16, 41, 0.4),\n        0px 8px 8px -4px rgba(45, 97, 229, 0.06), inset 0px 2px 6px rgba(45, 97, 229, 0.4) !important",
        backdropFilter: "blur(108.731px) !important",
        borderRadius: "12px !important"
    }
}));

const KanonDefaultButton = ({ children, onClick, className ,disabled}) => {

    const classes = useStyles();
    return (
        <Button 
            onClick={onClick}
            className={cn(classes.kanonDefaultButton, className)}
            disabled={disabled}
        >
            {children}
        </Button>
    );
}

KanonDefaultButton.propTypes = propTypes;

export default KanonDefaultButton;
