import React, { useEffect, useMemo, useState } from 'react';
import { makeStyles, withStyles } from '@mui/styles';
import { Button, Box, Typography, Link, useMediaQuery, Dialog, IconButton } from '@mui/material';

import Footerbg from '../../../assets/footer_bg.png';
import Logo from '../../../assets/logo.png';
import DISCORD_IMAGE from '../../../assets/Landing2/discord.png';
import MEDIUM_IMAGE from '../../../assets/Landing2/medium.png';
import TELEGRAM_IMAGE from '../../../assets/Landing2/telegram.png';
import TWITTER_IMAGE from '../../../assets/Landing2/twitter.png';

import CloseIcon from '@mui/icons-material/Close';
import HtmlFile from './HtmlFile';
const useStyles = makeStyles((theme) => ({
    footer: {
        width: "100%",
        height: "76px",
        color: "rgba(224, 224, 255, 0.6)",
        backgroundColor: "#202036",
        backgroundSize: "100% 100%",
        backgroundImage: `url(${Footerbg})`,
        display: "flex",
        alignItems: "center",
        position: "relative",
        [theme.breakpoints.down('md')]: {
            display: "flex",
            alignItems: 'flex-start',
            flexDirection: 'column',
            height: "300px",
            paddingLeft: "30px",
            paddingRight: "30px",
        }
    },
    footer1: {
        position:'fixed',
        width: "100%",
        height: "52px",
        color: "rgba(224, 224, 255, 0.6)",
        backgroundColor: "#152332",
        backgroundSize: "100% 100%",
        // backgroundImage: `url(${Footerbg})`,
        display: "flex",
        alignItems: "center",
        position: "relative",
        ['@media (max-width:500px)']: {
            // flexDirection:'column',
            height: '160px',
        }
    },
    text1: {
        position: 'absolute',
        fontSize: "14px !important",
        left: 180,
        [theme.breakpoints.down('md')]: {
            top: 250,
            marginBottom: '20px !important',
        }
    },
    text11: {
        position: 'absolute',
        fontSize: "14px !important",
        left: 100,
        [theme.breakpoints.down('md')]: {
            top: 250,
            left: 50,
            marginBottom: '20px !important',
        }
    },
    text5: {
        fontSize: "14px !important",
        cursor: "pointer",
        "&:hover": {
            textDecoration: 'underline',
        },
        marginBottom: '20px !important',
        marginLeft: '20px !important',
        color: 'white !important'
    },
    text2: {
        fontSize: "14px !important",
        marginLeft: "500px !important",
        cursor: 'pointer',
        "&:hover": {
            textDecoration: 'underline !important',
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '0px !important',
            marginBottom: '20px !important',
        }
    },
    text22: {
        fontSize: "14px !important",
        marginLeft: "420px !important",
        cursor: 'pointer',
        "&:hover": {
            textDecoration: 'underline !important',
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px !important',
            marginBottom: '20px !important',
            color: 'white !important'
        }
    },
    text3: {
        fontSize: "14px !important",
        marginLeft: '48px !important',
        cursor: "pointer",
        "&:hover": {
            textDecoration: 'underline',
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px !important',
            color: 'white !important'
        }
    },
    text4: {
        fontSize: "14px !important",
        position: 'absolute',
        right: 180,
        "& a": {
            float: "right", 
            margin: "0px", 
            marginLeft: "10px", 
            color: "white", 
            textDecoration: "none"
        },
        [theme.breakpoints.down('md')]: {
            top: 250,
        }
    },
    text44: {
        fontSize: "14px !important",
        position: 'absolute',
        right: 100,
        "& a": {
            float: "right", 
            margin: "0px", 
            marginLeft: "10px", 
            color: "white", 
            textDecoration: "none"
        },
        [theme.breakpoints.down('md')]: {
            top: 250,
            right: 50,
        }
    },
    logo: {
        margin: '21px 24px',
        marginTop: '50px',
    },
    logoImage: {
        
        height:'52px',
    },
    document: {
        background: "#E0E0FF",
    },
    docs: {
        paddingRight: '20px',
        width: "100%",
        display: 'flex',
        justifyContent: 'space-between',
    },
    menuItem: {
        width: "27px",
        objectFit: "contain",
        marginLeft: "16px",
        marginRight: "16px",
        cursor: "pointer",
        display: "flex",        
        ['@media (max-width:500px)']: {
            marginLeft: '20px',
            marginRight: '20px',
        }
    },
    social: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        
        ['@media (max-width:500px)']: {
            marginTop: '20px',
        }
    },
    modal: {        
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        height: 200,
        padding: 30,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#07aabb',
        bgcolor: 'background.paper',
        // border: "1px solid rgba(245, 247, 250, 0.06)",
        // boxSizing: 'border-box',
        // boxShadow: "0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04), 8px 8px 24px rgba(20, 16, 41, 0.4)",
    },
    exploreButton: {
        width: '100px',
        height: 56,
        textTransform: 'none !important',
        fontSize: '18px !important',
        fontFamily: 'Klavika !important',
        padding: '0px 14px !important',
        background: `linear-gradient(135deg, #2d61e5 0%, #8a62f6 53.09%, #e3477e 100%) !important`,
        boxShadow: `0px 0px 1px rgba(45, 97, 229, 0.24), 0px 2px 4px -1px rgba(10, 70, 82, 0.12),
            0px 16px 24px rgba(45, 97, 229, 0.24), 0px 8px 8px -4px rgba(45, 97, 229, 0.12) !important`,
            
        borderRadius: `12px !important`,
    },
    detailModal: {
        fontFamily: 'Klavika',
        zIndex: '10000 !important',
        maxHeight: '90vh',
        "& .MuiPaper-root": {
            
            background: '#212335',
            border: '1px solid rgba(245, 247, 250, 0.06)',
            boxSizing: 'border-box',
            boxShadow: ` 0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04),
                8px 8px 24px rgba(20, 16, 41, 0.4)`,
            backdropFilter: 'blur(108.731px)',
            borderRadius: 24,
            // display: 'flex',
            // flexDirection: 'column',
            // justifyContent: 'center',
            // alignItems: 'center',
            // height: '1000px',
            padding: '50px 30px',
            [theme.breakpoints.down('md')]: {
                width: '80%',
            }
        },
        "& .MuiPaper-root>:nth-Child(0)": {
        },
    },
    termText: {
        display: 'flex',
        overflowX: 'hidden',
        paddingRight: '10px',
        "&::-webkit-scrollbar": {
            width: '6px !important',
        },

        "&::-webkit-scrollbar-track": {
            background: "#e4e2e2",
            borderRadius: "10px",
        },

        "&::-webkit-scrollbar-thumb": {
            borderRadius: "10px",
            background: "rgb(148, 147, 147)",
        },

        "&::-webkit-scrollbar-thumb:hover": {
            background: "rgb(119, 118, 118)",
        },
    },
    main1: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
    },
    main: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between', 
        alignItems: 'center',
    }
}));

const Footer = () => {

    const classes = useStyles();
    const isXs = useMediaQuery("(min-width:900px)");
    const isXsMax = useMediaQuery("(min-width:1100px)");
    const isXsMin = useMediaQuery("(min-width:501px)");

    const [open, setOpen] = useState(false);
	const menuImages1 = [DISCORD_IMAGE, MEDIUM_IMAGE,TELEGRAM_IMAGE, TWITTER_IMAGE];
	const menuLinks = ["https://discord.gg/synesisone", "https://medium.com/synesis-one", "https://t.me/Synesis_One", "https://twitter.com/synesis_one"];

    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    /* create an account  */
    return (
        <Box className={classes.footer1}>
            {isXsMin &&<Box className={classes.main}>
                {/* <Link href="https://synesis.one" target="_blank" rel="noreferrer" > */}
                    <Box sx={{ cursor: 'pointer', zIndex: 9, height:'52px',display:'flex',alignItems:'center'}}>
                        <img src={Logo} alt="logo" className={classes.logoImage}/>
                    </Box>
                {/* </Link> */}
                <Box sx={{position:'absolute',width:'100%',display:'flex',justifyContent:'center'}}>
                    <Box className={classes.social}>
                        {menuImages1.map((item, i) =>
                            <a href={menuLinks[i]} target="_blank" rel="noreferrer" key={i} sx={{display:'flex'}}>
                                <img src={item} alt="menu" className={classes.menuItem} />
                            </a>
                        )}
                    </Box>
                </Box>
                <Link onClick={handleOpen} sx={{fontSize:'14px',color: 'white', zIndex: 9,marginRight:'20px',cursor:'pointer'}}>Terms</Link>
            </Box>}
            {!isXsMin &&<Box className={classes.main1}>
                <Box className={classes.main}>
                    <Link href="#" >
                        <Box sx={{ cursor: 'pointer', height:'52px',display:'flex',alignItems:'center'}}>
                            <img src={Logo} alt="logo" className={classes.logoImage}/>
                        </Box>                   
                    </Link>
                    <Link onClick={handleOpen} sx={{fontSize:'14px',color: 'white', textDecoration:'none',marginRight:'20px',cursor:'pointer'}}>Terms</Link>
                </Box>
                <Box className={classes.social}>
                    {menuImages1.map((item, i) =>
                        <a href={menuLinks[i]} target="_blank" rel="noreferrer" key={i} sx={{display:'flex'}}>
                            <img src={item} alt="menu" className={classes.menuItem} />
                        </a>
                    )}
                </Box>
            </Box>}
            <Dialog
                className={classes.detailModal}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box  sx={{position:'absolute',right:10,top:10,display:'flex', justifyContent:'flex-end'}}>
                    <IconButton onClick={handleClose}><CloseIcon/></IconButton>
                </Box>
                <Box className = {classes.termText}>
                    <HtmlFile />      
                </Box>
            </Dialog>
        </Box>
    );
}

export default Footer;