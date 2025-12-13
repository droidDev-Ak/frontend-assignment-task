import { Router } from "express";
import { createTask, deleteTask, displayTask, updateTask } from "../controllers/task.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const taskRouter = Router();

taskRouter.use(verifyJWT);

taskRouter
    .route("/")
    .post( createTask)
    .get(displayTask);

taskRouter
  .route("/:id")
  .patch(updateTask)
  .delete(deleteTask);

export default taskRouter;
