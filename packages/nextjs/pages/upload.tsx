import Link from "next/link";
import { Upload } from "../components/FileUpload";
import { MetaHeader } from "../components/MetaHeader";
import { Button, Icon } from "@chakra-ui/react";
import type { NextPage } from "next";
import { CpuChipIcon } from "@heroicons/react/24/outline";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Upload your Quantum Circuit</span>
          </h1>
          <Upload />
        </div>
      </div>
    </>
  );
};

export default Home;
