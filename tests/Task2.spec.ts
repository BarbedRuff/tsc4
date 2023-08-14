import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, TupleBuilder, toNano } from 'ton-core';
import { Task2 } from '../wrappers/Task2';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('Task2', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('Task2');
    });

    let blockchain: Blockchain;
    let task2: SandboxContract<Task2>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        task2 = blockchain.openContract(Task2.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await task2.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: task2.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and task2 are ready to use
    });

    it('matrix', async () => {
        let a = new TupleBuilder;
        let a1 = new TupleBuilder;
        let a2 = new TupleBuilder;
        a1.writeNumber(1n); a1.writeNumber(2n); a1.writeNumber(3n);
        a2.writeNumber(3n); a2.writeNumber(4n); a2.writeNumber(5n);
        a.writeTuple(a1.build());
        a.writeTuple(a2.build());

        let b = new TupleBuilder;
        let b1 = new TupleBuilder;
        let b2 = new TupleBuilder;
        let b3 = new TupleBuilder;
        b1.writeNumber(7n); b1.writeNumber(8n);
        b2.writeNumber(9n); b2.writeNumber(10n); 
        b3.writeNumber(11n); b3.writeNumber(12n); 
        b.writeTuple(b1.build());
        b.writeTuple(b2.build());
        b.writeTuple(b3.build());

        let res = await blockchain.runGetMethod(task2.address, 'matrix',
        // [{"type": "tuple", "items": a.build()},
        // {"type": "tuple", "items": b.build()}]
        );
        console.log(res.stack.at(0));
    });
});
