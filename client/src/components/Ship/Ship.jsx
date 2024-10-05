import styles from "./ship.module.scss";

export const Ship = ({ size, id }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("ship-size", size);
    e.dataTransfer.setData("ship-id", id);
  };

  const shipCells = [...Array(size)].map((_, index) => (
    <div key={index} className={styles.shipCell}></div>
  ));

  return (
    <div className={styles.ship} draggable onDragStart={handleDragStart}>
      {shipCells}
    </div>
  );
};
