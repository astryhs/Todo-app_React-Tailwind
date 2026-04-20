export const useTodoActions = ({
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
}) => {
  //Функция добавления
  const onAdd = async (text, deadline) => {
    const newTodo = createNewTodo(text, deadline, todos.length + 1);

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);

    //POST
    try {
      const createdTodo = await createTodo(newTodo);

      const syncedTodos = updatedTodos.map((todo) =>
        todo.id === newTodo.id ? createdTodo : todo,
      );

      setTodos(syncedTodos);
      saveToLocalStorage(syncedTodos);
    } catch (error) {
      console.error("Ошибка добавления: ", error.message);
      setTodos(todos);
    }
  };

  //обновление данных задач
  const handleUpdate = async (id, newText, newDeadline) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);

    if (!todoToUpdate) return;

    const updatedTodo = updateTodoData(todoToUpdate, newText, newDeadline);

    const updatedTodos = todos.map((todo) =>
      todo.id === id ? updatedTodo : todo,
    );

    setTodos(updatedTodos);

    //PUT
    try {
      await updateTodo(id, updatedTodo);
      saveToLocalStorage(updatedTodos);
    } catch (error) {
      console.error("Ошбика обновления: ", error.message);
      setTodos(todos);
    }
  };

  //Функция обновления статуса выполнения
  const toggleComplete = async (id) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);

    if (!todoToUpdate) return;

    const updatedTodo = toggleTodoComplete(todoToUpdate);
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? updatedTodo : todo,
    );

    setTodos(updatedTodos);

    //PUT
    try {
      await updateTodo(id, updatedTodo);
      saveToLocalStorage(updatedTodos);
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
    //DELETE
    try {
      await deleteTodo(id);
      saveToLocalStorage(updatedTodos);
    } catch (error) {
      console.error("Ошибка удаления: ", error.message);
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
      //DELETE
      try {
        await deleteTodo(id);
      } catch (error) {
        console.error(`Ошибка удаления задач ${id}: `, error.message);
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
    saveToLocalStorage(todos);
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

    saveToLocalStorage(updatedTodos);

    try {
      // Отправляем обновленный порядок на сервер
      for (const todo of updatedTodos) {
        await updateTodo(todo.id, { order: todo.order });
      }
    } catch (error) {
      console.error("Ошибка синхронизации порядка: ", error.message);
      setTodos(oldTodos);
      saveToLocalStorage(oldTodos);
    }
  };

  return {
    onAdd,
    handleUpdate,
    toggleComplete,
    handleDelete,
    handleDeleteCompleted,
    confirmDeleteCompleted,
    handleReorder,
    hasCompletedTodos,
  };
};
