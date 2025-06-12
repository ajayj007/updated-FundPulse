import { ethers } from "ethers";

// Smart Contract ABI and Bytecode
const PROJECT_CONTRACT_ABI = [
  "constructor(string memory _projectName, uint256 _fundingGoal, uint256 _equityPercentage, uint256 _startDate, uint256 _endDate, string memory _sector, string memory _reason)",
  "function projectName() public view returns (string memory)",
  "function fundingGoal() public view returns (uint256)",
  "function equityPercentage() public view returns (uint256)",
  "function startDate() public view returns (uint256)",
  "function endDate() public view returns (uint256)",
  "function sector() public view returns (string memory)",
  "function reason() public view returns (string memory)",
  "function owner() public view returns (address)",
  "function totalFunded() public view returns (uint256)",
  "function isActive() public view returns (bool)",
  "function fund() public payable",
  "function withdraw() public",
  "function getFundingStatus() public view returns (uint256, uint256, bool)",
  "event FundingReceived(address indexed funder, uint256 amount)",
  "event ProjectFunded(uint256 totalAmount)",
  "event FundsWithdrawn(address indexed owner, uint256 amount)"
];

// You'll need to replace this with your actual compiled contract bytecode
const PROJECT_CONTRACT_BYTECODE = "0x6080604052348015600f57600080fd5b50610fe68061001f6000396000f3fe60806040526004361061004a5760003560e01c8063013cf08b1461004f5780630d61b5191461009157806322e2e12d146100ba5780632afcf480146100e3578063da35c664146100ff575b600080fd5b34801561005b57600080fd5b5061007660048036038101906100719190610692565b61012a565b604051610088969594939291906107ba565b60405180910390f35b34801561009d57600080fd5b506100b860048036038101906100b39190610692565b61021b565b005b3480156100c657600080fd5b506100e160048036038101906100dc9190610957565b61039b565b005b6100fd60048036038101906100f89190610692565b610486565b005b34801561010b57600080fd5b50610114610642565b60405161012191906109c6565b60405180910390f35b60016020528060005260406000206000915090508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169080600101805461017390610a10565b80601f016020809104026020016040519081016040528092919081815260200182805461019f90610a10565b80156101ec5780601f106101c1576101008083540402835291602001916101ec565b820191906000526020600020905b8154815290600101906020018083116101cf57829003601f168201915b5050505050908060020154908060030154908060040154908060050160009054906101000a900460ff16905086565b600060016000838152602001908152602001600020905080600301544210158061024d57508060020154816004015410155b61028c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161028390610a8d565b60405180910390fd5b8060050160009054906101000a900460ff16156102de576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102d590610af9565b60405180910390fd5b60018160050160006101000a81548160ff0219169083151502179055508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc82600401549081150290604051600060405180830381858888f19350505050158015610369573d6000803e3d6000fd5b50817fbcf6a68a2f901be4a23a41b53acd7697893a7e34def4e28acba584da75283b6760405160405180910390a25050565b6000808154809291906103ad90610b48565b9190505550600060016000805481526020019081526020016000209050338160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508381600101908161041e9190610d3c565b5082816002018190555081426104349190610e0e565b81600301819055506000547f6c98a8c940418b35614f0cd02412d5c9606faff474cbb6cdd6640ba5d1a9f06b33868685600301546040516104789493929190610e63565b60405180910390a250505050565b6000600160008381526020019081526020016000209050806003015442106104e3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104da90610efb565b60405180910390fd5b8060050160009054906101000a900460ff1615610535576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161052c90610af9565b60405180910390fd5b60003411610578576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161056f90610f67565b60405180910390fd5b3481600401600082825461058c9190610e0e565b92505081905550348160060160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282546105e49190610e0e565b92505081905550817f85e040b1b514c2f60555b8b931138cd55218c914496a8fcf822858bd240df422333460405161061d929190610f87565b60405180910390a2806002015481600401541061063e5761063d8261021b565b5b5050565b60005481565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b61066f8161065c565b811461067a57600080fd5b50565b60008135905061068c81610666565b92915050565b6000602082840312156106a8576106a7610652565b5b60006106b68482850161067d565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006106ea826106bf565b9050919050565b6106fa816106df565b82525050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561073a57808201518184015260208101905061071f565b60008484015250505050565b6000601f19601f8301169050919050565b600061076282610700565b61076c818561070b565b935061077c81856020860161071c565b61078581610746565b840191505092915050565b6107998161065c565b82525050565b60008115159050919050565b6107b48161079f565b82525050565b600060c0820190506107cf60008301896106f1565b81810360208301526107e18188610757565b90506107f06040830187610790565b6107fd6060830186610790565b61080a6080830185610790565b61081760a08301846107ab565b979650505050505050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61086482610746565b810181811067ffffffffffffffff821117156108835761088261082c565b5b80604052505050565b6000610896610648565b90506108a2828261085b565b919050565b600067ffffffffffffffff8211156108c2576108c161082c565b5b6108cb82610746565b9050602081019050919050565b82818337600083830152505050565b60006108fa6108f5846108a7565b61088c565b90508281526020810184848401111561091657610915610827565b5b6109218482856108d8565b509392505050565b600082601f83011261093e5761093d610822565b5b813561094e8482602086016108e7565b91505092915050565b6000806000606084860312156109705761096f610652565b5b600084013567ffffffffffffffff81111561098e5761098d610657565b5b61099a86828701610929565b93505060206109ab8682870161067d565b92505060406109bc8682870161067d565b9150509250925092565b60006020820190506109db6000830184610790565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610a2857607f821691505b602082108103610a3b57610a3a6109e1565b5b50919050565b7f43616e6e6f742065786563757465207965740000000000000000000000000000600082015250565b6000610a7760128361070b565b9150610a8282610a41565b602082019050919050565b60006020820190508181036000830152610aa681610a6a565b9050919050565b7f416c726561647920657865637574656400000000000000000000000000000000600082015250565b6000610ae360108361070b565b9150610aee82610aad565b602082019050919050565b60006020820190508181036000830152610b1281610ad6565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610b538261065c565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203610b8557610b84610b19565b5b600182019050919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302610bf27fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610bb5565b610bfc8683610bb5565b95508019841693508086168417925050509392505050565b6000819050919050565b6000610c39610c34610c2f8461065c565b610c14565b61065c565b9050919050565b6000819050919050565b610c5383610c1e565b610c67610c5f82610c40565b848454610bc2565b825550505050565b600090565b610c7c610c6f565b610c87818484610c4a565b505050565b5b81811015610cab57610ca0600082610c74565b600181019050610c8d565b5050565b601f821115610cf057610cc181610b90565b610cca84610ba5565b81016020851015610cd9578190505b610ced610ce585610ba5565b830182610c8c565b50505b505050565b600082821c905092915050565b6000610d1360001984600802610cf5565b1980831691505092915050565b6000610d2c8383610d02565b9150826002028217905092915050565b610d4582610700565b67ffffffffffffffff811115610d5e57610d5d61082c565b5b610d688254610a10565b610d73828285610caf565b600060209050601f831160018114610da65760008415610d94578287015190505b610d9e8582610d20565b865550610e06565b601f198416610db486610b90565b60005b82811015610ddc57848901518255600182019150602085019450602081019050610db7565b86831015610df95784890151610df5601f891682610d02565b8355505b6001600288020188555050505b505050505050565b6000610e198261065c565b9150610e248361065c565b9250828201905080821115610e3c57610e3b610b19565b5b92915050565b6000610e4d826106bf565b9050919050565b610e5d81610e42565b82525050565b6000608082019050610e786000830187610e54565b8181036020830152610e8a8186610757565b9050610e996040830185610790565b610ea66060830184610790565b95945050505050565b7f446561646c696e65207061737365640000000000000000000000000000000000600082015250565b6000610ee5600f8361070b565b9150610ef082610eaf565b602082019050919050565b60006020820190508181036000830152610f1481610ed8565b9050919050565b7f4d7573742073656e642045544800000000000000000000000000000000000000600082015250565b6000610f51600d8361070b565b9150610f5c82610f1b565b602082019050919050565b60006020820190508181036000830152610f8081610f44565b9050919050565b6000604082019050610f9c6000830185610e54565b610fa96020830184610790565b939250505056fea2646970667358221220bad739e42fb2ebb6ce848104b369ef98c17ada70e3e98ad6c7c3ba3b6b3f880964736f6c634300081c0033"

export const connectWallet = async () => {
  // Check if MetaMask is installed
  if (!window.ethereum) {
    console.error("MetaMask not detected");
    alert("Please install MetaMask to use this feature. Visit https://metamask.io/");
    return {
      address: "",
      provider: null,
      connected: false,
      error: "MetaMask not installed"
    };
  }

  // Check if it's actually MetaMask (not just any ethereum provider)
  if (!window.ethereum.isMetaMask) {
    console.warn("Ethereum provider detected but it's not MetaMask");
  }

  try {
    console.log("Attempting to connect to MetaMask...");
    
    // Request account access
    const accounts = await window.ethereum.request({ 
      method: "eth_requestAccounts" 
    });

    if (accounts.length === 0) {
      console.error("No accounts returned from MetaMask");
      return {
        address: "",
        provider: null,
        connected: false,
        error: "No accounts available"
      };
    }

    // Get the first account
    const address = accounts[0];
    console.log("Connected to address:", address);

    // Create a provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Get network info for debugging
    const network = await provider.getNetwork();
    console.log("Connected to network:", network.name, "Chain ID:", network.chainId);

    return {
      address,
      provider,
      connected: true,
      network: network
    };

  } catch (error) {
    console.error("Error connecting to MetaMask:", error);
    
    let errorMessage = "Failed to connect to MetaMask";
    
    if (error.code === 4001) {
      errorMessage = "User rejected the connection request";
    } else if (error.code === -32002) {
      errorMessage = "Connection request already pending";
    }

    return {
      address: "",
      provider: null,
      connected: false,
      error: errorMessage
    };
  }
};

export const isMetaMaskAvailable = () => {
  return typeof window !== "undefined" && 
         typeof window.ethereum !== "undefined" && 
         window.ethereum.isMetaMask;
};

export const checkConnection = async () => {
  if (!isMetaMaskAvailable()) {
    return { connected: false, error: "MetaMask not available" };
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: "eth_accounts" 
    });
    
    if (accounts.length > 0) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      return {
        connected: true,
        address: accounts[0],
        provider: provider
      };
    } else {
      return { connected: false, error: "No accounts connected" };
    }
  } catch (error) {
    console.error("Error checking connection:", error);
    return { connected: false, error: error.message };
  }
};


export const ensureCorrectNetwork = async (provider, targetChainId = 1) => {
  try {
    const currentNetwork = await provider.getNetwork();
    
    if (currentNetwork.chainId !== targetChainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        });
        return { success: true, switched: true };
      } catch (switchError) {
        console.error("Failed to switch network:", switchError);
        return { 
          success: false, 
          error: `Please switch to the correct network manually. Current: ${currentNetwork.name}, Required: Chain ID ${targetChainId}` 
        };
      }
    }
    
    return { success: true, switched: false };
  } catch (error) {
    console.error("Error checking network:", error);
    return { success: false, error: error.message };
  }
};



export const getWalletBalance = async (provider, address) => {
  if (!provider || !address) return "0";

  try {
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error("Error getting balance:", error);
    return "0";
  }
};

export const sendTransaction = async (provider, toAddress, amount) => {
  if (!provider || !toAddress || !amount) return { success: false, message: "Invalid parameters" };

  try {
    const signer = provider.getSigner();
    const tx = await signer.sendTransaction({
      to: toAddress,
      value: ethers.utils.parseEther(amount.toString()),
    });

    return {
      success: true,
      message: "Transaction sent",
      hash: tx.hash,
    };
  } catch (error) {
    console.error("Error sending transaction:", error);
    return {
      success: false,
      message: error.message || "Transaction failed",
    };
  }
};

export const deployProjectContract = async (provider, projectData) => {
  if (!provider || !projectData) {
    return { success: false, error: "Invalid parameters" };
  }

  try {
    const signer = provider.getSigner();
    
    // Convert dates to timestamps
    const startTimestamp = Math.floor(new Date(projectData.startDate).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(projectData.endDate).getTime() / 1000);
    
    // Convert funding goal to wei
    const fundingGoalWei = ethers.utils.parseEther(projectData.fundingGoal.toString());
    
    // Create contract factory
    const contractFactory = new ethers.ContractFactory(
      PROJECT_CONTRACT_ABI,
      PROJECT_CONTRACT_BYTECODE,
      signer
    );
    
    // Deploy contract with constructor parameters
    const contract = await contractFactory.deploy(
      projectData.projectName,
      fundingGoalWei,
      Math.floor(projectData.equityPercentage * 100), // Convert to basis points
      startTimestamp,
      endTimestamp,
      projectData.sector,
      projectData.reason
    );

    // Wait for deployment
    await contract.deployed();

    return {
      success: true,
      contractAddress: contract.address,
      transactionHash: contract.deployTransaction.hash,
      contract: contract
    };

  } catch (error) {
    console.error("Error deploying contract:", error);
    return {
      success: false,
      error: error.message || "Contract deployment failed"
    };
  }
};

export const getProjectContract = async (provider, contractAddress) => {
  if (!provider || !contractAddress) return null;

  try {
    const contract = new ethers.Contract(contractAddress, PROJECT_CONTRACT_ABI, provider);
    return contract;
  } catch (error) {
    console.error("Error getting contract:", error);
    return null;
  }
};

export const fundProject = async (provider, contractAddress, amount) => {
  if (!provider || !contractAddress || !amount) {
    return { success: false, message: "Invalid parameters" };
  }

  try {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, PROJECT_CONTRACT_ABI, signer);
    
    const tx = await contract.fund({
      value: ethers.utils.parseEther(amount.toString())
    });

    await tx.wait();

    return {
      success: true,
      message: "Project funded successfully",
      hash: tx.hash
    };

  } catch (error) {
    console.error("Error funding project:", error);
    return {
      success: false,
      message: error.message || "Failed to fund project"
    };
  }
};

export const getProjectDetails = async (provider, contractAddress) => {
  if (!provider || !contractAddress) return null;

  try {
    const contract = new ethers.Contract(contractAddress, PROJECT_CONTRACT_ABI, provider);
    
    const [
      projectName,
      fundingGoal,
      equityPercentage,
      startDate,
      endDate,
      sector,
      reason,
      owner,
      totalFunded,
      isActive
    ] = await Promise.all([
      contract.projectName(),
      contract.fundingGoal(),
      contract.equityPercentage(),
      contract.startDate(),
      contract.endDate(),
      contract.sector(),
      contract.reason(),
      contract.owner(),
      contract.totalFunded(),
      contract.isActive()
    ]);

    return {
      projectName,
      fundingGoal: ethers.utils.formatEther(fundingGoal),
      equityPercentage: equityPercentage.toNumber() / 100,
      startDate: new Date(startDate.toNumber() * 1000),
      endDate: new Date(endDate.toNumber() * 1000),
      sector,
      reason,
      owner,
      totalFunded: ethers.utils.formatEther(totalFunded),
      isActive,
      contractAddress
    };

  } catch (error) {
    console.error("Error getting project details:", error);
    return null;
  }
};

export const withdrawFunds = async (provider, contractAddress) => {
  if (!provider || !contractAddress) {
    return { success: false, message: "Invalid parameters" };
  }

  try {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, PROJECT_CONTRACT_ABI, signer);
    
    const tx = await contract.withdraw();
    await tx.wait();

    return {
      success: true,
      message: "Funds withdrawn successfully",
      hash: tx.hash
    };

  } catch (error) {
    console.error("Error withdrawing funds:", error);
    return {
      success: false,
      message: error.message || "Failed to withdraw funds"
    };
  }
};