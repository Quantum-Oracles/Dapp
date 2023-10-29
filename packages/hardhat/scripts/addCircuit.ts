import { ethers } from "hardhat";

const contractAddress = "0x7A140831ddF3c56E44401d9be76D78D42B704d69";

async function addCircuit() {
  const QuantumOracle = await ethers.getContractFactory("QuantumOracleV1");
  const quantumOracle = QuantumOracle.attach(contractAddress);

  const price = await quantumOracle.calculateCost(
    `OPENQASM 2.0;
include "qelib1.inc";
qreg q[3];
creg meas[3];
h q[2];
x q[0];
y q[0];
cx q[0],q[1];
cx q[0],q[2];
barrier q[0],q[1],q[2];
measure q[0] -> meas[0];
measure q[1] -> meas[1];
measure q[2] -> meas[2];`,
  );
  console.log(price);

  await quantumOracle.addCircuit(
    `OPENQASM 2.0;
include "qelib1.inc";
qreg q[3];
creg meas[3];
h q[2];
x q[0];
y q[0];
cx q[0],q[1];
cx q[0],q[2];
barrier q[0],q[1],q[2];
measure q[0] -> meas[0];
measure q[1] -> meas[1];
measure q[2] -> meas[2];`,
    { value: price },
  );
}

addCircuit().catch(err => {
  console.log(err);
  process.exitCode = 1;
});
