import "./App.css";

import { FirmaSDK, FirmaConfig } from "@firmachain/firma-js"
import { FirmaWebLedgerWallet } from "@firmachain/firma-js-ledger";
import { FirmaBridgeLedgerWallet } from "@firmachain/firma-js-ledger";

import TransportHID from "@ledgerhq/hw-transport-webhid";

declare global {
  interface Window {
    require: NodeRequire;
    electron: any;
  }
}

function App() {

  // Incase of IPC
  let bridgeLedgerWallet = new FirmaBridgeLedgerWallet();

  bridgeLedgerWallet.registerShowAddressOnDevice(async (): Promise<void> => {
    window.electron.sendSync("ledger-showAddressOnDevice", {});
  });

  bridgeLedgerWallet.registerGetAddressAndPublicKeyCallback(async (): Promise<{ address: string, publicKey: Uint8Array }> => {
    return window.electron.sendSync("ledger-getAddressAndPublicKey", {});
  });

  bridgeLedgerWallet.registerGetAddressCallback(async (): Promise<string> => {
    return window.electron.sendSync("ledger-getAddress", {});
  });

  bridgeLedgerWallet.registerGetPublicKeyCallback(async (): Promise<Uint8Array> => {
    return window.electron.sendSync("ledger-getPublicKey", {});
  });

  bridgeLedgerWallet.registerGetSignCallback(async (message: string): Promise<Uint8Array> => {
    return window.electron.sendSync("ledger-sign", { message: message });
  });

  const sendIPC_ShowAddressOnDevice = async () => {
    await bridgeLedgerWallet.showAddressOnDevice();
  };

  const sendIPC_GetAddress = async () => {
    let address = await bridgeLedgerWallet.getAddress();
    console.log(address);
  };

  const sendIPC_Send = async () => {

    const firma = new FirmaSDK(FirmaConfig.TestNetConfig);
    const wallet = await firma.Wallet.initFromLedger(bridgeLedgerWallet);

    const amount = 1;

    try {
      var result1 = await firma.Bank.send(wallet, "firma1epg9kx7nqz32dykj23p6jreqfh5x0wdy5a43qc", amount);
    console.log(result1);
    } catch (error) {
      console.log("error!!!!");
    }
  };

  let webLedgerWallet = new FirmaWebLedgerWallet(TransportHID);

  const send_ShowAddressOnDevice = async () => {
    await webLedgerWallet.showAddressOnDevice();
  };

  const send_GetAddress = async () => {
    let address = await webLedgerWallet.getAddress();
    console.log(address);
  };

  const send_Send = async () => {

    try {
      const firma = new FirmaSDK(FirmaConfig.TestNetConfig);
    const wallet = await firma.Wallet.initFromLedger(webLedgerWallet);

    const amount = 1;

    var result1 = await firma.Bank.send(wallet, "firma1epg9kx7nqz32dykj23p6jreqfh5x0wdy5a43qc", amount);
    console.log(result1);
      
    } catch (error) {
      console.log("error!!!!");
    }
  };

  return (
    <div>
      <div style={{ width: "100vw" }}>
        <button onClick={sendIPC_GetAddress}>SEND IPC-GetAddress</button>
        <button onClick={sendIPC_ShowAddressOnDevice}>SEND IPC-ShowAddressOnDevice</button>
        <button onClick={sendIPC_Send}>SEND IPC-Send</button>

        <br></br>
        <br></br>
        <br></br>
        <button onClick={send_GetAddress}>SEND REACT-GetAddress</button>
        <button onClick={send_ShowAddressOnDevice}>SEND REACT-ShowAddressOnDevice</button>
        <button onClick={send_Send}>SEND REACT-Send</button>
      </div>
    </div>
  );
}

export default App;
