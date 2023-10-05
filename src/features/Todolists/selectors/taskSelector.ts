import { AppRootState } from "store";

export const selectTask = (id: string) => (state: AppRootState) => state.tasks[id];
