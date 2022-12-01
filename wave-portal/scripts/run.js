
const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveCOntractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveCOntractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
    });
    await waveContract.deployed();
    console.log("Contract deployed to :", waveContract.address);
    console.log("Contract deployed by : ", owner.address);

    //   Get contract Balance
    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.address
    )

    console.log("Contract balance", hre.ethers.utils.formatEther(contractBalance))


    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(waveCount.toNumber());

    /**
      * Let's send a few waves!
      */
    let waveTxn = await waveContract.wave("A message !  from Run");
    await waveTxn.wait();

    // Get contract balance to see what happened
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log(
        "Contract balance after First wave:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    /**
      * Choose a random account and wave again!
      */

    waveTxn = await waveContract.connect(randomPerson).wave("Another Message");
    await waveTxn.wait();

    // Get contract balance to see what happened
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log(
        "Contract balance after Second wave:",
        hre.ethers.utils.formatEther(contractBalance)
    );


    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);

};

const runMain = async () => {


    try {
        await main();
        process.exit(0) // exit node process without error    }
    } catch (error) {
        console.log(error)
        process.exit(1);// Exit node process while indicating "Uncaught excepition "error 
    }

}

runMain();