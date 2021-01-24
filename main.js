const fs = require('fs')
const csv = require('csv-parser');

let readFrom = "MOCK_DATA.csv" // the file that the data will be read from.
let outputFile = "output.json" // the file that the data will be written to.

/*
Desc: This function is responsbile for reading the data from the readFrom file, parse it, 
save it to an array, and then calls the saveToFile function.
Args: readFrom=> contains the file name to read the data from.
*/
function readPlain(readFrom) {
    let users = []
        /* 
        Here, we create a readStream using the fs module, pipe it into the csv object that will then 
        fire the data event each time a new row from the CSV file is processed. The end event is triggered 
        when all the rows from the CSV file are processed and we log a short message to the console to indicate that.
        */
    fs.createReadStream(readFrom)
        .pipe(csv())
        .on('data', (row) => {
            users.push(row);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            return saveToFile(users, outputFile)
        });
}

/*
Desc: This function is responsbile for creating an output file with the name passed 
as outputFile argument, then saving the passed array data to the created file. 
Args: dataToSave=> an array containig the users data to save, outputFile=> contains the file name to create.
*/
function saveToFile(dataToSave, outputFile) {
    let file = fs.createWriteStream(outputFile);

    file.on('error', function(err) { console.log(err) });
    file.write('[' + '\n') // addding the beginning of the json file

    // loops over the array objects and writes them to the file 
    file.write(dataToSave.map(JSON.stringify).join(",\n"))


    file.write(']') // addding the ending of the json file
    file.end();
    file.on("finish", () => {
        console.log('JSON file successfully created and populated with the passed data');
        return readJsonFile()
    }); //calling the readJsonFile function when finishing populating the file with the objects
}

/*
Desc: This function is responsbile for reading the crerated file and logs all the parsed objects. 
Args: None
*/
function readJsonFile() {
    fs.readFile(outputFile, 'utf8', (err, data) => {
        if (err) throw err
        let user = JSON.parse(data)
        console.log(user);
    });
}

readPlain(readFrom)