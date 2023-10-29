import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useCircuitContext } from "../components/CircuitContext";
import { Button } from "@chakra-ui/react";
import { encodeAbiParameters, keccak256 } from "viem";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

export function Load_Results(): JSX.Element {
    const { circuit } = useCircuitContext();
    const [circuitHash, setCircuitHash] = useState<`0x${string}`>();

    useEffect(() => {
        if (!circuit) return;
        const encodedCircuit = encodeAbiParameters([{ name: "circuitQASM", type: "string" }], [circuit]);
        setCircuitHash(keccak256(encodedCircuit));
    }, [circuit]);

    return (
        <>
        <div>
        </div>
        </>
    );
}