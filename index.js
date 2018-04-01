var express = require('express')
var parse = require('url-parse')
const sha256 = require('sha256');
var app = express()
var bodyParser = require('body-parser')  
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
const requests = require('request')

// Blockchain class
const Blockchain = require('./blockchain')

// Regulator class
const Regulator = require('./regulator')


// Generate a globally unique address for this node
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
node_identifier = uuidv4()

blockChain = new Blockchain()
blockChain.genesis()

regulator = new Regulator()

app.get('/mine', function mine(req, res) {
  // We run the proof of work algorithm to get the next proof...
  var lastBlock = blockChain.lastBlock()
  var lastNonce = lastBlock.nonce
  var nonce = blockChain.proofOfWork(lastNonce)

  // We must receive a reward for finding the proof.
  // The sender is "0" to signify that this node has mined a new coin.
  blockChain.newTransaction(
    sender="0",
    recipient=node_identifier,
    amount=1,
  )

  // Forge the new Block by adding it to the chain
  previousHash = blockChain.constructor.hash(blockChain.lastBlock())

  block = blockChain.newBlock(nonce, previousHash)
  
  response = {
    'message': "New Block Forged",
    'index': block['index'],
    'transactions': block['transactions'],
    'nonce': block['nonce'],
    'previous_hash': block['previous_hash'],
  }

  res.status(200).json(response)
})

app.post('/transactions/new', function newTransaction(req, res) { 
  const values = req.body
  console.log(values)
  const keys = Object.keys(values)
  // Check that the required fields are in the POST'ed data
  const required = ['sender', 'recipient', 'amount']
  if(keys.toString() !== required.toString()) {
    res.status(400).send("Missing values")
  }

  
  // Create a new Transaction
  const index = blockChain.newTransaction(values['sender'], values['recipient'], values['amount'])

  // Broadcast Transaction to other nodes
  var neighbours = this.nodes
  neighbours.forEach(function (node) {
    requests.post(`http://${node}/transactions/new`).form({'sender' : values['sender'], 'recipient' : values['recipient'], 'amount' : values['amount']})
  })
  response = {'message': `Transaction will be added to Block ${index}`}

  res.status(201).json(response)
})

app.get('/chain', function fullChain(req, res){
  response = {
    'chain': blockChain.chain,
    'length': blockChain.chain.length,
  }

  res.status(200).json(response)
})


app.post('/nodes/register', function registerNodes(req, res){ 
  values = req.body

  nodes = values['nodes']

  if(nodes == null){
    res.status(400).send("Error: Please supply a valid list of nodes")
  }

  nodes.forEach(function(node) {
    blockChain.registerNode(node)
  })

  response = {
    'message': "New nodes have been added",
    'total_nodes': Array(blockChain.nodes)
  }

  res.status(201).json(response)
})

app.get('/nodes/resolve', function consensus(req, res){
  replaced = blockChain.resolveConflicts()

  if(replaced) {
    response = {
      'message': "Our chain was replaced",
      'new_chain': blockChain.chain
    }
  }
  else {
    response = {
      'message': "Our chain is authoritative",
      'new_chain': blockChain.chain
    }
  }

  res.status(200).json(response)
})

app.listen(config.PORT)
