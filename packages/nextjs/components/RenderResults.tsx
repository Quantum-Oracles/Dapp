import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useCircuitContext } from "../components/CircuitContext";
import { Button, FormControl, FormErrorMessage, FormLabel, Icon, InputGroup } from "@chakra-ui/react";
import { encodeAbiParameters, keccak256 } from "viem";
import { MetaHeader } from "../components/MetaHeader";
import { fetchQiskitDataFromApi }  from "../pages/api/qiskitAPI";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

function Load_Results() {
  const { circuit, setCircuit } = useCircuitContext();
    const [imgURL, setImg] = useState("");
    const imgPromise = fetchQiskitDataFromApi(circuit);
    imgPromise
        .then(resolvedValue => {
        // Do something with the resolved value
        const imageBlob = resolvedValue;
        const blob = new Blob(imageBlob, { type: "image/png" }); // the blob
        const imageObjectURL = URL.createObjectURL(blob);
        console.log(imageObjectURL);
        setImg(imageObjectURL);
        })
        .catch(error => {
        // Handle any errors that occurred during the promise execution
        console.log(error);
        });


    const [circuitHash, setCircuitHash] = useState<`0x${string}`>();

    useEffect(() => {
        if (!circuit) return;
        const encodedCircuit = encodeAbiParameters([{ name: "circuitQASM", type: "string" }], [circuit]);
        setCircuitHash(keccak256(encodedCircuit));
    }, [circuit]);

    const { data: status, refetch: statusRefetch } = useScaffoldContractRead({
        contractName: "QuantumOracleV1",
        functionName: "status",
        args: [circuitHash],
    });

    const { data: result, refetch: resultRefetch } = useScaffoldContractRead({
        contractName: "QuantumOracleV1",
        functionName: "results",
        args: [circuitHash],
    });

    console.log(status);

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
        <>
            {imgURL && <img src={imgURL} />}
          {!imgURL && <p>Loading Circuit Image...</p>}
        </>
    );
};