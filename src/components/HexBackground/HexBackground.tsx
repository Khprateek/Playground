// src/components/HexBackground/HexBackground.tsx
import { useEffect, useState } from 'react';
import './HexBackground.scss';

const HexBackground: React.FC = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const createHexagons = () => {
    const hexSize = 88;
    const hexHeight = Math.sqrt(3) / 2 * hexSize;
    const numRows = Math.ceil(dimensions.height / hexHeight );
    const numCols = Math.ceil(dimensions.width / hexSize);
    
    const hexagons = [];
    
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const offsetX = (row % 2 === 0) ? 0 : hexSize * 0.50;
        hexagons.push({
          x: col * hexSize + offsetX,
          y: row * hexHeight,
          key: `hex-${row}-${col}`
        });
      }
    }
    
    return hexagons;
  };

  return (
    <div className="hexagons">
      {createHexagons().map(hexa => (
        <div
          key={hexa.key}
          className="hexa"
          style={{
            left: `${hexa.x}px`,
            top: `${hexa.y}px`
          }}
        />
      ))}
    </div>
  );
};

export default HexBackground;