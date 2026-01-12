import React, { useEffect } from 'react';
import { View, Image } from 'react-native';

import styles from './SplashScreenStyles';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Redirige a Login
    }, 5000); // 5 segundos

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/logoMovil.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}
