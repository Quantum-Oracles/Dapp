const { encode } = require ('@api3/airnode-abi');
const { decode } = require ('@api3/airnode-abi');

const encodedData = "";
const decodedData = decode(encodedData);

console.log(encodedData);
console.log(decodedData);