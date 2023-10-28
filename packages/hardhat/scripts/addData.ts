import { ethers } from "hardhat";

const contractAddress = "0xCaFcA6F468d65dDB9A752Fc2AC90AC76D8897cC2";

async function addData() {
  const QuantumOracle = await ethers.getContractFactory("QuantumOracleV1");
  const quantumOracle = QuantumOracle.attach(contractAddress);

  const signers = await ethers.getSigners();

  console.log(await quantumOracle.status("0xa3eca19a05b836aa195cc66b62ecce2a3e0ce11d5a663fb5f13053e127fc45b3"));

  console.log(await quantumOracle.isOracleAddress(signers[0].getAddress()));

  await quantumOracle.addData(
    "0xa3eca19a05b836aa195cc66b62ecce2a3e0ce11d5a663fb5f13053e127fc45b3",
    1,
    ethers.toUtf8Bytes("23472398472"),
  );
}

addData().catch(err => {
  console.log(err);
  process.exitCode = 1;
});
