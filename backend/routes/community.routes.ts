import { Router } from "express";
import {
  applyOrDenyFriendRequest,
  getUsersQueried,
  sendFriendRequest,
} from "../controllers/community.controller.js";

const communityRouter = Router();

communityRouter.post("/users-queried", getUsersQueried);
communityRouter.post("/send-friend-request", sendFriendRequest);
communityRouter.patch("/accept-deny-friend-request", applyOrDenyFriendRequest);

export default communityRouter;
