import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import useMaker from '../hooks/useMaker';
import useBlockHeight from '../hooks/useBlockHeight';
import { connectBrowserProvider } from '../maker';
import DaiCoins from '../components/daiCoins';

const ILink = ({ children, link }) => {
  return (
    <a className="inline-link" href={link || '#'} target="_blank">
      {children}
      <style jsx>{`
        .inline-link {
          color: black;
          font-weight: bold;
          text-decoration-style: dotted;
          font-style: italic;
        }
      `}</style>
    </a>
  );
};
const Home = () => {
  const { maker } = useMaker();
  const [pie, setPie] = useState(null);
  const [rate, setRate] = useState(null);
  const [account, setAccount] = useState(null);
  const [additional, setAdd] = useState(0);
  const blockHeight = useBlockHeight(0);

  console.log(blockHeight);

  async function connectBrowserWallet() {
    try {
      if (maker) {
        const connectedAddress = await connectBrowserProvider(maker);
        maker.useAccountWithAddress(connectedAddress);
        setAccount(connectedAddress);
      }
    } catch (err) {
      window.alert(err);
    }
  }

  const makeItDrip = async () => {
    setAdd(additional + 6);
    try {
      if (!account) {
        await connectBrowserWallet();
      }
      await maker
        .service('smartContract')
        .getContract('MCD_POT')
        .drip();
    } catch (error) {}
  };

  useEffect(() => {
    (async () => {
      if (maker) {
        const newPie = await maker.service('mcd:savings').getTotalDai();
        const Rate = await maker.service('mcd:savings').getYearlyRate();

        if (newPie > pie) {
          setAdd(additional + 1);
        }

        setPie(newPie);
        setRate(Rate);
      }
    })();
  }, [maker, blockHeight]);
  return (
    <div className="wrap">
      <Head>
        <title>Make it drip Dai!</title>
        <meta name="description" content="Learn more about how DSR works."></meta>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono:400,400i,700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>

      <div className="content">
        <h1>Make it Drip Dai!</h1>

        <p className="text">
          In Maker's Dai Savings Rate contract{' '}
          <ILink link="https://docs.makerdao.com/smart-contract-modules/rates-module/pot-detailed-documentation">
            (Pot)
          </ILink>
          ,{' '}
          <ILink link="https://docs.makerdao.com/smart-contract-modules/rates-module/pot-detailed-documentation#3-key-mechanisms-and-concepts">
            drip
          </ILink>{' '}
          is the call that updates the DSR rate accumulator{' '}
          <ILink link="https://docs.makerdao.com/smart-contract-modules/rates-module/pot-detailed-documentation#3-key-mechanisms-and-concepts">
            (chi)
          </ILink>{' '}
          and adds Dai by calculating the system debt{' '}
          <ILink link="https://docs.makerdao.com/other-documentation/system-glossary#accounting">
            (vice)
          </ILink>{' '}
          of Maker Protocol's balance sheet{' '}
          <ILink link="https://docs.makerdao.com/smart-contract-modules/system-stabilizer-module/vow-detailed-documentation">
            (vow)
          </ILink>
          . Drip has to be called when users adds{' '}
          <ILink link="https://docs.makerdao.com/smart-contract-modules/rates-module/pot-detailed-documentation">
            (join)
          </ILink>{' '}
          or withdraws{' '}
          <ILink link="https://docs.makerdao.com/smart-contract-modules/rates-module/pot-detailed-documentation">
            (exit)
          </ILink>{' '}
          Dai from the DSR{' '}
          <ILink link="https://docs.makerdao.com/smart-contract-modules/rates-module/pot-detailed-documentation#2-contract-details">
            Pie
          </ILink>{' '}
          but anyone can call it any time!
        </p>

        <p className="text">
          For more information on how Dai and the DSR works, check out{' '}
          <ILink link="https://docs.makerdao.com/">docs.makerdao.com</ILink>.
        </p>

        <div className="buttons">
          <button className="drip" onClick={makeItDrip}>
            Call Pot.drip
          </button>
          <a href="https://oasis.app/save" target="_blank">
            <button>Start earning on your Dai</button>
          </a>
        </div>

        <p className="text small-text">
          There's {pie && pie.toNumber().toLocaleString()} Dai in the Pie right
          now earning {rate && Math.round(rate.toNumber() * 100 - 100)}% a year.
        </p>

        <p className="text small-text colophon">
          A technical PSA by{' '}
          <ILink link="https://twitter.com/adrianleb">@adrianleb</ILink> about{' '}
          <ILink link="https://blog.makerdao.com/why-the-dai-savings-rate-is-a-game-changer-for-the-defi-ecosystem-and-beyond/">
            the wonders of DSR
          </ILink>
          ,{' '}
          <ILink link="https://github.com/adrianleb/dai-pot-drip">
            View Source
          </ILink>
        </p>
      </div>

      <DaiCoins dai={pie && pie.toNumber()} add={additional} />

      <style jsx>{`

        
        .wrap {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .content {
          position: absolute;
          z-index: 1;
          bottom: 0;
          padding: 32px;
          text-align: center;
        }

        @media (max-width: 481px) {
          .wrap {
            height: 120vh;
          }
        }
        button {
          appearance: none;
          font-size: 12px;
          padding: 8px 24px;
          font-family: 'IBM Plex Mono', monospace;
          margin: 0 8px;
        }

        .buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 8px 0 0;
        }

        h1 {
          font-weight: 700;
        }

        .text {
          max-width: 620px;
          margin: 0 auto;
          text-align: center;
          line-height: 1.75;
          font-size: 12px;
          padding: 8px 4px;
        }

        .small-text {
          font-size: 10px;
          padding-bottom: 0;
          color: #444;
        }

        .colophon {
          margin-top: 8px;
        }
      `}</style>

      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next{
          height: 100%;
          margin: 0;
          padding: 0;
        }

        html,
        body {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 14px;
          color: #222;
        }

        *,
        *:after,
        *:before {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Home;
