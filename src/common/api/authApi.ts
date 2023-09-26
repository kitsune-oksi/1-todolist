import { LoginDataType } from "store/auth-reducer";
import { BaseResponseType, instance } from "common/api/common.api";

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
