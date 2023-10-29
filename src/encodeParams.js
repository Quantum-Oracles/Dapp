const { encode } = require ('@api3/airnode-abi');
const { decode } = require ('@api3/airnode-abi');

// Add your parameters here, then copy the encoded data to be used as parameters in the makeRequest function.
const params = [
   { type: 'string', name: 'qasm', value: 'OPENQASM 2.0;\ninclude \"qelib1.inc\";\nqreg q[3];\ncreg meas[3];\nh q[0];\ncx q[0],q[1];\ncx q[0],q[2];\nbarrier q[0],q[1],q[2];\nmeasure q[0] -> meas[0];\nmeasure q[1] -> meas[1];\nmeasure q[2] -> meas[2];' }, 
   { type: 'string', name: 'backend_name', value: 'ibmq_qasm_simulator' }
];

const encodedData = encode(params);
const decodedData = decode(encodedData);

console.log(encodedData);
console.log(decodedData);