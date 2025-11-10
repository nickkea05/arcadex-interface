import React from 'react';

export const Referral: React.FC = () => {
  return (
    <div style={{ 
      padding: '2rem',
      color: 'white',
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: '#0a0a0a'
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: '600',
        marginBottom: '1rem'
      }}>
        Referral Page
      </h1>
      <p style={{ 
        fontSize: '1rem',
        color: '#888',
        lineHeight: '1.6'
      }}>
        Refer friends and earn bonuses - Coming soon
      </p>
    </div>
  );
};
