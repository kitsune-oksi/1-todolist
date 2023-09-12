import { AppRootStateType } from "store/store";

export const selectTask = (id: string) => (state: AppRootStateType) => state.tasks[id];
