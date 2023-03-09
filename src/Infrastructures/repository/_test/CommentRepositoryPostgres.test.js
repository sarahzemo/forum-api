const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const ThreadsTableHelper = require('../../../../tests/ThreadsTableHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');

const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');

describe('CommentRepositoryPostgres.test', () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addComment function', () => {
        it('should persist add comment and return added commet correclty', async () => {
            //Arrange
            await UsersTableTestHelper.addUser({ id: 'user-1111' });
            await ThreadsTableHelper.saveThread({
                id: 'thread-123',
                title: 'Judul Thread',
                body: 'Hai, ini adalah sebuah thread',
                owner: 'user-1111',
            });

            const addComment = new AddComment({
                content: 'Ga tau mau comment apa',
                threadId: 'thread-123',
                owner: 'user-1111'
            });

            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            //Action
            const addedComment = await commentRepositoryPostgres.addComment(addComment);
            const comment = await CommentsTableTestHelper.getCommentById('comment-123');

            //Assert
            expect(addedComment).toStrictEqual(new AddedComment({
                id: 'comment-123',
                content: 'Ga tau mau comment apa',
                owner: 'user-1111',
            }));
            expect(comment).toHaveLength(1);
        });
    });

    describe('verifyCommentOwner function', () => {
        it('should throw NotFoundError when comment not found', async () => {
            //Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            //Action and Assert 
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-1111')).rejects.toThrowError(NotFoundError);
        });

        it('should throw AuthorizationError when not owner', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-1111' });
            await ThreadsTableHelper.saveThread({
                id: 'thread-123',
                title: 'Judul Thread',
                body: 'Hai, ini adalah sebuah thread',
                owner: 'user-1111',
            });
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'Ga tau mau comment apa',
                thread: 'thread-123',
                owner: 'user-1111',
            });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            //Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).rejects.toThrowError(AuthorizationError);
        });

        it('should not throw error when owner is valid', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-1111' });
            await ThreadsTableHelper.saveThread({
                id: 'thread-123',
                title: 'Judul Thread',
                body: 'Hai, ini adalah sebuah thread',
                owner: 'user-1111',
            });
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'Ga tau mau comment apa',
                thread: 'thread-123',
                owner: 'user-1111',
            });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            //Action and Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-1111')).resolves.toBeUndefined();
        });
    });

    describe('checkCommentIsExist function', () => {
        it('should throw error when comment is not exist', async () => {
            //Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            //Action and Assert
            await expect(commentRepositoryPostgres.checkCommentIsExist('comment-123')).rejects.toThrowError(NotFoundError);
        });

        it('should not throw error when a thread with given id is found', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-1111' });
            await ThreadsTableHelper.saveThread({
                id: 'thread-123',
                title: 'Judul Thread',
                body: 'Hai, ini adalah sebuah thread',
                owner: 'user-1111',
            });
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'Ga tau mau comment apa',
                thread: 'thread-123',
                owner: 'user-1111',
            });

            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
            await expect(commentRepositoryPostgres.checkCommentIsExist('comment-123')).resolves.not.toThrow(NotFoundError);
        });
    });

    describe('detailCommentByThreadID function', () => {
        it('should throw NotFoundError when comment not found', async () => {
            //Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            //Action and Assert 
            await expect(commentRepositoryPostgres.detailCommentByThreadID('thread-111')).rejects.toThrowError(NotFoundError);
        });

        it('should presist get detail comment and return detail comment correctly', async () => {
            //Arrange
            await UsersTableTestHelper.addUser({ id: 'user-111' });
            await ThreadsTableHelper.saveThread({
                id: 'thread-111',
                title: 'Judul Thread',
                body: 'Hai, ini adalah sebuah thread',
                owner: 'user-111',
            });
            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'Ga tau mau comment apa',
                thread: 'thread-111',
                owner: 'user-111',
                date: '2023-02-27T00:26:14.499Z',
                is_deleted: false
            });
            await CommentsTableTestHelper.addComment({
                id: 'comment-124',
                content: 'Ga tau mau comment apa',
                thread: 'thread-111',
                owner: 'user-111',
                date: '2023-02-27T00:26:14.499Z',
                is_deleted: false
            });
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            //Action
            const commentDetail = await commentRepositoryPostgres.detailCommentByThreadID('thread-111');

            //Assert
            expect(commentDetail).toHaveLength(2);
            expect(commentDetail).toStrictEqual([
                new DetailComment({
                    id: 'comment-123',
                    content: 'Ga tau mau comment apa',
                    username: 'dicoding',
                    created_at: '2023-02-26T17:26:14.499Z',
                    is_delete: false
                }),
                new DetailComment({
                    id: 'comment-124',
                    content: 'Ga tau mau comment apa',
                    username: 'dicoding',
                    created_at: '2023-02-26T17:26:14.499Z',
                    is_delete: false
                })
            ]);
        });
    });

    describe('deleteCommentByID function', () => {
        it('should update field is_deleted to true', async () => {
            //Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableHelper.saveThread({
                id: 'thread-123',
                title: 'Judul Thread',
                body: 'Hai, ini adalah sebuah thread',
                owner: 'user-123',
            });
            const fakeIdGenerator = () => '123';
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            await commentRepositoryPostgres.addComment({
                content: 'Ga tau mau comment apa',
                threadId: 'thread-123',
                owner: 'user-123'
            });
            //Action
            await commentRepositoryPostgres.deleteCommentByID('comment-123');

            //Assert
            const commentDetail = await CommentsTableTestHelper.getCommentById('comment-123');
            expect(commentDetail[0].is_deleted).toEqual(true);
        });
    });
});