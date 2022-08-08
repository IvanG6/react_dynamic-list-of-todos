/* eslint-disable max-len */
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { useEffect, useState } from 'react';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { getTodos } from './api';
import { Filter } from './types/Filter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [userId, setUserId] = useState(0);
  const [selectedTodo, setSelectedTodo] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [visibleTodos, setVisibleTodos] = useState(todos);
  const [filteredBy, setFilteredBy] = useState('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const loadTodos = async () => {
      const todosFromServer = await getTodos();

      setLoading(true);
      setTodos(todosFromServer);
      setVisibleTodos(todosFromServer);
    };

    loadTodos();
    setLoading(false);
  }, []);

  const changeFilteredBy = (filterType: string) => {
    setFilteredBy(filterType);
  };

  const changeQuery = (input: string) => {
    setQuery(input);
  };

  const handleQueryFiltering = (title: string) => {
    return title.toLowerCase().includes(query.toLowerCase());
  };

  useEffect(() => {
    switch (filteredBy) {
      case Filter.ALL:
        setVisibleTodos(todos.filter(todo => handleQueryFiltering(todo.title)));
        break;

      case Filter.ACTIVE:
        setVisibleTodos(todos.filter(todo => !todo.completed && handleQueryFiltering(todo.title)));
        break;

      case Filter.COMPLETED:
        setVisibleTodos(todos.filter(todo => todo.completed && handleQueryFiltering(todo.title)));
        break;

      default:
        break;
    }
  }, [filteredBy, query]);

  const selectUser = (id: number, todoId: number) => {
    setUserId(id);
    setSelectedTodo(todoId);
  };

  const usersTodo = todos.find(todo => todo.id === selectedTodo);

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                changeFilteredBy={changeFilteredBy}
                changeQuery={changeQuery}
                query={query}
              />
            </div>

            <div className="block">
              {!isLoading && <Loader />}
              <TodoList todos={visibleTodos} selectUser={selectUser} />
            </div>
          </div>
        </div>
      </div>

      {!!userId && (
        <TodoModal
          todo={usersTodo}
          selectedUser={userId}
          selectUser={selectUser}
        />
      )}
    </>
  );
};
