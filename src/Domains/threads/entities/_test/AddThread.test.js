const AddThread = require('../AddThread');

describe('AddThread entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'test',
            body: 'test',
        };

        // Action & Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            title: 123,
            body: 'test',
            owner: 'test',
        };

        // Action & Assert
        expect(() => new AddThread(payload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddThread entities correctly', () => {
        // Arrange
        const payload = {
            title: 'test',
            body: 'test',
            owner: 'test',
        };

        // Action
        const addThread = new AddThread(payload);

        // Assert
        expect(addThread).toBeInstanceOf(AddThread);
        expect(addThread.title).toEqual(payload.title);
        expect(addThread.body).toEqual(payload.body);
        expect(addThread.owner).toEqual(payload.owner);

    });
});