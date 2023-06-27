This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
## Project Name: Black Pass Program

This is a projecte Black Pass program, which involves Soulbound Hedera NFTs with modifiable traits and the ability to claim RVV tokens. The contract allows users to create player profiles, claim loyalty passes, and interact with NFTs and collections.

### Features

1. **Loyalty Pass Claiming**: Users can visit the web page, connect their loyalty pass, and claim RVV tokens once they are available.

2. **Modifiable Traits and Dynamic NFTs**: The Soulbound Hedera NFTs have modifiable traits that change dynamically based on rewards and token balances. The NFT metadata reflects these changes.

3. **Tiered Rewards**: Different tiers are awarded to users based on specific conditions. More details about the tier system will be provided during the development process.

4. **Player Profiles**: User details such as names, email IDs, and optional social media handles are collected to create player profiles.

5. **NFT Staking** (Not a priority at the moment): Users can stake their NFTs along with the Black Pass to earn additional rewards or benefits.

6. **Hedera Marketplace Integration**: The NFTs created in the game are compatible with Hedera marketplaces, allowing users to trade and showcase their NFTs.

### Some of Smart Contract Functions

1. `tokenAssociate(address sender, address tokenAddress) external`: Associates a token with a specific address. [Documentation](https://docs.hedera.com/hedera/sdks-and-apis/deprecated/sdks/tokens/associate-tokens-to-an-account)

2. `setPlayer(string memory _name, address playerAddress) public onlyDefaultCaller override returns (Player memory)`: Sets player details and creates a new player object. 

3. `updatePlayer(uint256 _id, string memory _name, address playerAddress, bool status, bool claimed) public onlyDefaultCaller override returns(Player memory)`: Updates the details of an existing player. 

4. `allPlayers() public view override returns (Player[] memory)`: Returns an array of all player objects stored in the contract. 

5. `allCollections() public view override returns (Collection[] memory)`: Returns an array of all collection objects stored in the contract.

6. `setCollection(string memory _name, string memory _symbol, uint256 playerId, address collectionAddress) public onlyDefaultCaller override returns (Collection memory)`: Creates a new collection object and associates it with a player.

7. `whitelist_as_Default_Admin(address target) onlyOwner public`: Sets the default admin address.

8. `mint(uint256 collectionId, bytes[] memory metadata, string memory _tokenURI) public onlyDefaultCaller override returns(uint)`: Mints a new NFT in the specified collection. [Documentation](https://docs.hedera.com/hedera/docs/sdks/tokens/mint-a-token)

### Setup and Configuration

1. Ensure that you have the Hardhat framework installed.

2. Set up the development environment, including Hardhat for smart contract development and Hedera SDKs for necessary interactions.

### Contract Deployment

1. Deploy the smart contract using the deployment script provided.

### Contributing

Contributions to this project are welcome. If you encounter any issues or have suggestions
# NFT Marketplace Loyalty Program

Welcome to the Astra Nova Black Pass Program! This program aims to reward loyal users of our NFT marketplace by providing incentives and benefits based on their engagement and transactions. This document serves as a guide to understand the loyalty program's features, installation, and usage.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)


## Features

- Loyalty Points: Users can redeem their loyalty points for every NFT purchase made on the marketplace.
- Tiered Rewards: Different tiers with increasing benefits based on the user's loyalty points.
- Exclusive Access: Loyalty program members gain early access to limited edition NFT drops and special promotions.
- Discounted Fees: Lower transaction fees for loyalty program members.
- Special Badges: Users receive special badges displayed on their profiles based on their loyalty program status.

## Installation

To integrate the loyalty program into your NFT marketplace, follow these steps:

1. Clone the repository:

git clone git@github.com:Astra-Nova/Black-pass.git

2. Navigate to the black-pass directory:

npm install

3. Start the loyalty program service:

npm run dev


## Contribution

Contributions are welcome! To contribute to the Black Pass Program, follow these steps:

1. Fork the repository.

2. Create a new branch for your feature or bug fix.

3. Make the necessary changes and commit them.

4. Push the changes to your forked repository.

5. Submit a pull request to the main repository.

We appreciate your contributions to making our Black Pass program even better!

## License

This project is licensed under the MIT License.

## Contact

If you have any questions or feedback regarding the Astra Nova Black Pass Program, feel free to contact us:

Email: loyalty@nftmarketplace.com
Discord: NFT Marketplace Community
Twitter: @NFTMarketplace
We're excited to have you as part of our loyalty program and look forward to providing you with an enhanced NFT marketplace experience!
