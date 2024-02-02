import { register, login, forgotPassword, changePassword } from "../controllers/auth/auth.controller.js";
import { ProfileUpdate } from "../controllers/profile/profile.controller.js";

const routes = (router) => {
    router.post("/0auth/register", register)
    router.post("/0auth/login", login);
    router.post("/update",ProfileUpdate);
    router.post("/0auth/forgotPassword",forgotPassword);
    router.post("/0auth/changePassword/:passwordToken",changePassword);
};

export default routes;