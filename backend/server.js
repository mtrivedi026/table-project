const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const tableRoutes = require("./routes/tableRoutes");
app.use("/api/table", tableRoutes);

app.listen(5000, () => {
  console.log("🔥 Backend running on http://localhost:5000");
});