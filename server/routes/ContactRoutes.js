import {Router} from "express"
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getContactForDMList, searchContacts,getAllContacts} from "../controllers/ContactController.js"
const contactsRoutes=Router();

contactsRoutes.post("/search",verifyToken,searchContacts)
contactsRoutes.get("/get-contacts-for-dm",verifyToken,getContactForDMList)
contactsRoutes.get("/get-all-contacts",verifyToken,getAllContacts)
export default contactsRoutes