import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#526bbbff', tabBarStyle: {
      width: "70%",
      alignSelf: "center",
      borderRadius: 30
    } }}>
        <Tabs.Screen
            name="index"
            options={{
                title: 'Home',
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
                animation: "shift",
            }}
        />
        <Tabs.Screen
            name="settings"
            options={{
                title: 'Settings',
                tabBarIcon: ({ color }) => <FontAwesome name="gear" color={color} size={28} />,
                animation: "shift",
            }}
        />
    </Tabs>
  );
}