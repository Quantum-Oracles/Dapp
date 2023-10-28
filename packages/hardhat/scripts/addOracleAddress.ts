import { ethers } from "hardhat";

const contractAddress = "0xCaFcA6F468d65dDB9A752Fc2AC90AC76D8897cC2";

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
