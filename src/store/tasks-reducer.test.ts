import { TodolistDomainType, todolistReducer, todolistThunks } from "store/todolist-reducer";
import { ETaskPriorities, ETaskStatuses } from "common/enums/enums";
import { taskReducer, TasksStateType, taskThunks } from "store/tasks-reducer";
import { ERequestStatus } from "./app-reducer";

let startState: TasksStateType;
let startTasksState: TasksStateType;
let startTodolistsState: Array<TodolistDomainType>;

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: ETaskStatuses.New,
        todoListId: "todolistId1",
        order: 0,
        priority: ETaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: ERequestStatus.idle,
      },
      {
        id: "2",
        title: "JS",
        status: ETaskStatuses.Completed,
        todoListId: "todolistId1",
        order: 0,
        priority: ETaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: ERequestStatus.idle,
      },
      {
        id: "3",
        title: "React",
        status: ETaskStatuses.New,
        todoListId: "todolistId1",
        order: 0,
        priority: ETaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: ERequestStatus.idle,
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: ETaskStatuses.New,
        todoListId: "todolistId2",
        order: 0,
        priority: ETaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: ERequestStatus.idle,
      },
      {
        id: "2",
        title: "milk",
        status: ETaskStatuses.Completed,
        todoListId: "todolistId2",
        order: 0,
        priority: ETaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: ERequestStatus.idle,
      },
      {
        id: "3",
        title: "tea",
        status: ETaskStatuses.New,
        todoListId: "todolistId2",
        order: 0,
        priority: ETaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: ERequestStatus.idle,
      },
    ],
  };
  startTasksState = {};
  startTodolistsState = [];
});

test("correct task should be deleted from correct array", () => {
  const action = taskThunks.removeTask.fulfilled({ taskId: "2", todolistId: "todolistId2" }, "requestId", {
    taskId: "2",
    todolistId: "todolistId2",
  });

  const endState = taskReducer(startState, action);

  expect(endState).toEqual({
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: ETaskStatuses.New,
        todoListId: "todolistId1",
        order: 0,
        priority: ETaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: "idle",
      },
      {
        id: "2",
        title: "JS",
        status: ETaskStatuses.Completed,
        todoListId: "todolistId1",
        order: 0,
        priority: ETaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: "idle",
      },
      {
        id: "3",
        title: "React",
        status: ETaskStatuses.New,
        todoListId: "todolistId1",
        order: 0,
        priority: ETaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: "idle",
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "bread",
        status: ETaskStatuses.New,
        todoListId: "todolistId2",
        order: 0,
        priority: ETaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: "idle",
      },
      {
        id: "3",
        title: "tea",
        status: ETaskStatuses.New,
        todoListId: "todolistId2",
        order: 0,
        priority: ETaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: "idle",
      },
    ],
  });
});

test("correct task should be added to correct array", () => {
  const action = taskThunks.addTask.fulfilled(
    {
      id: "3",
      title: "juce",
      status: ETaskStatuses.New,
      todoListId: "todolistId2",
      order: 0,
      priority: ETaskPriorities.Low,
      addedDate: "",
      deadline: "",
      startDate: "",
      description: "",
      entityStatus: ERequestStatus.idle,
    },
    "requestId",
    { todolistId: "todolistId1", titleNewTask: "juce" },
  );
  const endState = taskReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juce");
  expect(endState["todolistId2"][0].status).toBe(ETaskStatuses.New);
});

//1 параметр (payload) - то, что thunk возвращает
// 2 параметр (meta данные) - нужны только для тестов, чтобы они отрабатывали, хотя эти данные мы не используем. В meta данные передаем 'requestId'
// 3 параметр(arg) - то, что thunk принимает. В нашем случае это todolistId
test("status of specified task should be changed", () => {
  const action = taskThunks.updateTask.fulfilled(
    {
      todolistId: "todolistId2",
      taskId: "2",
      model: {
        title: "milk",
        status: ETaskStatuses.New,
        priority: ETaskPriorities.Low,
        deadline: "",
        startDate: "",
        description: "",
      },
    },
    "requestId",
    {
      todolistId: "todolistId2",
      taskId: "2",
      newData: {
        title: "milk",
        description: "",
        status: ETaskStatuses.New,
        priority: ETaskPriorities.Low,
        startDate: "",
        deadline: "",
      },
    },
  );

  const endState = taskReducer(startState, action);

  expect(endState["todolistId2"][1].status).toBe(ETaskStatuses.New);
  expect(endState["todolistId2"][0].status).toBe(ETaskStatuses.New);
  expect(endState["todolistId2"][2].status).toBe(ETaskStatuses.New);
  expect(startState["todolistId1"]).toEqual(endState["todolistId1"]);
});

test("task`s title should be changed", () => {
  const action = taskThunks.updateTask.fulfilled(
    {
      todolistId: "todolistId2",
      taskId: "3",
      model: {
        title: "coffee",
        status: ETaskStatuses.Completed,
        priority: ETaskPriorities.Low,
        deadline: "",
        startDate: "",
        description: "",
      },
    },
    "requestId",
    {
      todolistId: "todolistId2",
      taskId: "2",
      newData: {
        title: "milk",
        description: "",
        status: ETaskStatuses.New,
        priority: ETaskPriorities.Low,
        startDate: "",
        deadline: "",
      },
    },
  );

  const endState = taskReducer(startState, action);

  expect(endState["todolistId2"][0].title).toBe("bread");
  expect(endState["todolistId2"][1].title).toBe("milk");
  expect(endState["todolistId2"][2].title).toBe("coffee");
  expect(startState["todolistId1"]).toEqual(endState["todolistId1"]);
});

test("new array should be added when new todolist is added", () => {
  const action = todolistThunks.addTodolist.fulfilled(
    {
      id: "2.1",
      title: "milk",
      order: 0,
      addedDate: "",
    },
    "requestId",
    "2.1",
  );

  const endState = taskReducer(startState, action);

  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k != "todolistId1" && k != "todolistId2");
  if (!newKey) {
    throw Error("new key should be added");
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});

test("ids should be equals", () => {
  const action = todolistThunks.addTodolist.fulfilled(
    {
      id: "2.1",
      title: "milk",
      order: 0,
      addedDate: "",
    },
    "requestId",
    "2.1",
  );

  const endTasksState = taskReducer(startTasksState, action);
  const endTodolistsState = todolistReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.id);
  expect(idFromTodolists).toBe(action.payload.id);
});

test("property with todolistId should be deleted", () => {
  const action = todolistThunks.removeTodolist.fulfilled("todolistId2", "requestId", "todolistId2");

  const endState = taskReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});
