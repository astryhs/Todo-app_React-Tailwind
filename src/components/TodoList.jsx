import { TodoItem } from "./TodoItem";

export const TodoList = ({
  todos,
  handleUpdate,
  toggleComplete,
  setDeletingId,
}) => {
  return (
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
  );
};
