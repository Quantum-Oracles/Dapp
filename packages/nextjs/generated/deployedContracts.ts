const contracts = {
  16: [
    {
      chainId: "16",
      name: "coston",
      contracts: {
        QuantumOracleV1: {
          address: "0x7A140831ddF3c56E44401d9be76D78D42B704d69",
          abi: [
            {
              inputs: [],
              stateMutability: "nonpayable",
              type: "constructor",
            },
            {
              inputs: [],
              name: "AlreadySubmittedResponse",
              type: "error",
            },
            {
              inputs: [],
              name: "CircuitAlreadyInSystem",
              type: "error",
            },
            {
              inputs: [],
              name: "InvalidStatusForThisCall",
              type: "error",
            },
            {
              inputs: [],
              name: "InvalidValueSent",
              type: "error",
            },
            {
              inputs: [],
              name: "OnlyOraclesAllowed",
              type: "error",
            },
            {
              inputs: [],
              name: "OracleAlreadyAdded",
              type: "error",
            },
            {
              inputs: [],
              name: "OracleNotFound",
              type: "error",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "string",
                  name: "circuitQASM",
                  type: "string",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "circuitHash",
                  type: "bytes32",
                },
              ],
              name: "CircuitAdded",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "circuitHash",
                  type: "bytes32",
                },
                {
                  indexed: false,
                  internalType: "string",
                  name: "result",
                  type: "string",
                },
              ],
              name: "CircuitResultUpdated",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "address",
                  name: "oracleAddress",
                  type: "address",
                },
              ],
              name: "OracleAdded",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "address",
                  name: "oracleAddress",
                  type: "address",
                },
              ],
              name: "OracleRemoved",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "uint256",
                  name: "requestId",
                  type: "uint256",
                },
                {
                  indexed: false,
                  internalType: "address",
                  name: "oracleAddress",
                  type: "address",
                },
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "response",
                  type: "bytes32",
                },
              ],
              name: "OracleResponseSubmitted",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: true,
                  internalType: "address",
                  name: "previousOwner",
                  type: "address",
                },
                {
                  indexed: true,
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "OwnershipTransferred",
              type: "event",
            },
            {
              anonymous: false,
              inputs: [
                {
                  indexed: false,
                  internalType: "bytes32",
                  name: "circuitHash",
                  type: "bytes32",
                },
              ],
              name: "ResultsCollected",
              type: "event",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "circuitQASM",
                  type: "string",
                },
              ],
              name: "addCircuit",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "circuitHash",
                  type: "bytes32",
                },
                {
                  internalType: "enum QuantumOracleV1.RequestType",
                  name: "rtype",
                  type: "uint8",
                },
                {
                  internalType: "string",
                  name: "data",
                  type: "string",
                },
              ],
              name: "addData",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "oracleAddress",
                  type: "address",
                },
              ],
              name: "addOracle",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "string",
                  name: "circuitQASM",
                  type: "string",
                },
              ],
              name: "calculateCost",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "pure",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              name: "circuits",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
                {
                  internalType: "enum QuantumOracleV1.RequestType",
                  name: "",
                  type: "uint8",
                },
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "hasSubmittedResponse",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              name: "isOracleAddress",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              name: "jobIds",
              outputs: [
                {
                  internalType: "address",
                  name: "oracleAddress",
                  type: "address",
                },
                {
                  internalType: "string",
                  name: "jobId",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
                {
                  internalType: "enum QuantumOracleV1.RequestType",
                  name: "",
                  type: "uint8",
                },
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              name: "oracleResponses",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "owner",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "oracleAddress",
                  type: "address",
                },
              ],
              name: "removeOracle",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [],
              name: "renounceOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              name: "results",
              outputs: [
                {
                  internalType: "string",
                  name: "",
                  type: "string",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "bytes32",
                  name: "",
                  type: "bytes32",
                },
              ],
              name: "status",
              outputs: [
                {
                  internalType: "enum QuantumOracleV1.Status",
                  name: "",
                  type: "uint8",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [],
              name: "totalOracleAddresses",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
            {
              inputs: [
                {
                  internalType: "address",
                  name: "newOwner",
                  type: "address",
                },
              ],
              name: "transferOwnership",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
        },
      },
    },
  ],
} as const;

export default contracts;
