import "./styles.css";
import {
  FunContextProvider,
  convertToValidUserId,
  // useConnector,
  useCreateFun,
  configureNewFunStore,
  // MetamaskConnector,
  Goerli,
  usePrimaryAuth,
  useMetamaskAuth,
} from "@funkit/react";
import { useState, useCallback } from "react";
import { ChecklistItems, AsyncButton } from "./UI";

// Step 1: Initialize the FunStore. This action configures your environment based on your ApiKey, chain, and the authentication methods of your choosing.
const DEFAULT_FUN_WALLET_CONFIG = {
  apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf",
  chain: Goerli,
  gasSponsor: {
    sponsorAddress: "0xCB5D0b4569A39C217c243a436AC3feEe5dFeb9Ad", //Gasless payments on Goerli. Please switch to another gas sponsor method, or prefund your wallet on mainnet!
  },
};

// const DEFAULT_CONNECTORS = [MetamaskConnector()];

configureNewFunStore({
  config: DEFAULT_FUN_WALLET_CONFIG,
  // connectors: DEFAULT_CONNECTORS,
});

export default function AppWrapper() {
  return (
    <FunContextProvider appId={"clnatprpv00sfmi0fv3qc185b"}>
      <App />
    </FunContextProvider>
  );
}

export function App() {
  const [receiptTxId, setReceiptTxId] = useState("");
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(false);
  const [account, setAccount] = useState(false);

  // Step 2: Use the connector button to connect your authentication method, in this case metamask.
  // const {
  //   active,
  //   activate,
  //   deactivate,
  //   connector,
  //   account: connectorAccount,
  // } = useConnector({ index: 0, autoConnect: true });

  /* ========================================================================
                            STEP 1: CONNECT METAMASK
     ======================================================================== */

  // const mmAuth = useMetamaskAuth()

  async function step1ConnectMetaMask() {

  }

  // Step 3: Use the initializeFunAccount method to create your funWallet object
  // const { account, initializeFunAccount, funWallet } = useCreateFun();

  // Step 4: Use the auth and funWallet to perform actions (ie: swap, transfer, etc.)
  // const [auth] = usePrimaryAuth();

  /* ========================================================================
                              STEP 2: CREATE WALLET
     ======================================================================== */

  async function step2CreateWallet() {
    // if (!connectorAccount) {
    //   alert("MetaMask not connected. Please follow the steps in order.");
    //   return;
    // }
    // initializeFunAccount({
    //   users: [{ userId: convertToValidUserId(connectorAccount) }],
    //   index: parseInt(Math.random() * 10000000), //random number
    // }).catch();
  }

  /* ========================================================================
                              STEP 3: SEND TRANSACTION
     ======================================================================== */

  async function step3SendTransaction() {
    // if (!funWallet) {
    //   alert("FunWallet not initialized. Please follow the steps in order.");
    //   return;
    // }

    // // Add your custom action code here!
    // const op = await funWallet.create(auth, await auth.getUserId());
    // const receipt = await funWallet.executeOperation(auth, op);
    // setReceiptTxId(receipt.txId);

    // // FINAL STEP: Add your custom action logic here (swap, transfer, etc)
  }

  return (
    <div className="App">
      <h1>Create FunWallet with MetaMask</h1>
      <ChecklistItems stepNumber={step}>
        {/* ========================================================================
                                  STEP 1: CONNECT METAMASK
          ======================================================================== */}
        <div>
          <h3>{active ? "MetaMask connected!" : "Connect metamask"}</h3>
          {active ? (
            <p> You are now ready to use FunWallet </p>
          ) : (
            <AsyncButton
              onClick={async () => {
                await step1ConnectMetaMask();
                setStep(1);
              }}
            >
              <p>Connect</p>
            </AsyncButton>
          )}
        </div>
        {/* ========================================================================
                                    STEP 2: CREATE WALLET
          ======================================================================== */}
        <div>
          <h3>Initialize FunWallet</h3>
          {account ? (
            <p>Success! FunWallet Address: {account}</p>
          ) : (
            <AsyncButton
              disabled={step < 1}
              onClick={async () => {
                await step2CreateWallet();
                setStep(2);
              }}
            >
              <p>Initialize</p>
            </AsyncButton>
          )}
        </div>
        {/* ========================================================================
                                    STEP 3: SEND TRANSACTION
          ======================================================================== */}
        <div>
          <h3> Create FunWallet </h3>
          <AsyncButton
            disabled={step < 2}
            onClick={async () => {
              await step3SendTransaction();
              setStep(3);
            }}
          >
            <p>Create</p>
          </AsyncButton>
          {receiptTxId && (
            <div style={{ paddingTop: 10, fontSize: 14 }}>
              <a
                href={`https://goerli.etherscan.io/tx/${receiptTxId}`}
                target="_blank"
                rel="noreferrer"
              >
                Transaction submitted!
              </a>{" "}
              View wallet on{" "}
              <a
                href={`https://goerli.etherscan.io/address/${account}`}
                target="_blank"
                rel="noreferrer"
              >
                block explorer.
              </a>
            </div>
          )}
        </div>
      </ChecklistItems>
    </div>
  );
}
