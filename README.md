

Blockchain Planting project using vite + express.js  
and solidity to write smart contract  

step to run 

open garnache with 1337 as network id 
and connect ganache in metamask using rpc id  http://127.0.0.1:7545 and network id  1337

and you may change the path of env file in contractController and deploy.js 
go to env and change private key in env using private key in some address in garnache


cd backend -->

npx hardhat compile

cd scripts-->

node deploy.js

after deploy you get the contract address and use this contract address in contractController 

so everything is set

and open vs code and run these command

cd frontend
npm run dev


cd backend
node server


cd admin
npm run dev
