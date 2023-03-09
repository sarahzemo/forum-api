const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const ThreadsTableHelper = require('../../../../tests/ThreadsTableHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadsRepositoryPostgres = require('../ThreadsRepositoryPostgres');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');

describe('ThreadsRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('saveThread function', () => {
        it('should persist add thread and return added thread correclty', async () => {
            //Arrange
            await UsersTableTestHelper.addUser({ id: 'user-1111' });
            const addThread = new AddThread({
                title: 'Judul Thread',
                body: 'Hai, ini adalah sebuah thread',
                owner: 'user-1111',
            });

            const fakeIdGenerator = () => '123';
            const threadsRepositoryPosgres = new ThreadsRepositoryPostgres(pool, fakeIdGenerator);

            //Action
            const addedThread = await threadsRepositoryPosgres.saveThread(addThread);
            const threads = await ThreadsTableHelper.getThreadById('thread-123');

            //Assert
            expect(addedThread).toStrictEqual(new AddedThread({
                id: 'thread-123',
                title: 'Judul Thread',
                owner: 'user-1111',
            }));
            expect(threads).toHaveLength(1);
        });
    });

    describe('getThreadByID function', () => {
        it('should throw NotFoundError when threads not found', async () => {
            //Arrange
            const threadsRepositoryPosgres = new ThreadsRepositoryPostgres(pool, {});

            //Action and Assert 
            await expect(threadsRepositoryPosgres.getThreadById('thread-11111')).rejects.toThrowError(NotFoundError);
        });

        it('should return getThreadByID correctly', async () => {
            //Arrange
            await UsersTableTestHelper.addUser({ id: 'user-1111' });
            await ThreadsTableHelper.saveThread({
                id: 'thread-123',
                title: 'Judul Thread',
                body: 'Hai, ini adalah sebuah thread',
                owner: 'user-1111',
            });
            const threadsRepositoryPosgres = new ThreadsRepositoryPostgres(pool, {});

            //Action
            const detailThreads = await threadsRepositoryPosgres.getThreadById('thread-123');

            //Assert
            expect(detailThreads).toHaveProperty('id');
            expect(detailThreads).toHaveProperty('title');
            expect(detailThreads).toHaveProperty('owner');
            expect(detailThreads).toStrictEqual({
                id: 'thread-123',
                title: 'Judul Thread',
                owner: 'user-1111',
            });
        });
    });

    describe('getDetailThreadById function', () => {
        it('should throw NotFoundError when threads not found', async () => {
            //Arrange
            const threadsRepositoryPosgres = new ThreadsRepositoryPostgres(pool, {});

            //Action and Assert 
            await expect(threadsRepositoryPosgres.getDetailThreadById('thread-11111')).rejects.toThrowError(NotFoundError);
        });

        it('should presist get detail thread and return detail thread correctly', async () => {
            //Arrange
            await UsersTableTestHelper.addUser({ id: 'user-1111' });
            await ThreadsTableHelper.saveThread({
                id: 'thread-123',
                title: 'Judul Thread',
                body: 'Hai, ini adalah sebuah thread',
                owner: 'user-1111',
                date: '2023-02-27T07:26:14.499Z'
            });

            
            const threadsRepositoryPosgres = new ThreadsRepositoryPostgres(pool, {});

            //Action
            const detailThread = await threadsRepositoryPosgres.getDetailThreadById('thread-123');
            
            //Assert
            expect(detailThread).toStrictEqual(new DetailThread({
                id: 'thread-123',
                title: 'Judul Thread',
                body: 'Hai, ini adalah sebuah thread',
                username: 'dicoding',
                create_at: '2023-02-27T07:26:14.499Z'
            }));
        });
    });
});