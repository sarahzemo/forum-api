const DetailComment = require('../DetailComment');
 
describe('DetailComment entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'Hai, ini adalah sebuah comment',
        };
 
        // Action & Assert
        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });
 
    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: [],
            username: 'Sarah Zemo',
            created_at: '2023-02-16T012',
            is_delete: false,
        };
 
        // Action & Assert
        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
 
    it('should create DetailThread entities correctly if delete flag is false', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'Hai, ini adalah sebuah thread',
            username: 'Sarah Zemo',
            created_at: '2023-02-16T012',
            is_delete: false,
        };
        // Action
        const detailComment = new DetailComment(payload);
 
        // Assert
        expect(detailComment).toBeInstanceOf(DetailComment);
        expect(detailComment.id).toEqual(payload.id);
        expect(detailComment.content).toEqual(payload.content);
        expect(detailComment.username).toEqual(payload.username);
        expect(detailComment.date).toEqual(payload.created_at);
    });

    it('should create DetailThread entities correctly if delete flag is true', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'Hai, ini adalah sebuah thread',
            username: 'Sarah Zemo',
            created_at: '2023-02-16T012',
            is_delete: true,
        };
        // Action
        const detailComment = new DetailComment(payload);
 
        // Assert
        expect(detailComment).toBeInstanceOf(DetailComment);
        expect(detailComment.id).toEqual(payload.id);
        expect(detailComment.content).toEqual('**komentar telah dihapus**');
        expect(detailComment.username).toEqual(payload.username);
        expect(detailComment.date).toEqual(payload.created_at);
    });
});