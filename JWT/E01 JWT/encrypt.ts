// import
import bcrypt from "bcryptjs" // + @types
import {MongoClient, ObjectId}  from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

// mongo
const connectionString:string = process.env.connectionStringLocal;
const dbname = process.env.DBNAME

encrypt()

async function encrypt(){
	const client = new MongoClient(connectionString);
	await client.connect().catch(function () {
		console.log("503 - Database connection error");
	});
	const collection = client.db(dbname).collection('mails');
	let rq = collection.find().project({"password":1}).toArray()
	rq.then(function(data){
		let promises = []
		for(let item of data){
			// Controlo se la password corrente è già in formato bcrypt
			// Le stringhe bcrypt inizano con $2[ayb]$10$ e sono lunghe 60
			let regex = new RegExp("^\\$2[ayb]\\$10\\$.{53}$");
		
		
		
	})
	rq.catch(function(err){
		console.log("Errore lettura record " + err.message)
		client.close();
	})
}
