import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import useMaker from '../hooks/useMaker';
import useBlockHeight from '../hooks/useBlockHeight';
import { connectBrowserProvider } from '../maker';
import DaiCoins from '../components/daiCoins';
import ReactGA from 'react-ga';

const ILink = ({ children, link }) => {
  const onClick = (link, children) => {
    ReactGA.event({
      category: 'LinkClick',
      action: children,
      label: link
    });
  };
  return (
    <a
      className="inline-link"
      onClick={onClick}
      href={link || '#'}
      target="_blank"
    >
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

  useEffect(() => {
    if (window !== undefined) {
      ReactGA.initialize('UA-154852830-1');
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }, []);

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
    ReactGA.event({
      category: 'action',
      action: 'call drip'
    });
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
        <title>Make It Drip Dai</title>
        <meta name="title" content="Make It Drip Dai" />
        <meta
          name="description"
          content="Learn more about how #MuchCoolerDai DSR works."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://daidrip.tech/" />
        <meta property="og:title" content="Make It Drip Dai" />
        <meta
          property="og:description"
          content="Learn more about how #MuchCoolerDai DSR works."
        />
        <meta property="og:image" content="/dais2.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://daidrip.tech/" />
        <meta property="twitter:title" content="Make It Drip Dai" />
        <meta
          property="twitter:description"
          content="Learn more about how #MuchCoolerDai DSR works."
        />
        <meta property="twitter:image" content="/dais2.png" />
        <link
          href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono:400,400i,700&display=swap"
          rel="stylesheet"
        ></link>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest"></link>
      </Head>

      <div className="content">
        <h1>Make It Drip Dai!</h1>

        <p className="text">
          In{' '}
          <ILink link="https://twitter.com/search?q=%23MuchCoolerDai">
            #MuchCoolerDai
          </ILink>
          's Dai Savings Rate contract{' '}
          <ILink link="https://docs.makerdao.com/smart-contract-modules/rates-module/pot-detailed-documentation">
            (Pot)
          </ILink>
          ,{' '}
          <ILink link="https://docs.makerdao.com/smart-contract-modules/rates-module/pot-detailed-documentation#3-key-mechanisms-and-concepts">
            drip
          </ILink>{' '}
          is the function that updates the DSR accumulator{' '}
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
          . Drip has to be called when a user adds{' '}
          <ILink link="https://docs.makerdao.com/smart-contract-modules/rates-module/pot-detailed-documentation">
            (join)
          </ILink>{' '}
          or withdraws{' '}
          <ILink link="https://docs.makerdao.com/smart-contract-modules/rates-module/pot-detailed-documentation">
            (exit)
          </ILink>{' '}
          Dai from the DSR but anyone can call it any time!
        </p>

        <p className="text">
          To learn more about the tech behind DSR, Dai and the rest of the Maker
          protocol, check out the docs at{' '}
          <ILink link="https://docs.makerdao.com/">docs.makerdao.com</ILink>.
        </p>

        <div className="buttons">
          <button className="drip" onClick={makeItDrip}>
            Call Pot.drip
          </button>
          <a href="https://oasis.app/save" target="_blank">
            <button
              onClick={() => {
                ReactGA.event({
                  category: 'action',
                  action: 'link oasis'
                });
              }}
            >
              Start earning on your Dai
            </button>
          </a>
        </div>

        <p className="text small-text">
          There's {pie && pie.toNumber().toLocaleString()} Dai in the{' '}
          <ILink link="https://docs.makerdao.com/smart-contract-modules/rates-module/pot-detailed-documentation#2-contract-details">
            Pie
          </ILink>{' '}
          right now earning {rate && Math.round(rate.toNumber() * 100 - 100)}% a
          year.
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
          height: 125vh;
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

        @media (max-width: 681px) {
          .wrap {
            height: 135vh;
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
          font-size: 22px;
          margin: 0;
          padding: 0;
          margin-bottom: 8px;
        }

        .text {
          max-width: 620px;
          margin: 0 auto;
          text-align: center;
          line-height: 1.75;
          font-size: 14px;
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
        div#__next {
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
