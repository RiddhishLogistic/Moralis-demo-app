import { MoralisProvider } from "react-moralis";
import "../styles/globals.css";
import { ConnectButton } from "web3uikit";

function MyApp({ Component, pageProps }) {
  return (
    <MoralisProvider
      appId="74mCRm5QeysxJ0IdJNg7KGHPLGASSkh8u2OW2mlE"
      serverUrl="https://gog9qkh2gfb1.usemoralis.com:2053/server"
    >
      <div className="header">
        <div className="logo"></div>
        <ConnectButton />
      </div>
      <Component {...pageProps} />
    </MoralisProvider>
  );
}

export default MyApp;
