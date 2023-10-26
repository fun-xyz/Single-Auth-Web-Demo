"use client"; // All React hooks need to be used in a client context
import {
  FunContextProvider,
  Goerli,
  useMetamaskAuth,
  useFunWallet,
  useAction,
  ActionType,
  ExecutionReceipt,
} from "@funkit/react";

import React, { Fragment, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import ChecklistItems from "./components/ChecklistItems";
import AsyncButton from "./components/AsyncButton";

/* ======================================================================== *
 *                      STEP 0: DEFINE CONFIGS / ENVS
 * =========================================================================*/
const GOERLI_ETHERSCAN_BASE_URL = "https://goerli.etherscan.io";
const FUN_APP_ID = "clnatprpv00sfmi0fv3qc185b";
const DEFAULT_FUN_WALLET_CONFIG = {
  apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf",
  chain: Goerli,
  gasSponsor: {
    sponsorAddress:
      "0xCB5D0b4569A39C217c243a436AC3feEe5dFeb9Ad" as `0x${string}`, //Gasless payments on Goerli. Please switch to another gas sponsor method, or prefund your wallet on mainnet!
  },
};

function App() {
  const [receiptTxId, setReceiptTxId] = useState("");
  const [step, setStep] = useState(0);
  /* ========================================================================
                            STEP 1: CONNECT METAMASK
     ======================================================================== */

  const {
    auth: metaMaskAuth,
    active,
    login: connectMetamask,
  } = useMetamaskAuth();

  const step1ConnectMetaMask = useCallback(async () => {
    await connectMetamask();
    setStep(1);
  }, [connectMetamask]);

  /* ========================================================================
                            STEP 2: INITIALIZE WALLET
     ======================================================================== */

  const { address, createFunWallet } = useFunWallet();

  const step2InitalizeWallet = useCallback(async () => {
    if (!active || !metaMaskAuth) {
      alert("MetaMask not connected. Please follow the steps in order.");
      return;
    }
    await createFunWallet(metaMaskAuth).catch();
    setStep(2);
  }, [metaMaskAuth, active, createFunWallet])

  /* ========================================================================
                            STEP 3: SEND TRANSACTION
     ======================================================================== */

  // Make use of useAction hook to execute any supported funWallet action
  const { executeOperation, ready } = useAction({
    action: ActionType.create,
    params: null,
  });

  const step3SendTransaction = useCallback(async () => {
    if (!ready) {
      alert("FunWallet not initialized. Please follow the steps in order.");
      return;
    }

    const op = (await executeOperation()) as ExecutionReceipt;
    if (!op) return;
    setReceiptTxId(op.txId as string);
    setStep(3);
  }, [executeOperation, ready])


  // Build the step items
  const stepItems = useMemo(() => {
    return [
      {
        title: "Connect MetaMask",
        actionTitle: "Connect",
        actionOnClick: step1ConnectMetaMask,
        switchCondition: !!active,
        completeContent: <p>Connected! You are now ready to use FunWallet</p>,
      },
      {
        title: "Initialize FunWallet",
        actionTitle: "Initialize",
        actionOnClick: step2InitalizeWallet,
        switchCondition: !!address,
        completeContent: (
          <Fragment>
            <p>
              Success! FunWallet Address:
              <Link
                href={`${GOERLI_ETHERSCAN_BASE_URL}/address/${address}`}
                target="_blank"
              >
                &nbsp;{address}.
              </Link>
            </p>
          </Fragment>
        ),
      },
      {
        title: "Create a transaction on a FunWallet",
        actionTitle: "Create",
        actionOnClick: step3SendTransaction,
        switchCondition: !!receiptTxId,
        completeContent: (
          <p>
            <Link
              href={`${GOERLI_ETHERSCAN_BASE_URL}/tx/${receiptTxId}`}
              target="_blank"
              rel="noreferrer"
            >
              Transaction submitted!
            </Link>{" "}
            View (smart contract) wallet on{" "}
            <Link
              href={`${GOERLI_ETHERSCAN_BASE_URL}/address/${address}`}
              target="_blank"
              rel="noreferrer"
            >
              block explorer.
            </Link>
          </p>
        ),
      },
    ];
  }, [
    step1ConnectMetaMask,
    active,
    step2InitalizeWallet,
    address,
    step3SendTransaction,
    receiptTxId,
  ]);

  return (
    <div className="App p-6 mt-8 ml-4 flex justify-center items-start">
      <div className="w-[600px]">
        <h1 className="pb-4 font-bold">Create FunWallet with MetaMask</h1>
        <ChecklistItems stepNumber={step}>
          {stepItems.map((stepItem, idx) => (
            <div id={stepItem.title} key={stepItem.title}>
              <h3>{stepItem.title}</h3>
              {stepItem.switchCondition ? (
                stepItem.completeContent
              ) : (
                <AsyncButton
                  onClick={() => stepItem.actionOnClick?.()}
                  disabled={step < idx}
                  title={stepItem.actionTitle}
                />
              )}
            </div>
          ))}
        </ChecklistItems>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <FunContextProvider options={DEFAULT_FUN_WALLET_CONFIG} privyAppId={FUN_APP_ID}>
      <App />
    </FunContextProvider>
  );
}
