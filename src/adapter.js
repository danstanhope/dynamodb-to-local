'use strict';

const fs = require('fs');
const aws = require('aws-sdk');
const path = require('path');
const json2csv = require('json2csv');

class DynamoDbAdapter {
    constructor(endpoint) {
        aws.config.loadFromPath(path.resolve(__dirname, 'config.json'));

        this.dynamodb = endpoint ? new aws.DynamoDB({ endpoint : endpoint }) : new aws.DynamoDB();
    }

    async describe(tableName) {
        return new Promise((resolve, reject) => {
            this.dynamodb.describeTable({ TableName: tableName }, (error, response) => {
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve(response);
                }
            });
        });  
    }

    async scan(tableName) {
        return new Promise((resolve, reject) => {
            this.dynamodb.scan({ TableName: tableName }, (error, response) => {
                if (error) {
                    reject(new Error(error));
                } else {
                    resolve(DynamoDbAdapter.unmarshall(response));
                }
            });
        });
    }

    async write(results, fileName) {
        results = json2csv({ data : results });

        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(fileName);

            file.write(results);

            file.end();

            file.on('finish', () => {
                console.log('Woot! Woot! Your file has been created.');
            });

            file.on('error', reject);
        });
    }

    static unmarshall(obj) {
        if (obj.Items && Array.isArray(obj.Items)) {
            let items = [];

            for (let i = 0; i < obj.Items.length; i++) {
                items.push(aws.DynamoDB.Converter.unmarshall(obj.Items[i]));
            }

            return items;
        } else if (obj.Item) {
            let item = aws.DynamoDB.Converter.unmarshall(obj.Item);

            return item;
        }
    }
}

module.exports = DynamoDbAdapter;