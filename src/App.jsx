import { useEffect, useState } from "react";
import { TodoItem } from "./components/TodoItem";
import { AddTodo } from "./components/AddTodo";
import { ToggleTheme } from "./components/ToggleTheme";
import { getInitialTheme } from "./helpers/getInitialTheme";
import { toggleTheme } from "./helpers/toggleTheme";
import { DeleteConfirmModule } from "./components/DeleteConfirmModule";

const LOCAL_STORAGE_KEY = "todos";
const API_URL = "https://69e374fa3327837a15532d7a.mockapi.io/api/v1/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [theme, setTheme] = useState(getInitialTheme());
  const [deletingID, setDeletingId] = useState(null);
  const [isDeletingCompleted, setISDeletingCompleted] = useState(false);

  useEffect(() => {
    //Загружаю данные из LS и БЗ
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

  //Функция добавления
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

  //обновление данных задач
  const handleUpdate = async (id, newText, newDeadline) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);

    if (!todoToUpdate) return;

    const updatedTodo = {
      ...todoToUpdate,
      text: newText,
      deadline: newDeadline,
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

  //Функция обновления статуса выполнения
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

  //Функция удаления
  const handleDelete = async (id) => {
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

  const hasCompletedTodos = todos.some((todo) => todo.completed);

  const handleDeleteCompleted = () => {
    if (!hasCompletedTodos) return;

    setISDeletingCompleted(true);
  };

  //удаление выполненых задач
  const confirmDeleteCompleted = async () => {
    const originalTodos = [...todos];

    const completedIds = originalTodos
      .filter((t) => t.completed)
      .map((t) => t.id);

    setTodos(originalTodos.filter((todo) => !todo.completed));

    const failedIds = [];

    for (const id of completedIds) {
      try {
        await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });
      } catch (error) {
        console.error(`Ошбика удаления задачи ${id}: `, error.message);
        failedIds.push(id);
      }
    }

    if (failedIds.length > 0) {
      setTodos(
        originalTodos.filter(
          (todo) => !todo.completed || failedIds.includes(todo.id),
        ),
      );
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
    setISDeletingCompleted(false);
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
                onDelete={() => setDeletingId(todo.id)}
                onToggleComplete={toggleComplete}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        </div>
        {deletingID && (
          <DeleteConfirmModule
            onCancel={() => setDeletingId(null)}
            onConfirm={() => {
              handleDelete(deletingID);
              setDeletingId(null);
            }}
            message={"Вы уверены, что хотите удалить эту задачу?"}
          />
        )}
        {isDeletingCompleted && (
          <DeleteConfirmModule
            onCancel={() => setISDeletingCompleted(false)}
            onConfirm={confirmDeleteCompleted}
            message={`Вы уверены, что хотите удалить все выполненные задачи (${todos.filter((todo) => todo.completed).length})?`}
          />
        )}
        {hasCompletedTodos && (
          <button
            onClick={handleDeleteCompleted}
            className="px-4 py-2 bg-red-400 text-white rounded hover:bg-red-500 transition-colors duration-300 cursor-pointer mt-4"
          >
            Удалить выполненные
          </button>
        )}
      </div>
    </>
  );
}

export default App;
