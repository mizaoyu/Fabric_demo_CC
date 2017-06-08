# Fabric_demo_CC

This project is a simple demo of [Hyperledger Fabric](https://github.com/hyperledger/fabric) with a simple Web interface for interaction, which is still under development.

This demo has the functions of enrolling users(who can perform the following actions), create channel, join peer(s) of his/her orgnization into the channel created, install chaincode, instantiate chaincode, invoke chaincode(move assets betweem two entitys), query chaincode(query entity's existing asset amount), query block and query transaction.

What it can perform is basically transfer asset between two entities. Some screen shots of the demo are as follows.

![Login Page](/docs/images/login_snap.jpg)

![Menu Page](/docs/images/menu_snap.jpg)

This project is composed by several parts. The core underlying framework is [Hyperledger Fabric](https://github.com/hyperledger/fabric), which is an implementation of blockchain technology. In order to make an interactive interface, [Hyperledger Fabric Client SDK for Node.js](https://github.com/hyperledger/fabric-sdk-node) is used. It provides the APIs to interact with a Hyperledger Fabric blockchain through NodeJS. Therefore, the backend of this project uses [NodeJS](https://nodejs.org/en/), and [React](https://facebook.github.io/react/) is used for frontend. The code to actually perform functions in blockchain is called chaincode, which can be written in GO/JAVA.

The process of making some calls from the user to the blockchain is as follows:
* The user opens the web page of this project using browser and click something to perform an action.
* The frontend send HTTP request to the backend.
* The backend calls specific APIs of the blockchain(fabric) through fabric-sdk-node.
* The underlying fabric handles the requests and may call specific functions of the chaincode provided to it.
* The chaincode may modified some state of the blockchain.

Folder `demoUI/my-app` is the frontend code base. Folder `asset-transfer/` is the backend code base, including script to pull fabric docker images and chaincodes. There is no fabric code base in this repository. It is leveraged through docker.

### Environment Setup ###

I am using a Linux VM. (Recommand Linux System, otherwise you might met lots of problems) So the following setups are all based on Linux. Not sure if it will work or not on Windows or MacOS.

* [Docker](https://www.docker.com/products/overview) - v1.12 or higher
* [Docker Compose](https://docs.docker.com/compose/overview/) - v1.8 or higher
* [Git client](https://git-scm.com/downloads) - needed for clone commands
* [Node.js](https://nodejs.org/en/) v6.2.0 - 6.10.0 ( Node v7+ is not supported ) (should include `npm`, otherwise install `npm` seperately)
* [Go](https://golang.org/doc/install) latest will be fine
* [cURL](https://curl.haxx.se/) Usually it's already installed on Linux System. Check if it exists using `curl --version` in your terminal.

### Place the project ###

* Choose a place and create a folder at any place you like. Before cloning this repository into the folder, it's *important* to setup the *GOPATH* first. See [HERE](https://github.com/golang/go/wiki/SettingGOPATH) about how to setup the GOPATH. For example, you create a `HyperLedger` folder where you want to put the project, you need to set this folder path as the GOPATH first. 
* `cd` into this folder, and clone the project under it. Make sure all fabric related projects are under this GOPATH.

### Setup the app ###

* Download docker images (this might take a rather long time, and if you see errors, stop it and re-run the command again)

      cd asset-transfer/
      docker-compose -f artifacts/docker-compose.yaml pull
* Once you have completed the above setup, you will be provisioned a local network with following configuration(defined in the `artifacts/docker-compose.yaml` file):

  * 2 CAs
  * A SOLO orderer
  * 4 peers (2 peers per Org)
* Then run the application:
      ./runApp.sh
  If you see something like the followings, it means the backend has been successfully running on `localhost:4000`. Don't close it.
  
      [INFO] SampleWebApp - ****************** SERVER STARTED ************************
      [INFO] SampleWebApp - **************  http://localhost:4000  ******************

### Start the frontend ###

* Open another terminal. `cd` into the `demoUI/my-app` folder. Run
    
      npm start
* Open the browser, go to `http:localhost:3000/login`. You should see the web page.

### Explanation ###

Detailed explanation about the files and some notes are provided in the `README` in each subfolder.

### Touble Shooting ###
* If you do `npm install` by yourself and see some errors. You can delete the `node_modules` folder first, and try `npm install --unsafe-perm`
* If you see some errors regarding the tools (such as node, npm etc), you might want to check if you have properly set up the system environment for that tool first.
* In case you are building the fabric docker image from their source code base, if you see errors `Illegal file mode detected for file xxx`, you can run `chmod -R 666 {filepath}` to change the mode of the file as some fabric source code have a check of that.

### Author ###
Author : Misky Shi






