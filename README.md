# 💎 TON Address Search

A live TON blockchain address search tool built with **React + Vite + Tailwind CSS**.

## Features
- 🔍 Search any TON address (EQ... or UQ...)
- 📍 Live balance, state, account type
- 🔄 Real transaction history
- 🪙 Jetton (token) balances
- 🖼️ NFTs owned
- 💰 Live TON/USD price
- 🌙 Dark mode

## Data Sources
- `toncenter.com/api/v2` — address info, transactions, blocks
- `tonapi.io/v2` — jettons, NFTs, price

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

## Build for Production
```bash
npm run build
npm run preview
```

## Project Structure
```
ton-search/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx          # Entry point
    ├── App.jsx           # Main app logic
    ├── index.css         # Global styles
    ├── api/
    │   └── ton.js        # All TON API calls
    └── components/
        ├── SearchBar.jsx       # Search input + button
        ├── AccountInfo.jsx     # Balance, state, details
        ├── TransactionList.jsx # Tx history table
        ├── JettonList.jsx      # Token balances
        ├── NFTList.jsx         # NFT gallery
        ├── CopyButton.jsx      # Copy to clipboard
        └── Skeleton.jsx        # Loading skeletons
```

## API Rate Limits
Free tier has limits. If data fails to load, wait 10 seconds and try again.
For unlimited access, get a free API key from [toncenter.com](https://toncenter.com).
