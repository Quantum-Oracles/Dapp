import Link from "next/link";
import type { NextPage } from "next";
import { Button, Icon } from "@chakra-ui/react";
import { CpuChipIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";
import { Upload } from 'components/FileUpload';


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
          <div>
          <p className="text-center mb-8">
          <Link href="/submit-circuit"> 
           <Button leftIcon={<Icon as={CpuChipIcon} />}>Send Circuit to QOracle</Button>
          </Link>
          </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
