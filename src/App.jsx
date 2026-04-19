import { useState } from "react";
import { useTodoManagement } from "./hooks/useTodoMagagement";
import { ToggleTheme } from "./components/ToggleTheme";
import { toggleTheme } from "./helpers/toggleTheme";
import { getInitialTheme } from "./helpers/getInitialTheme";
import { DeleteConfirmModule } from "./components/DeleteConfirmModule";
import { DeleteCompletedButton } from "./components/DeleteCompletedButton";
import { MainContent } from "./components/MainContent";

function App() {
  const [theme, setTheme] = useState(getInitialTheme());

  const {
    todos,
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
  } = useTodoManagement();

  return (
    <>
      <div
        data-theme={theme}
        className="flex flex-col min-h-screen justify-center items-center bg-page-light dark:bg-page-dark p-6"
      >
        <ToggleTheme toggleTheme={() => toggleTheme(setTheme)} theme={theme} />

        <MainContent
          onAdd={onAdd}
          todos={todos}
          handleUpdate={handleUpdate}
          toggleComplete={toggleComplete}
          setDeletingId={setDeletingId}
          onReorder={handleReorder}
        />

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
          <DeleteCompletedButton
            handleDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>
    </>
  );
}

export default App;
