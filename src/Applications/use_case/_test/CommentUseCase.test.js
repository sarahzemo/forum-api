const CommentUseCase = require('../CommentUseCase');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');
const ThreadsRespository = require('../../../Domains/threads/ThreadsRespository');

describe('CommentUseCase executeAddComment', () => {
    it('should orchestrating the add comment actijon correctly', async () => {
        //Arrange
        const useCasePayload = {
            content: 'Ga tau mau comment apa',
            threadId: 'thread-123',
            owner: 'user-ERoTx8AcR4mTNsd4BT6R4'
        };

        const expectedAddedComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.owner,
        });

        const expectedGetTheads = {
            id: 'thread-123',
            title: 'Judul Thread',
            owner: 'user-1111',
        };

        const mockCommentRepository = new CommentRepository();
        const mockThreadsRespository = new ThreadsRespository();

        mockThreadsRespository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(expectedGetTheads));
        mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedComment));

        const commentUseCase = new CommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadsRespository
        });

        //Action
        const addedComment = await commentUseCase.executeAddComment(useCasePayload);

        //Assert
        expect(addedComment).toStrictEqual(expectedAddedComment);
        expect(mockThreadsRespository.getThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment(useCasePayload));
    });
});

describe('CommentUseCase executeDeleteCommment', () => {
    it('should orchestrating the delete comment actijon correctly', async () => {
        //Arrange
        const useCasePayload = new DeleteComment({
            commentId: 'comment-123',
            threadId: 'thread-123',
            owner: 'user-ERoTx8AcR4mTNsd4BT6R4'
        });

        const expectedGetTheads = {
            id: 'thread-123',
            title: 'Judul Thread',
            owner: 'user-1111',
        };

        const mockCommentRepository = new CommentRepository();
        const mockThreadsRespository = new ThreadsRespository();

        mockThreadsRespository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(expectedGetTheads));
        mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.deleteCommentByID = jest.fn().mockImplementation(() => Promise.resolve());

        const commentUseCase = new CommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadsRespository
        });

        //Action & Assert
        await expect(commentUseCase.executeDeleteCommment(useCasePayload)).resolves.not.toThrowError();
        expect(mockThreadsRespository.getThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
        expect(mockCommentRepository.deleteCommentByID).toBeCalledWith(useCasePayload.commentId);
    });
});
