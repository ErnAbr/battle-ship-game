import styles from "./gameBoard.module.scss";

export const GameBoard = () => {
  const gridCells = [...Array(100)].map((_, index) => {
    const row = String.fromCharCode(65 + Math.floor(index / 10));
    const col = (index % 10) + 1;
    const coordinate = `${row}${col}`;

    return (
      <div
        key={coordinate}
        className={styles.gridCell}
        onClick={() => console.log(coordinate)}
      ></div>
    );
  });

  return <div className={styles.gridContainer}>{gridCells}</div>;
};
