"use client";

import { useEffect, useState } from "react";
import styles from "../page.module.css";
import CryptoItem from "./CryptoItem";
import { Crypto, User } from "../types";

export default () => {
  const url = "https://api.coinlore.net/api/tickers/";
  const urlUser = "https://superkiment.fr/?page=crypto-liste";
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [renderedCryptos, setRenderedCryptos] = useState(["Bitcoin"]);
  const [userCrypto, setUser] = useState<User>();
  const [interfaceConnexion, setInterfaceConnexion] = useState<boolean>(false);
  const [messageErreur, setMessageErreur] = useState<string>("");
  const [messageResponse, setMessageResponse] = useState<string>("");

  const getData = async () => {
    const data = await fetch(url);
    const dataJSON = (await data.json()).data;
    setCryptos(dataJSON);
  };

  const inscrireUser = async (username: string) => {
    const data = await fetch(
      `${urlUser}&type=inscription&username=${username}`
    );
    const dataJSON = (await data.json()).data;
    setMessageResponse(dataJSON.data);
  };

  const getUser = async (username: string) => {
    try {
      const data = await fetch(
        urlUser + `&type=connexion&username=${username}`
      );
      const dataJSON = await data.json();
      console.log("fetch user ", dataJSON);

      if (dataJSON.type == "success") {
        setUser(dataJSON.data);
        setRenderedCryptos(dataJSON.data.cryptos);
        setMessageResponse("Compte récupéré avec succès !");
      } else setMessageErreur(dataJSON.data);
    } catch (e) {
      setMessageErreur("Erreur, veuillez réessayer.");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const retirerCryptoCompte = async (crypto: string) => {
    const data = await fetch(
      `${urlUser}&type=retirer-crypto&username=${userCrypto?.username}&crypto=${crypto}`
    );
    const dataJSON = (await data.json()).data;
    setMessageResponse(dataJSON.data);
  };

  const ajouterCryptoCompte = async (crypto: string) => {
    const data = await fetch(
      `${urlUser}&type=ajouter-crypto&username=${userCrypto?.username}&crypto=${crypto}`
    );
    const dataJSON = (await data.json()).data;
    setMessageResponse(dataJSON.data);
  };

  const Liste = () => {
    interface Props {
      crypto: string;
    }

    const StringToCrypto: React.FC<Props> = ({ crypto }) => {
      for (let i = 0; i < cryptos.length; i++) {
        let cryptoItem: Crypto = cryptos[i];
        if (cryptoItem.name.toLowerCase() == crypto.toLowerCase()) {
          return (
            <CryptoItem crypto={cryptoItem} username={userCrypto?.username} />
          );
        }
      }
    };

    return renderedCryptos.map((item: string, index) => (
      <div key={index} className={styles.listitem}>
        <button
          className={styles.colorred}
          onClick={() => {
            console.log(userCrypto?.username);
            if (userCrypto) {
              retirerCryptoCompte(item);
            }

            const temp = [];
            for (let i = 0; i < renderedCryptos.length; i++) {
              if (renderedCryptos[i].toLowerCase() != item.toLowerCase()) {
                temp.push(renderedCryptos[i]);
              }
            }

            setRenderedCryptos(temp);
          }}
        >
          Ne plus suivre
        </button>
        <StringToCrypto crypto={item} />
      </div>
    ));
  };

  const AjouterCrypto = () => {
    const [inputValue, setInputValue] = useState<string>("");

    const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    };

    const onClickButton = () => {
      console.log(inputValue);
      if (!renderedCryptos.includes(inputValue)) {
        setRenderedCryptos([...renderedCryptos, inputValue]);
        ajouterCryptoCompte(inputValue);
      }
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

    return (
      <div className={styles.description}>
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
        {inputValue != "" && (
          <div className={styles.listitem}>
            <ResultsSearch />
          </div>
        )}
      </div>
    );
  };

  const ConnexionButton = () => {
    const [username, setUsername] = useState<string>("");

    return (
      <div className={styles.interfaceconnexion}>
        <div className={styles.connexionbutton}>
          <button
            onClick={() => {
              setInterfaceConnexion(!interfaceConnexion);
            }}
          >
            Compte
          </button>
        </div>

        {interfaceConnexion &&
          (userCrypto ? (
            <div>
              <p>Connecté en tant que {userCrypto.username} !</p>
              <button
                onClick={() => {
                  setUser(undefined);
                  setRenderedCryptos(["Bitcoin"]);
                }}
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <div>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setUsername(event.target.value);
                }}
              />

              <button
                type="submit"
                onClick={() => {
                  if (username == "")
                    setMessageErreur("Veuillez spécifier un nom d'utilisateur");
                  else getUser(username);
                }}
              >
                Se Connecter
              </button>

              <button
                type="submit"
                onClick={() => {
                  if (username == "")
                    setMessageErreur("Veuillez spécifier un nom d'utilisateur");
                  else inscrireUser(username);
                }}
              >
                S'inscrire
              </button>
              <p className={styles.colorred}>{messageErreur}</p>
            </div>
          ))}
      </div>
    );
  };

  return (
    <>
      <div className={styles.gridtrois}>
        <div></div>
        <h2>Liste</h2>
        <ConnexionButton />
      </div>

      <AjouterCrypto />

      <Liste />

      {messageResponse}
    </>
  );
};
