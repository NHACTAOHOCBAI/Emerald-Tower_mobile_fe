import { Tabs } from "expo-router";
import {
  CircleUserRound,
  ConciergeBell,
  CreditCard,
  Home,
  LucideIcon,
} from "lucide-react-native";
import { View } from "react-native";

const TAB_ITEMS = [
  { name: "home", icon: Home },
  { name: "information", icon: CircleUserRound },
  { name: "service", icon: ConciergeBell },
  { name: "payment", icon: CreditCard },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#244B35",
          height: 100,
          borderTopWidth: 0,
          elevation: 0,
          paddingTop: 20,
          paddingHorizontal: 10,
        },
      }}
    >
      {TAB_ITEMS.map((item) => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={item.icon} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

function TabIcon({
  icon: Icon,
  focused,
}: {
  icon: LucideIcon;
  focused: boolean;
}) {
  return (
    <View>
      <Icon color={focused ? "#C8F2D1" : "white"} />
    </View>
  );
}
