import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tqnkhjj.mongodb.net/`);

export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("You successfully connected to MongoDB!")
        return client;
    }
    catch (err) {
        console.dir(err)
    }
}

const conntectMongoDB = await connectToMongoDB();
const db = conntectMongoDB.db("simple_curd_server");
const users = db.collection("user");


app.get("/", (req, res) => {
    res.send("Hello world curd server run");
})

app.get("/users", async (req, res) => {
    const cursor = users.find({});
    const allUsers = await cursor.toArray();
    res.send(allUsers)
})

app.get("/users/:id", async (req, res) => {
    console.log("params in the server", req.params.id);
    const id = req.params.id;

    const query = { _id: new ObjectId(id) };

    const result = await users.findOne(query);
    res.send(result);

})

app.delete("/users/:id", async (req, res) => {
    const id = req.params.id;

    const query = { _id: new ObjectId(id) };

    const result = await users.deleteOne(query);

    res.send(result);
})

app.patch("/users/:id", async (req, res) => {
    const id = req.params.id;
    const updateUser = req.body;

    console.log("update user with ID", id, "with data", updateUser);

    const filter = { _id: new ObjectId(id) };

    const options = { upsert: true };

    const updateDoc = {
        $set: {
            name: updateUser.name,
            email: updateUser.email,
        }
    };

    const result = await users.updateOne(filter, updateDoc, options);

    res.send(result);


})

app.post("/users", async (req, res) => {
    const newUser = req.body;
    console.log("Adding new user", newUser);
    const result = await users.insertOne(newUser);
    res.send(result);
})

app.listen(PORT, () => {
    console.log(`Curd server run in port ${PORT}`)
})