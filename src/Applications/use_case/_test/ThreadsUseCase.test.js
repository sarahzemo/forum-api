const ThreadsUseCase = require('../ThreadsUseCase');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const detailThread = require('../../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const ThreadsRespository = require('../../../Domains/threads/ThreadsRespository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('ThreadsUseCase', () => {
    it('should orchestrating the add thread actijon correctly', async () => {
        //Arrange
        const useCasePayload = {
            title: 'Judul Thread',
            body: 'Hai, ini adalah sebuah thread',
            owner: 'user-1111',
        };

        const expectedAddedThread = new AddedThread({
            id: 'thread-123',
            title: useCasePayload.title,
            owner: useCasePayload.owner,
        });

        const mockThreadsRespository = new ThreadsRespository();

        mockThreadsRespository.saveThread = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedThread));

        const threadUseCase = new ThreadsUseCase({
            threadsRespository: mockThreadsRespository,
        });

        //Action
        const addedThread = await threadUseCase.executeAddThread(useCasePayload);

        //Assert
        expect(addedThread).toStrictEqual(expectedAddedThread);
        expect(mockThreadsRespository.saveThread).toBeCalledWith(new AddThread(useCasePayload));
    });

    it('should orchestrating get detail thread actijon correctly', async () => {
        //Arrange
        const threadId = 'thread-123';

        const expectedDetailThread = new detailThread({
            id: 'thread-123',
            title: 'Judul Thread',
            body: 'Hai, ini adalah sebuah thread',
            username: 'Sarah Zemo',
            create_at: '2023-02-16T012',
        });

        const expectedDetailComment = [
            new DetailComment({
                id: 'comment-123',
                content: 'Hai, ini adalah sebuah thread',
                username: 'Sarah Zemo',
                created_at: '2023-02-16T012',
                is_delete: false,
            })];

        const mockThreadsRespository = new ThreadsRespository();
        const mockCommentRepository = new CommentRepository();

        mockThreadsRespository.getDetailThreadById = jest.fn().mockImplementation(() => Promise.resolve(new detailThread({
            id: 'thread-123',
            title: 'Judul Thread',
            body: 'Hai, ini adalah sebuah thread',
            username: 'Sarah Zemo',
            create_at: '2023-02-16T012',
        })));
        mockCommentRepository.detailCommentByThreadID = jest.fn().mockImplementation(() => Promise.resolve([
            new DetailComment({
            id: 'comment-123',
            content: 'Hai, ini adalah sebuah thread',
            username: 'Sarah Zemo',
            created_at: '2023-02-16T012',
            is_delete: false,
        })]));

        const threadUseCase = new ThreadsUseCase({
            threadsRespository: mockThreadsRespository,
            commentRepository: mockCommentRepository,
        });

        //Action
        const DetailThread = await threadUseCase.executeDetailThread(threadId);
        
        //Assert
        expect(DetailThread).toStrictEqual({ ...expectedDetailThread, comments: expectedDetailComment });
        expect(mockThreadsRespository.getDetailThreadById).toBeCalledWith(threadId);
        expect(mockCommentRepository.detailCommentByThreadID).toBeCalledWith(threadId);
    });
});

