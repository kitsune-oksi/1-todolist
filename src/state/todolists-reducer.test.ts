import { v1 } from 'uuid'
import {
    addTodoListAC,
    changeTodoListFilterAC,
    changeTodoListTitleAC,
    FilterValueType,
    removeTodoListAC,
    todolistsReducer,
    TodoListsType
} from "./todolists-reducer";

test('correct todolist should be removed', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    const startState: Array<TodoListsType> = [
        {id: todolistId1, title: 'What to learn', filter: 'All'},
        {id: todolistId2, title: 'What to buy', filter: 'All'}
    ]

    // const endState = todolistsReducer(startState, {type: 'REMOVE-TODOLIST', id: todolistId1})
    const endState = todolistsReducer(startState, removeTodoListAC(todolistId1))

    expect(endState.length).toBe(1)
    expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let newTodolistTitle = 'New Todolist'

    const startState: Array<TodoListsType> = [
        {id: todolistId1, title: 'What to learn', filter: 'All'},
        {id: todolistId2, title: 'What to buy', filter: 'All'}
    ]

    const endState = todolistsReducer(startState, addTodoListAC(newTodolistTitle))

    expect(endState.length).toBe(3)
    expect(endState[0].title).toBe(newTodolistTitle)
})

test('correct todolist should change its name', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let newTodolistTitle = 'New Todolist'
    let todoListId = todolistId2;

    const startState: Array<TodoListsType> = [
        {id: todolistId1, title: 'What to learn', filter: 'All'},
        {id: todolistId2, title: 'What to buy', filter: 'All'}
    ]

    // const action = {
    //     type: 'CHANGE-TODOLIST-TITLE',
    //     id: todolistId2,
    //     title: newTodolistTitle
    // }

    const endState = todolistsReducer(startState, changeTodoListTitleAC(newTodolistTitle, todoListId))

    expect(endState[0].title).toBe('What to learn')
    expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
    let todolistId1 = v1()
    let todolistId2 = v1()

    let newFilter: FilterValueType = 'Completed'
    let todoListId =todolistId2

    const startState: Array<TodoListsType> = [
        {id: todolistId1, title: 'What to learn', filter: 'All'},
        {id: todolistId2, title: 'What to buy', filter: 'All'}
    ]

    const endState = todolistsReducer(startState, changeTodoListFilterAC(newFilter, todoListId))

    expect(endState[0].filter).toBe('All')
    expect(endState[1].filter).toBe(newFilter)
})