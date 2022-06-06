import styles from "../../styles/Coin.module.css";
import { useState, useEffect } from "react";
import { Button } from "web3uikit";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { deployedContractAddress } from "../../config";

function Coin({ perc, setBtc, token, setVisible, setModelToken }) {
  const [color, setColor] = useState();

  const contractProcess = useWeb3ExecuteFunction();
  const { isAuthenticated } = useMoralis();

  useEffect(() => {
    if (perc < 50) {
      setColor("#c43d08");
    } else {
      setColor("#33cc66");
    }
  }, [perc]);

  async function vote(upDown) {
    let options = {
      contractAddress: deployedContractAddress,
      functionName: "vote",
      abi: [
        {
          inputs: [
            {
              internalType: "string",
              name: "_ticker",
              type: "string",
            },
            {
              internalType: "bool",
              name: "_vote",
              type: "bool",
            },
          ],
          name: "vote",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      params: {
        _ticker: token,
        _vote: upDown,
      },
    };

    await contractProcess.fetch({
      params: options,
      onSuccess: () => {
        console.log("vote successfully");
      },
      onError: (error) => {
        console.log("error response : ", error);
        alert(error);
      },
    });
  }

  return (
    <>
      <div>
        <div className={styles.token}>{token}</div>
        <div
          className={styles.circle}
          style={{ boxShadow: `0 0 20px ${color}` }}
        >
          <div
            className={styles.wave}
            style={{
              marginTop: `${100 - perc}%`,
              boxShadow: `0 0 20px ${color}`,
              backgroundColor: color,
            }}
          ></div>
          <div className={styles.percentage}>{perc}%</div>
        </div>

        <div className={styles.votes}>
          <Button
            color="green"
            onClick={() => {
              if (isAuthenticated) {
                vote(true);
              } else {
                alert("Authenticate to vote");
              }
            }}
            text="Up"
            theme="primary"
            type="button"
          />
          <Button
            color="red"
            onClick={() => {
              if (isAuthenticated) {
                vote(false);
              } else {
                alert("Authenticate to vote");
              }
            }}
            text="Down"
            theme="colored"
            type="button"
          />
        </div>

        <div className={styles.votes}>
          <Button
            onClick={() => {
              setModelToken(token);
              setVisible(true);
            }}
            text="Info"
            theme="translucent"
            type="button"
          />
        </div>
      </div>
    </>
  );
}

export default Coin;
