const DetailThread = require('../DetailThread');

describe('DetailThread entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'Judul Thread',
            body: 'Hai, ini adalah sebuah thread',
            username: 'Sarah Zemo'
        };

        // Action & Assert
        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            title: 'Judul Thread',
            body: 'Hai, ini adalah sebuah thread',
            username: 'Sarah Zemo',
            create_at: '2023-02-16T012',
        };

        // Action & Assert
        expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create DetailThread entities correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-123',
            title: 'Judul Thread',
            body: 'Hai, ini adalah sebuah thread',
            username: 'Sarah Zemo',
            create_at: '2023-02-16T012',
        };

        // Action
        const detailThread = new DetailThread(payload);

        // Assert
        expect(detailThread).toBeInstanceOf(DetailThread);
        expect(detailThread.id).toEqual(payload.id);
        expect(detailThread.title).toEqual(payload.title);
        expect(detailThread.body).toEqual(payload.body);
        expect(detailThread.username).toEqual(payload.username);
        expect(detailThread.date).toEqual(payload.create_at);
    });
});