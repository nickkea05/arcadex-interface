# ArcadeX
Decentralized options protocol for Solana memecoins.

## Overview
ArcadeX enables binary and capped options trading on volatile Solana assets through automated market making vaults. Users can trade options with defined risk/reward while liquidity providers earn yield from premiums.

## How It Works

### For Traders

- Buy call/put options on major memecoins (WIF, BONK, POPCAT, etc.)
- Binary options with capped payouts (10x-100x potential)
- No order books - instant execution via AMM
- Positions represented as SPL tokens

### For Liquidity Providers

- Deposit assets into automated vaults
- Earn premiums from option sales (15-30% APY target)
- Automated covered call/put strategies
- No active management required

## Architecture
```
Frontend (React + Vite)
    ↓
Backend API (Node.js)
    ├── Pricing Engine (Black-Scholes)
    ├── Redis Cache
    └── PostgreSQL
    ↓
Solana Program (Anchor)
    ├── Option Token Minting
    ├── Vault Management
    └── Settlement via Pyth Oracle
```

## Key Features

- **Non-custodial**: Full control of your assets - never deposit, trade directly from your wallet
- **Decentralized**: Permissionless trading on-chain with no intermediaries
- **Transparent**: All transactions and settlements verifiable on Solana blockchain
- **Automated Settlement**: Oracle-based expiration with smart contract execution
- **Capital Efficient**: Binary options reduce collateral requirements
- **Always Liquid**: AMM model ensures availability 24/7
- **Web3 Native**: Built for DeFi with composable SPL tokens

## Contracts
```
Program ID: [TO BE DEPLOYED]
Network: Solana Mainnet
```

## Development
```bash
# Install dependencies
yarn install

# Run frontend
cd client && yarn dev

# Build Solana program
anchor build

# Run tests
anchor test
```

## Security
Smart contracts pending audit. Use at your own risk during beta.

## Links

- Website (Coming Soon)
- Docs (Coming Soon)
- Twitter (Coming Soon)

---

Built on Solana | Powered by memecoins | Not financial advice
