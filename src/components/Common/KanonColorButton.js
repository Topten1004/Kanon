import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import cn from 'classnames';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme) => ({
    kanonColorButton: {
        width: 'fit-content',
        textTransform: 'none !important',
        fontSize: '16px !important',
        color: 'white !important',
        fontFamily: 'Klavika !important',
        padding: '0px 24px !important',
        height: 48,
        background: `linear-gradient(135deg, #2d61e5 0%, #8a62f6 53.09%, #e3477e 100%) !important;
        box-shadow: 0px 0px 1px rgba(45, 97, 229, 0.24), 0px 2px 4px -1px rgba(10, 70, 82, 0.12),
            0px 16px 24px rgba(45, 97, 229, 0.24), 0px 8px 8px -4px rgba(45, 97, 229, 0.12) !important;
        border-radius: 12px !important`,
    },
    disableBtn: {
        width: 'fit-content',
        textTransform: 'none !important',
        fontSize: '16px !important',
        color: 'rgba(255, 255, 255, 0.3)',
        fontFamily: 'Klavika !important',
        padding: '0px 24px !important',
        height: 48,
        background: `linear-gradient(135deg, #2d61e5 0%, #8a62f6 53.09%, #e3477e 100%) !important;
        box-shadow: 0px 0px 1px rgba(45, 97, 229, 0.24), 0px 2px 4px -1px rgba(10, 70, 82, 0.12),
            0px 16px 24px rgba(45, 97, 229, 0.24), 0px 8px 8px -4px rgba(45, 97, 229, 0.12) !important;
        border-radius: 12px !important`,
    }
}));

const propTypes = {
	setValue: PropTypes.func,
	className: PropTypes.string,
};

const KanonColorButton = ({ children, onClick, className, disabled }) => {
    
    const classes = useStyles();

	return (
		<Button
            disabled={disabled}
			onClick={onClick}
			className={ disabled? cn(classes.disableBtn, className) : cn(classes.kanonColorButton, className)}
		>
			{children}
		</Button>
	);
}

KanonColorButton.propTypes = propTypes;

export default KanonColorButton;
