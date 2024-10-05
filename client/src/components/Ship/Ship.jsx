import styles from "./ship.module.scss";
import { useState } from "react";

export const Ship = ({ size, id }) => {
  const [isHorizontal, setIsHorizontal] = useState(true);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("ship-size", size);
    e.dataTransfer.setData("ship-id", id);
    e.dataTransfer.setData("is-horizontal", isHorizontal);
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setIsHorizontal((prev) => !prev);
  };

  return (
    <div
      className={`${styles.ship} ${
        isHorizontal ? styles.horizontal : styles.vertical
      }`}
      draggable
      onDragStart={handleDragStart}
      onContextMenu={handleContextMenu}
    >
      {Array.from({ length: size }, (_, index) => (
        <div key={index} className={styles.shipPart}></div>
      ))}
    </div>
  );
};
