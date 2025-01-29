import React from 'react';
import { Button, View } from 'react-native';
import { useTheme } from './theme_context';

const ThemeSwitcher = () => {
  const { toggleTheme } = useTheme();

  return (
    <View style={{ marginTop: 20 }}>
      <Button title="Toggle Theme" onPress={toggleTheme} />
    </View>
  );
};

export default ThemeSwitcher;
