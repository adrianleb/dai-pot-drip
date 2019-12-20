import Maker from '@makerdao/dai';
import mcdPlugin, { MDAI } from '@makerdao/dai-plugin-mcd';
import { checkEthereumProvider } from './utils/ethereum';
import { createCurrency } from '@makerdao/currency';
import assert from 'assert';

export const SAI = createCurrency('SAI');
export const ETH = Maker.ETH;
export const USD = Maker.USD;
export const DAI = MDAI;

let maker;

export function getMaker() {
  assert(maker, 'Maker has not been instantiated');
  return maker;
}

const INFURA_KEY = '6ba7a95268bf4ccda9bf1373fe582b43';

export async function instantiateMaker(network) {
  const url =
    network === 'test'
      ? process.env.TEST_RPC_URL
      : `https://${network}.infura.io/v3/${INFURA_KEY}`;


  const config = {
    url,
    log: false,
    multicall: true,
    plugins: [
      [
        mcdPlugin,
        {
          cdpTypes: [
            { currency: SAI, ilk: 'SAI' },
            { currency: ETH, ilk: 'ETH-A' }
          ]
        }
      ],
    ]
  };

  maker = await Maker.create('http', config);
  window.maker = maker; // for debugging
  return maker;
}

export async function connectBrowserProvider(maker) {
  const networkId = maker.service('web3').networkId();
  const browserProvider = await checkEthereumProvider();

  assert(
    browserProvider.networkId === networkId,
    `Expected network ID ${networkId}, got ${browserProvider.networkId}.`
  );
  assert(
    browserProvider.address &&
      browserProvider.address.match(/^0x[a-fA-F0-9]{40}$/),
    'Got an incorrect or nonexistent wallet address.'
  );

  const getMatchedAccount = address =>
    maker
      .listAccounts()
      .find(acc => acc.address.toUpperCase() === address.toUpperCase());

  let account;
  if (maker.service('accounts').hasAccount()) {
    const matchedAccount = getMatchedAccount(browserProvider.address);
    if (!matchedAccount) {
      account = await maker.addAccount({ type: 'browser', autoSwitch: true });
    } else {
      account = matchedAccount;
    }
  } else {
    account = await maker.addAccount({ type: 'browser', autoSwitch: true });
  }

  maker.useAccountWithAddress(account.address);
  return maker.currentAddress();
}
