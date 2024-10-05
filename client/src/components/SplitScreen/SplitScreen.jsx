import styles from "./splitScreen.module.scss";

export const SplitScreen = ({ children }) => {
  const [left, right] = children;
  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <h3>Your Board</h3>
        {left}
      </div>
      <div className={styles.panel}>
        <h3>Enemy Board</h3>
        {right}
      </div>
    </div>
  );
};
