import express from "express";

import * as taskControllers from "../controllers/taskControllers";

const taskRoute = express.Router();

taskRoute.post("/uploadTasks", taskControllers.uploadTaskSheet);
taskRoute.get("/tasks", taskControllers.getAllTasks);
taskRoute.get("/tasks/:id", taskControllers.getTask);
taskRoute.delete("/tasks/:id", taskControllers.deleteTask);
taskRoute.put("/updateTask", taskControllers.updateTask);
export default taskRoute;
