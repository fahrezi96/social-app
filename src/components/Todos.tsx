import { useEffect, useState } from 'react';
import { Todo, baseUrl } from '../services/global';

function Todos({ userId }: { userId: number }) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [title, setTitle] = useState('');

  const getTodos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/users/${userId}/todos`);
      setTodos(await response.json());
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const addTodo = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/todos/`, {
        method: 'POST',
        body: JSON.stringify({
          title,
          completed: false,
          userId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setTodos([await response.json(), ...todos]);
      setIsAdd(false);
    } catch (error) {
      console.log(error);
    }
  };

  const completeTodo = async (todo: Todo) => {
    const completedTodo: Todo = {
      id: todo.id,
      title: todo.title,
      completed: true,
      userId: todo.userId,
    };

    try {
      await fetch(`${baseUrl}/todos/${todo.id}`, {
        method: 'PUT',
        body: JSON.stringify(completedTodo),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const index = todos.findIndex((t) => t.id === todo.id);
      const newTodos = [...todos];

      newTodos.splice(index, 1, completedTodo);

      setTodos([...newTodos]);

      setIsAdd(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container">
      <div className="d-flex gap-2 align-items-center mb-2">
        <h3>Todos</h3>
        <button className="btn btn-primary btn-sm" onClick={() => setIsAdd(!isAdd)}>
          {isAdd ? 'Cancel' : '+ Add Todo'}
        </button>
      </div>
      {isAdd && (
        <form onSubmit={addTodo}>
          <div className="form-group mb-2">
            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group mb-4">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        </form>
      )}
      <div className="row">
        {isLoading ? (
          <h4>Loading...</h4>
        ) : !todos.length ? (
          <h4>No todos yet</h4>
        ) : (
          <ul className="list-group">
            {todos.map((todo: Todo) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={todo.id}>
                {todo.title}
                <button disabled={todo.completed} className="btn btn-primary btn-sm" onClick={() => completeTodo(todo)}>
                  {todo.completed ? 'Completed' : 'Completing'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Todos;
