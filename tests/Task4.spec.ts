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
        let st = '0100100001100101011011000110110001101111001000000101011101101111011100100110110001100100';
        for(var i = 0; i < 32; i++){
            cell.storeBit(0);
        }
        for(var i = 0; i < st.length; i++){
            cell.storeBit(st[i].charCodeAt(0) - 48);
        }
        console.log(cell.endCell());
        let res = await blockchain.runGetMethod(task4.address, 'caesar_cipher_encrypt', [
            {'type': 'int', 'value': 29n},
            {'type': 'cell', 'cell': cell.endCell()}
        ]);
        let ans = res.stack.at(0);
        console.log(ans);
    });
});
