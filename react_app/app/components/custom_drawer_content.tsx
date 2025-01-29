import { router } from "expo-router";
import { useSession } from "../context/auth_context";
import { View, Text, TextInput, Button, Alert, TouchableOpacity, Image, StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

const CustomDrawerContent: React.FC = (props: any) => {
  const { signOut, username } = useSession();

  const handleLogout = async () => {
    await signOut();
    // Alert.alert("Success", "Logged out successfully!");
    router.replace("/signin_screen");
  }

  return (
    <View
      style={{flex: 1}}
    >
      <DrawerContentScrollView {...props}>
        <View style={{padding: 20, alignItems: 'center'}}>
          <Image 
            resizeMode='contain' 
            source={require("../assets/images/events_logo.png")} 
            style={{ width: 125, height: 125 }}>
          </Image>
        </View>
        <DrawerItemList {...props}/>
      </DrawerContentScrollView>

    <TouchableOpacity onPress={handleLogout} style={styles.logout_button}>
      <Text style={styles.logout_text}>Logout</Text>
    </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  logout_button: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  logout_text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

})

export default CustomDrawerContent;