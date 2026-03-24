import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function CreateCharacterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [desc, setDesc] = useState('');
  
  // Statlar için state
  const [stats, setStats] = useState({ power: 50, defense: 50, magic: 50, speed: 50 });

  const handleStatChange = (key: keyof typeof stats, change: number) => {
    setStats(prev => {
      const newVal = prev[key] + change;
      if (newVal < 0 || newVal > 100) return prev; // 0-100 arası sınır
      return { ...prev, [key]: newVal };
    });
  };

  const saveCharacter = async () => {
    if (!name || !role) {
      Alert.alert("Eksik Bilgi", "Lütfen karakter ismini ve rolünü gir.");
      return;
    }

    const newCharacter = {
      id: Date.now(), // Benzersiz ID
      name,
      role,
      description: desc || "Gizemli bir savaşçı...",
      image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=600&auto=format&fit=crop", // Varsayılan avatar
      difficulty: "Özel",
      stats
    };

    try {
      // Eskileri çek, yeniyi ekle, kaydet
      const existing = await AsyncStorage.getItem('custom_chars');
      const chars = existing ? JSON.parse(existing) : [];
      chars.push(newCharacter);
      await AsyncStorage.setItem('custom_chars', JSON.stringify(chars));
      
      Alert.alert("Başarılı", "Karakter veritabanına işlendi!");
      router.push('/(tabs)/explore'); // Listeye dön
    } catch (e) {
      console.error(e);
    }
  };

  // Stat Artır/Azalt Butonu
  const StatControl = ({ label, statKey, color }: { label: string, statKey: keyof typeof stats, color: string }) => (
    <View style={styles.statRow}>
      <Text style={[styles.statLabel, { color }]}>{label}</Text>
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => handleStatChange(statKey, -10)}>
          <Ionicons name="remove-circle-outline" size={32} color={color} />
        </TouchableOpacity>
        <Text style={styles.statValue}>{stats[statKey]}</Text>
        <TouchableOpacity onPress={() => handleStatChange(statKey, 10)}>
          <Ionicons name="add-circle-outline" size={32} color={color} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ImageBackground source={require('../../assets/background.png')} style={styles.bg} imageStyle={{ opacity: 0.2 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>YENİ VARLIK OLUŞTUR</Text>

        {/* Form Alanı */}
        <View style={styles.formCard}>
          <Text style={styles.label}>KOD ADI (İSİM)</Text>
          <TextInput style={styles.input} placeholderTextColor="#555" placeholder="Örn: Cyber Wolf" value={name} onChangeText={setName} />

          <Text style={styles.label}>SINIF (ROL)</Text>
          <TextInput style={styles.input} placeholderTextColor="#555" placeholder="Örn: Hacker" value={role} onChangeText={setRole} />

          <Text style={styles.label}>BİYOGRAFİ</Text>
          <TextInput style={[styles.input, { height: 80 }]} multiline placeholderTextColor="#555" placeholder="Hikayesi nedir?" value={desc} onChangeText={setDesc} />
        </View>

        {/* Stat Ayarları */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>GÜÇ PARAMETRELERİ</Text>
          <StatControl label="PWR" statKey="power" color="#00f3ff" />
          <StatControl label="DEF" statKey="defense" color="#39ff14" />
          <StatControl label="MGC" statKey="magic" color="#9d00ff" />
          <StatControl label="SPD" statKey="speed" color="#ffeb3b" />
        </View>

        {/* Kaydet Butonu */}
        <TouchableOpacity onPress={saveCharacter} activeOpacity={0.8}>
          <LinearGradient colors={['#00f3ff', '#bc13fe']} start={{x:0, y:0}} end={{x:1, y:0}} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>SİSTEME YÜKLE</Text>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#000' },
  container: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  title: { fontSize: 24, fontFamily: 'Orbitron', color: '#bc13fe', textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
  formCard: { backgroundColor: 'rgba(20,20,20,0.8)', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#333', marginBottom: 20 },
  label: { color: '#00f3ff', fontFamily: 'Orbitron', marginBottom: 5, fontSize: 12 },
  input: { backgroundColor: '#111', color: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#444', marginBottom: 15, fontFamily: 'Orbitron' },
  sectionTitle: { color: '#fff', fontFamily: 'Orbitron', textAlign: 'center', marginBottom: 15, fontSize: 16 },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statLabel: { fontSize: 16, fontFamily: 'Orbitron', fontWeight: 'bold', width: 50 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statValue: { color: '#fff', fontSize: 18, fontFamily: 'Orbitron', width: 40, textAlign: 'center' },
  saveBtn: { padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#000', fontFamily: 'Orbitron', fontWeight: 'bold', fontSize: 18 }
});