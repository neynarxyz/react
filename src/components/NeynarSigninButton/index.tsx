import styles from "./index.module.css";

export const NeynarSigninButton: React.FC<{ label: string }> = ({ label }) => (
  <button
    onClick={() => console.log("Hello from Neynar..!!")}
    className={styles.button}
  >
    {label}
  </button>
);
