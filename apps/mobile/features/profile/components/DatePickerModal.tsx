import { useCallback, useRef } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CalendarPicker from 'react-native-calendar-picker';
import { useTheme } from '@/hooks/useTheme';
import { colors, shadows } from '@/lib/theme';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (date: string) => void;
  initialDate?: string;
  title: string;
}

export function DatePickerModal({ visible, onClose, onSelect, initialDate, title }: DatePickerModalProps) {
  const { isDark } = useTheme();
  const c = colors(isDark);
  const s = shadows(isDark);
  const selectedDateRef = useRef<Date | null>(null);

  const parsedInitial = initialDate ? new Date(initialDate) : new Date();
  const initialDateObj = isNaN(parsedInitial.getTime()) ? new Date() : parsedInitial;

  const handleDateChange = useCallback((date: Date) => {
    selectedDateRef.current = date;
  }, []);

  const handleConfirm = useCallback(() => {
    const d = selectedDateRef.current || initialDateObj;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    onSelect(`${yyyy}-${mm}-${dd}`);
    onClose();
  }, [onSelect, onClose, initialDateObj]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: c.overlay }}
        onPress={onClose}
      >
        <Pressable
          className="rounded-2xl"
          style={{
            backgroundColor: c.card,
            padding: 20,
            width: '92%',
            maxWidth: 360,
            ...s.md,
          }}
          onPress={() => {}}
        >
          <Text className="text-lg font-bold text-center mb-4" style={{ color: c.text }}>
            {title}
          </Text>

          <CalendarPicker
            initialDate={initialDateObj}
            onDateChange={handleDateChange}
            selectedStartDate={initialDateObj}
            selectedDayColor={c.primary}
            selectedDayTextColor="#fff"
            todayBackgroundColor={isDark ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.1)'}
            textStyle={{ color: c.text }}
            monthTitleStyle={{ color: c.text }}
            yearTitleStyle={{ color: c.text }}
            previousTitle=""
            nextTitle=""
            previousComponent={<Ionicons name="chevron-back" size={22} color={c.primary} />}
            nextComponent={<Ionicons name="chevron-forward" size={22} color={c.primary} />}
            width={320}
            scaleFactor={375}
            dayShape="circle"
          />

          <View className="flex-row justify-end gap-3 mt-4 pt-4" style={{ borderTopWidth: 1, borderTopColor: c.border }}>
            <Pressable
              onPress={onClose}
              className="px-6 rounded-lg"
              style={{ backgroundColor: c.surface, paddingTop: 5, paddingBottom: 5 }}
            >
              <Text className="text-sm font-semibold" style={{ color: c.muted }}>
                Cancel
              </Text>
            </Pressable>
            <Pressable
              onPress={handleConfirm}
              className="px-6 rounded-lg"
              style={{ backgroundColor: c.primary, paddingTop: 5, paddingBottom: 5 }}
            >
              <Text className="text-sm font-semibold text-white">
                Confirm
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
