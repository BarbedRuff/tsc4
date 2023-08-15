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
        for(var i = 0; i < 1023; i++){
            cell.storeBit(1);
        }
        let cell1 = new Builder();
        cell1.storeBit(0);
        cell1.storeBit(1);
        cell1.storeBit(0);
        cell1.storeBit(1); // 110101
        cell.storeRef(cell1.endCell());
        console.log(cell.endCell());
        let res = await blockchain.runGetMethod(task3.address, 'find_and_replace', [
            {'type': 'int', 'value': 53n},
            {'type': 'int', 'value': 0n},
            {'type': 'cell', 'cell': cell.endCell()}
        ]);
        // let res = await blockchain.runGetMethod(task3.address, 'kek', []);
        console.log(res.stack.at(0));
    });
});
