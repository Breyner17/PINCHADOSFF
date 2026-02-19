require("node:dns/promises").setServers([
  "1.1.1.1",
  "8.8.8.8"
]);

require("dotenv").config();

const express = require("express");
const connectDB = require("../config/db");

const app = express();

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));


connectDB();

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
