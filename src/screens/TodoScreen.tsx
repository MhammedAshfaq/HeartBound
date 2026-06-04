import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CustomModal } from '@components/common/Modal';
import { Button } from '@components/common/Button';
import { useTheme } from '@context/ThemeContext';
import { useThemedStyles } from '@hooks/useThemedStyles';
import { useScreenLayout, screenPadding } from '@hooks/useScreenLayout';
import { useTodos } from '@hooks/useTodos';
import { AppTheme } from '@utils/theme';
import {
  TODO_CATEGORY_META,
  TODO_PRIORITY_META,
  TODO_FILTERS,
} from '@utils/todoConstants';
import { TodoItem, TodoCategory, TodoPriority, TodoFilter } from '../types';
import { formatRelativeTime } from '@utils/helpers';

interface TodoFormState {
  title: string;
  description: string;
  priority: TodoPriority;
  category: TodoCategory;
}

const EMPTY_FORM: TodoFormState = {
  title: '',
  description: '',
  priority: TodoPriority.MEDIUM,
  category: TodoCategory.Connection,
};

export const TodoScreen: React.FC = () => {
  const screenLayout = useScreenLayout();
  const styles = useThemedStyles(createStyles);
  const { theme } = useTheme();
  const {
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
  } = useTodos();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TodoFormState>(EMPTY_FORM);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalVisible(true);
  };

  const openEditModal = (item: TodoItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description || '',
      priority: item.priority,
      category: item.category,
    });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSave = () => {
    const title = form.title.trim();
    if (!title) {
      Alert.alert('Missing title', 'Please enter a task title.');
      return;
    }

    if (editingId) {
      editTodo({
        id: editingId,
        title,
        description: form.description,
        priority: form.priority,
        category: form.category,
      });
    } else {
      createTodo({
        title,
        description: form.description || undefined,
        priority: form.priority,
        category: form.category,
      });
    }
    closeModal();
  };

  const confirmDelete = (item: TodoItem) => {
    Alert.alert('Delete task', `Remove "${item.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeTodo(item.id),
      },
    ]);
  };

  const confirmClearCompleted = () => {
    Alert.alert('Clear completed', 'Remove all completed tasks?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearCompleted },
    ]);
  };

  const confirmCompleteAll = () => {
    Alert.alert('Complete all', 'Mark every active task as done?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Complete all', onPress: completeAll },
    ]);
  };

  const getPriorityColor = useCallback(
    (priority: TodoPriority) => {
      const key = TODO_PRIORITY_META[priority].colorKey;
      return theme.colors[key];
    },
    [theme]
  );

  const renderTodo = ({ item }: { item: TodoItem }) => {
    const categoryMeta = TODO_CATEGORY_META[item.category];
    const priorityMeta = TODO_PRIORITY_META[item.priority];

    return (
      <View style={[styles.todoCard, item.completed && styles.todoCardCompleted]}>
        <TouchableOpacity
          style={styles.checkButton}
          onPress={() => toggleTodoComplete(item.id)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.completed }}
        >
          <Ionicons
            name={item.completed ? 'checkbox' : 'square-outline'}
            size={26}
            color={item.completed ? theme.colors.success : theme.colors.border}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.todoBody}
          onPress={() => openEditModal(item)}
          activeOpacity={0.7}
        >
          <View style={styles.todoTitleRow}>
            <Text
              style={[styles.todoTitle, item.completed && styles.todoTitleDone]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <View
              style={[
                styles.priorityBadge,
                { backgroundColor: `${getPriorityColor(item.priority)}22` },
              ]}
            >
              <Text
                style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}
              >
                {priorityMeta.label}
              </Text>
            </View>
          </View>

          {item.description ? (
            <Text
              style={[styles.todoDescription, item.completed && styles.todoDescriptionDone]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          ) : null}

          <View style={styles.todoMeta}>
            <Text style={styles.categoryText}>
              {categoryMeta.emoji} {categoryMeta.label}
            </Text>
            <Text style={styles.timeText}>
              {item.completed && item.completedAt
                ? `Done ${formatRelativeTime(new Date(item.completedAt))}`
                : `Added ${formatRelativeTime(new Date(item.createdAt))}`}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => confirmDelete(item)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={screenLayout.safe} edges={['top']}>
      <View style={styles.filterRow}>
        {TODO_FILTERS.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.filterChip, filter === f.id && styles.filterChipActive]}
            onPress={() => setFilter(f.id as TodoFilter)}
          >
            <Text
              style={[styles.filterText, filter === f.id && styles.filterTextActive]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionsRow}>
        <Button title="Add Task" onPress={openAddModal} style={styles.addButton} />
        {stats.active > 0 && (
          <TouchableOpacity style={styles.textAction} onPress={confirmCompleteAll}>
            <Text style={styles.textActionLabel}>Complete all</Text>
          </TouchableOpacity>
        )}
        {stats.completed > 0 && (
          <TouchableOpacity style={styles.textAction} onPress={confirmClearCompleted}>
            <Text style={[styles.textActionLabel, styles.textActionDanger]}>
              Clear done
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderTodo}
        contentContainerStyle={screenLayout.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>
              {filter === 'completed'
                ? 'No completed tasks yet'
                : filter === 'active'
                  ? 'All caught up!'
                  : 'No tasks yet'}
            </Text>
            <Text style={styles.emptyText}>
              {filter === 'all'
                ? 'Add a relationship goal or daily gesture to get started.'
                : 'Try another filter or add a new task.'}
            </Text>
            {filter !== 'completed' && (
              <Button title="Add your first task" onPress={openAddModal} style={styles.emptyButton} />
            )}
          </View>
        }
      />

      <CustomModal
        visible={modalVisible}
        onClose={closeModal}
        title={editingId ? 'Edit Task' : 'New Task'}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <Text style={styles.fieldLabel}>Title</Text>
            <TextInput
              style={styles.fieldInput}
              placeholder="What do you want to do?"
              placeholderTextColor={theme.colors.textSecondary}
              value={form.title}
              onChangeText={(text) => setForm((prev) => ({ ...prev, title: text }))}
            />

            <Text style={styles.fieldLabel}>Notes (optional)</Text>
            <TextInput
              style={[styles.fieldInput, styles.fieldInputMultiline]}
              placeholder="Add details..."
              placeholderTextColor={theme.colors.textSecondary}
              value={form.description}
              onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
            />

            <Text style={styles.fieldLabel}>Priority</Text>
            <View style={styles.optionRow}>
              {(Object.values(TodoPriority) as TodoPriority[]).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.optionChip,
                    form.priority === p && styles.optionChipActive,
                  ]}
                  onPress={() => setForm((prev) => ({ ...prev, priority: p }))}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      form.priority === p && styles.optionChipTextActive,
                    ]}
                  >
                    {TODO_PRIORITY_META[p].label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.categoryRow}>
              {(Object.values(TodoCategory) as TodoCategory[]).map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.categoryChip,
                    form.category === c && styles.categoryChipActive,
                  ]}
                  onPress={() => setForm((prev) => ({ ...prev, category: c }))}
                >
                  <Text style={styles.categoryChipEmoji}>{TODO_CATEGORY_META[c].emoji}</Text>
                  <Text
                    style={[
                      styles.categoryChipText,
                      form.category === c && styles.categoryChipTextActive,
                    ]}
                  >
                    {TODO_CATEGORY_META[c].label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title={editingId ? 'Save Changes' : 'Add Task'}
              onPress={handleSave}
              style={styles.modalSubmit}
            />
            <Button
              title="Cancel"
              onPress={closeModal}
              variant="outline"
              style={styles.modalCancel}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </CustomModal>
    </SafeAreaView>
  );
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    filterRow: {
      flexDirection: 'row',
      paddingHorizontal: screenPadding,
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      paddingTop: theme.spacing.md,
    },
    filterChip: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      alignItems: 'center',
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    filterChipActive: {
      backgroundColor: theme.colors.primaryLight,
      borderColor: theme.colors.primary,
    },
    filterText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    filterTextActive: {
      color: theme.colors.primary,
    },
    actionsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      paddingHorizontal: screenPadding,
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    addButton: {
      flexGrow: 1,
      minWidth: 140,
    },
    textAction: {
      paddingVertical: theme.spacing.sm,
    },
    textActionLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    textActionDanger: {
      color: theme.colors.error,
    },
    todoCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: theme.colors.card,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.sm,
    },
    todoCardCompleted: {
      opacity: 0.85,
      backgroundColor: theme.colors.surface,
    },
    checkButton: {
      marginRight: theme.spacing.sm,
      marginTop: 2,
    },
    todoBody: {
      flex: 1,
    },
    todoTitleRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
    },
    todoTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    todoTitleDone: {
      textDecorationLine: 'line-through',
      color: theme.colors.textSecondary,
    },
    priorityBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.borderRadius.sm,
    },
    priorityText: {
      fontSize: 11,
      fontWeight: '700',
    },
    todoDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      lineHeight: 20,
      marginBottom: theme.spacing.sm,
    },
    todoDescriptionDone: {
      textDecorationLine: 'line-through',
    },
    todoMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    categoryText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    timeText: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
    deleteButton: {
      paddingLeft: theme.spacing.sm,
      paddingTop: 2,
    },
    emptyContainer: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: screenPadding,
    },
    emptyIcon: {
      fontSize: 56,
      marginBottom: theme.spacing.md,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: theme.spacing.lg,
    },
    emptyButton: {
      minWidth: 200,
    },
    fieldLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      marginTop: theme.spacing.sm,
    },
    fieldInput: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.background,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
    },
    fieldInputMultiline: {
      minHeight: 88,
      textAlignVertical: 'top',
    },
    optionRow: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    optionChip: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      alignItems: 'center',
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    optionChipActive: {
      backgroundColor: theme.colors.primaryLight,
      borderColor: theme.colors.primary,
    },
    optionChipText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    optionChipTextActive: {
      color: theme.colors.primary,
    },
    categoryRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.background,
    },
    categoryChipActive: {
      backgroundColor: theme.colors.primaryLight,
      borderColor: theme.colors.primary,
    },
    categoryChipEmoji: {
      fontSize: 16,
    },
    categoryChipText: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    categoryChipTextActive: {
      color: theme.colors.primary,
    },
    modalSubmit: {
      marginTop: theme.spacing.md,
    },
    modalCancel: {
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.md,
    },
  });
