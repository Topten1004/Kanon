import React from 'react';
import PropTypes from 'prop-types';
import { HashLink as Link } from 'react-router-hash-link';
import { makeStyles, useTheme } from '@mui/styles';
import { ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { styled } from '@mui/system';
import SwitchUnstyled, { switchUnstyledClasses } from '@mui/base/SwitchUnstyled';
const blue = {
  500: '#007FFF',
};

const grey = {
  400: '#BFC7CF',
  500: '#AAB4BE',
};

const Root = styled('span')`
  font-size: 0;
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
  margin: 10px;
  cursor: pointer;

  &.${switchUnstyledClasses.disabled} {
    opacity: 0.4;
    cursor: not-allowed;
  }

  & .${switchUnstyledClasses.track} {
    background: ${grey[400]};
    border-radius: 10px;
    display: block;
    height: 100%;
    width: 100%;
    position: absolute;
  }

  & .${switchUnstyledClasses.thumb} {
    display: block;
    width: 14px;
    height: 14px;
    top: 3px;
    left: 3px;
    border-radius: 16px;
    background-color: #fff;
    position: relative;
    transition: all 200ms ease;
  }

  &.${switchUnstyledClasses.focusVisible} .${switchUnstyledClasses.thumb} {
    background-color: ${grey[500]};
    box-shadow: 0 0 1px 8px rgba(0, 0, 0, 0.25);
  }

  &.${switchUnstyledClasses.checked} {
    .${switchUnstyledClasses.thumb} {
      left: 22px;
      top: 3px;
      background-color: #fff;
    }

    .${switchUnstyledClasses.track} {
      background: ${blue[500]};
    }
  }

  & .${switchUnstyledClasses.input} {
    cursor: inherit;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    z-index: 1;
    margin: 0;
  }
`;

const useStyles = makeStyles((theme) => ({
  menuItem: {
    color: 'white !important',
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
  rightIcon: {
    minWidth: '35px !important'
  },
  text: {
    color: "#E0E0FF",
    marginRight: '50px',
  },
  itemText: {
    paddingLeft: 20
  },
}));

const propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string,
};


const MenuItem = ({ status, title, image, onclick }) => {

  const classes = useStyles();
  const label = { componentsProps: { input: { 'aria-label': 'Demo switch' } } };

  return (
    <ListItem button className={classes.menuItem} onClick={onclick}>
      {image}
      <ListItemText primary={title} className={classes.itemText} />
      <ListItemIcon className={classes.rightIcon}>
        <SwitchUnstyled component={Root} {...label} checked={status == "dark"}/>
      </ListItemIcon>

    </ListItem>
  )
}
MenuItem.propTypes = {
  onClose: PropTypes.func,
};

export default MenuItem;