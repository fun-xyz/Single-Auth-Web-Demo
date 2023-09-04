import {
  convertToValidUserId,
  useConnector,
  useCreateFun,
  configureNewFunStore,
  MetamaskConnector,
  Goerli,
  usePrimaryAuth,
} from "@funkit/react";
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
    if (!connectorAccount) {
      alert("Metamask not connected. Please follow the steps.")
      return
    }
    initializeFunAccount({
      users: [{ userId: convertToValidUserId(connectorAccount) }],
      index: parseInt(Math.random()*10000000) //random number
    }).catch()
  }


  const createWallet = async () => {
    if (!funWallet) {
      alert("FunWallet not initialized. Please follow the steps.")
      return
    }
    
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
      1.&ensp;
      <ConnectorButton key={0} index={0} ></ConnectorButton>
      {
        active ?
          <div>
            Success! Metamask connected!
          </div>
          : <></>
      }
      <br></br>
      <br></br>

      2.&ensp;
      <button onClick={initializeSingleAuthFunAccount}>Initialize FunWallet</button>
      {account ?
        <div>
          Success! FunWallet address: {account}
        </div>
        : <></>
      }
      <br></br>
      <br></br>

      3.&ensp;
      <button onClick={createWallet} >Create FunWallet</button>
      {loading ?
        <div>
          Loading...
        </div>
        : <></>
      }
      {receiptTxId ?
        <div>
          <a href={`https://goerli.etherscan.io/tx/${receiptTxId}`} target="_blank" rel="noreferrer">Transaction submitted!</a> View wallet on <a href={`https://goerli.etherscan.io/address/${account}`} target="_blank" rel="noreferrer"> block explorer. </a>
        </div>
        : <></>
      }
      <br></br>
      <br></br>
    </div>
  );
}