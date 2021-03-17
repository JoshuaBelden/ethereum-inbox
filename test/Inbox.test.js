const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let accounts = [], inbox = {};

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode,
            arguments: ['initial-message']
        })
        .send({
            from: accounts[0],
            gas: '1000000'
        });

});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const initialMessage = await inbox.methods.message().call();
        assert.strictEqual(initialMessage, 'initial-message');
    });

    it('can change the message', async () => {
        await inbox.methods.setMessage('updated-message').send({ from: accounts[0] });
        const updatedMessage = await inbox.methods.message().call();
        assert.strictEqual(updatedMessage, 'updated-message');
    });
});
