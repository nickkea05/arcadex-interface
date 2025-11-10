import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './wallet';
import { Home, Exchange, Cover, Portfolio, Rewards, Referral, Docs } from './pages';
import { NavBar } from './components/layout';
import { colors } from './theme';
import './styles/globals.css';

function App() {
  return (
    <WalletProvider>
      <Router>
        <div style={{
          height: '100vh',
          backgroundColor: colors.mainBackgroundColor,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <NavBar />
          
          <div style={{ 
            flex: 1, 
            minHeight: 0,
            overflow: 'hidden'
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/exchange" element={<Exchange />} />
              <Route path="/markets" element={<Exchange />} />
              <Route path="/vault" element={<Cover />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/rewards" element={<Rewards />} />
              <Route path="/referral" element={<Referral />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/settings" element={<div style={{ padding: 'clamp(1rem, 3vw, 2rem)', color: colors.mainTextColor, backgroundColor: colors.mainBackgroundColor, height: '100%' }}><h1>Settings Page</h1><p>Coming soon</p></div>} />
              <Route path="/support" element={<div style={{ padding: 'clamp(1rem, 3vw, 2rem)', color: colors.mainTextColor, backgroundColor: colors.mainBackgroundColor, height: '100%' }}><h1>Support Page</h1><p>Coming soon</p></div>} />
              <Route path="/about" element={<div style={{ padding: 'clamp(1rem, 3vw, 2rem)', color: colors.mainTextColor, backgroundColor: colors.mainBackgroundColor, height: '100%' }}><h1>About Page</h1><p>Coming soon</p></div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </WalletProvider>
  );
}

export default App;