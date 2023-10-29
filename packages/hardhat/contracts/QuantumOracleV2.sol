// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@api3/airnode-protocol/contracts/rrp/requesters/RrpRequesterV0.sol";
import "@openzeppelin/contracts@4.9.0/access/Ownable.sol";
import "@api3/contracts/v0.8/interfaces/IProxy.sol";

contract QuantumOracleV1 is RrpRequesterV0, Ownable {
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

	mapping(address => bool) public isOracleAddress;
	mapping(bytes32 => mapping(RequestType => mapping(address => bool)))
		public hasSubmittedResponse;
	mapping(bytes32 => mapping(RequestType => string[])) public oracleResponses;
	mapping(bytes32 => string) public circuits;
	mapping(bytes32 => string) public results;
	mapping(bytes32 => bytes[]) public jobIds;
	mapping(bytes32 => Status) public status;
    mapping(bytes32 => bool) public circuitIncomingFulfillments;
    mapping(bytes32 => bool) public resultIncomingFulfillments;

	uint256 public totalOracleAddresses;

    address public proxyAddress;

    address public airnode;
    address public sponsorWallet;
    bytes32 public circuitEndpointId;
    bytes32 public resultEndpointId;

    bytes public returnedResponse;

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

    event RequestedUint256(bytes32 indexed requestId);
    event ReceivedString(bytes32 indexed requestId, string response);

	error InvalidValueSent();
	error CircuitAlreadyInSystem();
	error InvalidStatusForThisCall();
	error OracleAlreadyAdded();
	error AlreadySubmittedResponse();
	error OracleNotFound();
	error OnlyOraclesAllowed();

	constructor(address _rrpAddress) RrpRequesterV0(_rrpAddress) {}

    function setProxyAddress(address _proxyAddress) public onlyOwner {
        proxyAddress = _proxyAddress;
    }

    function setRequestParameters(
        address _airnode,
        bytes32 _circuitEndpointId,
        bytes32 _resultsEndpointId,
        address _sponsorWallet
    ) external onlyOwner {
        airnode = _airnode;
        circuitEndpointId = _circuitEndpointId;
        resultEndpointId = _resultsEndpointId;
        sponsorWallet = _sponsorWallet;
    }

    function circuitMakeRequest(bytes calldata parameters) external {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            circuitEndpointId,
            address(this),
            sponsorWallet,
            address(this),
            this.circuitFulfill.selector,
            parameters
        );
        circuitIncomingFulfillments[requestId] = true;
        emit RequestedUint256(requestId);
    }

    function circuitFulfill(bytes32 requestId, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(circuitIncomingFulfillments[requestId], "No such request made");
        delete circuitIncomingFulfillments[requestId];
        string memory decodedData = abi.decode(data, (string));
        returnedResponse = data;
        // addJobIds(circuitHash, decodedData);
        emit ReceivedString(requestId, decodedData);
    }

    function resultMakeRequest(bytes calldata parameters) external {
        bytes32 requestId = airnodeRrp.makeFullRequest(
            airnode,
            resultEndpointId,
            address(this),
            sponsorWallet,
            address(this),
            this.resultFulfill.selector,
            parameters
        );
        resultIncomingFulfillments[requestId] = true;
        emit RequestedUint256(requestId);
    }

    function resultFulfill(bytes32 requestId, bytes32 circuitHash, bytes calldata data)
        external
        onlyAirnodeRrp
    {
        require(resultIncomingFulfillments[requestId], "No such request made");
        delete resultIncomingFulfillments[requestId];
        string memory decodedData = abi.decode(data, (string));
        addResults(circuitHash, decodedData);
        emit ReceivedString(requestId, decodedData);
    }

    function addJobIds(bytes32 circuitHash, string memory data) public {
        if (status[circuitHash] != Status.PENDING)
			revert InvalidStatusForThisCall();
		if (hasSubmittedResponse[circuitHash][RequestType.CREATE_CIRCUIT][msg.sender])
			revert AlreadySubmittedResponse();
		oracleResponses[circuitHash][RequestType.CREATE_CIRCUIT].push(data);

		jobIds[circuitHash].push(returnedResponse);
    }

    function addResults(bytes32 circuitHash, string memory data) public {
        results[circuitHash] = data;
        status[circuitHash] = Status.RESULT_UPDATED;
        emit CircuitResultUpdated(circuitHash, data);
    }

    function getCircuitHash(string memory circuitQASM) public pure returns(bytes32) {
        bytes32 circuitHash = keccak256(abi.encode(circuitQASM));
        return circuitHash;
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

    function readDataFeed() public view returns (uint256, uint256) {
        (int224 value, uint256 timestamp) = IProxy(proxyAddress).read();
        uint256 price = uint224(value);
        return (price, timestamp);
    }

	function calculateCostInUSD(
		string memory circuitQASM
	) public pure returns (uint256) {
		return bytes(circuitQASM).length * 1e10;
	}

	function calculateCost(
		string memory circuitQASM
	) public view returns (uint256) {
        (uint256 price, ) = readDataFeed();
        uint256 cost = calculateCostInUSD(circuitQASM);
        uint256 amountInETHWei = (cost * 1 ether) / price;
		return amountInETHWei;
	}
}
