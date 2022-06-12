import React from 'react';
import PropTypes from 'prop-types';
import { HashLink as Link } from 'react-router-hash-link';
import { makeStyles, useTheme } from '@mui/styles';
import { ListItem, ListItemText, ListItemIcon } from '@mui/material';
import ARROWFORWARD_IMAGE from '../../../assets/Landing2/arrowforward.png';


const useStyles = makeStyles((theme) => ({
    menuItem: {
        color: 'white',
        fontSize: 20,
        cursor: 'pointer',
        marginRight: 50,
        fontWeight: 500,
        textDecoration: 'none',
        [theme.breakpoints.down('lg')]: {
            fontSize: '16px',
            marginRight: 30,
        },
    },
    itemText: {
        paddingLeft: 20
    },
    rightIcon: {
        minWidth: '35px !important'
    }
}));

const propTypes = {
    title: PropTypes.string.isRequired,
    link: PropTypes.string,
};

const MenuItem = ({ title, image, link, onClose }) => {

    const classes = useStyles();

    return (
        <Link smooth to={link} onClick={onClose}>
            <ListItem button className={classes.menuItem}>
                {image}
                <ListItemText primary={title} className={classes.itemText}/>
                <ListItemIcon className={classes.rightIcon}>
                    <img src={ARROWFORWARD_IMAGE} alt="arrowforward" />
                </ListItemIcon>

            </ListItem>
        </Link>
    )
}

MenuItem.propTypes = {
    onClose: PropTypes.func,
};

export default MenuItem;
