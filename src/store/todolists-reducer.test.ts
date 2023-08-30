import { v1 } from 'uuid'
import {
    addTodoListAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    FilterValueType,
    removeTodoListAC, TodolistDomainType,
    todolistsReducer,
} from "./todolists-reducer";

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType>
let newTodolistTitle: string
let todoListId: string
let newFilter: FilterValueType

beforeEach(()=> {
    todolistId1 = v1()
    todolistId2 = v1()
    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'All', order: 0, addedDate: '', entityStatus: 'idle'},
        {id: todolistId2, title: 'What to buy', filter: 'All', order: 1, addedDate: '', entityStatus: 'idle'}
    ]
    newTodolistTitle = 'New Todolist'
    todoListId = todolistId2
    newFilter = 'Completed'
})

test('correct todolist should be removed', () => {
    const endState = todolistsReducer(startState, removeTodoListAC(todolistId1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
    const endState = todolistsReducer(startState, addTodoListAC({id: '2.1', title: 'New Todolist', order: 0, addedDate: ''}))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(newTodolistTitle)
})

test('correct todolist should change its name', () => {

    const endState = todolistsReducer(startState, changeTodoListTitleAC(newTodolistTitle, todoListId))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
    const endState = todolistsReducer(startState, changeTodoListFilterAC(newFilter, todoListId))

    expect(endState[0].filter).toBe('All')
    expect(endState[1].filter).toBe(newFilter)
})