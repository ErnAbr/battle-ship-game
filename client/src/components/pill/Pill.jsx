import classNames from "classnames";
import styles from "./pill.module.scss";

export const Pill = ({ text, size = "big" }) => {
  return <div className={classNames(styles.pill, styles[size])}>{text}</div>;
};
