import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import * as locale from '@mui/material/locale';


// colors
const primary = "#6E56F8";
const secondary = "#11243E";
const black = "#303030";
const darkBlack = "#0c1319";
const background = "#fff";
const warningLight = "rgba(255, 246, 32, .3)";
const warningMain = "rgba(255, 246, 32, .5)";
const warningDark = "rgba(255, 246, 32, .7)";

// border
const borderWidth = 1;
const borderColor = "#2e6da4";

// breakpoints
const xl = 1920;
const lg = 1280;
const md = 960;
const sm = 600;
const xs = 0;

// spacing
const spacing = 8;

const darktheme = createTheme({
    layout: {
        contentWidth: 1140,
        footerWidth: 1400
    },
    palette: {
        mode: 'dark',
        primary: { main: primary, footer: '#055da6' },
        secondary: { main: secondary },
        common: {
            black,
            darkBlack
        },
        warning: {
            light: warningLight,
            main: warningMain,
            dark: warningDark
        },
        tonalOffset: 0.2,
        background: {
            default: background,
            gray: '#f1f1f170'
        },
        spacing
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    border: {
        borderColor: borderColor,
        borderWidth: borderWidth
    },
    overrides: {
    },
    typography: {
        fontFamily: 'Klavika, Montserrat',
    },
});
const lighttheme = createTheme({
    layout: {
        contentWidth: 1140,
        footerWidth: 1400
    },
    palette: {
        mode: 'light',
        primary: { main: primary, footer: '#055da6' },
        secondary: { main: secondary },
        common: {
            black,
            darkBlack
        },
        warning: {
            light: warningLight,
            main: warningMain,
            dark: warningDark
        },
        tonalOffset: 0.2,
        background: {
            default: background,
            gray: '#f1f1f170'
        },
        spacing
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    border: {
        borderColor: borderColor,
        borderWidth: borderWidth
    },
    overrides: {
    },
    typography: {
        fontFamily: 'Klavika, Montserrat',
    },
});
export {lighttheme, darktheme};
