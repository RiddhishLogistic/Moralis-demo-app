import styles from "../styles/Home.module.css";
import Coin from "./components/Coin";
import { useState, useEffect } from "react";
import { Modal } from "web3uikit";
import { useMoralisWeb3Api, useMoralis } from "react-moralis";
import { abouts } from "./about";

export default function Home() {
  const [btc, setBtc] = useState(0);
  const [eth, setEth] = useState(0);
  const [link, setLink] = useState(0);
  const [visible, setVisible] = useState(false);
  const [modelPrice, setModelPrice] = useState();
  const [modelToken, setModelToken] = useState();
  const { Moralis, isInitialized } = useMoralis();

  const Web3Api = useMoralisWeb3Api();

  async function getRatio(tick, setPerc) {
    const Votes = Moralis.Object.extend("Votes");
    const query = new Moralis.Query(Votes);
    query.equalTo("ticker", tick);
    query.descending("createdAt");
    const results = await query.first();
    let up = Number(results.attributes.up);
    let down = Number(results.attributes.down);
    let ratio = Math.round((up / (up + down)) * 100);
    setPerc(ratio);
  }

  useEffect(() => {

    if (isInitialized) {
      getRatio("BTC", setBtc);
      getRatio("ETH", setEth);
      getRatio("LINK", setLink);

      async function createLiveQuery() {
        let query = new Moralis.Query("Votes");
        let subscription = await query.subscribe();
        subscription.on("update", (object) => {
          if (object.attributes.ticker === "LINK") {
            getRatio("LINK", setLink);
          } else if (object.attributes.ticker === "ETH") {
            getRatio("ETH", setEth);
          } else if (object.attributes.ticker === "BTC") {
            getRatio("BTC", setBtc);
          }
        });
      }

      createLiveQuery();

    }
  }, [isInitialized]);

  useEffect(() => {
    async function fetchtokenPrice() {
      const options = {
        address:
          abouts[abouts.findIndex((x) => x.token === modelToken)].address,
      };
      const price = await Web3Api.token.getTokenPrice(options);
      setModelPrice(price.usdPrice.toFixed(3));
    }
    if (modelToken) {
      fetchtokenPrice();
    }
  }, [modelToken]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.instructions}>
          What do you think these tokens are going? <br /> up or down?
        </div>
        <div className={styles.list}>
          <Coin
            perc={btc}
            setPerc={setBtc}
            token={"BTC"}
            setModelToken={setModelToken}
            setVisible={setVisible}
          />

          <Coin
            perc={eth}
            setPerc={setEth}
            token={"ETH"}
            setModelToken={setModelToken}
            setVisible={setVisible}
          />

          <Coin
            perc={link}
            setPerc={setLink}
            token={"LINK"}
            setModelToken={setModelToken}
            setVisible={setVisible}
          />
        </div>
      </div>
      <Modal
        isVisible={visible}
        onCloseButtonPressed={() => setVisible(false)}
        hasFooter={false}
        title={modelToken}
      >
        <div>
          <span style={{ color: "white" }}>{`Price: `}</span>
          {modelPrice}$
        </div>
        <div>
          <span style={{ color: "white" }}>{`About`}</span>
        </div>
        <div>
          {modelToken &&
            abouts[abouts.findIndex((x) => x.token === modelToken)].about}
        </div>
      </Modal>
    </>
  );
}