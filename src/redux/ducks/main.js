import { PlaylistAdd } from "@mui/icons-material";
import axios from "axios";
const { REACT_APP_SERVER_URL } = process.env;
//Types
export const Types = {
    SETPOOLFLAG: '@setPoolFlag',
    GETPROOF: '@getProof',
    SETGLOBALSTATE: '@getGlobalState',
    SETPROVIDER: '@setProvider',
    SETKNPROGRAM: '@setKNProgram',
    SETAHPROGRAM: '@setAHProgram',
    SETREDUXAHIDL: '@setReduxAhIdl',
    SETWALLET: '@setWallet',
    SETNFTTOKENS: '@setnftTokens',
    SETRESERVEDNFTS: '@setreservedNfts',
    SETLOADING: '@setLoading',
    SETALLCOLLECTION: '@setAllCollections',
    SETSCHEDULE: '@setSchedule',
    GETMINTABLENFTS: '@getmintablenfts',
    SETREADYFLAG: '@setreadyflag',
    GETCOLLECTIONSUMMARY: '@getcollctionsummary'
}

//Reducer

const INITIAL_STATE = {
    loading: false,
    nonftsFlag: false,
    proof: [],
    globalStateAccountPubkey: null,
    provider: null,
    KNProgram: null,
    AHProgram: null,
    ReduxAhIdl: null,
    wallet: null,
    nftTokens: [],
    reservedNfts: [],
    allcollections: [],
    schedule: -1,
    mintablenfts: [],
    collectionSummary: [],
    isReadyMintableNFTs: false
};

export default function reducer(
    state = INITIAL_STATE,
    { type, payload }
) {
    switch (type) {
        case Types.SETLOADING:
            return { ...state, loading: payload }
        case Types.GETPROOF:
            return { ...state, proof: payload }
        case Types.SETGLOBALSTATE:
            return { ...state, globalStateAccountPubkey: payload }
        case Types.SETPROVIDER:
            return { ...state, provider: payload }
        case Types.SETKNPROGRAM:
            return { ...state, KNProgram: payload }
        case Types.SETAHPROGRAM:
            return { ...state, AHProgram: payload }
        case Types.SETREDUXAHIDL:
            return { ...state, ReduxAhIdl: payload }
        case Types.SETWALLET:
            return { ...state, wallet: payload }
        case Types.SETNFTTOKENS:
            return { ...state, nftTokens: payload }
        case Types.SETRESERVEDNFTS:
            return { ...state, reservedNfts: payload }
        case Types.SETALLCOLLECTION:
            return {
                ...state, allcollections: payload.result,
                nonftsFlag: payload.noflag
            }
        case Types.SETSCHEDULE:
            return { ...state, schedule: payload }
        case Types.GETCOLLECTIONSUMMARY:
            return { ...state, collectionSummary: payload}
        case Types.SETREADYFLAG:
            return { ...state, isReadyMintableNFTs: payload }
        case Types.GETMINTABLENFTS:
            return {
                ...state, mintablenfts: [...payload.result],
                isReadyMintableNFTs: payload.flag
            }
        default:
            return state;
    }
};

//ActionS
export const setLoading = (loading_flag) => ({ type: Types.SETLOADING, payload: loading_flag })

export const setPoolFlag = (pool_flag) => ({ type: Types.SETPOOLFLAG, payload: pool_flag })

export const setGlobalState = (key) => ({ type: Types.SETGLOBALSTATE, payload: key })

export const setProvider = (provider) => ({ type: Types.SETPROVIDER, payload: provider })

export const setKNProgram = (program) => ({ type: Types.SETKNPROGRAM, payload: program })

export const setAHProgram = (ahProgram) => ({ type: Types.SETAHPROGRAM, payload: ahProgram })

export const setReduxAhIdl = (ah_idl) => ({ type: Types.SETREDUXAHIDL, payload: ah_idl })

export const setWallet = (wallet) => ({ type: Types.SETWALLET, payload: wallet })

export const getProof = async (address) => {
    let res = await axios.post(`${REACT_APP_SERVER_URL}/getwhitelistproof`, { wallet: address });

    return ({ type: Types.GETPROOF, payload: res.data.result });
}

export const setnftTokens = async (address) => {
    let res = await axios.post(`${REACT_APP_SERVER_URL}/getreservednftproof`, { wallet: address });

    return ({ type: Types.SETNFTTOKENS, payload: res.data.result });
}

export const setAllCollections = async (pg_from, pg_size) => {
    let res = await axios.post(`${REACT_APP_SERVER_URL}/getnftsoverallcollections`, { pg_from: pg_from, pg_size: pg_size });
    let result = res.data.result;
    let noflag = result.length == 0;
    return ({ type: Types.CSETALLCOLLETION, payload: { result, noflag } });
}

export const getmintablenfts = async () => {
    let res = await axios.post(`${REACT_APP_SERVER_URL}/getmintablenfts`);
    let result = res.data.result;
    let flag = true;
    return ({ type: Types.GETMINTABLENFTS, payload: { result, flag } });
}

export const setreservedNfts = (data) => ({ type: Types.SETRESERVEDNFTS, payload: data });

export const setSchedule = (data) => ({ type: Types.SETSCHEDULE, payload: data });

export const setreadyflag = (data) => ({ type: Types.SETREADYFLAG, payload: data });
