const mongoose = require('mongoose');
const mongoMemoryDB = require('../src/lib/mongo-memory-db');
const userService = require('../src/services/user');
const userModel = require('../src/models/User');

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await mongoMemoryDB.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await mongoMemoryDB.clear());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await mongoMemoryDB.disconnect());


/**
 * User test suite.
 */
describe('user', () => {

    it('can be created correctly', async () => {
        expect(async () => await userService.create(userComplete))
            .toBeDefined();
    });

    it('exist after being created', async () => {
        await userService.create(userComplete);
        const createdUser = await userModel.findOne();

        expect(createdUser.name)
            .toBe(userComplete.name);
    });

    it('email address is invalid',async()=>{
        expect(async () => await userService.create(userInvalidEmail))
        .rejects
        .toThrow(mongoose.Error.ValidationError);
    })

    it('require user email address',async()=>{
        expect(async () => await userService.create(userMissingEmail))
        .rejects
        .toThrow(mongoose.Error.ValidationError);
    })

    it('required min 8 and maximum 14 characters long password', async() => {
        expect(async()=> await userService.create(userInvalidPasswd))
        .rejects
        .toThrow(mongoose.Error.ValidationError);
    })

    it('require user last name',async()=>{
        expect(async () => await userService.create(userMissingLastName))
        .rejects
        .toThrow(mongoose.Error.ValidationError);
    })
});


/**
 * Valid User example.
 */
const userComplete = {
    firstName: 'Shweta',
    lastName: 'Tiwari',
    email: 'mailme@abc.com',
    password: 'nevertellyou'
};

const userInvalidEmail = {
    firstName: 'Shweta',
    lastName: 'Tiwari',
    email: 'mailmeabc.com',
    password: 'nevertellyou'
};

const userInvalidPasswd = {
    firstName: 'Shweta',
    lastName: 'Tiwari',
    email: 'mailme@abc.com',
    password: 'never'
};

const userMissingLastName = {
    firstName: 'Shweta',
    email: 'b@abccom',
    password: 'nevertellyou'
};

const userMissingEmail = {
    firstName: 'Shweta',
    lastName: 'Tiwari',
    password: 'nevertellyou'
}
