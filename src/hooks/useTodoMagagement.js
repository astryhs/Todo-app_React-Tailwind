import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import {
  createNewTodo,
  sortedSavedTodos,
  toggleTodoComplete,
  updateTodoData,
} from "../helpers/todoHelpers";
import { createTodo, deleteTodo, fetchTodos, updateTodo } from "../api/todoApi";
import { useTodoActions } from "./useTodoActions";

export const useTodoManagement = () => {
  const [todos, setTodos] = useState([]);
  const [deletingID, setDeletingId] = useState(null);
  const [isDeletingCompleted, setISDeletingCompleted] = useState(false);
  const { loadFromLocalStorage, saveToLocalStorage } = useLocalStorage();

  useEffect(() => {
    const loadInitialData = async () => {
      const savedTodos = sortedSavedTodos(loadFromLocalStorage());
      setTodos(savedTodos);
      //GET запрос
      try {
        const serverTodos = await fetchTodos();
        const sortedServerTodos = sortedSavedTodos(serverTodos);
        setTodos(sortedServerTodos);
        saveToLocalStorage(sortedServerTodos);
      } catch (error) {
        console.error("Ошибка загрузки данных: ", error.message);
      }
    };
    loadInitialData();
  }, []);

  const actions = useTodoActions({
    todos,
    setTodos,
    createNewTodo,
    createTodo,
    saveToLocalStorage,
    updateTodoData,
    updateTodo,
    toggleTodoComplete,
    deleteTodo,
    setISDeletingCompleted,
  });

  return {
    todos,
    setTodos,
    deletingID,
    setDeletingId,
    isDeletingCompleted,
    setISDeletingCompleted,
    ...actions,
  };
};
