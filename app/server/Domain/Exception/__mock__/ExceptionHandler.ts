export const mockHandler = jest.fn();
const mock = jest.fn().mockImplementation(()=>{
    return {handle: mockHandler}
});

export default mock;