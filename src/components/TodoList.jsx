import { TodoItem } from "./TodoItem";

import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

export const TodoList = ({
  todos,
  handleUpdate,
  toggleComplete,
  setDeletingId,
  onReorder, // функция для обновления порядка в родительском компоненте
}) => {
  return (
    <DragDropProvider
      onDragEnd={(event) => {
        const newTodos = move(todos, event);
        onReorder(newTodos);
      }}
    >
      <div className="flex flex-col gap-3">
        {todos.map((todo, index) => (
          <TodoItem
            todo={todo}
            key={todo.id}
            index={index}
            onDelete={() => setDeletingId(todo.id)}
            onToggleComplete={toggleComplete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </DragDropProvider>
  );
};
