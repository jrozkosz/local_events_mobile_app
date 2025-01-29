import { View, Text } from 'react-native';
import { Stack, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from '../context/auth_context';
import React from 'react';

const AuthLayout: React.FC = () => {
    const { session, isLoading } = useSession();
          
        if (isLoading) {
            return <Text>Loading...</Text>;
        }
        
        if (session) {
            return <Redirect href="/home_screen" />;
        }

    return (
        <>
            <Stack>
                <Stack.Screen 
                    name="signin_screen" 
                    options={{
                        headerShown: false
                    }} />
            </Stack>
            <StatusBar backgroundColor="#161622" style="light" /> 
        </>
    )
}

export default AuthLayout;