"use client";

import { useEffect, useState } from "react";
import { openaifun } from "./api/llmAPI";
import { Icon, Input } from "@chakra-ui/react";
import { NextPage } from "next";
import { MagnifyingGlassCircleIcon, MagnifyingGlassIcon, PlayIcon } from "@heroicons/react/24/outline";

// import { Input } from "@chakra-ui/react";

const GenerateCircuit: NextPage = () => {
  const [problem, setProblem] = useState<string>();
  const [circuit, setCircuit] = useState<string | null>(null);

  useEffect(() => {}, []);

  async function getOutput() {
    if (!problem) return;
    const data = await openaifun(problem);
    console.log(data);
    setCircuit(data);
  }

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
    </div>
  );
};

export default GenerateCircuit;
