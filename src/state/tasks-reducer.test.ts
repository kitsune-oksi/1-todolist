import {addTaskAC, removeTaskAC, tasksReducer, TasksStateType, updteTaskAC} from './tasks-reducer'
import {addTodoListAC, removeTodoListAC, TodolistDomainType, todolistsReducer} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";

let startState: TasksStateType
let startTasksState: TasksStateType
let startTodolistsState: Array<TodolistDomainType>

beforeEach(()=>{
    startState = {
        'todolistId1': [
            {id: '1', title: 'CSS', status: TaskStatuses.New, todoListId: 'todolistId1', order: 0, priority: TaskPriorities.Low, addedDate: '', deadline: '', startDate: '', description: ''},
            {id: '2', title: 'JS', status: TaskStatuses.Completed, todoListId: 'todolistId1', order: 0, priority: TaskPriorities.Low, addedDate: '', deadline: '', startDate: '', description: ''},
            {id: '3', title: 'React', status: TaskStatuses.New, todoListId: 'todolistId1', order: 0, priority: TaskPriorities.Low, addedDate: '', deadline: '', startDate: '', description: ''}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', status: TaskStatuses.New, todoListId: 'todolistId2', order: 0, priority: TaskPriorities.Low, addedDate: '', deadline: '', startDate: '', description: ''},
            {id: '2', title: 'milk', status: TaskStatuses.Completed, todoListId: 'todolistId2', order: 0, priority: TaskPriorities.Low, addedDate: '', deadline: '', startDate: '', description: ''},
            {id: '3', title: 'tea', status: TaskStatuses.New, todoListId: 'todolistId2', order: 0, priority: TaskPriorities.Low, addedDate: '', deadline: '', startDate: '', description: ''}
        ]
    }
    startTasksState = {}
    startTodolistsState = []
})

test('correct task should be deleted from correct array', () => {
    const action = removeTaskAC('2', 'todolistId2')

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {id: '1', title: 'CSS', status: TaskStatuses.New, todoListId: 'todolistId1', order: 0, priority: TaskPriorities.Low, addedDate: '', deadline: '', startDate: '', description: ''},
            {id: '2', title: 'JS', status: TaskStatuses.Completed, todoListId: 'todolistId1', order: 0, priority: TaskPriorities.Low, addedDate: '', deadline: '', startDate: '', description: ''},
            {id: '3', title: 'React', status: TaskStatuses.New, todoListId: 'todolistId1', order: 0, priority: TaskPriorities.Low, addedDate: '', deadline: '', startDate: '', description: ''}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', status: TaskStatuses.New, todoListId: 'todolistId2', order: 0, priority: TaskPriorities.Low, addedDate: '', deadline: '', startDate: '', description: ''},
            {id: '3', title: 'tea', status: TaskStatuses.New, todoListId: 'todolistId2', order: 0, priority: TaskPriorities.Low, addedDate: '', deadline: '', startDate: '', description: ''}
        ]
    })
})

test('correct task should be added to correct array', () => {
    const action = addTaskAC({id: '3', title: 'juce', status: TaskStatuses.New, todoListId: 'todolistId2', order: 0, priority: TaskPriorities.Low, addedDate: '', deadline: '', startDate: '', description: ''})

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juce')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {
    const action = updteTaskAC( 'todolistId2', '2',{title: 'milk', status: TaskStatuses.Completed, priority: TaskPriorities.Low, deadline: '', startDate: '', description: ''})

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
    expect(endState['todolistId2'][2].status).toBe(TaskStatuses.New)
    expect(startState['todolistId1']).toEqual(endState['todolistId1'])
})

test('task`s title should be changed', () => {
    const action = updteTaskAC('todolistId2', '3', {title: 'coffee', status: TaskStatuses.Completed, priority: TaskPriorities.Low, deadline: '', startDate: '', description: ''})

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][0].title).toBe('bread')
    expect(endState['todolistId2'][1].title).toBe('milk')
    expect(endState['todolistId2'][2].title).toBe('coffee')
    expect(startState['todolistId1']).toEqual(endState['todolistId1'])
})

test('new array should be added when new todolist is added', () => {
    const action = addTodoListAC('new todolist')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)
    const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3)
    expect(endState[newKey]).toEqual([])
})

test('ids should be equals', () => {
    const action = addTodoListAC('new todolist')

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.newTodoListId)
    expect(idFromTodolists).toBe(action.payload.newTodoListId)
})

test('property with todolistId should be deleted', () => {
    const action = removeTodoListAC('todolistId2')

    const endState = tasksReducer(startState, action)


    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})
