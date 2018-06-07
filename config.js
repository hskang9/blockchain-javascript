// Difficuly of mining
const DIFFICULTY = 4;

// Initial amount of coin in genesis block
const INITIAL_BALANCE = 500000000000000;

// Mining reward
const MINING_REWARD = 50;

// Listening port
const PORT = 5000;

// mining nodes
const NODE_ADDRESSES = [`localhost:${PORT}`];



module.exports = { DIFFICULTY, INITIAL_BALANCE, MINING_REWARD, NODE_ADDRESSES };
