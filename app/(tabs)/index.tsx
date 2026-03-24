import { Orbitron_700Bold, useFonts } from '@expo-google-fonts/orbitron';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// Ekran genişliğini alalım
const { width, height } = Dimensions.get('window');

export default function App() {
  const router = useRouter();
  // Fontu yüklüyoruz
  let [fontsLoaded] = useFonts({
    Orbitron_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* DİKKAT: index.tsx içeride olduğu için resimlere ulaşmak için
         "../assets" (bir üst klasöre çık) dememiz gerekir.
      */}
      <ImageBackground 
        source={require('../../assets/background.png')} 
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.2 }} 
      >
        
        {/* LOGO ALANI */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo.png')}
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.titleText}>CYBERWIKI</Text>
        </View>

        {/* NEON BUTON */}
        <TouchableOpacity 
          style={styles.buttonContainer} 
          activeOpacity={0.8}
          // İŞTE SİHİRLİ SATIR BURASI:
          onPress={() => router.push('/explore')}
        >
          <LinearGradient
            colors={['#00F0FF', '#BC13FE']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBorder}
          >
            <View style={styles.blackButtonInner}>
              <Text style={styles.buttonText}>SİSTEME GİR</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 100,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain', 
  },
  titleText: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 32,
    color: '#FFFFFF',
    letterSpacing: 4,
    textShadowColor: '#BC13FE',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  buttonContainer: {
    width: width * 0.8,
    height: 60,
  },
  gradientBorder: {
    flex: 1,
    padding: 3,
    borderRadius: 8,
  },
  blackButtonInner: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  buttonText: {
    fontFamily: 'Orbitron_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
});