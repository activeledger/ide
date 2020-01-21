const ac = require("@activeledger/activecrypto");
const type = process.argv[2];
// console.log(type);
console.log(JSON.stringify(new ac.ActiveCrypto.KeyPair(type).generate()));
