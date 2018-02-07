/* eslint-env mocha */

const aws = require('aws-sdk');
const adapter = require('../src/adapter');
const expect = require('chai').expect;

aws.config.update({
    'region'            : 'local',
    'accessKeyId'       : 'local-key',
    'secretAccessKey'   : 'local-secret'
});

const dynamodb = new aws.DynamoDB({ endpoint: 'http://localhost:8000' });
const tableName = 'DynamoDVToLocalTestTable';

function createTable(){
    let params = {
        'TableName' : tableName,
        'KeySchema': [
            { 'AttributeName': 'id', 'KeyType': 'HASH' }
        ],
        'AttributeDefinitions': [
           { 'AttributeName': 'id', 'AttributeType': 'S' }
        ],
        'ProvisionedThroughput': {
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    };

    return dynamodb.createTable(params).promise();
}

function dropTable(){
    return dynamodb.deleteTable({ TableName: tableName}).promise();
}

describe('initialize dynamodb table for testing',function(){
    let dynamodbAdapter = new adapter('http://localhost:8000');

    beforeEach(function(){
        return createTable().then(() => dynamodb.waitFor('tableExists', { TableName: tableName}));
    });

    afterEach(function(){ 
        return dropTable().then(() => dynamodb.waitFor('tableNotExists', { TableName: tableName}));
    });	

    describe('initialize dynamodb adapter',function(){
        it('it should create a dynamodb adapter object', function(){
            expect(dynamodbAdapter).to.be.an('object');
        });

        it('it should have endpoint set to localhost', function(){
            expect(dynamodbAdapter.dynamodb.endpoint.host).to.eql('localhost:8000');
        });
    });	

    describe('test dynamodb adapter methods',function(){
        it('it should return test table description', function(){
            let tableDescription = dynamodbAdapter.describe(tableName);

            tableDescription.then(function(resp){               
                expect(resp.Table.TableName).to.eql(tableName);
            });
        });	

        it('it should scan the test table', function(){
            let result = dynamodbAdapter.scan(tableName);

            result.then(function(resp){	
                expect(resp.length).to.eql(0);			
            });		
        });			
    });	
});



