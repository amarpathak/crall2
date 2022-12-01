import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WavePortal.json'
export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [waveMsg, setwaveMsg] = useState("");
  const [waves, setWaves] = useState([])
  const contractAddress = "0x8BD135141dD54BBbF403173dAE3A5543859772Af";
  const contractABI = abi.abi;
  const checkIfWalletIsConnected = async () => {
    try {
      /*
      * First make sure we have access to window.ethereum
      */
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }

  }
  /**
    * Implement your connectWallet method here
    */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }
  const wave = async (e) => {

    e && e.preventDefault();

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(waveMsg);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        let allWaves = await wavePortalContract.getAllWaves();
        console.log("Retrived all waves to you", allWaves);

        const filteredWaves = allWaves.map(wave => ({
          address: wave.waver,
          timestamp: new Date(wave.timestamp * 1000),
          message: wave.message
        }))

        setWaves(filteredWaves);


      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }
  const getAllWaves = () => {


  }
  /**
   * Listen in for emitter events!
   */
  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("New Wave", from, timestamp, message);
      setWaves(prevState => [...prevState, {
        address: from,
        timestamp: new Date(timestamp * 1000),
        message
      }])
    };
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)
      wavePortalContract.on("NewWave", onNewWave);

    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave)
      }
    }
  }, [])
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I am Amar Pathak and I'm a frontend and a blockchain engineer Connect your Ethereum wallet and wave at me! to get a surprise
        </div>
        <form className="waveForm" onSubmit={wave}>
          <input className="waveInput" value={waveMsg} onChange={(e) => { const { value } = e.target; setwaveMsg(value) }} />
          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
        </form>

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {waves.length > 0 && <div>You get to see who all waved because u waved :) also you get<b>0.01 ETH</b>  check your account :)</div>}
        {waves.map((wave, index) => (
          <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
            <div>Address: {wave.address}</div>
            <div>Time: {wave.timestamp.toString()}</div>
            <div>Message: {wave.message}</div>
          </div>
        ))}
      </div>

    </div>
  );
}
