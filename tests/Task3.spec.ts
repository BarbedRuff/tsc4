import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano, Builder } from 'ton-core';
import { Task3 } from '../wrappers/Task3';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task3', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task3');
    });

    let blockchain: Blockchain;
    let task3: SandboxContract<Task3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task3 = blockchain.openContract(Task3.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task3.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task3.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        let cell = new Builder();
        let st = '111000111';
        for(var i = 0; i < st.length; i++){
            cell.storeBit(st[i].charCodeAt(0) - 48);
        }
        console.log(cell.endCell());
        let res = await blockchain.runGetMethod(task3.address, 'find_and_replace', [
            {'type': 'int', 'value': 14n},
            {'type': 'int', 'value': 172n},
            {'type': 'cell', 'cell': cell.endCell()}
        ]);
        // let res = await blockchain.runGetMethod(task3.address, 'kek', []);
        console.log(res.stack.at(0));
    });
});
