import { Slot } from 'expo-router';
import { SessionProvider } from './context/auth_context';
import { ThemeProvider } from './components/theme_context'; // Importowanie ThemeProvider
import { Stack } from "expo-router";

export default function Root() {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }}/>
          <Stack.Screen name="(drawer)" options={{ headerShown: false }}/>
          <Stack.Screen name="index" options={{ headerShown: false }}/>
          <Stack.Screen name="components" options={{ headerShown: false }}/>
        </Stack>
        {/* <Slot/> */}
      </ThemeProvider>
    </SessionProvider>
  );
}




// import { Stack, Slot } from "expo-router";
// import { View } from 'react-native';

// export default function RootLayout() {
//   const title = { headerTitle: 'Moja Aplikacja' };

//   return (
//     <Stack>
//       <Stack.Screen name="index" options={() => JSON.parse(JSON.stringify(title))} />
//       <Stack.Screen name="screens/home/home" options={{ title: 'Home' }} />
//       <Slot />
//     </Stack>
//   );
// }



// // import { Stack } from "expo-router";
// // import { Slot } from "expo-router";
// // import { useRouter } from "expo-router";
// // import { useEffect } from "react";

// // export default function RootLayout() {
// //   const router = useRouter();

// //   useEffect(() => {
// //     // Przekierowanie do logowania po załadowaniu RootLayout
// //     router.replace("./pages/Auth");
// //   }, [router]);

// //   return (
// //     <Stack>
// //       <Slot />  {/* Slot umożliwia załadowanie innych ekranów */}
// //     </Stack>
// //   );
// // }


