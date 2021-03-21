import { ReadConfig } from '../Domain/ReadConfig';

describe('ReadConfig',()=>{

    describe('ReadConfigクラス',()=>{
        it('設定を読み取れる',()=>{
            expect(ReadConfig.dabtabaseConfig().test.host).toBe('test');
        });
    });    

})