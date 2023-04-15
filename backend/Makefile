# include .env file and export its env vars
# (-include to ignore error if it does not exist)
-include .env

all: clean remove install update solc build 

# Install proper solc version.
solc:; nix-env -f https://github.com/dapphub/dapptools/archive/master.tar.gz -iA solc-static-versions.solc_0_8_19

# Clean the repo
clean  :; forge clean

# Remove modules
remove :; rm -rf ../.gitmodules && rm -rf ../.git/modules/* && rm -rf lib && touch ../.gitmodules && git add . && git commit -m "modules"

# Install the Modules
install :; 
	forge install OpenZeppelin/openzeppelin-contracts

# Update Dependencies
update:; forge update

# Builds
build  :; forge clean && forge build --optimize --optimize-runs 1000000

setup-yarn:
	yarn 

local-node: setup-yarn 
	yarn hardhat node 

# polygon gas estimation isn't accurate, so we need to set a high gas limit
deploy-mumbai:
	forge script script/Deploy.s.sol --rpc-url ${RPC_URL} --broadcast --gas-limit 12345678

deploy-scroll:
	forge script script/Deploy.s.sol --rpc-url ${RPC_URL} --broadcast --legacy

deploy-zk-polygon:
	forge script script/Deploy.s.sol --rpc-url ${RPC_URL} --broadcast

deploy-taiko:
	forge script script/Deploy.s.sol --rpc-url ${RPC_URL} --broadcast

deploy-celo:
	forge script script/Deploy.s.sol --rpc-url ${RPC_URL} --broadcast