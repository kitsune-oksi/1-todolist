import React, { useCallback } from "react";
import { ButtonWithMemo } from "common/components";
import { EFilterValue } from "common/enums";
import { todolistActions } from "store/todolist-reducer";
import { useAppDispatch } from "store/store.hooks";

type Props = {
  id: string;
  filter: EFilterValue;
};

export const TodolistFilterButtons: React.FC<Props> = ({ id, filter }) => {
  const dispatch = useAppDispatch();

  const changeFilterHandler = useCallback(
    (newFilter: EFilterValue) => {
      dispatch(todolistActions.changeTodolistFilter({ todoListId: id, newFilter }));
    },
    [id],
  );

  return (
    <div>
      <ButtonWithMemo
        onClick={useCallback(() => changeFilterHandler(EFilterValue.All), [])}
        variant={filter === EFilterValue.All ? "outlined" : "text"}
        color={"inherit"}
        title={EFilterValue.All}
      />
      <ButtonWithMemo
        onClick={useCallback(() => changeFilterHandler(EFilterValue.Active), [])}
        variant={filter === EFilterValue.Active ? "outlined" : "text"}
        color={"primary"}
        title={EFilterValue.Active}
      />
      <ButtonWithMemo
        onClick={useCallback(() => changeFilterHandler(EFilterValue.Completed), [])}
        variant={filter === EFilterValue.Completed ? "outlined" : "text"}
        color={"secondary"}
        title={EFilterValue.Completed}
      />
    </div>
  );
};
