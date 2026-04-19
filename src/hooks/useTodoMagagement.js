import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "todos";
const API_URL = "https://69e374fa3327837a15532d7a.mockapi.io/api/v1/todos";

export const useTodoManagement = () => {
  const [todos, setTodos] = useState([]);
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
          const sortedTodos = [...serverTodos].sort(
            (a, b) => a.order - b.order,
          );
          setTodos(sortedTodos);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sortedTodos));
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

  //функция изменения порядка
  const handleReorder = async (newTodos) => {
    const oldTodos = [...todos];

    const updatedTodos = newTodos.map((todo, index) => ({
      ...todo,
      order: index + 1, // ← ключевой момент!
    }));
    setTodos(updatedTodos);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));

    try {
      // Отправляем обновленный порядок на сервер
      for (const todo of updatedTodos) {
        await fetch(`${API_URL}/${todo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: todo.order }),
        });
      }
    } catch (error) {
      console.error("Ошибка синхронизации порядка: ", error.message);
      setTodos(oldTodos);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(oldTodos));
    }
  };

  return {
    todos,
    setTodos,
    deletingID,
    setDeletingId,
    isDeletingCompleted,
    setISDeletingCompleted,
    onAdd,
    handleUpdate,
    toggleComplete,
    handleDelete,
    handleDeleteCompleted,
    confirmDeleteCompleted,
    hasCompletedTodos,
    handleReorder,
  };
};
