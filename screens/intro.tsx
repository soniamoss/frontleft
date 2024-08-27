import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const IntroScreen = () => {
  const handleCreateAccount = () => {
    router.push("/PhoneLoginScreen"); // Navigate to the phone login screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Doost</Text>
      <Text style={styles.textsmaller}>Where events and friends meet</Text>
      <Text style={styles.textPrivacy}>
        By tapping ‘Sign in’ / ‘Create account’, you agree to {"\n"} our Terms
        of Service. Learn how we process your {"\n"}data in our Privacy Policy.{" "}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/PhoneLoginScreen")}
      >
        <Text style={styles.buttonText}>Create Account/Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#28397E33",
  },
  text: {
    fontSize: 80,
    fontWeight: "bold",
    fontFamily: "Chicle",
    color: "#3F407C",
  },
  textsmaller: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Chicle",
    color: "#3F407C",
  },
  textPrivacy: {
    fontSize: 11, // Adjust font size
    top: 170,
    fontWeight: 400, // Make text bold
    fontFamily: "poppins",
    textAlign: "left",
    color: "#3D4353",
  },
  button: {
    position: "absolute",
    bottom: 60,
    width: "66%",
    paddingVertical: 15,
    backgroundColor: "#3F407C",
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: 400,
  },
});

export default IntroScreen;

//when we add logo
//<Image source={require('../assets/logo.png')} style={styles.logo} />
/*logo: {
    width: 200,  
    height: 200, 
    resizeMode: 'contain',
  }*/
