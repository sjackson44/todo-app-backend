import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

const TodoList: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState<string>('');
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
    const [editedTitle, setEditedTitle] = useState<string>('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://35.173.7.161/todos');
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const addTodo = async () => {
        if (newTodo.trim() === '') return;
        try {
            const response = await axios.post('http://35.173.7.161/todos', { title: newTodo, completed: false });
            setTodos(prevTodos => [...prevTodos, response.data]);
            setNewTodo('');
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const updateTodo = async (todo: Todo) => {
        try {
            const response = await axios.put(`http://35.173.7.161/todos/${todo.id}`, todo);
            setTodos(prevTodos => prevTodos.map(t => (t.id === todo.id ? response.data : t)));
            setEditingTodoId(null);
            setEditedTitle('');
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const deleteTodo = async (id: number) => {
        try {
            await axios.delete(`http://35.173.7.161/todos/${id}`);
            setTodos(prevTodos => prevTodos.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const toggleComplete = (todo: Todo) => {
        updateTodo({ ...todo, completed: !todo.completed });
    };

    const handleEdit = (todo: Todo) => {
        setEditingTodoId(todo.id);
        setEditedTitle(todo.title);
    };

    const handleSave = (id: number) => {
        const updatedTodo = todos.find(todo => todo.id === id);
        if (updatedTodo) {
            updateTodo({ ...updatedTodo, title: editedTitle });
        }
    };

    return (
        <div>
            <div className="flex mb-4">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="todo-input"
                    placeholder="New Todo"
                    autoComplete="off"
                />
                <button onClick={addTodo} className="todo-button">Add</button>
            </div>
            <ul className="list-none p-0">
                {todos.map(todo => (
                    <li key={todo.id} className="todo-item">
                        {editingTodoId === todo.id ? (
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="todo-input flex-grow"
                                />
                                <button
                                    onClick={() => handleSave(todo.id)}
                                    className="todo-item-button todo-item-save ml-2"
                                >
                                    Save
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <span
                                    onClick={() => toggleComplete(todo)}
                                    className={`todo-item-text ${todo.completed ? 'line-through' : ''}`}
                                >
                                    {todo.title}
                                </span>
                                <button
                                    onClick={() => handleEdit(todo)}
                                    className="todo-item-button todo-item-edit ml-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="todo-item-button todo-item-delete ml-2"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
