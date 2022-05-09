
const ProvenDB = require('@southbanksoftware/provendb-node-driver').Database;
const { MongoClient } = require('mongodb');

const URL = process.env.PROVENDB_URI;
const DATABASE = process.env.PROVENDB_DATABASE;
let connection;
let db;
let pdb;
let result;

async function proveMyDB() {
    connection = await MongoClient.connect(process.env.PDB_PROXY_URI);
    db = await connection.db(DATABASE);

    // ProvenDB Logic goes here...
    pdb = new ProvenDB(db);                           // Create ProvenDB Client.
    collection = pdb.collection('proven_staff');      // Get collection.
    result = await pdb.getVersion();                  // Check current version.
    console.log(`Version was ${result.version}.`);
    result = await collection.insertOne({             // Add a document.
        name: 'Michael',
        role: 'Code Monkey'
    });
    console.log(`Inserted a document.`);
    result = await pdb.getVersion();                  // Check version again.
    console.log(`Version is now ${result.version}.`);

    // Document History
    result = await collection.update(
        { name: 'Michael', role: 'Code Monkey' },
        { $set: { role: 'Chief Code Monkey' } }
    );
    console.log(`Updated ${result.result.nModified} document/s.`);
    // Fetch the history of that document.
    result = await pdb.docHistory('proven_staffe', { name: 'Michael' });
    console.log(
        `History for document: ${JSON.stringify(result.docHistory[0], null, 4)}`
    );

    // Create a Proof
    result = await pdb.submitProof();
    console.log(`Submitted Proof: ${JSON.stringify(result, null, 4)}`);

    // View a Proof.
    result = await pdb.getProof();
    console.log(`Latest Proof Is: ${JSON.stringify(result, null, 4)}`);
}
proveMyDB()