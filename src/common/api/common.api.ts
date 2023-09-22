import axios from "axios";
import { EResultCode } from "../enums/enums";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "1690be4a-0b2f-42a4-9e71-302df103dbfe",
  },
});

//types
export type ResponseType<D = {}> = {
  resultCode: EResultCode;
  messages: Array<string>;
  data: D;
};
