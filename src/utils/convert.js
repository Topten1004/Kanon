export const shortenAddress = (address, chars = 4) => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};
