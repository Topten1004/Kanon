import axios from "axios";
const { REACT_APP_SERVER_URL, REACT_APP_PUBLISHDURATION, REACT_APP_airdrop_pg_size, REACT_APP_mywallet_pg_size, REACT_APP_marketplace_pg_size, REACT_APP_CALLTIME, REACT_APP_STAKE_PROGRAMID, REACT_APP_STAKE_NETWORK } = process.env;
const anchor = require("@project-serum/anchor");
const common = require("@project-serum/common");
const { BN } = anchor;
const { Keypair, PublicKey, SystemProgram, Transaction } = anchor.web3;
const splToken = require('@solana/spl-token');

const Token = require("@solana/spl-token").Token;
const TOKEN_PROGRAM_ID = require("@solana/spl-token").TOKEN_PROGRAM_ID;
const TokenInstructions = require("@project-serum/serum").TokenInstructions;

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

const { createTokenAccount } = require("@project-serum/common");

export const MywalletPgSize = parseInt(REACT_APP_mywallet_pg_size);                     // lazy loading step   
export const MarketplacePgSize = parseInt(REACT_APP_marketplace_pg_size);                     // lazy loading step   
export const AirdropPgSize = parseInt(REACT_APP_airdrop_pg_size);                     // lazy loading step   
export const CallTime = parseInt(REACT_APP_CALLTIME);               //lazy loader timer
export const UpdateMetadataDuration = parseInt(REACT_APP_PUBLISHDURATION); // publish duration

export const setItem = (key, item) => { // set session
    if (item) {
        window.localStorage.setItem(key, item);
    } else {
        window.localStorage.removeItem(key);
    }
}

export const getItem = (key) => {       // get session
    if (key) {
        return window.localStorage.getItem(key);
    }
}

export const removeItem = (key) => { // set session
    window.localStorage.removeItem(key)
}


export const shortenAddress = (address, chars = 4) => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

export const shortenTime = (time) => {
    let str = time.slice(0, 10) + " " + time.slice(11, 16);
    return str;
}

export const randomIntFromInterval = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const filtering = (nfts, nftTokens) => {
    let real_nftTokens = nftTokens.filter((item) => {
        if (nfts.findIndex((val) => val.mint.toBase58() == item.airdrop_nft_mint_address) != -1) {
            return true;
        }
        else {
            return false;
        }
    });
    return real_nftTokens;
}

export const mintfiltering = (nfts, nftTokens) => {
    let real_nftTokens = nftTokens.filter((item) => {
        if (nfts.findIndex((val) => val.mint.toBase58() == item.mintable_nft_mint_address) != -1) {
            return true;
        }
        else {
            return false;
        }
    });
    return real_nftTokens;
}

export const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export const allCollectionFilter = (nfts, nftTokens) => {
    let real_nftTokens = [];
    nftTokens.filter((item) => {
        let index = nfts.findIndex((val) => val.nft_mint_address == item.airdrop_nft_mint_address);
        if (index != -1) {
            real_nftTokens.push(nfts[index])
            return true;
        }
        else {
            return false;
        }
    });
    return real_nftTokens;
}
export const allCollectionFilter1 = (nfts, nftTokens) => {
    let real_nftTokens = [];
    nftTokens.filter((item) => {
        let index = nfts.findIndex((val) => val.nft_mint_address == item.mint.toBase58());
        if (index != -1) {
            real_nftTokens.push(nfts[index])
            return true;
        }
        else {
            return false;
        }
    });
    return real_nftTokens;
}

export const calculateStep = (collectionState) => {
    let current_timestamp = Math.floor(Date.now() / 1000);
    let difference = (current_timestamp - collectionState.seasonOpenedTimestamp.toNumber()) / 3600;
    if (difference != 0) {
        difference -= collectionState.countdownDuration.toNumber();
        if (difference <= 0) {
            return 1;
        }
        difference -= (collectionState.premintDuration.toNumber() + collectionState.premintBlockingDuration.toNumber());
        if (difference <= 0) {
            return 2;
        }
        difference -= collectionState.mintWave3Duration.toNumber();
        if (difference <= 0) {
            return 3;
        }
        difference -= UpdateMetadataDuration;
        if (difference <= 0) {
            return 4;
        }
        return 5;
    }
}

export const calculateAirdropStep = (collectionState) => {
    let current_timestamp = Math.floor(Date.now() / 1000);
    let difference = (current_timestamp - collectionState.seasonOpenedTimestamp.toNumber()) / 3600;
    if (difference != 0) {
        difference -= (collectionState.countdownDuration.toNumber() - collectionState.promosMintDuration.toNumber());
        if (difference <= 0) {
            return 1;
        }
        difference -= collectionState.promosMintDuration.toNumber();
        if (difference <= 0) {
            return 2;
        }
        difference -= collectionState.premintDuration.toNumber();
        if (difference <= 0) {
            return 3;
        }
        difference -= collectionState.premintBlockingDuration.toNumber();
        if (difference <= 0) {
            return 4;
        }
        difference -= collectionState.mintWave3Duration.toNumber();
        if (difference <= 0) {
            return 5;
        }
        return 6;
    }
}

const timeZoneAbbreviated = () => {
    const { 1: tz } = new Date().toString().match(/\((.+)\)/);

    // In Chrome browser, new Date().toString() is
    // "Thu Aug 06 2020 16:21:38 GMT+0530 (India Standard Time)"

    // In Safari browser, new Date().toString() is
    // "Thu Aug 06 2020 16:24:03 GMT+0530 (IST)"

    if (tz.includes(" ")) {
        return tz
            .split(" ")
            .map(([first]) => first)
            .join("");
    } else {
        return tz;
    }
};

export const EstTime = (allTime) => {
    let txt = '';
    let date = new Date(allTime * 1000);
    let MyString = date.toTimeString();
    let MyOffset = timeZoneAbbreviated();
    let options = { month: 'short' };
    txt += date.toLocaleString(undefined, options) + ' '
    options = { day: 'numeric' };
    txt += date.toLocaleString(undefined, options) + 'th ';
    let times = date.toLocaleTimeString()
    let subfix = times.split(' ')[1].toLowerCase();
    let prefix = times.split(' ')[0].split(':')[0] + ':' + times.split(' ')[0].split(':')[1];
    txt += prefix + ' ';
    txt += subfix + ' ' + MyOffset;
    return txt;
}

export const FormatDateTime = (time) => {

}

export const EstHistoryTime = (allTime) => {
    let txt = '';
    let date = new Date(allTime * 1000);
    let MyString = date.toTimeString();
    let MyOffset = timeZoneAbbreviated();
    let options = { month: 'short' };
    txt += date.toLocaleString(undefined, options) + ' '
    options = { day: 'numeric' };
    txt += date.toLocaleString(undefined, options) + 'th ';
    let times = date.toLocaleTimeString()
    let subfix = times.split(' ')[1].toLowerCase();
    let prefix = times.split(' ')[0].split(':')[0] + ':' + times.split(' ')[0].split(':')[1];
    txt += prefix;
    txt += subfix;
    return txt;
}
export const getCollections = async (PgFrom) => {
    try {
        let res = await axios.post(`${REACT_APP_SERVER_URL}/getnftsoverallcollections`, { pg_from: PgFrom, pg_size: MywalletPgSize });
        return res.data.result;
    } catch (err) {
        console.log(err)
        return [];
    }
}


export const getAddressCollections = async (addresses, season) => {
    try {
        let res = await axios.post(`${REACT_APP_SERVER_URL}/getmetadatabymintaddressesandseasonnumber`, { mint_addresses: addresses, season_number: season });
        return res.data.result;
    } catch (err) {
        console.log(err)
        return [];
    }
}

export const getMetadataByMintaddresses = async (season, addresses) => {
    try {
        let res = await axios.post(`${REACT_APP_SERVER_URL}/getmetadatabymintaddresses`, { mint_addresses: addresses, season_number: season });
        return res.data.result;
    } catch (err) {
        console.log(err)
        return [];
    }
}

export const getthumbnailbymintaddresses = async (season, pg_from, pg_size, addresses) => {
    try {
        let res = await axios.post(`${REACT_APP_SERVER_URL}/getthumbnailbymintaddresses`, { mint_addresses: addresses, season_number: season, pg_from: pg_from, pg_size: pg_size });
        return res.data.result;
    } catch (err) {
        console.log(err)
        return [];
    }
}

export const checkreservednftamountbywallet = async (wallet) => {
    try {
        let res = await axios.post(`${REACT_APP_SERVER_URL}/checkReservedNftAmountByWallet`, { wallet: wallet });
        return res.data.result[0].count;
    } catch (err) {
        console.log(err)
        return 0;
    }
}

export const getreservednftsbywallet = async (wallet) => {
    try {
        let res = await axios.post(`${REACT_APP_SERVER_URL}/getreservednftsbywallet`, { wallet: wallet });
        return res.data.result;
    } catch (err) {
        console.log(err)
        return [];
    }
}

export const getreservednftproofbymintaddressandwallet = async (wallet, nft_mint_address) => {
    try {
        let res = await axios.post(`${REACT_APP_SERVER_URL}/getreservednftproofbymintaddressandwallet`, { wallet: wallet, mint_address: nft_mint_address });
        return res.data.result;
    } catch (err) {
        console.log(err)
        return [];
    }
}

export const getwhitelistproofinfo = async (wallet) => {
    try {
        let res = await axios.post(`${REACT_APP_SERVER_URL}/getwhitelistproofinfo`, { wallet: wallet });
        return res.data.result;
    } catch (err) {
        console.log(err)
        return [];
    }
}

export const findAssociatedTokenAddress = async (
    walletAddress,
    tokenMintAddress
) => {
    return (
        await PublicKey.findProgramAddress(
            [
                walletAddress.toBuffer(),
                TOKEN_PROGRAM_ID.toBuffer(),
                tokenMintAddress.toBuffer(),
            ],
            SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
        )
    )[0];
};

export const getTokenAccountAndAirdrop = async (provider, program, pda, mint, user) => {
    const tokenAccount = await createTokenAccount(provider, mint, user);
    await program.rpc.airdrop(
        {
            accounts: {
                userToken: tokenAccount,
                pdaAccount: pda,
                tokenMint: mint,
                tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
                clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
            },
        });
    return (tokenAccount);
};


export const serializeSellTransaction = async (info) => {
    let res = await axios.post(`${REACT_APP_SERVER_URL}/ahserializeselltransaction`, info);
    return res.data;
}

export const listNftToMarket = async (info) => {
    let res = await axios.post(`${REACT_APP_SERVER_URL}/ahlistnfttomarket`, info);
    return res.data;
}

export const checkIsListed = async (owner_wallet, mint_address) => {
    try {
        let res = await axios.post(`${REACT_APP_SERVER_URL}/ahgetoderinfo`, {
            "seller": owner_wallet,
            "nft_mint_address": mint_address,
        });
        return res;
    } catch (err) {
        console.log(err)
        return false;
    }
}

export const getSaleHistory = async (mint_address) => {
    try {
        let res = await axios.post(`${REACT_APP_SERVER_URL}/ahgetsalehistorybymintaddress`, {
            "nft_mint_address": mint_address,
        });
        return res.data.result;
    } catch (err) {
        console.log(err)
        return [];
    }
}

export const getCollectionSummary = async (collectionName) => {
    try {
        let res = await axios.post(`${REACT_APP_SERVER_URL}/ahgetcollectionsummary`, {
            "collection_name": collectionName,
        });
        return res.data.result;
    } catch (err) {
        console.log(err)
        return [];
    }
}

export const ahgetlistednfts = async (order_field, order_type, name_keyword, price_keyword) => {
    try {
        let res = await axios.post(`${REACT_APP_SERVER_URL}/ahgetlistednfts`, {
            "order_field": order_field,
            "order_type": order_type,
            "name_keyword": name_keyword,
            "price_keyword": price_keyword,
        });
        return res.data.result;
    } catch (err) {
        console.log(err)
        return [];
    }
}

export const ahgetlistednftsthumbnail = async (order_field, order_type, name_keyword, price_keyword, pg_from, pg_size) => {
    try {
        let res = await axios.post(`${REACT_APP_SERVER_URL}/ahgetlistednftsthumbnail`, {
            "order_field": order_field,
            "order_type": order_type,
            "name_keyword": name_keyword,
            "price_keyword": price_keyword,
            "pg_from": pg_from,
            "pg_size": pg_size,
        });
        return res.data.result;
    } catch (err) {
        console.log(err)
        return [];
    }
}


export const serializeUnlistTransaction = async (info) => {
    let res = await axios.post(`${REACT_APP_SERVER_URL}/ahserializeunlisttransaction`, info);
    return res.data;
}

export const unlistFromMarket = async (info) => {
    let res = await axios.post(`${REACT_APP_SERVER_URL}/ahunlistfrommarket`, info);
    return res.data;
}


export const serializeBuyTransaction = async (info) => {
    let res = await axios.post(`${REACT_APP_SERVER_URL}/ahserializebuytransaction`, info);
    return res.data;
}

export const buyNFT = async (info) => {
    let res = await axios.post(`${REACT_APP_SERVER_URL}/ahbuynft`, info);
    return res.data;
}