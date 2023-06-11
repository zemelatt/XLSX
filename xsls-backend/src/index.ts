import express from "express";

import taskRoute from "./routes/taskRoute";
import bodyParser from "body-parser";
import fileupload from "express-fileupload";

const port = 8081; // default port to listen
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload({ createParentPath: true }));
app.use(bodyParser.json());

app.use(taskRoute);

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
