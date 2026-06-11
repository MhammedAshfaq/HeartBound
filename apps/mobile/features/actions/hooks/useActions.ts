import { useState, useEffect, useCallback } from 'react';
import { ActionTask, NewActionPayload } from '../types/action.types';
import { actionService } from '../utils/actionService';

export const useActions = () => {
  const [actions, setActions] = useState<ActionTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadActions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await actionService.getActions();
      
      // If there are no actions, generate the initial batch
      if (data.length === 0) {
        const freshData = await actionService.refreshSuggestions();
        setActions(freshData);
      } else {
        setActions(data);
      }
    } catch (error) {
      console.error('Failed to load actions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActions();
  }, [loadActions]);

  const refreshSuggestions = async () => {
    try {
      setIsLoading(true);
      const data = await actionService.refreshSuggestions();
      setActions(data);
    } catch (error) {
      console.error('Failed to refresh suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsCompleted = async (id: string) => {
    try {
      await actionService.markAsCompleted(id);
      setActions((prev) => 
        prev.map((a) => a.id === id ? { ...a, isCompleted: true, completedAt: new Date().toISOString() } : a)
      );
    } catch (error) {
      console.error('Failed to mark as completed:', error);
    }
  };

  const addCustomAction = async (payload: Omit<NewActionPayload, 'isCustom'>) => {
    try {
      const newAction = await actionService.addCustomAction(payload);
      setActions((prev) => [newAction, ...prev]);
    } catch (error) {
      console.error('Failed to add custom action:', error);
    }
  };

  return { actions, isLoading, refreshSuggestions, markAsCompleted, addCustomAction };
};
