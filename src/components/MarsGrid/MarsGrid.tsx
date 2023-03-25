import { useEffect, useState } from "react";
import "./MarsGrid.css";

const MarsGrid = ({ positionX, positionY }: { positionX: number; positionY: number }) => {
  
  const [gridPosition, setGridPosition] = useState({ left: '0', bottom: '0' });

  const calculatePosition = (
    positionX: number,
    positionY: number
  ): { left: string; bottom: string } => {
    const left = `${positionX * 2}%`;
    const bottom = `${positionY * 2}%`;

    return { left, bottom };
  };

  useEffect(() => {
    const { left, bottom } = calculatePosition(positionX, positionY);
    setGridPosition({ left, bottom });
  }, [positionX, positionY]);
  
  
  const styles = {
    bottom: gridPosition.bottom || 0,
    left: gridPosition.left || 0,
  };

  const items = Array.from({ length: 50 });

  return (
    <div className="grid">
      {items.map((_, row) => (
        <div key={row} data-row-position={row} className="row">
          {items.map((_, col) => (
            <div key={col} data-cell-position={col} className="grid-cell" />
          ))}
        </div>
      ))}
      <div className="robot" style={styles}></div>
    </div>
  );
};

export default MarsGrid;