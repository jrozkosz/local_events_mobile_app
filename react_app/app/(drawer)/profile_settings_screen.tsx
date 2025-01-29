import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';  

const MyProfile = () => {  
  return (
    <View>
      <Text style={{fontStyle: "italic", alignSelf: "center", marginTop: 10}}>
        PROFILE'S SETTINGS...
      </Text>
    </View>
    // <TouchableOpacity>  
    //   <ImageBackground   
    //     source={require('../assets/images/persons.png')}   
    //     style={styles.button}  
    //   >  
    //     <Text style={styles.buttonText}>Kliknij mnie</Text>  
    //   </ImageBackground>  
    // </TouchableOpacity>  
  );  
};  

const styles = StyleSheet.create({  
  button: {  
    width: 200,  
    height: 50,  
    justifyContent: 'center',  
    alignItems: 'center',  
  },  
  buttonText: {  
    color: 'black',  
    fontSize: 18,  
  },  
});  

export default MyProfile;