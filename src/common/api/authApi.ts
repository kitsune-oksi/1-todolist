import { LoginDataType } from "../../store/auth-reducer";
import { instance } from "./common.api";
import { ResponseType } from "./common.api";

export const authAPI = {
  login(values: LoginDataType) {
    return instance.post<ResponseType<{ userId: number }>>("auth/login", values);
  },
  me() {
    return instance.get<ResponseType<{ id: number; email: string; login: string }>>("auth/me");
  },
  logout() {
    return instance.delete<ResponseType>("auth/login");
  },
};
