import styles from "./pill.module.scss";

export const Pill = ({ text }) => {
  return <div className={styles.pill}>{text}</div>;
};
