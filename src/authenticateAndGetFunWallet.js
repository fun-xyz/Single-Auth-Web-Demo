import "./styles.css";
import {
  convertToValidUserId,
  useConnector,
  useCreateFun,
  configureNewFunStore,
  MetamaskConnector,
  Goerli,
  usePrimaryAuth,
} from "@fun-xyz/react";
import { useState } from "react";

//Step 1: Initialize the FunStore. This action configures your environment based on your ApiKey, chain, and the authentication methods of your choosing. 
const DEFAULT_FUN_WALLET_CONFIG = {
  apiKey: "hnHevQR0y394nBprGrvNx4HgoZHUwMet5mXTOBhf",
  chain: Goerli,
  gasSponsor: {
    sponsorAddress: "0xCB5D0b4569A39C217c243a436AC3feEe5dFeb9Ad", //Gasless payments on Goerli. Please switch to another gas sponsor method, or prefund your wallet on mainnet!
  }
};

const DEFAULT_CONNECTORS = [
  MetamaskConnector(),
];

configureNewFunStore({
  config: DEFAULT_FUN_WALLET_CONFIG,
  connectors: DEFAULT_CONNECTORS,
});

//Step 2: Use the connector button to connect your authentication method, in this case metamask. 
const ConnectorButton = ({ index }) => {
  const { active, activate, deactivate, connectorName, connector } = useConnector({ index });

  return (<button
    onClick={() => {
      if (active) {
        deactivate(connector)
        return
      }
      activate(connector)
    }
    }>{active ? ("Disconnect") : ("Connect")} {connectorName} </button>)
}

export default function App() {
  const [receiptTxId, setReceiptTxId] = useState("")
  const [loading, setLoading] = useState(false)

  const { account: connectorAccount, active } = useConnector({ index: 0, autoConnect: true });

  //Step 3: Use the initializeFunAccount method to create your funWallet object
  const { account, initializeFunAccount, funWallet } = useCreateFun()

  //Step 4: Use the auth and funWallet to perform actions (ie: swap, transfer, etc.)
  const [auth] = usePrimaryAuth()

  const initializeSingleAuthFunAccount = async () => {
    initializeFunAccount({
      users: [{ userId: convertToValidUserId(connectorAccount) }],
      index: 214
    }).catch()
  }


  const createWallet = async () => {
    // Add your custom action code here!
    setLoading(true)
    console.log(auth)
    const op = await funWallet.create(auth, await auth.getUserId())
    const receipt = await funWallet.executeOperation(auth, op)
    setReceiptTxId(receipt.txId)
    setLoading(false)

    // FINAL STEP: Add your custom action logic here (swap, transfer, etc)
  }

  return (
    <div className="App">
      <h1>Create FunWallet with Metamask</h1>
      1. Connect Metamask.
      <ConnectorButton key={0} index={0} ></ConnectorButton>
      {
        active ?
          <div>
            Success! Metamask Connected!
          </div>
          : <></>
      }
      <br></br>
      <br></br>

      2. Initialize the FunWallet and Auth object.
      <button onClick={initializeSingleAuthFunAccount}>Initialize FunWallet</button>
      {account ?
        <div>
          Success! FunWallet Address: {account}
        </div>
        : <></>
      }
      <br></br>
      <br></br>

      3. Create FunWallet onchain.
      <button onClick={createWallet} >Create FunWallet</button>
      {loading ?
        <div>
          Loading...
        </div>
        : <></>
      }
      {receiptTxId ?
        <div>
          Success! View on <a href={`https://goerli.etherscan.io/address/${account}`} target="_blank"> block explorer. </a>
        </div>
        : <></>
      }
      <br></br>
      <br></br>
    </div>
  );
}