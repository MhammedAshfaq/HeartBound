import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { colors } from '@/lib/theme';
import { formatDistanceToNow } from 'date-fns';

export interface ActivityLog {
  id: string;
  action: string;
  metadata: {
    previous: Record<string, any>;
    current: Record<string, any>;
  };
  createdAt: string;
}

interface ActivityLogCardProps {
  log: ActivityLog;
}

export function ActivityLogCard({ log }: ActivityLogCardProps) {
  const { isDark } = useTheme();
  const c = colors(isDark);

  let icon: keyof typeof Ionicons.glyphMap = 'time-outline';
  let title = 'Activity';

  if (log.action === 'UPDATE_RELATIONSHIP_STATUS') {
    icon = 'heart';
    title = 'Relationship Status Updated';
  } else if (log.action === 'UPDATE_PROFILE') {
    icon = 'person-circle-outline';
    title = 'Profile Updated';
  }

  const keysChanged = Object.keys(log.metadata?.current || {});
  
  return (
    <View 
      className="flex-row items-start rounded-xl p-4 mb-4"
      style={{
        backgroundColor: c.card,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'

      }}
    >
      <View 
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: c.primary + '15' }}
      >
        <Ionicons name={icon} size={20} color={c.primary} />
      </View>
      
      <View className="flex-1">
        <Text style={{ color: c.text }} className="text-sm font-bold mb-1">
          {title}
        </Text>
        
        {keysChanged.map((key) => {
          const prev = log.metadata?.previous?.[key];
          const curr = log.metadata?.current?.[key];
          
          if (typeof curr === 'object') return null;

          return (
            <Text key={key} style={{ color: c.muted }} className="text-xs mb-1">
              <Text style={{ textTransform: 'capitalize' }}>{key}</Text>: <Text style={{ textDecorationLine: 'line-through', opacity: 0.6 }}>{String(prev || 'none')}</Text> {' '}
              <Ionicons name="arrow-forward" size={10} color={c.muted} /> {' '}
              <Text style={{ color: c.text, fontWeight: '600' }}>{String(curr)}</Text>
            </Text>
          );
        })}
        
        <Text style={{ color: c.muted, fontSize: 10, marginTop: 4 }}>
          {log.createdAt ? formatDistanceToNow(new Date(log.createdAt), { addSuffix: true }) : ''}
        </Text>
      </View>
    </View>
  );
}
