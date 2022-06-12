import React, { useState, useEffect } from 'react'
import { makeStyles } from '@mui/styles';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {IconButton} from '@mui/material';

const useStyles = makeStyles((theme) => ({
    toTop: {
        zIndex: 999999999,
        position: 'fixed !important',
        bottom: '60px',
        background: '#2D61E5 !important',
        color: 'white',
        "&:hover, &.Mui-focusVisible": {
            transition: '0.3s',
            color: '#397BA6',
            backgroundColor: '#DCDCDC'
        },
        [theme.breakpoints.up('xs')]: {
            right: 30,
            backgroundColor: 'rgb(220,220,220,0.7)',
        },
        [theme.breakpoints.up('lg')]: {
            right: 30,
        },
    }
})
)

const Scroll = ({
    showBelow,
}) => {

    const classes = useStyles();

    const [show, setShow] = useState(showBelow ? false : true)

    const handleScroll = () => {
        if (window.pageYOffset > showBelow) {
            if (!show) setShow(true)
        } else {
            if (show) setShow(false)
        }
    }

    const handleClick = () => {
        window[`scrollTo`]({ top: 0, behavior: `smooth` })
    }

    useEffect(() => {
        if (showBelow) {
            window.addEventListener(`scroll`, handleScroll)
            return () => window.removeEventListener(`scroll`, handleScroll)
        }
    })

    return (
        <div>
            {show &&
                <IconButton onClick={handleClick} className={classes.toTop} aria-label="to top" component="span">
                    <ExpandLessIcon />
                </IconButton>
            }
        </div>
    )
}
export default Scroll