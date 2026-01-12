import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";

import styles from "./RegisterStyles";
import globalStyles from "../../styles/globalStyles";

export default function Register({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    // 🔒 Validación de dominio corporativo
    const dominioEmpresa = "@lavidriera.com";

    if (!email.toLowerCase().endsWith(dominioEmpresa)) {
      Alert.alert(
        "Email no válido",
        `El correo debe pertenecer al dominio ${dominioEmpresa}`
      );
      return;
    }

    fetch("http://10.0.2.2:5297/api/usuarios/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        email,
        passwordHash: password,
        fechaRegistro: new Date().toISOString(),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al registrar usuario");
        return res.json();
      })
      .then((data) => {
        Alert.alert("Éxito", "Usuario registrado correctamente");
        console.log("Usuario registrado:", data);
        navigation.replace("Login");
      })
      .catch((err) => {
        console.error(err);
        Alert.alert("Error", "No se pudo registrar el usuario");
      });
  };

  return (
    <ImageBackground
      source={require("../../assets/logoMovil.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={globalStyles.title}>Crear nuevo usuario</Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Usuario"
          placeholderTextColor="#666"
          value={nombre}
          onChangeText={setNombre}
        />

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

        <TextInput
          style={globalStyles.input}
          placeholder="Confirmar contraseña"
          placeholderTextColor="#666"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={globalStyles.primaryButton} onPress={handleRegister}>
          <Text style={globalStyles.primaryButtonText}>Registrarme</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.backText}>Volver al Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
