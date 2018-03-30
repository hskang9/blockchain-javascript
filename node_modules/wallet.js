class Wallet {
  constructor(balance, keyPair, publicKey) {
    this.balance = balance;
    this.keyPair = keyPair;
    this.publicKey = publicKey;
  }

  toString() {
    return `Wallet -
    publicKey : ${this.publicKey.toString()}
    balance   : ${this.balance}`
  }
}

module.exports = Wallet;