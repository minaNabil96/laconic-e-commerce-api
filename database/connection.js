const mongoose = require("mongoose");
require("dotenv").config();

const mongoUrl = process.env.MONGODB_URL;
// .catch((err) => console.log(err));

async function main() {
  await mongoose
    .connect(`${mongoUrl}`)
    .then((resault) => {
      console.log("connect sucsses");
    })
    .catch((err) => {
      console.log(err);
    });
}

main();
