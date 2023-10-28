import { ethers } from "hardhat";

const contractAddress = "0xCaFcA6F468d65dDB9A752Fc2AC90AC76D8897cC2";
const circuitHash = "0xd2ba4d67c5b42f95668a4fc67e2a6fca860e53a7f8dd247d648254252401bf56";
async function getStatus() {
  const QuantumOracle = await ethers.getContractFactory("QuantumOracleV1");
  const quantumOracle = QuantumOracle.attach(contractAddress);

  console.log(await quantumOracle.status(circuitHash));
  console.log(await quantumOracle.results(circuitHash));

  // await quantumOracle.addOracle(signers[0].getAddress());
}

getStatus().catch(err => {
  console.log(err);
  process.exitCode = 1;
});
