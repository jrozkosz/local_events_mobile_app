import React from 'react';
import { Button, View } from 'react-native';
import { useTheme } from './theme_context'; // Importowanie useTheme

const ThemeSwitcher = () => {
  const { toggleTheme } = useTheme(); // Funkcja do zmiany motywu

  return (
    <View style={{ marginTop: 20 }}>
      <Button title="Toggle Theme" onPress={toggleTheme} />
    </View>
  );
};

export default ThemeSwitcher;
