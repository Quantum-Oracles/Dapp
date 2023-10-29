"use client";

import React, { useEffect, useState } from "react";
import { openaifun } from "./api/llmAPI";
import { Button, Icon, Input, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { NextPage } from "next";
import { encodeAbiParameters, keccak256 } from "viem";
import {
  ArrowTopRightOnSquareIcon,
  CpuChipIcon,
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
  PlayIcon,
} from "@heroicons/react/24/outline";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

// import { Input } from "@chakra-ui/react";

const GenerateCircuit: NextPage = () => {
  const [problem, setProblem] = useState<string>("");
  const [circuit, setCircuit] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [circuitHash, setCircuitHash] = useState<`0x${string}`>();

  async function getOutput() {
    if (!problem) return;
    console.log(problem);
    setLoading(true);
    const {
      data: { message },
    } = await axios.post("/api/llmAPI", { prompt: problem });
    setLoading(false);
    setCircuit(message);
  }

  useEffect(() => {
    if (!circuit) {
      setCircuitHash(undefined);
      return;
    }
    const encodedCircuit = encodeAbiParameters([{ name: "circuitQASM", type: "string" }], [circuit]);
    const hash = keccak256(encodedCircuit);
    setCircuitHash(hash);
    const circuits = JSON.parse(localStorage.getItem("circuits") || "[]");
    if (!circuits.includes(hash)) {
      circuits.push(hash);
      localStorage.setItem("circuits", JSON.stringify(circuits));
    }
  }, [circuit]);

  const { data: result, refetch: resultRefetch } = useScaffoldContractRead({
    contractName: "QuantumOracleV1",
    functionName: "results",
    args: [circuitHash],
  });

  const { data: status, refetch: statusRefetch } = useScaffoldContractRead({
    contractName: "QuantumOracleV1",
    functionName: "status",
    args: [circuitHash],
  });

  const { data: cost } = useScaffoldContractRead({
    contractName: "QuantumOracleV1",
    functionName: "calculateCost",
    args: [circuitHash],
  });

  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "QuantumOracleV1",
    functionName: "addCircuit",
    args: [circuitHash],
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
        if (_ch == circuitHash) {
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
        if (_ch == circuitHash) {
          statusRefetch();
          resultRefetch();
        }
      });
    },
  });

  return (
    <div className="w-1/2 mx-auto pt-10">
      <div className="flex justify-center gap-2">
        <Input
          onChange={e => setProblem(e.target.value)}
          value={problem}
          placeholder="Write a quantum circuit for ...."
        />
        <Icon onClick={getOutput} as={PlayIcon} className="text-2xl my-auto" />
      </div>

      {loading && (
        <div className="mt-14">
          <Spinner width="50px" height="50px" />
        </div>
      )}

      {circuit && (
        <div>
          <form action="https://quantum-api-2eds4tyidq-nw.a.run.app/draw" target="my-iframe" method="post">
            <input type="hidden" name="qasm" value={circuit} />
            <button type="submit" style={{ textDecoration: "underline" }}>
              Display Circuit <Icon as={ArrowTopRightOnSquareIcon} />
            </button>
          </form>

          <div>
            <p>
              {circuit.split("\n").map((el, i) => (
                <React.Fragment key={i}>
                  {el}
                  <br />
                </React.Fragment>
              ))}
            </p>
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
        </div>
      )}
    </div>
  );
};

export default GenerateCircuit;
