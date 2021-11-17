import React from "react";
import Player from "./src/pages/player";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SleepTimer from "./src/pages/timer";
import Library from "./src/pages/library";
import Home from "./src/pages/home";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="home" component={Home} />
                <Stack.Screen name="library" component={Library} />
                <Stack.Screen name="player" component={Player} />
                <Stack.Screen name="timer" component={SleepTimer} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
