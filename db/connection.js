const mongoose = require("mongoose");

const URL = process.env.MONGO_URL;

mongoose.connect(
    URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => console.log("Mongo DB Connected"))
    .catch((error) => {
        console.log(error);
    })