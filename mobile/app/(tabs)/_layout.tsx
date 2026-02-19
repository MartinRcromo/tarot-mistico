import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { COLORS } from '@/constants/theme';
import CreditBadge from '@/components/CreditBadge';
import { useAuth } from '@/hooks/useAuth';

/** Layout de tabs principales — 4 tabs */
export default function TabLayout() {
  const { profile } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.surface },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: '600' },
        headerRight: () => (
          <CreditBadge
            credits={profile?.credits_remaining ?? 0}
            subscriptionStatus={profile?.subscription_status ?? 'free'}
          />
        ),
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tirada',
          headerTitle: '🔮 Tarot Místico',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🔮</Text>,
        }}
      />
      <Tabs.Screen
        name="readings"
        options={{
          title: 'Historial',
          headerTitle: '📖 Mis Lecturas',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📖</Text>,
        }}
      />
      <Tabs.Screen
        name="consultation"
        options={{
          title: 'Consulta',
          headerTitle: '📞 Consulta Pro',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>📞</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerTitle: '👤 Mi Perfil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
