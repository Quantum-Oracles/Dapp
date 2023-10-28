import { ethers } from "hardhat";

const contractAddress = "0xCaFcA6F468d65dDB9A752Fc2AC90AC76D8897cC2";

async function addCircuit() {
  const QuantumOracle = await ethers.getContractFactory("QuantumOracleV1");
  const quantumOracle = QuantumOracle.attach(contractAddress);

  const price = await quantumOracle.calculateCost(
    'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[3];\ncreg meas[3];\nh q[0];\ncx q[0],q[1];\ncx q[0],q[2];\nbarrier q[0],q[1],q[2];\nmeasure q[0] -> meas[0];\nmeasure q[1] -> meas[1];\nmeasure q[2] -> meas[2];',
  );
  console.log(price);

  await quantumOracle.addCircuit(
    'OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[3];\ncreg meas[3];\nh q[0];\ncx q[0],q[1];\ncx q[0],q[2];\nbarrier q[0],q[1],q[2];\nmeasure q[0] -> meas[0];\nmeasure q[2] -> meas[1];\nmeasure q[2] -> meas[1];',
    { value: price },
  );
}

addCircuit().catch(err => {
  console.log(err);
  process.exitCode = 1;
});
