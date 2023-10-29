import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useCircuitContext } from "../components/CircuitContext";
import { MetaHeader } from "../components/MetaHeader";
import { Load_Results } from "../components/RenderResults";
import { NextPage } from "next";

const Results: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Existing QOracle Computations</span>
          </h1>
          <Load_Results />
        </div>
      </div>
    </>
  );
};

export default Results;
