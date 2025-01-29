import { View, StyleSheet, Text, StatusBar, Image } from 'react-native';
import { Link, Redirect, useRouter } from 'expo-router';
import { useSession } from './context/auth_context';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import 'react-native-get-random-values';

const Welcome: React.FC = () => {
  const { session, isLoading } = useSession();
  const router = useRouter();
  
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (session) {
    return <Redirect href="/home_screen" />;
  }

  const { width, height } = Dimensions.get('window');

  return (
    <SafeAreaView style={styles.container}>
      <Image 
        resizeMode='contain'
        source={require("./assets/images/events_logo.png")} 
        style={{ 
          width: width * 0.6,
          height: height * 0.3,
          resizeMode: 'contain'
        }}
        >
      </Image>
      <Text style={styles.welcome_text}>Welcome in the Local Events App!</Text>
      <Link href="/signin_screen" style={styles.link_text}>Go to Profile</Link>
      <StatusBar backgroundColor="#161622" barStyle={"default"} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // margin: ,
    // padding: 20,
  },
  link_text: {
    fontSize: 17,
    textDecorationLine: 'underline',
    fontStyle: 'italic',
    paddingBottom: 40,
    // padding: 10
  },
  welcome_text: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 10
  }
})

export default Welcome;