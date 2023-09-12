import { todolistActions, TodolistDomainType, todolistReducer } from "store/todolist-reducer";
import { TaskPriorities, TaskStatuses } from "api/todolist-api";
import { taskActions, taskReducer, TasksStateType } from "store/tasks-reducer";

let startState: TasksStateType;
let startTasksState: TasksStateType;
let startTodolistsState: Array<TodolistDomainType>;

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        order: 0,
        priority: TaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: "idle",
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        todoListId: "todolistId1",
        order: 0,
        priority: TaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: "idle",
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        order: 0,
        priority: TaskPriorities.Low,
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
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        order: 0,
        priority: TaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: "idle",
      },
      {
        id: "2",
        title: "milk",
        status: TaskStatuses.Completed,
        todoListId: "todolistId2",
        order: 0,
        priority: TaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: "idle",
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        order: 0,
        priority: TaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: "idle",
      },
    ],
  };
  startTasksState = {};
  startTodolistsState = [];
});

test("correct task should be deleted from correct array", () => {
  const action = taskActions.removeTask({ taskId: "2", todolistId: "todolistId2" });

  const endState = taskReducer(startState, action);

  expect(endState).toEqual({
    todolistId1: [
      {
        id: "1",
        title: "CSS",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        order: 0,
        priority: TaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: "idle",
      },
      {
        id: "2",
        title: "JS",
        status: TaskStatuses.Completed,
        todoListId: "todolistId1",
        order: 0,
        priority: TaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: "idle",
      },
      {
        id: "3",
        title: "React",
        status: TaskStatuses.New,
        todoListId: "todolistId1",
        order: 0,
        priority: TaskPriorities.Low,
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
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        order: 0,
        priority: TaskPriorities.Low,
        addedDate: "",
        deadline: "",
        startDate: "",
        description: "",
        entityStatus: "idle",
      },
      {
        id: "3",
        title: "tea",
        status: TaskStatuses.New,
        todoListId: "todolistId2",
        order: 0,
        priority: TaskPriorities.Low,
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
  const action = taskActions.addTask({
    task: {
      id: "3",
      title: "juce",
      status: TaskStatuses.New,
      todoListId: "todolistId2",
      order: 0,
      priority: TaskPriorities.Low,
      addedDate: "",
      deadline: "",
      startDate: "",
      description: "",
      entityStatus: "idle",
    },
  });
  const endState = taskReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(3);
  expect(endState["todolistId2"].length).toBe(4);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juce");
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
});

test("status of specified task should be changed", () => {
  const action = taskActions.updateTask({
    todolistId: "todolistId2",
    taskId: "2",
    model: {
      title: "milk",
      status: TaskStatuses.New,
      priority: TaskPriorities.Low,
      deadline: "",
      startDate: "",
      description: "",
    },
  });

  const endState = taskReducer(startState, action);

  expect(endState["todolistId2"][1].status).toBe(TaskStatuses.New);
  expect(endState["todolistId2"][0].status).toBe(TaskStatuses.New);
  expect(endState["todolistId2"][2].status).toBe(TaskStatuses.New);
  expect(startState["todolistId1"]).toEqual(endState["todolistId1"]);
});

test("task`s title should be changed", () => {
  const action = taskActions.updateTask({
    todolistId: "todolistId2",
    taskId: "3",
    model: {
      title: "coffee",
      status: TaskStatuses.Completed,
      priority: TaskPriorities.Low,
      deadline: "",
      startDate: "",
      description: "",
    },
  });

  const endState = taskReducer(startState, action);

  expect(endState["todolistId2"][0].title).toBe("bread");
  expect(endState["todolistId2"][1].title).toBe("milk");
  expect(endState["todolistId2"][2].title).toBe("coffee");
  expect(startState["todolistId1"]).toEqual(endState["todolistId1"]);
});

test("new array should be added when new todolist is added", () => {
  const action = todolistActions.addTodolist({
    newTodolist: { id: "2.1", order: 0, addedDate: "", title: "newTodolist" },
  });

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
  const action = todolistActions.addTodolist({ newTodolist: { id: "2.1", title: "milk", order: 0, addedDate: "" } });

  const endTasksState = taskReducer(startTasksState, action);
  const endTodolistsState = todolistReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.newTodolist.id);
  expect(idFromTodolists).toBe(action.payload.newTodolist.id);
});

test("property with todolistId should be deleted", () => {
  const action = todolistActions.removeTodolist({ todoListId: "todolistId2" });

  const endState = taskReducer(startState, action);

  const keys = Object.keys(endState);

  expect(keys.length).toBe(1);
  expect(endState["todolistId2"]).not.toBeDefined();
});
