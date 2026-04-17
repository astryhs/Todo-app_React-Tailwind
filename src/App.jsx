import { useState } from "react";
import { TodoItem } from "./components/TodoItem";
import { AddTodo } from "./components/AddTodo";
import { ToggleTheme } from "./components/ToggleTheme";
import { getInitialTheme } from "./helpers/getInitialTheme";
import { toggleTheme } from "./helpers/toggleTheme";

function App() {
  const [todos, setTodos] = useState([]);
  const [theme, setTheme] = useState(getInitialTheme());

  const toggleComplete = (id) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);

    if (!todoToUpdate) return;

    const updatedTodo = {
      ...todoToUpdate,
      completed: !todoToUpdate.completed,
    };

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? updatedTodo : todo,
    );

    setTodos(updatedTodos);
  };

  const onDelete = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const onAdd = (text, deadline) => {
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: deadline || null,
      order: todos.length + 1,
    };
    setTodos([...todos, newTodo]);
  };

  return (
    <>
      <div
        data-theme={theme}
        className="flex flex-col min-h-screen justify-center items-center bg-page-light dark:bg-page-dark p-6"
      >
        <ToggleTheme toggleTheme={() => toggleTheme(setTheme)} theme={theme} />
        <div className="mx-auto flex flex-col gap-3">
          <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-purple-500">
              My TODO app
            </span>
          </h1>
          <AddTodo onAdd={onAdd} />
          <div className="flex flex-col gap-3">
            {todos.map((todo) => (
              <TodoItem
                todo={todo}
                key={todo.id}
                onDelete={onDelete}
                onToggleComplete={toggleComplete}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
