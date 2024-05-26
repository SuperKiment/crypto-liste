"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";
import CryptoItem from "./CryptoItem";
import { Crypto } from "../types";

export default () => {
  const url = "https://api.coinlore.net/api/tickers/";
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [renderedCryptos, setRenderedCryptos] = useState(["Bitcoin"]);

  const getData = async () => {
    const data = await fetch(url);
    const dataJSON = (await data.json()).data;
    setCryptos(dataJSON);
    console.log("fetch");
  };

  useEffect(() => {
    getData();
  }, []);

  const Liste = () => {
    interface Props {
      crypto: string;
    }

    const StringToCrypto: React.FC<Props> = ({ crypto }) => {
      for (let i = 0; i < cryptos.length; i++) {
        let cryptoItem: Crypto = cryptos[i];
        if (cryptoItem.name.toLowerCase() == crypto.toLowerCase()) {
          return <CryptoItem crypto={cryptoItem} />;
        }
      }
    };

    return renderedCryptos.map((item: string, index) => (
      <StringToCrypto key={index} crypto={item} />
    ));
  };

  const AjouterCrypto = () => {
    const [inputValue, setInputValue] = useState<string>("");

    const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
      const value: string = event.target.value.trim();
      console.log(value);
    };

    const onClickButton = () => {
      console.log(inputValue);
      if (!renderedCryptos.includes(inputValue))
        setRenderedCryptos([...renderedCryptos, inputValue]);
    };

    const checkAddable = () => {
      for (let i = 0; i < cryptos.length; i++) {
        if (inputValue === cryptos[i].name) return true;
      }
      return false;
    };

    const ResultsSearch = () => {
      const results: Crypto[] = [];

      for (let i = 0; i < cryptos.length; i++) {
        if (cryptos[i].name.toLowerCase().includes(inputValue.toLowerCase())) {
          results.push(cryptos[i]);
        }
      }

      return (
        <div>
          <button
            className={styles.description}
            onClick={() => {
              getData();
            }}
          >
            Rafraîchir
          </button>

          <div className={styles.gridsearch}>
            {results.map((result, index) => (
              <p
                onClick={() => {
                  setInputValue(result.name);
                  console.log(result.name);
                }}
                key={index}
              >
                {result.name}
              </p>
            ))}
          </div>
        </div>
      );
    };

    const InputAdd = () => {
      return (
        <div className={styles.listitem}>
          <input
            type="text"
            name="ajout-crypto"
            id="ajout-crypto"
            value={inputValue}
            onChange={onChangeInput}
            placeholder="Chercher une cryptomonnaie"
          />
          {checkAddable() && <button onClick={onClickButton}>Ajouter</button>}
        </div>
      );
    };

    return (
      <div className={styles.description}>
        <InputAdd />
        {inputValue != "" && (
          <div className={styles.listitem}>
            <ResultsSearch />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <h2>Liste</h2>

      <AjouterCrypto />

      <Liste />
    </>
  );
};
