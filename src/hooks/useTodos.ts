import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  setTodoFilter,
  addTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  clearCompletedTodos,
  markAllTodosComplete,
  AddTodoPayload,
  UpdateTodoPayload,
} from '@store/slices/todoSlice';
import { TodoFilter } from '../types';

export const useTodos = () => {
  const dispatch = useAppDispatch();
  const { items, filter } = useAppSelector((state) => state.todo);

  const filteredItems = useMemo(() => {
    switch (filter) {
      case 'active':
        return items.filter((t) => !t.completed);
      case 'completed':
        return items.filter((t) => t.completed);
      default:
        return items;
    }
  }, [items, filter]);

  const stats = useMemo(() => {
    const completed = items.filter((t) => t.completed).length;
    return {
      total: items.length,
      active: items.length - completed,
      completed,
    };
  }, [items]);

  const setFilter = useCallback(
    (next: TodoFilter) => {
      dispatch(setTodoFilter(next));
    },
    [dispatch]
  );

  const createTodo = useCallback(
    (payload: AddTodoPayload) => {
      dispatch(addTodo(payload));
    },
    [dispatch]
  );

  const editTodo = useCallback(
    (payload: UpdateTodoPayload) => {
      dispatch(updateTodo(payload));
    },
    [dispatch]
  );

  const toggleTodoComplete = useCallback(
    (id: string) => {
      dispatch(toggleTodo(id));
    },
    [dispatch]
  );

  const removeTodo = useCallback(
    (id: string) => {
      dispatch(deleteTodo(id));
    },
    [dispatch]
  );

  const clearCompleted = useCallback(() => {
    dispatch(clearCompletedTodos());
  }, [dispatch]);

  const completeAll = useCallback(() => {
    dispatch(markAllTodosComplete());
  }, [dispatch]);

  return {
    items,
    filter,
    filteredItems,
    stats,
    setFilter,
    createTodo,
    editTodo,
    toggleTodoComplete,
    removeTodo,
    clearCompleted,
    completeAll,
  };
};
