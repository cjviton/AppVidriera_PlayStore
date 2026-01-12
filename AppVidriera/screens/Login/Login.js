import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";

import styles from "./LoginStyles";
import globalStyles from "../../styles/globalStyles";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    fetch("http://10.0.2.2:5297/api/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        passwordHash: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          Alert.alert("Bienvenido", `Hola ${data.nombre}`);
          navigation.replace("Home");
        } else {
          Alert.alert("Error", "Email o contraseña incorrectos");
        }
      })
      .catch((err) => {
        Alert.alert("Error", "No se pudo conectar con el servidor");
        console.log(err);
      });
  };

  return (
    <ImageBackground
      source={require("../../assets/logoMovil.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={globalStyles.title}>Iniciar sesión</Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#666"
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={globalStyles.input}
          placeholder="Contraseña"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={globalStyles.primaryButton} onPress={handleLogin}>
          <Text style={globalStyles.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace("Register")}>
          <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
