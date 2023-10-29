import { ethers } from "hardhat";

const contractAddress = "0x7A140831ddF3c56E44401d9be76D78D42B704d69";

async function addOracleAddress() {
  const QuantumOracle = await ethers.getContractFactory("QuantumOracleV1");
  const quantumOracle = QuantumOracle.attach(contractAddress);

  const signers = await ethers.getSigners();

  await quantumOracle.addOracle(signers[0].getAddress());
}

addOracleAddress().catch(err => {
  console.log(err);
  process.exitCode = 1;
});
