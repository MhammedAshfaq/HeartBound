import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TodoItem,
  TodoState,
  TodoFilter,
  TodoPriority,
  TodoCategory,
} from '../../types';

const now = () => new Date().toISOString();

const SEED_TODOS: TodoItem[] = [
  {
    id: 'todo-seed-1',
    title: 'Send a thoughtful good morning message',
    description: 'Start the day with warmth and appreciation.',
    completed: false,
    priority: TodoPriority.MEDIUM,
    category: TodoCategory.Communication,
    createdAt: now(),
  },
  {
    id: 'todo-seed-2',
    title: 'Plan a surprise date night',
    description: 'Pick a place or activity your partner will love.',
    completed: false,
    priority: TodoPriority.HIGH,
    category: TodoCategory.Date,
    createdAt: now(),
  },
  {
    id: 'todo-seed-3',
    title: 'Write down three things you appreciate',
    description: 'Share one of them with your partner today.',
    completed: true,
    priority: TodoPriority.LOW,
    category: TodoCategory.Connection,
    createdAt: now(),
    completedAt: now(),
  },
];

const initialState: TodoState = {
  items: SEED_TODOS,
  filter: 'all',
};

export interface AddTodoPayload {
  title: string;
  description?: string;
  priority: TodoPriority;
  category: TodoCategory;
}

export interface UpdateTodoPayload {
  id: string;
  title?: string;
  description?: string;
  priority?: TodoPriority;
  category?: TodoCategory;
}

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setTodoFilter: (state, action: PayloadAction<TodoFilter>) => {
      state.filter = action.payload;
    },
    addTodo: (state, action: PayloadAction<AddTodoPayload>) => {
      const item: TodoItem = {
        id: `todo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        title: action.payload.title.trim(),
        description: action.payload.description?.trim() || undefined,
        completed: false,
        priority: action.payload.priority,
        category: action.payload.category,
        createdAt: now(),
      };
      state.items.unshift(item);
    },
    updateTodo: (state, action: PayloadAction<UpdateTodoPayload>) => {
      const item = state.items.find((t) => t.id === action.payload.id);
      if (!item) return;
      if (action.payload.title !== undefined) {
        item.title = action.payload.title.trim();
      }
      if (action.payload.description !== undefined) {
        item.description = action.payload.description.trim() || undefined;
      }
      if (action.payload.priority !== undefined) {
        item.priority = action.payload.priority;
      }
      if (action.payload.category !== undefined) {
        item.category = action.payload.category;
      }
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const item = state.items.find((t) => t.id === action.payload);
      if (!item) return;
      item.completed = !item.completed;
      item.completedAt = item.completed ? now() : undefined;
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    clearCompletedTodos: (state) => {
      state.items = state.items.filter((t) => !t.completed);
    },
    markAllTodosComplete: (state) => {
      const timestamp = now();
      state.items.forEach((item) => {
        if (!item.completed) {
          item.completed = true;
          item.completedAt = timestamp;
        }
      });
    },
  },
});

export const {
  setTodoFilter,
  addTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  clearCompletedTodos,
  markAllTodosComplete,
} = todoSlice.actions;

export default todoSlice.reducer;
