import { LoginDataType } from "store/auth-reducer";
import { instance } from "common/api/common.api";
import { BaseResponseType } from "common/api/commonTypes";

export const authAPI = {
  login(values: LoginDataType) {
    return instance.post<BaseResponseType<{ userId: number }>>("auth/login", values);
  },
  me() {
    return instance.get<BaseResponseType<{ id: number; email: string; login: string }>>("auth/me");
  },
  logout() {
    return instance.delete<BaseResponseType>("auth/login");
  },
};
