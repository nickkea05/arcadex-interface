# Phantom Wallet Integration

A comprehensive React wallet integration module for connecting to Phantom browser extension wallets in our crypto crowdfunding platform. This module provides a clean, reusable interface for wallet connection, transaction signing, and blockchain interactions.

## 📁 File Structure

```
src/wallet/
├── README.md                 # This documentation
├── index.ts                  # Public exports
├── providers/
│   └── WalletProvider.tsx    # Phantom provider wrapper
├── hooks/
│   └── useWallet.ts          # Custom wallet hook
└── components/
    └── ConnectButton.tsx     # Wallet connection UI component
```

## 🚀 Features

### Current Functionality
- **Wallet Connection**: Connect to user's existing Phantom browser extension
- **Address Management**: Get and format wallet addresses
- **Connection State**: Track connection status and loading states
- **Error Handling**: Graceful handling of connection failures
- **UI Component**: Ready-to-use connect/disconnect button
- **Authentication**: Signature-based session management

### Future Functionality
- **Live Balance Fetching**: Real-time SOL balance display (requires RPC provider setup)
- **Transaction Signing**: Sign smart contract transactions
- **Campaign Funding**: Process crypto investments
- **Multi-chain Support**: Ethereum and other blockchain support
- **Transaction History**: Track user's investment history
- **Gas Estimation**: Calculate transaction fees

## 💰 Balance Display Implementation

**Current Status**: Balance display shows "Balance Coming Soon" placeholder.

**To Implement Live Balance Fetching**:
1. **Choose RPC Provider**: Set up account with Alchemy, QuickNode, or Helius
2. **Add Balance Hook**: Implement `useSolBalance` hook with RPC calls
3. **Update Dashboard**: Replace placeholder with real balance data
4. **Error Handling**: Handle RPC rate limits and failures gracefully

**Recommended RPC Providers**:
- **Alchemy**: `https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY`
- **QuickNode**: `https://YOUR_ENDPOINT.solana-mainnet.quiknode.pro/YOUR_TOKEN/`
- **Helius**: `https://rpc.helius.xyz/?api-key=YOUR_API_KEY`

## 🔧 How It Works

### 1. Provider Setup
The `WalletProvider` wraps the entire application and configures Phantom SDK:

```tsx
<PhantomProvider
  config={{
    providerType: "injected",        // Uses browser extension
    addressTypes: [AddressType.solana], // Solana addresses only
  }}
  children={children}
/>
```

### 2. Wallet Connection Flow
1. User clicks "Connect Wallet" button
2. Phantom extension prompts for connection approval
3. On approval, wallet address is extracted and stored
4. UI updates to show connected state with formatted address
5. User can disconnect at any time

### 3. State Management
- **Connection State**: Tracks if wallet is connected
- **Address State**: Stores current wallet address
- **Loading State**: Shows connection progress
- **Error State**: Handles and displays connection errors

## 📖 Usage

### Basic Implementation

```tsx
// App.tsx
import { WalletProvider, ConnectButton } from './wallet';

function App() {
  return (
    <WalletProvider>
      <div>
        <h1>Crypto Crowdfunding Platform</h1>
        <ConnectButton />
      </div>
    </WalletProvider>
  );
}
```

### Using the Hook Directly

```tsx
// Any component within WalletProvider
import { useWallet } from './wallet';

function MyComponent() {
  const { 
    connect, 
    disconnect, 
    connected, 
    address, 
    formattedAddress, 
    isLoading 
  } = useWallet();

  return (
    <div>
      {connected ? (
        <div>
          <p>Connected: {formattedAddress}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connect} disabled={isLoading}>
          {isLoading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );
}
```

## 🔮 Future Integration Plans

### 1. Campaign Investment Flow
```tsx
// Future: Campaign investment component
function InvestButton({ campaignId, amount }) {
  const { solana } = useSolana(); // Will be added
  const { connected } = useWallet();

  const handleInvest = async () => {
    if (!connected) {
      // Trigger wallet connection first
      return;
    }

    // Create investment transaction
    const transaction = await createInvestmentTransaction(campaignId, amount);
    
    // Sign and send transaction
    const result = await solana.signAndSendTransaction(transaction);
    
    // Update campaign progress
    updateCampaignProgress(campaignId, amount);
  };

  return (
    <button onClick={handleInvest} disabled={!connected}>
      Invest {amount} SOL
    </button>
  );
}
```

### 2. Smart Contract Interactions
```tsx
// Future: Smart contract integration
function CampaignContract({ campaignAddress }) {
  const { solana } = useSolana();
  const { connected, address } = useWallet();

  const fundCampaign = async (amount) => {
    // Create funding transaction to smart contract
    const instruction = createFundingInstruction(
      campaignAddress,
      address,
      amount
    );
    
    const transaction = new Transaction().add(instruction);
    
    // Sign and send transaction
    const result = await solana.signAndSendTransaction(transaction);
    return result;
  };

  return (
    <div>
      <button onClick={() => fundCampaign(1000000)}>
        Fund Campaign (1 SOL)
      </button>
    </div>
  );
}
```

### 3. Transaction History
```tsx
// Future: Transaction history component
function TransactionHistory() {
  const { address } = useWallet();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (address) {
      // Fetch user's transaction history
      fetchUserTransactions(address).then(setTransactions);
    }
  }, [address]);

  return (
    <div>
      <h3>Investment History</h3>
      {transactions.map(tx => (
        <TransactionItem key={tx.signature} transaction={tx} />
      ))}
    </div>
  );
}
```

### 4. Multi-Chain Support
```tsx
// Future: Multi-chain wallet support
function MultiChainWallet() {
  const { solana } = useSolana();
  const { ethereum } = useEthereum(); // Will be added
  const { connected } = useWallet();

  const switchChain = (chain) => {
    if (chain === 'solana') {
      // Switch to Solana operations
    } else if (chain === 'ethereum') {
      // Switch to Ethereum operations
    }
  };

  return (
    <div>
      <button onClick={() => switchChain('solana')}>Solana</button>
      <button onClick={() => switchChain('ethereum')}>Ethereum</button>
    </div>
  );
}
```

## 🛠 Technical Details

### Dependencies
- `@phantom/react-sdk@1.0.0-beta.11` - Phantom React SDK (beta version)
- `@phantom/browser-sdk` - Browser SDK for AddressType enum
- `@solana/web3.js` - Solana blockchain interactions

### TypeScript Support
Full TypeScript support with proper type definitions:
- `UseWalletReturn` interface for hook return type
- `ConnectButtonProps` interface for component props
- Proper error handling with typed error messages

### Error Handling
- **Wallet Not Installed**: Shows installation prompt
- **User Rejection**: Handles connection rejection gracefully
- **Connection Failures**: Displays user-friendly error messages
- **Network Issues**: Handles blockchain connectivity problems

## 🔄 Integration with Platform Features

### Campaign Creation
- Financial advisors can connect wallets to create campaigns
- Wallet verification for advisor credentials
- Campaign funding goal validation

### Investment Processing
- Investors connect wallets to fund campaigns
- Real-time transaction confirmation
- Automatic campaign progress updates
- Refund processing for failed campaigns

### Compliance & Security
- KYC integration with wallet addresses
- Transaction monitoring for compliance
- Secure fund escrow through smart contracts
- Multi-signature requirements for large investments

## 📝 Development Notes

### Adding New Features
1. **New Hooks**: Add to `hooks/` directory
2. **New Components**: Add to `components/` directory
3. **Provider Updates**: Modify `WalletProvider.tsx` for new configurations
4. **Exports**: Update `index.ts` to export new functionality

### Testing
- Test wallet connection with Phantom extension
- Verify error handling for various failure scenarios
- Test UI states (loading, connected, disconnected)
- Validate address formatting and display

### Performance Considerations
- Lazy load wallet functionality
- Cache connection state
- Optimize re-renders with proper memoization
- Handle wallet disconnection gracefully

## 🚨 Important Notes

- **Beta Version**: Currently using beta version of Phantom SDK
- **Browser Extension Required**: Users must have Phantom extension installed
- **HTTPS Required**: Wallet connection only works over HTTPS or localhost
- **Solana Only**: Currently supports Solana blockchain only (Ethereum support planned)

## 🔗 Related Documentation

- [Phantom React SDK Documentation](https://docs.phantom.com/sdks/react-sdk)
- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
- [Phantom Wallet Extension](https://phantom.app/)

---

*This wallet integration is designed to be the foundation for all blockchain interactions in our crypto crowdfunding platform. As we add more features, this module will be extended to support additional functionality while maintaining a clean, consistent API.*
