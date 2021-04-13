import { mySqlConnector } from "../../Domain/Utility/Connection/Connection";
import Message from "../../Domain/Message/Message";
import User from "../../Domain/User/User";
import Datetime from "../../Domain/Utility/Datetime";

describe('Message', () => {

    const user: User = new User('tester', { email: 'test@test.com', password: 'password' }, new Datetime());
    let message_id: string;

    beforeAll(async () => {
        await user.registe();
    });

    afterAll(async () => {
        await mySqlConnector.query('TRUNCATE TABLE users');
        await mySqlConnector.query('TRUNCATE TABLE messages');
    });

    describe('add()', () => {
        it('追加出来る', async () => {
            const message: Message = new Message('テストメッセージ', user, 'everybody');
            expect(await message.add()).toBe(true);
            message_id = message.message_id!;
        });
    });

    describe('edit()', () => {
        it('編集できる', async () => {
            const message = new Message(message_id);
            expect(await message.edit('編集後のメッセージ')).toBe(true);
        });
    });

    describe('delete()', () => {
        it('削除できる', async () => {
            const message = new Message(message_id);
            expect(await message.delete()).toBe(true);
        });
    });

});