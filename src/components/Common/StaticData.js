import { Box, List, ListItem, Typography, Link } from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

export const NO_MORE_NFT = "There are no more NFTs available to mint.";
export const OUT_OF_NFTSAMOUNT = "Total quantity of nft is out of limit.";
export const ERROR_CONDITION = "We are sorry. Something went wrong and we will handle this issue asap";
export const NO_NFTS = "No NFTs are available. Please try again later";


export const errorData = [
    {
        "code": 6000,
        "name": "InvalidDuration",
        "msg": "You are not in correct duration."
    },
    {
        "code": 6001,
        "name": "ConditionIsMismatchedToMint",
        "msg": "Reached out of limitation to mint."
    },
    {
        "code": 6002,
        "name": "OutOfWhitelistUserMaxQuantity",
        "msg": "The total quantity of premint is out of limit."
    },
    {
        "code": 6003,
        "name": "OutOfReservedNftsAmount",
        "msg": "Total quantity of reserved nft is out of limit."
    },
    {
        "code": 6004,
        "name": "OutOfNftsAmount",
        "msg": "Total quantity of nft is out of limit."
    },
    {
        "code": 6005,
        "name": "NotEnoughBalanceInUserWallet",
        "msg": "Your balance is not enough now"
    },
    {
        "code": 6006,
        "name": "OutOfUserMaxQuantity",
        "msg": "Your max quantity is out of limitation."
    },
    {
        "code": 6007,
        "name": "NftDoesntExist",
        "msg": "Sorry this NFT has been claimed by another user. Please try again."
    },
    {
        "code": 6008,
        "name": "InvalidGlobalAccount",
        "msg": "The global account address is wrong."
    },
    {
        "code": 6009,
        "name": "AccessDenied",
        "msg": "Your access is denied."
    },
    {
        "code": 6010,
        "name": "WrongSeasonNumber",
        "msg": "The season number is wrong."
    },
    {
        "code": 6011,
        "name": "ConditionMismatch",
        "msg": "Your condition is mismatched."
    }
]

export const accordionContent = [
    {
        title: "When will trading begin on Kanon Exchange?",
        context: "Marketplace functionality on Kanon Exchange will open on Mar 15th, 2022",
        expanded: false,
    },
    {
        title: "What do you charge to list?",
        context: "Listing is free on Kanon Exchange",
        expanded: false,
    },
    {
        title: "What are the fees?",
        context: <Box>
            <Typography sx={{textDecoration: 'line-through'}}>All transactions on Kanon Exchange have a 2.5% fee</Typography>
            <Typography>Transaction fees are currently 0% for the initial promotional period</Typography>
        </Box>,
    },
    {
        title: "Do you honor royalty fees?",
        context: "Yes, creator royalties will be paid immediately according to settings in the NFTs metadata",
    },
    {
        title: "Do you support Ethereum NFTs?",
        context: "No, Kanon Exchange is currently a Solana-focused NFT marketplace",
    },
    {
        title: "Which NFT collections do you support?",
        context: "Currently, Kanon Exchange only supports NFTs created within the Synesis One ecosystem. Stay tuned for updates on more NFT listings",
    },
    {
        title: "Can I mint NFTs on Kanon Exchange?",
        context:  <Typography>Yes, in addition to being a secondary marketplace for NFTs, Kanon Exchange is where all Kanon NFT Collections will be minted. See the &nbsp;<Link href='/mint' sx={{color: '#2D61E5'}}>minting page </Link>&nbsp; for more information</Typography>,
    },
    {
        title: "How can I reach out?",
        context: <ListItem>Please send email to &nbsp;<Link sx={{color: '#2D61E5'}}>kanon-support@synesis.one</Link></ListItem>,
    },
];

export const mintAccordionContent = [
    {
        title: "Overview",
        context: <>
         <Typography component={'div'} variant={'body2'} sx={{mb:2}}> We are releasing our first set of NFTs, the Kanon Aquarius Collection, on 9am PST (17:00 UTC) on Feb 25th 2022</Typography>
         <Typography component={'div'} variant={'body2'}> The Kanon Aquarius Collection consists of 10,000 NFTs, each representing a unique word inthe English language, accompanied with beautiful algorithmically-generated artwork</Typography>
        </>
    },
    {
        title: "What is the schedule for the NFT minting process?",
        context: <> 
                <Typography component={'div'} variant={'body2'}> The mint will follow this schedule:</Typography>
                <Typography component={'div'} variant={'body2'}> <FiberManualRecordIcon sx={{width:8,height:8,mr:1,}}/> 9am PST Feb 25th: Whitelist sale</Typography>
                <Typography component={'div'} variant={'body2'}> <FiberManualRecordIcon sx={{width:8,height:8,mr:1,}}/> 9am PST Feb 26th: Public sale</Typography>
                <Typography component={'div'} variant={'body2'}> <FiberManualRecordIcon sx={{width:8,height:8,mr:1,}}/> 9am PST Feb 27th: End of Public sale</Typography>
                <Typography component={'div'} variant={'body2'}> <FiberManualRecordIcon sx={{width:8,height:8,mr:1,}}/> 9am PST Feb 28th: NFT artwork and metadata revealed</Typography>
        </>
    },
    {
        title: "How much will each Aquarius NFT cost?",
        context: "2 SOL",
    },
    {
        title: "Are there limits to how many NFTs I can mint?",
        context: 
        <>
            <Typography component={'div'} variant={'body2'} > <FiberManualRecordIcon sx={{width:8,height:8,mr:1,}}/> Whitelist sale: 2 NFTs per wallet</Typography>
            <Typography component={'div'} variant={'body2'} sx={{pb:3}}> <FiberManualRecordIcon sx={{width:8,height:8,mr:1,}}/>  Public sale: 3 NFTs per wallet</Typography>
            <Typography component={'div'} variant={'body2'}>  Note that a whitelisted wallet can mint a maximum of 5 NFTs if they participate in both the Whitelist and Public sales </Typography>
        </>
    },
    {
        title: "Am I guaranteed to get my NFT?",
        context: 
        <>
            <Typography component={'div'} variant={'body2'} > <FiberManualRecordIcon sx={{width:8,height:8,mr:1,}}/> Yes, a whitelisted wallet that participates in the Whitelist sale is guaranteed to be able to mint 2 NFTs</Typography>
            <Typography component={'div'} variant={'body2'} > <FiberManualRecordIcon sx={{width:8,height:8,mr:1,}}/>   A wallet not on the whitelist can participate in the Public sale but will not be guaranteed an NFT if Kanon Aquarius Collection sells out</Typography>
        </>
    },
    {
        title: "What happens after the Public mint?",
        context:  
        <>
            <Typography component={'div'} variant={'body2'} sx={{mb:2}}>Kanon Aquarius Collection NFTs will use a ‘Mystery Box’ scheme where NFT images and metadata will not be revealed until 24-48 hours after the Public mint is completed</Typography>
            <Typography component={'div'} variant={'body2'} >We have implemented our NFTs this way to allow our community to experience the surprise of discovering their NFT word and artwork together at the same time, and to discourage NFT holders from selling their NFTs on the secondary market before all NFTs in the collection have been minted</Typography>
        </>
    },
    {
        title: "Are there any other benefits to holding an Aquarius Collection NFT?",
        context: 
        <>
            <Typography component={'div'} variant={'body2'} sx={{mb:2}}> Yes, all Kanon NFTs act as an ‘entry ticket’ into the Synesis ecosystem of games and decentralized applications. Staking your Aquarius Collection NFTs into any of the apps in the Synesis family allows you to play alongside other community members and earn rewards</Typography>
            <Typography component={'div'} variant={'body2'} sx={{mb:2}}> Further, Aquarius Collection NFTs will be passive yield-generating financial assets due to their linkage with the Synesis Data Yield Farming system. A portion of revenue generated by SynesisOne from the mining of AI ontological data will be shared with Kanon NFT holders as rewards </Typography>
            <Typography component={'div'} variant={'body2'} >  Stay tuned for further details as we roll out these features in 2022!</Typography>
        </>
    },
];
export const toastConfig = {
    position: "top-center",
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
};