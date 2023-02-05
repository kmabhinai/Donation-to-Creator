const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on('uncaughtException', err => {
    console.log(err.name, err.message);
    process.exit(1);
});

//Uses the env variables
dotenv.config({ path: './config.env' });
const app = require("./app");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(con => console.log("Db connected"));


const port = 3000;
const server = app.listen(port, () => {
    console.log(`App running on prt ${port}....`);
});

process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});