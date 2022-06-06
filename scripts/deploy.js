const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const MarketSentiment = await hre.ethers.getContractFactory(
    "MarketSentiment"
  );
  const marketSentiment = await MarketSentiment.deploy();

  await marketSentiment.deployed();

  console.log("MarketSentiment deployed to:", marketSentiment.address);

  fs.writeFileSync(
    "./config.js",
    `
  export const deployedContractAddress = "${marketSentiment.address}"
  `
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
