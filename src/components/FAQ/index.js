import React, { useState, useEffect, useContext } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Link, Box, useMediaQuery, } from "@mui/material";
import AccordionPanel from './AccordionPanel';
import { ExpandMore } from "@mui/icons-material";
import { useWallet } from '@solana/wallet-adapter-react';
import { makeStyles } from '@mui/styles';
import { WalletModalButton } from '@solana/wallet-adapter-react-ui';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {accordionContent} from '../../components/Common/StaticData';

const propTypes = {};

const useStyles = makeStyles(theme => ({
	faqPage: {
		background: "#202036",
		position: 'relative',
	},
	imageItem: {
		width: "150px",
		height: "150px",
		borderRadius: "24px",
		margin: "6px",
	},

	faqHeader: {
		marginTop: "-112px",
		overflow: "hidden",
	},

	header1: {
		marginLeft: "-270px",
		width: "200vw",
		height: "170px",
		overflow: "hidden",
	},

	header2: {
		marginLeft: "-80px",
		width: "200vw",
		height: "170px",
		overflow: "hidden",
	},

	propertyDiv: {
		marginTop: "24px",
		backgroundColor: "rgba(224, 224, 255, 0.02) !important",
		borderRadius: "12px !important",
		fontFamily: "Montserrat",
	},

	propertyDivTitle: {
		fontWeight: 200,
		fontSize: "18px",
		lineHeight: "24px",
		color: "white",
		letterSpacing: "-0.4px",
		marginLeft: "8px",
		[theme.breakpoints.down('md')]: {
			fontSize: "14px",
		},
	},

	propertyDivDetail: {
		paddingLeft: "24px",
		fontWeight: 500,
		fontSize: "14px",
		lineHeight: "24px",
		color: "rgba(224, 224, 255, 0.6)",
		[theme.breakpoints.down('md')]: {
			fontSize: "12px",
		}
	},

	expandIcon: {
		color: "rgba(224, 224, 255, 0.6)"
	},
	faqContent: {
		padding: "150px 180px",
		[theme.breakpoints.down('md')]: {
			padding: "80px 90px",
		},
		[theme.breakpoints.down('sm')]: {
			padding: "80px 30px",
		}
	},
	faqDiv: {
		minWidth: "320px",

	},
	title: {
		fontWeight: "bold",
		fontSize: "48px",
		lineHeight: "48px",
		letterSpacing: "-1px",
		color: "#ffffff",
		marginBottom: "32px",
		[theme.breakpoints.down('md')]: {
			fontSize: "30px",
		}
	},
	connectDiv: {
		position: 'absolute',
		display: 'flex',
		justifyContent: 'center',
		width: '100%',
		top: "420px",
	},
	walletConnectContent: {
		width: 648,
		padding: 15,
		display:'flex',
		flexDirection: 'column',
		alignItems: 'center',
		backgroundColor: ` linear-gradient(135deg, rgba(245, 247, 250, 0.12) 0%, rgba(245, 247, 250, 0.06) 51.58%, rgba(245, 247, 250, 0.0001) 98.94%)`,
		border: "1px solid rgba(245, 247, 250, 0.06)",
		boxSizing: 'border-box',
		boxShadow: "0px 1px 1px rgba(20, 16, 41, 0.4), -4px -4px 8px rgba(224, 224, 255, 0.04), 8px 8px 24px rgba(20, 16, 41, 0.4)",
		backdropFilter: "blur(108.731px)",

		"border-radius": '24px',
		[theme.breakpoints.down('md')]: {
			width: 300,
		}
	},
	text: {

		fontWeight: 'bold',
		fontSize: "48px",
		lineHeight: "48px",
		textAlign: 'center',
		letterSpacing: "-1px",
		color: "#ffffff",
		marginTop: "36px",
		[theme.breakpoints.down('md')]: {
			fontSize: '30px',
		}
	},
	connectButton: {
		marginTop: "24px",
		marginBottom: "25px",
		textAlign: 'center',
		background: `linear-gradient(135deg, #2d61e5 0%, #8a62f6 53.09%, #e3477e 100%) !important`,
		boxShadow: `0px 0px 1px rgba(45, 97, 229, 0.24), 0px 2px 4px -1px rgba(10, 70, 82, 0.12),
            0px 16px 24px rgba(45, 97, 229, 0.24), 0px 8px 8px -4px rgba(45, 97, 229, 0.12) !important`,
		borderRadius: `12px !important`,
		// [theme.breakpoints.down('md')]: {
		// 	width: 300,
		// }
	}

}))

const FAQPage = () => {
	const classes = useStyles();
	const defaultExpanded = false;

	
	return (
		<Box className={classes.faqPage}>
			<Link id="about" href="#faq" />
			<Box className={classes.faqContent}>
				<Box className={classes.faqDiv}>
					<Box className={classes.title}>FAQ</Box>
					{
						accordionContent.map((value, index) =>{
							return (
								<AccordionPanel
									key={index}
									title={value.title}
									context={value.context}
									defaultExpanded={defaultExpanded}
								/>
							)
						})
					}
				</Box>
			</Box>
		</Box>
	)
}

FAQPage.propTypes = propTypes;

export default FAQPage;
