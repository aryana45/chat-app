import { createAuthSlice } from "./slices/auth-slice.js";
import {create} from "zustand"
import { createChatSlice } from "./slices/chat-slice.js";
export const useAppStore=create()((...a)=>({
    ...createAuthSlice(...a),
    ...createChatSlice(...a)
}))