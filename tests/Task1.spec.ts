import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano, Builder } from 'ton-core';
import { Task1 } from '../wrappers/Task1';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task1', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task1');
    });

    let blockchain: Blockchain;
    let task1: SandboxContract<Task1>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task1 = blockchain.openContract(Task1.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task1.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task1.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        let cell = new Builder();
        let cell1 = new Builder();
        let cell2 = new Builder();
        let cell3 = new Builder();
        let cell4 = new Builder();
        cell.storeRef(cell1);
        cell.storeRef(cell2);
        cell.storeRef(cell3);
        cell.storeRef(cell4);
        let res = await blockchain.runGetMethod(task1.address, 'find_branch_by_hash',
        [{"type": "int", "value":1n},
        {"type": "cell", "cell": cell.endCell()}]
        );
        console.log(res.stack.at(0));
    });
});
