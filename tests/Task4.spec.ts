import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Builder, Cell, toNano } from 'ton-core';
import { Task4 } from '../wrappers/Task4';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task4', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task4');
    });

    let blockchain: Blockchain;
    let task4: SandboxContract<Task4>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task4 = blockchain.openContract(Task4.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task4.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task4.address,
            deploy: true,
            success: true,
        });
    });

    // it('should deploy', async () => {
    //     // the check is done inside beforeEach
    //     // blockchain and task4 are ready to use
    // });

    it('caesar', async () => {
        let cell = new Builder();
        let st = '01000001';
        for(var i = 0; i < 32; i++){
            cell.storeBit(0);
        }
        for(var i = 0; i < st.length; i++){
            cell.storeBit(st[i].charCodeAt(0) - 48);
        }

        let cell1 = new Builder();
        let st1 = '01000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010';
        for(var i = 0; i < st1.length; i++){
            cell1.storeBit(st1[i].charCodeAt(0) - 48);
        }
        cell.storeRef(cell1.endCell());

        let cell2 = new Builder();
        let st2 = '01000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010010000100100001001000010';
        for(var i = 0; i < st2.length; i++){
            cell2.storeBit(st2[i].charCodeAt(0) - 48);
        }
        cell.storeRef(cell2.endCell());

        console.log(cell.endCell());
        let res = await blockchain.runGetMethod(task4.address, 'caesar_cipher_encrypt', [
            {'type': 'int', 'value': 1n},
            {'type': 'cell', 'cell': cell.endCell()}
        ]);
        console.log(res.stack.at(0));
    });
});
