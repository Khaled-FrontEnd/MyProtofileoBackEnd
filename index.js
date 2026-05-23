let express = require("express");
let mongoose = require("mongoose");
require("dotenv").config({ debug: false, silent: true });
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const SkillsRouter = require("./routes/Skills");
const ProjectsRouter = require("./routes/Projects");
const contactLinksRouter = require("./routes/ContactLinks");

app.use("/skills", SkillsRouter);
app.use("/projects", ProjectsRouter);
app.use("/contactLinks", contactLinksRouter);

mongoose.connect(process.env.DATABASE_URL).catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server Started"));

module.exports = app;
