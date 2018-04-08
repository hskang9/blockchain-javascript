class Wallet {
  constructor(_address, _balance, _privateKey, _publicKey) {
    this.address = _address;
    this.privateKey = _privateKey;
    this.publicKey = _publicKey;
    this.balance = _balance;
  }

  toString() {
    return `Wallet -
    address : ${this.address}
    privateKey : ${this.privateKey.toString()}
    publicKey : ${this.publicKey.toString()}
    balance   : ${this.balance}`
  }
}

module.exports = Wallet;