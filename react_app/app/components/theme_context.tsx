import React, { createContext, useContext, useState } from 'react';

// Zdefiniowanie dostępnych motywów
const themes = {
  light: {
    backgroundColor: 'white',
    textColor: 'black',
  },
  dark: {
    backgroundColor: 'black',
    textColor: 'white',
  },
};

const ThemeContext = createContext({
  theme: themes.light, // Domyślny motyw
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(themes.light); // Domyślny motyw

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === themes.light ? themes.dark : themes.light));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
