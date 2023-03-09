const ThreadsRespository = require('../ThreadsRespository');

describe('ThreadsRepository inteface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        //Arrange
        const threadsRespository = new ThreadsRespository();

        //Action and Assert
        await expect(threadsRespository.saveThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(threadsRespository.getThreadById('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(threadsRespository.getDetailThreadById('')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    })
});