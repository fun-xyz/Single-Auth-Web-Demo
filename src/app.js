import "./styles.css";
import {
  convertToValidUserId,
  useConnector,
  useCreateFun,
  configureNewFunStore,
  MetamaskConnector,
  Goerli,
  usePrimaryAuth,
} from "@funkit/react";
import { useState, useCallback } from "react";
import { ChecklistItems, AsyncButton } from "./UI";

//Step 1: Initialize the FunStore. This action configures your environment based on your ApiKey, chain, and the authentication methods of your choosing.
const DEFAULT_FUN_WALLET_CONFIG = {
  apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf",
  chain: Goerli,
  gasSponsor: {
    sponsorAddress: "0xCB5D0b4569A39C217c243a436AC3feEe5dFeb9Ad", //Gasless payments on Goerli. Please switch to another gas sponsor method, or prefund your wallet on mainnet!
  },
};

const DEFAULT_CONNECTORS = [MetamaskConnector()];

configureNewFunStore({
  config: DEFAULT_FUN_WALLET_CONFIG,
  connectors: DEFAULT_CONNECTORS,
});

export default function App() {
  const [receiptTxId, setReceiptTxId] = useState("");
  const [step, setStep] = useState(0);

  //Step 2: Use the connector button to connect your authentication method, in this case metamask.
  const {
    active,
    activate,
    deactivate,
    connector,
    account: connectorAccount,
  } = useConnector({ index: 0, autoConnect: true });

  const toggleConnect = useCallback(async () => {
    if (active) {
      await deactivate(connector);
    } else {
      await activate(connector);
    }
  }, [active, activate, deactivate, connector]);

  //Step 3: Use the initializeFunAccount method to create your funWallet object
  const { account, initializeFunAccount, funWallet } = useCreateFun();

  //Step 4: Use the auth and funWallet to perform actions (ie: swap, transfer, etc.)
  const [auth] = usePrimaryAuth();

  const initializeSingleAuthFunAccount = async () => {
    if (!connectorAccount) {
      alert("Metamask not connected. Please follow the steps.");
      return;
    }
    initializeFunAccount({
      users: [{ userId: convertToValidUserId(connectorAccount) }],
      index: parseInt(Math.random() * 10000000), //random number
    }).catch();
  };

  const createWallet = async () => {
    if (!funWallet) {
      alert("FunWallet not initialized. Please follow the steps.");
      return;
    }

    // Add your custom action code here!
    const op = await funWallet.create(auth, await auth.getUserId());
    const receipt = await funWallet.executeOperation(auth, op);
    setReceiptTxId(receipt.txId);

    // FINAL STEP: Add your custom action logic here (swap, transfer, etc)
  };

  return (
    <div className="App">
      <h1>Create FunWallet with Metamask</h1>
      <ChecklistItems stepNumber={step}>
        <div>
          <h3>{active ? "Metamask connected!" : "Connect metamask"}</h3>
          {active ? (
            <p> You are now ready to use FunWallet </p>
          ) : (
            <AsyncButton
              onClick={async () => {
                await toggleConnect();
                setStep(1);
              }}
            >
              <p>Connect</p>
            </AsyncButton>
          )}
        </div>
        <div>
          <h3>Initialize FunWallet</h3>
          {account ? (
            <p>Success! FunWallet Address: {account}</p>
          ) : (
            <AsyncButton
              disabled={step < 1}
              onClick={async () => {
                await initializeSingleAuthFunAccount();
                setStep(2);
              }}
            >
              <p>Initialize</p>
            </AsyncButton>
          )}
        </div>

        <div>
          <h3> Create FunWallet </h3>
          <AsyncButton
            disabled={step < 2}
            onClick={async () => {
              await createWallet();
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
