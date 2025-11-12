import { request } from "@/lib/api/axios-client";
import { USER_ROUTES } from "../routes.constants";

export const signUpUser = async () => {
  console.log("🚀 ~ signUpUser ~ USER_ROUTES.SIGNUP:", USER_ROUTES.SIGNUP);
  const res = await request("POST", USER_ROUTES.SIGNUP, {
    data: {
      user: "first user",
    },
  });
  console.log("🚀 ~ signUpUser ~ res:", res);
};
