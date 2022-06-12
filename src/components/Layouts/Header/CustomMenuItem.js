import React from 'react';
import PropTypes from 'prop-types';
import { HashLink as Link } from 'react-router-hash-link';
import { makeStyles, useTheme } from '@mui/styles';


const useStyles = makeStyles((theme) => ({
    menuItem: {
        color: 'white',
        fontSize: 20,
        cursor: 'pointer',
        marginRight: 20,
        marginLeft: 20,
        fontWeight: 500,
        textDecoration: 'none',

    }
}));

const propTypes = {
    title: PropTypes.string.isRequired,
    link: PropTypes.string,
    step: PropTypes.number
};

const MenuItem = ({ title, link, step }) => {

    const classes = useStyles();

    return (
        <Link smooth className={classes.menuItem} to={(link === '/marketplace'  && step !== 5) ? '#':link}>
            {title}
        </Link>
    )
}

MenuItem.propTypes = propTypes;

export default MenuItem;
