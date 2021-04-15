import bcrypt = require('bcrypt');
const saltRound = 10;
export default {
    hash: async (plainPassword: string): Promise<string> => {
        return await bcrypt.hash(plainPassword, saltRound);
    },
    compare: async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
};
