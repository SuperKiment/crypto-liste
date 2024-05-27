import styles from "../page.module.css";
import { Crypto } from "../types";

interface CryptoProps {
  crypto: Crypto;
  username: string | undefined;
}

const CryptoItem: React.FC<CryptoProps> = ({ crypto, username }) => {
  const percents = [
    crypto.percent_change_1h,
    crypto.percent_change_24h,
    crypto.percent_change_7d,
  ];

  return (
    <div className={styles.gridval}>
      
      <p>
        {crypto.symbol} {crypto.name}
      </p>
      <p>${crypto.price_usd}</p>
      {percents.map((value, i) => {
        return (
          <p
            key={i}
            className={value > 0 ? styles.colorgreen : styles.colorred}
          >
            {value}%
          </p>
        );
      })}
      <p>{crypto.price_btc} BTC</p>
    </div>
  );
};

export default CryptoItem;
