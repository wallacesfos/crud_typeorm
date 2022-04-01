import { Router } from "express";
import { UserController } from "./Controllers/UserController";
import { authenticate, authenticateAdmin, authenticateAdminDeletePatch, existsUser, validate } from "./middleweres";
import { loginSchema, registerSchema } from "./schemas";

const routes = Router();

routes.post("/users", validate(registerSchema), new UserController().createUser);
routes.post("/login",validate(loginSchema), new UserController().loginUser)
routes.get("/users", authenticate, authenticateAdmin, new UserController().findUser)
routes.get("/users/profile", authenticate, new UserController().findOneUser)
routes.delete('/users/:uuid', authenticate, existsUser, authenticateAdminDeletePatch, new UserController().deleteUser)
routes.patch('/users/:uuid', authenticate, existsUser, authenticateAdminDeletePatch, new UserController().updateUser)

export { routes }