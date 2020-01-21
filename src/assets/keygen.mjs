const ac = require("@activeledger/activecrypto");

generateKey = (type) => {
  return JSON.stringify(new ac.ActiveCrypto.KeyPair(type).generate());
}

onmessage = (e) => {
  postMessage(generateKey(e.data[0]));
}