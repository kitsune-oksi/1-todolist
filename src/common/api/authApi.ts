import { instance } from "common/api/commonApi";
import { BaseResponse, LoginData } from "common/api";

export const authAPI = {
  login(values: LoginData) {
    return instance.post<BaseResponse<{ userId: number }>>("auth/login", values);
  },
  me() {
    return instance.get<BaseResponse<{ id: number; email: string; login: string }>>("auth/me");
  },
  logout() {
    return instance.delete<BaseResponse>("auth/login");
  },
};
