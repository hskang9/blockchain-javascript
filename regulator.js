const { INITIAL_BALANCE } = require('./config');
const Wallet = require('./wallet');
const EC = require('elliptic').ec;
const sha256 = require('sha256');


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

    hash(data){
        /*
        @description
        Creates a SHA-256 hash of a data
    
        : param block: Block
        */
    
        // We must make sure that the Object is Ordered, or we'll have inconsistent hashes

        var blockString = JSON.stringify(data, Object.keys(data).sort());
        var hash = sha256(blockString);
        return hash;
    }

    authenticate(data, signature, publicKey) {
        delete data.public_key;
        delete data.signature;
        var ec = new EC('secp256k1');
        var msgHash = this.hash(data);
        var key = ec.keyFromPublic(publicKey, 'hex');
        return key.verify(msgHash, signature);
    }

    
}

module.exports = Regulator;