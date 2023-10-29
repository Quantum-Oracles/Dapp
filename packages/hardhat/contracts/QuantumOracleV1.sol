// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract QuantumOracleV1 is Ownable {
	enum Status {
		NON_EXISTENT,
		PENDING,
		RESULT_UPDATED
	}

	enum RequestType {
		NON_EXISTENT,
		CREATE_CIRCUIT,
		FETCH_RESULT,
		CLUB_RESULT
	}

	struct JobId {
		address oracleAddress;
		string jobId;
	}

	mapping(address => bool) public isOracleAddress;
	mapping(bytes32 => mapping(RequestType => mapping(address => bool)))
		public hasSubmittedResponse;
	mapping(bytes32 => mapping(RequestType => string[])) public oracleResponses;
	mapping(bytes32 => string) public circuits;
	mapping(bytes32 => string) public results;
	mapping(bytes32 => JobId[]) public jobIds;
	mapping(bytes32 => Status) public status;

	uint256 public totalOracleAddresses;

	event OracleAdded(address oracleAddress);
	event OracleRemoved(address oracleAddress);
	event OracleResponseSubmitted(
		uint256 requestId,
		address oracleAddress,
		bytes32 response
	);
	event CircuitAdded(string circuitQASM, bytes32 circuitHash);
	event CircuitResultUpdated(bytes32 circuitHash, string result);
	event ResultsCollected(bytes32 circuitHash);

	error InvalidValueSent();
	error CircuitAlreadyInSystem();
	error InvalidStatusForThisCall();
	error OracleAlreadyAdded();
	error AlreadySubmittedResponse();
	error OracleNotFound();
	error OnlyOraclesAllowed();

	constructor() {}

	function addOracle(address oracleAddress) public onlyOwner {
		if (isOracleAddress[oracleAddress]) revert OracleAlreadyAdded();
		isOracleAddress[oracleAddress] = true;
		totalOracleAddresses++;
		emit OracleAdded(oracleAddress);
	}

	function removeOracle(address oracleAddress) public onlyOwner {
		if (!isOracleAddress[oracleAddress]) revert OracleNotFound();
		isOracleAddress[oracleAddress] = false;
		totalOracleAddresses--;
		emit OracleRemoved(oracleAddress);
	}

	function addCircuit(string memory circuitQASM) public payable {
		bytes32 circuitHash = keccak256(abi.encode(circuitQASM));
		if (status[circuitHash] != Status.NON_EXISTENT)
			revert CircuitAlreadyInSystem();
		if (calculateCost(circuitQASM) != msg.value) revert InvalidValueSent();

		circuits[circuitHash] = circuitQASM;
		status[circuitHash] = Status.PENDING;

		emit CircuitAdded(circuitQASM, circuitHash);
	}

	function addData(
		bytes32 circuitHash,
		RequestType rtype,
		string calldata data
	) public {
		if (status[circuitHash] != Status.PENDING)
			revert InvalidStatusForThisCall();
		if (!isOracleAddress[msg.sender]) revert OnlyOraclesAllowed();
		if (hasSubmittedResponse[circuitHash][rtype][msg.sender])
			revert AlreadySubmittedResponse();
		oracleResponses[circuitHash][rtype].push(data);

		if (rtype == RequestType.CREATE_CIRCUIT) {
			jobIds[circuitHash].push(
				JobId({ oracleAddress: msg.sender, jobId: data })
			);
		}

		if (
			oracleResponses[circuitHash][rtype].length == totalOracleAddresses
		) {
			if (rtype == RequestType.FETCH_RESULT) {
				emit ResultsCollected(circuitHash);
			}
			if (rtype == RequestType.CLUB_RESULT) {
				// TODO: check the clubbed result (if all oracles return the same response or not)
				results[circuitHash] = data;
				status[circuitHash] = Status.RESULT_UPDATED;
				emit CircuitResultUpdated(circuitHash, data);
			}
		}
	}

	function calculateCost(
		string memory circuitQASM
	) public pure returns (uint256) {
		return bytes(circuitQASM).length * 1e10;
	}
}
