const Westend = require(`../mods/westend/westend.js`);
const Kusama = require(`../mods/kusama/kusama.js`);
const Polkadot = require(`../mods/polkadot/polkadot.js`);
const node_assert = require('assert');

let assert = (boolish) => {
  try {
    node_assert(boolish)
    console.log("test passed");
  } catch(err) {
    console.log("test failed");
    console.log(err);
  }
}

let getModuleOptionsAsSavedWestend = (mock_name) => {
  return {
    "storage": {
      "keypair": {
        "encoded": "MFMCAQEwBQYDK2VwBCIEIG1dCl4MZA+diDNWBby5VIXMrMJPtM9SbWQ5OZBj1FvvocfMEtbLbfrmwPRItcdQ+QsD+lZzYAzdli7ro+kkqWOhIwMhAKHHzBLWy2365sD0SLXHUPkLA/pWc2AM3ZYu66PpJKlj",
        "encoding": {
          "content": [
            "pkcs8",
            "ed25519"
          ],
          "type": [
            "none"
          ],
          "version": "3"
        },
        "address": "14f84aCLwtjHedp2eqz7PNWspTkzAzEHQKc9RFJep7QcMGgQ",
        "meta": {
          "name": "polkadot pair"
        }
      }
    }
  }
}

let getModuleOptionsAsSavedPolkadot = (mock_name) => {
  return {
    "storage": {
      "keypair": {
        "encoded": "MFMCAQEwBQYDK2VwBCIEINhpiJUXyKENBe/68cpRvcmU9RySbt9vH9O/pUbSLKEFeiYo/JWkkQzFE0ObWnjzWz1mvOfp6hdbxyxsOUnfcpGhIwMhAHomKPyVpJEMxRNDm1p481s9Zrzn6eoXW8csbDlJ33KR",
        "encoding": {
          "content": [
            "pkcs8",
            "ed25519"
          ],
          "type": [
            "none"
          ],
          "version": "3"
        },
        "address": "13mABKJCTLRN3n31K8Cw3dUvqx9fCW1cjsWAWGHZTxEv6KSk",
        "meta": {
          "name": "polkadot pair"
        }
      }
    }
  }
}

let getModuleOptionsAsSavedKusama = (mock_name) => {
  return {
    "storage": {
      "keypair": {
        "encoded": "MFMCAQEwBQYDK2VwBCIEIO++opadDTI4tMtzuVn3PUBZIENLc/dGRHjvjOPPWra24o0xPR3rJMybLG5+rJ9mD9KaPtw7u7qvaJ+Aavv5TOShIwMhAOKNMT0d6yTMmyxufqyfZg/Smj7cO7u6r2ifgGr7+Uzk",
        "encoding": {
          "content": [
            "pkcs8",
            "ed25519"
          ],
          "type": [
            "none"
          ],
          "version": "3"
        },
        "address": "1683mMtH2nUrHTaUgzNt7LNpsWuHcXKStWcDreUFD7EycdLx",
        "meta": {
          "name": "polkadot pair"
        }
      }
    }
  }
}
let getModulesOptionsAsNew = (mock_name) => {
  return {};
}

let mock_app = {
  BROWSER: true,
  storage: {
    saveOptions: () => {},
    getModuleOptionsByName: getModulesOptionsAsNew,
  }
};

let runAllTests = async () => {
  let mock_crypto_module = new Westend(mock_app);
  await runBalanceTest(new Westend(mock_app));
  await runTransferTest(new Westend(mock_app),getModuleOptionsAsSavedWestend, "5FipvEwH67TpD6oWhCw7FDgixqmLUgg9KpsfFxKJG2P6AiSg");

  mock_crypto_module = new Kusama(mock_app);
  await runBalanceTest(new Kusama(mock_app));
  await runTransferTest(new Kusama(mock_app),getModuleOptionsAsSavedKusama, "HhNHLy5oNEJbaPQW48vs8ugAVBsitaVGPiV61kr8pRxB7D8");

  mock_crypto_module = new Polkadot(mock_app);
  await runBalanceTest(new Polkadot(mock_app));
  await runTransferTest(new Polkadot(mock_app),getModuleOptionsAsSavedPolkadot, "13mABKJCTLRN3n31K8Cw3dUvqx9fCW1cjsWAWGHZTxEv6KSk");
  process.exit();
}
let runBalanceTest = async (mock_crypto_module) => {
  mock_crypto_module.initialize(mock_app);
  console.log("------------------------------");
  console.log("Test - Retrieve " + mock_crypto_module.name + " balance.");
  console.log("Endpoint: " + mock_crypto_module.endpoint);
  console.log("Address: " + mock_crypto_module.returnAddress());
  let balance = await mock_crypto_module.returnBalance();
  if(typeof balance.toNumber === 'function') {
    balance = balance.toNumber();
  }
  console.log("Balance: " + balance);
  assert(balance === 0.0);
}
let runTransferTest = async (mock_crypto_module, getModuleOptionsFunc, savedOptionsAddress) => {
  mock_app.storage.getModuleOptionsByName = getModuleOptionsFunc;
  mock_crypto_module.initialize(mock_app);
  console.log("------------------------------");
  console.log("Test - Transfer " + mock_crypto_module.name + " balance.");
  console.log("Endpoint: " + mock_crypto_module.endpoint);
  console.log("From Address: " + mock_crypto_module.returnAddress());
  //assert(mock_crypto_module.returnAddress() == savedOptionsAddress);
  balance = await mock_crypto_module.returnBalance();
  if(typeof balance.toNumber === 'function') {
    balance = balance.toNumber();
  }
  console.log("Balance: " + balance);
  if(balance === 0.0) {
    console.log("Balance needed for transfer testing. Aborting.");
  } else {
    let hash = await mock_crypto_module.transfer(0.0001, "5F8BATXh9XxpE6tMqVUSXJB4X9A7scQMi7LAJQRAxcaBnrBr");
    let verify_payment = await mock_crypto_module.hasPayment(0.0001, getModuleOptionsFunc, "5F8BATXh9XxpE6tMqVUSXJB4X9A7scQMi7LAJQRAxcaBnrBr", Math.floor(Date.now() / 1000));
    assert(verify_payment);
  }
}

runAllTests();