const container = require('../../container');
const createServer = require('../createServer');
const pool = require('../../database/postgres/pool');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableHelper = require('../../../../tests/ThreadsTableHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/comments endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await ThreadsTableHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    describe('when POST /comments', () => {
        it('should response 201 and persisted comments', async () => {
            //Arrange
            const server = await createServer(container);

            const requestAuthpayload = {
                username: 'dicoding',
                password: 'secret',
            };

            //Action            
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAuthpayload.username,
                    password: requestAuthpayload.password,
                    fullname: 'Dicoding Indonesia',
                },
            });

            const respAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAuthpayload,
            });

            const respAuthJSON = JSON.parse(respAuth.payload);

            const requestAddThreadPayload = {
                title: 'Coba thread',
                body: 'Hai ini percobaan pembuatan thread loh..',
            };

            const respAddThread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestAddThreadPayload,
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
            });

            const respAddThreadJSON = JSON.parse(respAddThread.payload);

            const requestAddCommnetsPayload = {
                content: 'Ini komentar loh',
            };

            const respAddComment = await server.inject({
                method: 'POST',
                url: `/threads/${respAddThreadJSON.data.addedThread.id}/comments`,
                payload: requestAddCommnetsPayload,
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
            });

            //Assert
            const respAddCommentsJSON = JSON.parse(respAddComment.payload);
            expect(respAddComment.statusCode).toEqual(201);
            expect(respAddCommentsJSON.status).toEqual('success');
            expect(respAddCommentsJSON.data.addedComment).toBeDefined();
            expect(respAddCommentsJSON.data.addedComment.content).toEqual(requestAddCommnetsPayload.content);
        });

        it('should response 400 when request payload not contain needed property', async () => {
            //Arrange
            const server = await createServer(container);

            const requestAuthpayload = {
                username: 'dicoding',
                password: 'secret',
            };

            //Action            
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAuthpayload.username,
                    password: requestAuthpayload.password,
                    fullname: 'Dicoding Indonesia',
                },
            });
            const respAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAuthpayload,
            });
            const respAuthJSON = JSON.parse(respAuth.payload);

            const requestAddThreadPayload = {
                title: 'Coba thread',
                body: 'Hai ini percobaan pembuatan thread loh..',
            };
            const respAddThread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestAddThreadPayload,
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
            });
            const respAddThreadJSON = JSON.parse(respAddThread.payload);

            const respAddComment = await server.inject({
                method: 'POST',
                url: `/threads/${respAddThreadJSON.data.addedThread.id}/comments`,
                payload: {},
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
            });

            //Assert
            const respAddCommentsJSON = JSON.parse(respAddComment.payload);
            expect(respAddComment.statusCode).toEqual(400);
            expect(respAddCommentsJSON.status).toEqual('fail');
            expect(respAddCommentsJSON.message).toBeDefined();
            expect(respAddCommentsJSON.message).toEqual('harus mengirimkan content');
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            //Arrange
            const server = await createServer(container);

            const requestAuthpayload = {
                username: 'dicoding',
                password: 'secret',
            };

            //Action            
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAuthpayload.username,
                    password: requestAuthpayload.password,
                    fullname: 'Dicoding Indonesia',
                },
            });
            const respAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAuthpayload,
            });
            const respAuthJSON = JSON.parse(respAuth.payload);

            const requestAddThreadPayload = {
                title: 'Coba thread',
                body: 'Hai ini percobaan pembuatan thread loh..',
            };
            const respAddThread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestAddThreadPayload,
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
            });
            const respAddThreadJSON = JSON.parse(respAddThread.payload);

            const requestAddCommnetsPayload = {
                content: 123,
            };
            const respAddComment = await server.inject({
                method: 'POST',
                url: `/threads/${respAddThreadJSON.data.addedThread.id}/comments`,
                payload: requestAddCommnetsPayload,
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
            });

            //Assert
            const respAddCommentsJSON = JSON.parse(respAddComment.payload);
            expect(respAddComment.statusCode).toEqual(400);
            expect(respAddCommentsJSON.status).toEqual('fail');
            expect(respAddCommentsJSON.message).toBeDefined();
            expect(respAddCommentsJSON.message).toEqual('content harus string');
        });

        it('should response 404 when thread not valid', async () => {
            //Arrange
            const server = await createServer(container);

            const requestAuthpayload = {
                username: 'dicoding',
                password: 'secret',
            };

            //Action            
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAuthpayload.username,
                    password: requestAuthpayload.password,
                    fullname: 'Dicoding Indonesia',
                },
            });
            const respAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAuthpayload,
            });
            const respAuthJSON = JSON.parse(respAuth.payload);

            const requestAddCommnetsPayload = {
                content: 'Ini komentar loh',
            };
            const respAddComment = await server.inject({
                method: 'POST',
                url: '/threads/xxxx/comments',
                payload: requestAddCommnetsPayload,
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
            });

            //Assert
            const respAddCommentsJSON = JSON.parse(respAddComment.payload);
            expect(respAddComment.statusCode).toEqual(404);
            expect(respAddCommentsJSON.status).toEqual('fail');
            expect(respAddCommentsJSON.message).toBeDefined();
            expect(respAddCommentsJSON.message).toEqual('Thread tidak ditemukan');
        });
    });

    describe('when DELETE /comments', () => {
        it('should response 200 and persisted comments', async () => {
            //Arrange
            const server = await createServer(container);

            const requestAuthpayload = {
                username: 'dicoding',
                password: 'secret',
            };

            //Action            
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAuthpayload.username,
                    password: requestAuthpayload.password,
                    fullname: 'Dicoding Indonesia',
                },
            });
            const respAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAuthpayload,
            });
            const respAuthJSON = JSON.parse(respAuth.payload);

            const requestAddThreadPayload = {
                title: 'Coba thread',
                body: 'Hai ini percobaan pembuatan thread loh..',
            };
            const respAddThread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestAddThreadPayload,
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
            });
            const respAddThreadJSON = JSON.parse(respAddThread.payload);
          
            const requestAddCommnetsPayload = {
                content: 'Ini komentar loh',
            };
            const respAddComment = await server.inject({
                method: 'POST',
                url: `/threads/${respAddThreadJSON.data.addedThread.id}/comments`,
                payload: requestAddCommnetsPayload,
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
            });
            const respAddCommentsJSON = JSON.parse(respAddComment.payload);

            const respDeleteComment = await server.inject({
                method: 'DELETE',
                url: `/threads/${respAddThreadJSON.data.addedThread.id}/comments/${respAddCommentsJSON.data.addedComment.id}`,
                payload: {},
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
            });

            //Assert
            const respDeleteCommentsJSON = JSON.parse(respDeleteComment.payload);
            expect(respDeleteComment.statusCode).toEqual(200);
            expect(respDeleteCommentsJSON.status).toEqual('success');
        });

        it('should response 403 when unauthorized', async () => {
            //Arrange
            const server = await createServer(container);

            const requestAuthpayload = {
                username: 'dicoding',
                password: 'secret',
            };

            //Action            
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAuthpayload.username,
                    password: requestAuthpayload.password,
                    fullname: 'Dicoding Indonesia',
                },
            });
            const respAuth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAuthpayload,
            });
            const respAuthJSON = JSON.parse(respAuth.payload);

            const requestAuthpayload2 = {
                username: 'sarahzemo',
                password: 'sarahzemo',
            };
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: requestAuthpayload2.username,
                    password: requestAuthpayload2.password,
                    fullname: 'Dicoding Indonesia',
                },
            });
            const respAuth2 = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: requestAuthpayload2,
            });
            const respAuthJSON2 = JSON.parse(respAuth2.payload);

            const requestAddThreadPayload = {
                title: 'Coba thread',
                body: 'Hai ini percobaan pembuatan thread loh..',
            };
            const respAddThread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestAddThreadPayload,
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
            });
            const respAddThreadJSON = JSON.parse(respAddThread.payload);
          
            const requestAddCommnetsPayload = {
                content: 'Ini komentar loh',
            };
            const respAddComment = await server.inject({
                method: 'POST',
                url: `/threads/${respAddThreadJSON.data.addedThread.id}/comments`,
                payload: requestAddCommnetsPayload,
                headers: {
                    Authorization: `Bearer ${respAuthJSON.data.accessToken}`,
                },
            });
            const respAddCommentsJSON = JSON.parse(respAddComment.payload);

            const respDeleteComment = await server.inject({
                method: 'DELETE',
                url: `/threads/${respAddThreadJSON.data.addedThread.id}/comments/${respAddCommentsJSON.data.addedComment.id}`,
                payload: {},
                headers: {
                    Authorization: `Bearer ${respAuthJSON2.data.accessToken}`,
                },
            });

            //Assert
            const respDeleteCommentsJSON = JSON.parse(respDeleteComment.payload);
            expect(respDeleteComment.statusCode).toEqual(403);
            expect(respDeleteCommentsJSON.status).toEqual('fail');
            expect(respDeleteCommentsJSON.message).toEqual('Anda tidak berhak mengakses resource ini');
        });
    });
});