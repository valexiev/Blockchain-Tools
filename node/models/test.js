const ed = require('ed25519-supercop')

const tx = {
	from: 'df977118191a291697328dc62b11017e8727db23de76a8679ca5e2dd0be8cff1',
	to: '123',
	signature: 'f6938ee9593c72c5ca2ad1892473d72709f041020ec9a81c939ea3d49500243f7b69dd9b5c9af72a36b5344a3beba0295c665dfc100588081c91cc58d94e090b',
	amount: '123'
}

const privateKey = '2864a8bad5c0ca9bf73b6e09ee8345777a45f56679aae60915d0159ddee39a4153a01b748fd591136d02c469816c820d48ad1a9454d93aaa1a8e48672b85ab04'

function verifySignature(trz) {
	const message = (trz.from + trz.to + trz.amount)
	const signature = ed.sign(message, trz.from, privateKey).toString('hex')
	console.log(signature)
	return ed.verify(signature, message, trz.from);
}

function getSignature(trz) {
	const message = (trz.from + trz.to + trz.amount)
	return ed.sign(message, trz.from, privateKey).toString('hex')
}

console.log(verifySignature(tx))
console.log(getSignature(tx))
