require("@nomiclabs/hardhat-waffle");

module.exports = {
    solidity: "0.8.0",
    networks: {
        rinkeby: {
            url: "https://eth-rinkeby.alchemyapi.io/v2/SvB4XxQbDYy6xvs0pyZohrqfD82O3gKS",
            accounts: ["7778c99f051fac2f72f25d343f1d3a5896e3372cddaaed6d51e066c2a63368fd"]
        },
    },
};