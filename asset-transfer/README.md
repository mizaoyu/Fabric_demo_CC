This sub-project provides the backend of the demo. Detailed explanation of each files are as follows.

### Folder Structure 

* **package.json**: some environment and dependencies information for this sub-project.
* **runApp.sh**: entry point. restart the network, install node modules and start the backend app through shell script.
* **testAPIs.sh**: this shell script file can be used to test the backend APIs using curl to start HTTP requests without frontend interface.
* **config.json**: provide some global and presetted variables. If you want change the network port, default chaincodeId, default channelName, chaincode base location, default chaincodePath, orgnization list, and etc, modify this file. Used by `app.js`.
* **app.js**: Entry point file for the nodeJS backend network. It includes all the API functions that the frontend can call. If you want to add any backend APIs, add in this file. For further detailed functions, it calls functions defined in files under `app/` folder. Currently both data modified in the blockchain or data stored in the backend is not persistent. If you restart the network, it will start from fresh.

* **node_modules/**: contain the node modules needed by this sub-project. Generated after running the `npm install` in `runApp.sh`. Notice that the fabric-sdk-node is leveraged here through `fabric-client` and `fabric-ca-client` modules in this folder. Provided here since I fixed some bugs in the `fabric-client` node module. If you `npm install` the node modules by yourself, please modify the following files. 
  * Open `/node_modules/fabric-client/lib/Chain.js`, find function `sendInstallProposal`. Change the first few lines to
      
        logger.debug('Chain.sendInstallProposal begin');
        var errorMsg = null;
        var peers = null;
        if (request) {
          peers = request.targets;
          if (peers && peers.length > 0) {
            for (let p = 0; p < peers.length; p++) {
              if (!this.isValidPeer(peers[p])) {
                errorMsg = 'Request targets peer object '+ peers[p] +' not in chain';
                logger.error('Chain.sendInstallProposal error '+ errorMsg);
                return Promise.reject(new Error(errorMsg));
              }
            }
          }
        }
   by deleting the `let` before the `peer`. Otherwise, the `peer` variable will not be updated.
  * Also in `/node_modules/fabric-client/lib/Chain.js`, find function `sendInstantiateProposal` and make the same modification.
* **chaincode/src/github.com/**: contain the chaincode file. The chaincode file defines functions that the transactions can invoke.
* **artifacts/**: 
  * **docker-compose.yaml**: file used to configure and run applications made up of multiple containers in docker. It defines ca-server, order and peers' address, and some other setting parameters to start mutiple containers to mock different nodes in the Internet. 
  * **channel/**: contains an orderer genesis block (twoorgs.orderer.block) and channel configuration transaction (mychannel.tx) which has been pre generated using the configtxgen tool, which consumes the file `configtx.yaml`. More details regarding the configtxgen tool are available [here](http://hyperledger-fabric.readthedocs.io/en/latest/getting_started.html#using-the-configtxgen-tool). If you want to generate another channel configuration transaction, you should change the default channel name in this project(in both config.json and frontend code) to the name you used in the command line to generate the channel configuration file. In this demo, the channle name of this configuration is `mychannel`, so if you want to change, replace all where `mychannel` is used.
  * **crypto-config/**: contains crypto materials generated using the cryptogen tool from fabric and mounted to all peers, the orderering node and CA org containers. More details regarding the cryptogen tool are available [here](http://hyperledger-fabric.readthedocs.io/en/latest/getting_started.html#using-the-cryptogen-tool).
  * **tls/**: contains certificates of all peers, the orderering node and CA containers to verify the TLS handshake. 
* **app/**: contain JS files for specific functions to interact with the Node SDK APIs and a network config JSON file to config the involvers and their addresses. `helper.js` includes some common functions used by other JS funtions. Other js files are self-explanatory by their name, each support for one specific function.




