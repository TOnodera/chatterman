

describe('User', () => {
    describe('registe()', () => {

        it('テストプログラムが正常に動くか確認', () => {
            const a: number = 1;
            const b: number = 2;
            const sum = (a: number, b: number) => a + b;
            expect(sum(a, b)).toBe(a + b);
        });

        it('環境変数確認', () => {
            expect(process.env.NODE_ENV).toBe('test');
        });

    });
});