import React, {useEffect, useState} from "react";
import {useRouter, Redirect, Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Alert, StyleSheet, ScrollView, Image } from 'react-native';
import { TextInput, Button, Card } from 'react-native-paper';
import api from "../api";
import { useSession } from '../context/auth_context';
import { Ionicons } from "@expo/vector-icons";

const SignInScreen: React.FC = () => {
    const { isLoading, signIn } = useSession();
    const router = useRouter();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [invalidCredentials, setInvalidCredentials] = useState<boolean>();

    const handleLogin = async () => {
        try {
            await signIn(username, password);
            // Alert.alert("Success", "Logged in successfully!");
            setInvalidCredentials(false);
            router.push("/home_screen");
        } catch (error) {
            if (error instanceof Error) {
                // Alert.alert("Error!!!!!!!", error.message);
                setInvalidCredentials(true);
            } else {
                Alert.alert("Error", "An unexpected error occurred");
            }
        }
    };

    return (
            <View style={styles.container}>
            <Image 
                resizeMode='contain'
                source={require("../assets/images/events_logo.png")} 
                style={styles.logo}
                >
            </Image>
            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={25} style={styles.icon}></Ionicons>
                <TextInput
                    label="Username"
                    value={username}
                    keyboardType="email-address"
                    onChangeText={setUsername}
                    mode="outlined"
                    style={styles.input}
                />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={25} style={styles.icon}></Ionicons>
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    mode="outlined"
                    style={styles.input}
                />
            </View>
            {invalidCredentials && <Text
                style={styles.errorText}
                >
                Invalid credentials
            </Text>}
            <Button
                mode="contained"
                onPress={handleLogin}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
            >
                Log In
            </Button>
            <Text style={styles.signUp}>
                Don't have an account?{" "}
                <Link href="/(auth)/signin_screen" style={styles.signUpLink}>
                    Sign up
                </Link>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    logo: {
        height: 200,
        width: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    input: {
        flex: 1,
        height: '100%',
    },
    icon: {
        marginRight: 10,
    },
    button: {
        marginTop: 10,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
    signUp: {
        marginTop: 10,
        color: '#000',
    },
    signUpLink: {
        color: '#1E90FF',
    },
  });

export default SignInScreen;