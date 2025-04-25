import React, { useEffect } from 'react';
import { HMIFavicon } from './HMILogo';
import ReactDOMServer from 'react-dom/server';

const Favicon: React.FC = () => {
  useEffect(() => {
    // Convert the SVG to a string
    const svgString = ReactDOMServer.renderToString(<HMIFavicon />);
    
    // Convert the SVG string to a data URL
    const dataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
    
    // Create or update the favicon link element
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    
    // Update the href attribute to use the data URL
    link.href = dataUrl;
  }, []);
  
  return null;
};

export default Favicon;
