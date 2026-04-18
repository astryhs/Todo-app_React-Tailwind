import { useEffect, useState } from "react";
import { TodoItem } from "./components/TodoItem";
import { AddTodo } from "./components/AddTodo";
import { ToggleTheme } from "./components/ToggleTheme";
import { getInitialTheme } from "./helpers/getInitialTheme";
import { toggleTheme } from "./helpers/toggleTheme";

const LOCAL_STORAGE_KEY = "todos";
const API_URL = "https://69e374fa3327837a15532d7a.mockapi.io/api/v1/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    const loadInitialData = async () => {
      const savedTodos = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || "[]",
      );
      setTodos(savedTodos);

      try {
        const response = await fetch(API_URL);

        if (response.ok) {
          const serverTodos = await response.json();
          setTodos(serverTodos);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverTodos));
        }
      } catch (error) {
        console.error("Ошибка загрузки данных: ", error.message);
      }
    };
    loadInitialData();
  }, []);

  const toggleComplete = async (id) => {
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

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        //нужен метод PATCH, но мок сервис его не поддерживает
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTodo),
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
      console.error("Ошбика обновления: ", error.message);
      setTodos(todos);
    }
  };

  const onDelete = async (id) => {
    const prevTodos = todos;
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
      console.error("Ошбика удаления: ", error.message);
      setTodos(prevTodos);
    }
  };

  const onAdd = async (text, deadline) => {
    const newTodo = {
      id: `temp_${Date.now()}`,
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: deadline || null,
      order: todos.length + 1,
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });

      const createdTodo = await response.json();

      const syncedTodos = updatedTodos.map((todo) =>
        todo.id === newTodo.id ? createdTodo : todo,
      );

      setTodos(syncedTodos);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(syncedTodos));
    } catch (error) {
      console.error("Ошибка добавления: ", error.message);
      setTodos(todos);
    }
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
