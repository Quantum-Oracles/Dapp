import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useCircuitContext } from "../components/CircuitContext";
import { Button, Icon } from "@chakra-ui/react";
import { encodeAbiParameters, keccak256 } from "viem";
import { CpuChipIcon } from "@heroicons/react/24/outline";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

export function Load_Results(): JSX.Element {
  const { circuit } = useCircuitContext();
  const [circuitHashes, setCircuitHashes] = useState<`0x${string}`[]>([]);
  const [selectedCircuitHash, setSelectedCircuitHash] = useState<`0x${string}`>();

  useEffect(() => {
    const hashes = JSON.parse(localStorage.getItem("circuits") || "[]");
    setCircuitHashes(hashes as `0x${string}`[]);
  }, []);

  useEffect(() => {
    if (!circuit) return;
    const encodedCircuit = encodeAbiParameters([{ name: "circuitQASM", type: "string" }], [circuit]);
    // setCircuitHash(keccak256(encodedCircuit));
  }, [circuit]);

  const { data: result, refetch: resultRefetch } = useScaffoldContractRead({
    contractName: "QuantumOracleV1",
    functionName: "results",
    args: [selectedCircuitHash],
  });

  const { data: status, refetch: statusRefetch } = useScaffoldContractRead({
    contractName: "QuantumOracleV1",
    functionName: "status",
    args: [selectedCircuitHash],
  });

  const { data: cost } = useScaffoldContractRead({
    contractName: "QuantumOracleV1",
    functionName: "calculateCost",
    args: [selectedCircuitHash],
  });

  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "QuantumOracleV1",
    functionName: "addCircuit",
    args: [selectedCircuitHash],
    // For payable functions
    value: cost,
    // The number of block confirmations to wait for before considering transaction to be confirmed (default : 1).
    blockConfirmations: 1,
    // The callback function to execute when the transaction is confirmed.
    onBlockConfirmation: txnReceipt => {
      console.log("Transaction blockHash", txnReceipt.blockHash);
    },
  });

  useScaffoldEventSubscriber({
    contractName: "QuantumOracleV1",
    eventName: "CircuitAdded",
    listener(logs) {
      logs.map(log => {
        const { circuitHash: _ch } = log.args;
        if (_ch == selectedCircuitHash) {
          statusRefetch();
        }
      });
    },
  });

  useScaffoldEventSubscriber({
    contractName: "QuantumOracleV1",
    eventName: "CircuitResultUpdated",
    listener(logs) {
      logs.map(log => {
        const { circuitHash: _ch, result } = log.args;
        if (_ch == selectedCircuitHash) {
          statusRefetch();
          resultRefetch();
        }
      });
    },
  });

  return (
    <>
      <div>
        <table className="table-auto hover:table-fixed">
          <thead>
            <tr>
              <th>Circuit Hash</th>
            </tr>
          </thead>
          <tbody>
            {circuitHashes.map(hash => (
              <tr key={hash} onClick={() => setSelectedCircuitHash(hash)}>
                <td>{hash}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedCircuitHash && (
          <div>
            <div className="">Selected Circuit Hash = {selectedCircuitHash}</div>
            {!status || status == 0 ? (
              <p className="text-center mb-8">
                <Button onClick={() => writeAsync()} leftIcon={<Icon as={CpuChipIcon} />}>
                  Send Circuit to QOracle
                </Button>
              </p>
            ) : (
              <>
                {status == 1 ? <div>Quantum Computer is still executing the circuit</div> : <div>Result: {result}</div>}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
