async function main() {
  const FundingPlatform = await ethers.getContractFactory("FundingPlatform");
  const contract = await FundingPlatform.deploy();
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
