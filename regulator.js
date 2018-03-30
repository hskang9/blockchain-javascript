const { INITIAL_BALANCE } = require('./config');
const Wallet = require('wallet');
const EC = require('elliptic').ec;


class Regulator {

    constructor() {
        this.users = 0;// number of users,
        this.INITIAL_BALANCE = INITIAL_BALANCE;
    }


    generate() {
        this.users += 1;
        var ec = new EC('secp256k1');
        var keys = ec.genKeyPair();
        return new Wallet(INITIAL_BALANCE, keys, keys.getPublic().encode('hex'));
    }

    authenticate(msgHash, signature, publicKey) {
        var key = ec.keyFromPublic(publicKey, 'hex');
        return key.verify(msgHash, signature)
    }

    
}

module.exports = Regulator;