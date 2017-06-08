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
