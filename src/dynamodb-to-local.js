'use strict';

const pkg = require('../package.json');
const dynamo = require('./adapter');
const program = require('commander');

(async() => {
    try{
        program.version(pkg.version)
            .option('-d, --describe', 'description of DynamoDb table')
            .option('-t, --table [tableName]', 'data to be exported')
            .option('-f, --file [File]', 'file to store exported data')
            .parse(process.argv);

        let db = new dynamo();

        if(!program.table) {
            console.log('Whoa! Not so fast. Need a table name from ya?');

            program.outputHelp();

            process.exit(1);
        }else{
            if(program.describe){
                let description = await db.describe(program.table);

                console.log(`\nTable Name: ${program.table} \n`);

                console.dir(description.Table);

                process.exit(1);
            }else if(!program.file){
                console.log('Whoa! Not so fast. What do you want to call the file?');

                program.outputHelp();

                process.exit(1);
            }else{
                let db = new dynamo();

                let results = await db.scan(program.table);

                await db.write(results, program.file);
            }
        }
    }catch(err){
        console.log(err);
    }
})();