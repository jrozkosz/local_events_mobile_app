import React, { useContext, createContext, useState, useEffect, PropsWithChildren } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../api';

const AuthContext = createContext<{
  signIn: (username: string, password: string) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  username?: string | null;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: true,
  username: null
});

export function useSession() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useSession must be wrapped in a <SessionProvider />');
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const storedSession = await AsyncStorage.getItem('access_token');
      const username = await AsyncStorage.getItem('username');
      setSession(storedSession);
      setUsername(username);
      setIsLoading(false);
    };
    loadSession();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
        const response = await api.post('/api/auth/login', { username, password });
        await AsyncStorage.setItem('access_token', response.data.access_token);
        await AsyncStorage.setItem('username', username);
        setSession(response.data.access_token);
        setUsername(username);
    } catch (error) {
        throw new Error('Invalid credentials');
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('username');
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, session, isLoading, username }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;