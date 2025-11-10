import React from 'react';
import { colors } from '../../theme';

export const Docs: React.FC = () => {
  return (
    <div style={{ 
      padding: '2rem',
      color: 'white',
      minHeight: 'calc(100vh - 64px)',
      backgroundColor: colors.mainBackgroundColor
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: '600',
        marginBottom: '1rem'
      }}>
        Documentation
      </h1>
      <p style={{ 
        fontSize: '1rem',
        color: '#888',
        lineHeight: '1.6'
      }}>
        Learn how to use the platform - Coming soon
      </p>
    </div>
  );
};
