import { v1 } from "uuid";
import { todolistActions, TodolistDomainType, todolistReducer, todolistThunks } from "store/todolist-reducer";
import { ERequestStatus } from "./app-reducer";
import { EFilterValueType } from "common/enums/enums";

let todolistId1: string;
let todolistId2: string;
let startState: Array<TodolistDomainType>;
let newTodolistTitle: string;
let todoListId: string;
let newFilter: EFilterValueType;

beforeEach(() => {
  todolistId1 = v1();
  todolistId2 = v1();
  startState = [
    {
      id: todolistId1,
      title: "What to learn",
      filter: EFilterValueType.All,
      order: 0,
      addedDate: "",
      entityStatus: ERequestStatus.idle,
    },
    {
      id: todolistId2,
      title: "What to buy",
      filter: EFilterValueType.All,
      order: 1,
      addedDate: "",
      entityStatus: ERequestStatus.idle,
    },
  ];
  newTodolistTitle = "New Todolist";
  todoListId = todolistId2;
  newFilter = EFilterValueType.Completed;
});

test("correct todolist should be removed", () => {
  const endState = todolistReducer(
    startState,
    todolistThunks.removeTodolist.fulfilled(todolistId1, "requestId", todolistId1),
  );

  expect(endState.length).toBe(1);
  expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added", () => {
  const endState = todolistReducer(
    startState,
    todolistThunks.addTodolist.fulfilled(
      {
        id: "2.1",
        title: "New Todolist",
        order: 0,
        addedDate: "",
      },
      "requestId",
      "2.1",
    ),
  );

  expect(endState.length).toBe(3);
  expect(endState[0].title).toBe(newTodolistTitle);
});

test("correct todolist should change its name", () => {
  const endState = todolistReducer(
    startState,
    todolistThunks.changeTodolistTitle.fulfilled(
      {
        todoListId,
        newTodolistTitle,
      },
      "requestId",
      { todoListId, newTodolistTitle },
    ),
  );

  expect(endState[0].title).toBe("What to learn");
  expect(endState[1].title).toBe(newTodolistTitle);
});

test("correct filter of todolist should be changed", () => {
  const endState = todolistReducer(startState, todolistActions.changeTodolistFilter({ todoListId, newFilter }));

  expect(endState[0].filter).toBe("All");
  expect(endState[1].filter).toBe(newFilter);
});
