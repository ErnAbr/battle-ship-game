import React, { useState } from "react";
import styles from "./modal.module.scss";

export const Modal = ({ children, buttonName }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <button className={styles.modalButton} onClick={() => setShow(true)}>
        {buttonName}
      </button>
      {show && (
        <div className={styles.modalBackground}>
          <div className={styles.modalContent}>
            <button onClick={() => setShow(false)}>Close Form</button>
            {React.cloneElement(children, { closeModal: () => setShow(false) })}
          </div>
        </div>
      )}
    </>
  );
};
