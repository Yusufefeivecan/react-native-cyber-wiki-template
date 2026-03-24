import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameData } from '../explore';

const { width, height } = Dimensions.get('window');

export default function CharacterDetailScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation(); // Navigasyon geçmişi kontrolü için
  const router = useRouter();
  const characterDataString = params.characterData as string;
  const [isFav, setIsFav] = useState(false);

  const character: GameData = characterDataString ? JSON.parse(characterDataString) : null;

  useEffect(() => { checkIfFav(); }, []);

  const checkIfFav = async () => {
    if (!character) return;
    try {
      const favsStr = await AsyncStorage.getItem('favorites');
      const favs = favsStr ? JSON.parse(favsStr) : [];
      const exists = favs.find((f: any) => f.id === character.id);
      setIsFav(!!exists);
    } catch (e) { console.error(e); }
  };

  const toggleFav = async () => {
    try {
      const favsStr = await AsyncStorage.getItem('favorites');
      let favs = favsStr ? JSON.parse(favsStr) : [];
      if (isFav) { favs = favs.filter((f: any) => f.id !== character.id); } 
      else { favs.push(character); }
      await AsyncStorage.setItem('favorites', JSON.stringify(favs));
      setIsFav(!isFav);
    } catch (e) { console.error(e); }
  };

  const getStatValue = (char: any, keys: string[]): number => {
    if (!char) return 50;
    const source = char.stats || char; 
    for (const key of keys) {
      if (source[key] !== undefined && source[key] !== null) return Number(source[key]);
    }
    return 50;
  };

  const stats = character?.stats || {};
  const powerVal = getStatValue(character, ['power']) || stats.power;
  const defVal = getStatValue(character, ['defense']) || stats.defense;
  const magicVal = getStatValue(character, ['magic']) || stats.magic;
  const speedVal = getStatValue(character, ['speed']) || stats.speed;

  const CyberBar = ({ icon, label, value, maxValue = 100, color }: any) => {
    const totalSegments = 10;
    const safeValue = value || 50;
    const filledSegments = Math.round((safeValue / maxValue) * totalSegments);
    const segments = [];
    for (let i = 0; i < totalSegments; i++) {
      segments.push(<View key={i} style={[styles.barSegment, { backgroundColor: i < filledSegments ? color : '#333', opacity: i < filledSegments ? 1 : 0.3 }]} />);
    }
    return (
      <View style={styles.statRow}>
        <View style={styles.statHeader}><Text style={styles.statLabel}>{label}</Text><Text style={styles.statValue}>{safeValue}/{maxValue}</Text></View>
        <View style={styles.barContainer}><Text style={[styles.statIcon, { color }]}>{icon}</Text><View style={styles.segmentsWrapper}>{segments}</View></View>
      </View>
    );
  };

  if (!character) return null;

  return (
    <ImageBackground source={require('../../../assets/background.png')} style={styles.backgroundImage} imageStyle={{ opacity: 0.2 }}>
      
      {/* GERİ BUTONU DÜZELTİLDİ: Sadece bir önceki sayfaya döner */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => {
          if (navigation.canGoBack()) {
            router.back(); // Geçmiş varsa oraya dön (Favorilerse Favoriler, Listeyse Liste)
          } else {
            router.replace('/(tabs)/explore'); // Sadece geçmiş yoksa listeye at
          }
        }}
      >
        <Ionicons name="chevron-back" size={24} color="#00f3ff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.favButton} onPress={toggleFav}>
        <Ionicons name={isFav ? "star" : "star-outline"} size={24} color={isFav ? "#ffd700" : "#fff"} />
      </TouchableOpacity>

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Stack.Screen options={{ headerTitle: '', headerTransparent: true, headerTintColor: '#00f3ff' }} />

        <View style={styles.imageWrapper}>
          <LinearGradient colors={['rgba(188, 19, 254, 0.6)', 'rgba(0, 243, 255, 0.6)']} style={styles.imageBorder}>
              <Image source={{ uri: character.image }} style={styles.image} resizeMode="cover" />
          </LinearGradient>
        </View>

        <Text style={styles.heroName}>{character.name.toUpperCase()}</Text>
        <Text style={styles.heroRole}>{character.role} • {character.difficulty}</Text>

        <View style={styles.statsCard}>
          <CyberBar icon="⚔" label="PWR (GÜÇ)" value={powerVal} color="#00f3ff" />
          <CyberBar icon="🛡" label="DEF (DEFANS)" value={defVal} color="#39ff14" />
          <CyberBar icon="✨" label="MGC (BÜYÜ)" value={magicVal} color="#9d00ff" />
          <CyberBar icon="⚡" label="SPD (HIZ)" value={speedVal} color="#ffeb3b" />
        </View>

        <LinearGradient colors={['rgba(20, 20, 20, 0.9)', 'rgba(0, 0, 0, 1)']} style={styles.storyBox}>
          <View style={[styles.cornerLine, { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 }]} />
          <View style={[styles.cornerLine, { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 }]} />
          <Text style={styles.storyTitle}>BİYOGRAFİ_</Text>
          <Text style={styles.storyText}>{character.description}</Text>
        </LinearGradient>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: width, height: height, backgroundColor: '#020202' },
  container: { flex: 1 }, 
  contentContainer: { paddingTop: 90, alignItems: 'center', paddingBottom: 50 },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#bc13fe' },
  favButton: { position: 'absolute', top: 50, right: 20, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ffd700' },
  imageWrapper: { shadowColor: "#00f3ff", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 15, marginBottom: 15, elevation: 10 },
  imageBorder: { padding: 2, borderRadius: 20, height: 220, width: 220 },
  image: { width: '100%', height: '100%', borderRadius: 18, backgroundColor: '#111' },
  heroName: { fontSize: 24, color: '#fff', fontFamily: 'Orbitron', fontWeight: 'bold', letterSpacing: 2, textAlign: 'center', marginTop: 10 },
  heroRole: { fontSize: 14, color: '#bc13fe', fontFamily: 'Orbitron', marginBottom: 30, letterSpacing: 4, textAlign: 'center' },
  statsCard: { width: '90%', marginBottom: 30 },
  statRow: { marginBottom: 20 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, paddingHorizontal: 5 },
  statLabel: { color: '#fff', fontFamily: 'Orbitron', fontSize: 12, opacity: 0.8 },
  statValue: { color: '#fff', fontFamily: 'Orbitron', fontWeight: 'bold' },
  barContainer: { flexDirection: 'row', alignItems: 'center' },
  statIcon: { fontSize: 20, width: 30, marginRight: 10, textAlign: 'center', fontFamily: 'Orbitron' },
  segmentsWrapper: { flex: 1, flexDirection: 'row', height: 14, gap: 4 },
  barSegment: { flex: 1, height: '100%', borderRadius: 2, transform: [{ skewX: '-20deg' }] },
  storyBox: { width: '90%', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#333', position: 'relative' },
  storyTitle: { color: '#bc13fe', fontSize: 14, fontFamily: 'Orbitron', marginBottom: 10, fontWeight: 'bold' },
  storyText: { color: '#ccc', fontFamily: 'Orbitron', fontSize: 12, lineHeight: 20 },
  cornerLine: { position: 'absolute', width: 20, height: 20, borderColor: '#00f3ff' }
});