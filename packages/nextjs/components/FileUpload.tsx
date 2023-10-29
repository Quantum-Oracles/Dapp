import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useCircuitContext } from "./CircuitContext";
import { Button, FormControl, FormErrorMessage, FormLabel, Icon, InputGroup } from "@chakra-ui/react";
import { UseFormRegisterReturn, useForm } from "react-hook-form";
import { encodeAbiParameters, keccak256 } from "viem";
import { CpuChipIcon } from "@heroicons/react/24/outline";
import { ArrowSmallUpIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";
import { useScaffoldContractRead, useScaffoldContractWrite, useScaffoldEventSubscriber } from "~~/hooks/scaffold-eth";

type FileUploadProps = {
  register: UseFormRegisterReturn;
  accept?: string;
  children?: ReactNode;
};

// Function to read a file as text
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const reader = new FileReader();

    reader.addEventListener("load", () => {
      const fileContents = reader.result as string;
      resolve(fileContents);
    });

    reader.addEventListener("error", () => {
      reject(new Error("Error reading the file"));
    });

    reader.readAsText(file);
  });
}

// FileUpload component
const FileUpload = (props: FileUploadProps) => {
  const { register, accept, children } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { ref, ...rest } = register as { ref: (instance: HTMLInputElement | null) => void };

  const handleClick = () => inputRef.current?.click();

  return (
    <InputGroup onClick={handleClick}>
      <input
        type={"file"}
        hidden
        accept={accept}
        {...rest}
        ref={e => {
          ref(e);
          inputRef.current = e;
        }}
      />
      <>{children}</>
    </InputGroup>
  );
};
type FormValues = {
  file: File;
};

export function Upload() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [CircuitString, setCircuitString] = useState("");
  const { setCircuit } = useCircuitContext();
  const [imgURL, setImg] = useState("");
  const [title, setTitle] = useState("");

  const onSubmit = handleSubmit(data => {
    if (!data.file) return;
    const selectedFile = readFileAsText((data.file as any as File[])[0])
      .then(fileContents => {
        console.log(fileContents);
        setCircuitString(fileContents);
        setCircuit(fileContents);
        setTitle("Your Circuit");
        //TODO currently can't render image
        // const imgPromise = fetchQiskitDataFromApi(fileContents);
        // imgPromise
        //   .then(resolvedValue => {
        //     // Do something with the resolved value
        //     const imageBlob = resolvedValue;
        //     const blob = new Blob(imageBlob, { type: "image/png" }); // the blob
        //     const imageObjectURL = URL.createObjectURL(blob);
        //     console.log(imageObjectURL);
        //     setImg(imageObjectURL);
        //   })
        //   .catch(error => {
        //     // Handle any errors that occurred during the promise execution
        //     console.log(error);
        //   });
      })
      .catch(error => {
        console.error(error);
      });
    console.log("On Submit: ", data);
    console.log("Selected file: ", selectedFile);
  });

  const validateFiles = (value: File) => {
    if (!value || (value as any as File[]).length < 1) {
      return "File is required";
    }
    const file = value;
    console.log(file);
    const fsMb = file.size / (1024 * 1024);
    const MAX_FILE_SIZE = 1;
    if (fsMb > MAX_FILE_SIZE) {
      return "Max file size 1mb";
    }
    return true;
  };

  const { data: cost } = useScaffoldContractRead({
    contractName: "QuantumOracleV1",
    functionName: "calculateCost",
    args: [CircuitString],
  });

  const [circuitHash, setCircuitHash] = useState<`0x${string}`>();

  useEffect(() => {
    if (!CircuitString) return;
    const encodedCircuit = encodeAbiParameters([{ name: "circuitQASM", type: "string" }], [CircuitString]);
    setCircuitHash(keccak256(encodedCircuit));
  }, [CircuitString]);

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

  const { writeAsync, isLoading, isMining } = useScaffoldContractWrite({
    contractName: "QuantumOracleV1",
    functionName: "addCircuit",
    args: [CircuitString],
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
    <>
      <form onSubmit={onSubmit}>
        <FormControl isInvalid={!!errors.file} isRequired>
          <FormLabel>{"File input"}</FormLabel>
          <FileUpload
            accept=".qasm" // accepts .qasm files only
            register={register("file", { validate: validateFiles })}
          >
            <Button leftIcon={<Icon as={ArrowSmallUpIcon} />}>Upload your QASM file</Button>
          </FileUpload>

          <FormErrorMessage>{errors.file && errors?.file.message}</FormErrorMessage>
        </FormControl>
        <p>
          <Button onClick={onSubmit} leftIcon={<Icon as={CheckBadgeIcon} />}>
            Set your Circuit
          </Button>
          {/* <button></button> */}
        </p>
      </form>
      <div>
        <h2>{title}</h2>
        <p>
          {CircuitString.split("\n").map(el => (
            <React.Fragment key={el}>
              {el}
              <br />
            </React.Fragment>
          ))}
        </p>
        {CircuitString && (
          <>
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
          </>
        )}
      </div>
    </>
  );
}
