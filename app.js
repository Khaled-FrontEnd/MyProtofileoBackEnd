let express = require("express");
let mongoose = require("mongoose");
require("dotenv").config({ debug: false, silent: true });
const router = express.Router();

const app = express();
app.use(cors());
const SkillsRouter = require("./routes/Skills");
const ProjectsRouter = require("./routes/Projects")
const contactLinksRouter = require("./routes/ContactLinks")

const PORT = process.env.PORT || 3000;
app.use(express.json());


mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server Started");
    });
  })
  .catch((err) => console.log(err));

app.use("/skills", SkillsRouter);
app.use("/projects", ProjectsRouter);
app.use("/contactLinks", contactLinksRouter);