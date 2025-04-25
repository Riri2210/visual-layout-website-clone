import React from 'react';

export const HMILogoCircle: React.FC = () => {
  return (
    <div className="w-32 h-32">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="95" fill="white" stroke="#00b050" strokeWidth="6" />
        <g transform="translate(50, 50) scale(0.5)">
          <rect x="10" y="10" width="40" height="140" fill="#00b0f0" stroke="#ffff00" strokeWidth="5" />
          <rect x="50" y="10" width="40" height="140" fill="#ff0000" stroke="#ffff00" strokeWidth="5" />
          <rect x="90" y="10" width="40" height="140" fill="#92d050" stroke="#ffff00" strokeWidth="5" />
          <rect x="130" y="10" width="40" height="140" fill="#ff0000" stroke="#ffff00" strokeWidth="5" />
          <rect x="170" y="10" width="40" height="140" fill="#00b0f0" stroke="#ffff00" strokeWidth="5" />
          
          {/* Connecting parts for the 'H' shape */}
          <rect x="50" y="70" width="40" height="20" fill="#92d050" stroke="#ffff00" strokeWidth="5" />
          <rect x="130" y="70" width="40" height="20" fill="#92d050" stroke="#ffff00" strokeWidth="5" />
        </g>
        
        {/* Handshake */}
        <g transform="translate(55, 130) scale(0.25)">
          <path d="M72 112C72 103.2 79.2 96 88 96H136V80H88C70.4 80 56 94.4 56 112C56 129.6 70.4 144 88 144H136V128H88C79.2 128 72 120.8 72 112Z" fill="#00b050"/>
          <path d="M184 96H136V112H184C192.8 112 200 119.2 200 128C200 136.8 192.8 144 184 144H136V160H184C201.6 160 216 145.6 216 128C216 110.4 201.6 96 184 96Z" fill="#00b050"/>
          <path d="M184 112C175.2 112 168 119.2 168 128C168 136.8 175.2 144 184 144C192.8 144 200 136.8 200 128C200 119.2 192.8 112 184 112Z" fill="#00b050"/>
          <path d="M88 144C96.8 144 104 136.8 104 128C104 119.2 96.8 112 88 112C79.2 112 72 119.2 72 128C72 136.8 79.2 144 88 144Z" fill="#00b050"/>
        </g>
      </svg>
    </div>
  );
};

export const HMILogoSquare: React.FC = () => {
  return (
    <div className="w-10 h-10">
      <svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="220" height="220" fill="#ffff00" />
        <rect x="20" y="20" width="30" height="180" fill="#00b0f0" />
        <rect x="50" y="20" width="40" height="180" fill="#ff0000" />
        <rect x="90" y="20" width="40" height="180" fill="#92d050" />
        <rect x="130" y="20" width="40" height="180" fill="#ff0000" />
        <rect x="170" y="20" width="30" height="180" fill="#00b0f0" />
        
        {/* Upper connecting part for the 'H' shape */}
        <rect x="90" y="60" width="40" height="30" fill="#00b0f0" />
        
        {/* Middle connecting part for the 'H' shape */}
        <rect x="90" y="95" width="40" height="30" fill="#92d050" />
        
        {/* Lower connecting part for the 'H' shape */}
        <rect x="90" y="130" width="40" height="30" fill="#00b0f0" />
      </svg>
    </div>
  );
};

export const HMIFavicon: React.FC = () => {
  return (
    <svg width="32" height="32" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="220" height="220" fill="#ffff00" />
      <rect x="20" y="20" width="30" height="180" fill="#00b0f0" />
      <rect x="50" y="20" width="40" height="180" fill="#ff0000" />
      <rect x="90" y="20" width="40" height="180" fill="#92d050" />
      <rect x="130" y="20" width="40" height="180" fill="#ff0000" />
      <rect x="170" y="20" width="30" height="180" fill="#00b0f0" />
      
      {/* Upper connecting part for the 'H' shape */}
      <rect x="90" y="60" width="40" height="30" fill="#00b0f0" />
      
      {/* Middle connecting part for the 'H' shape */}
      <rect x="90" y="95" width="40" height="30" fill="#92d050" />
      
      {/* Lower connecting part for the 'H' shape */}
      <rect x="90" y="130" width="40" height="30" fill="#00b0f0" />
    </svg>
  );
};

const HMILogo: React.FC<{ type?: 'circle' | 'square' }> = ({ type = 'circle' }) => {
  return type === 'circle' ? <HMILogoCircle /> : <HMILogoSquare />;
};

export default HMILogo;
