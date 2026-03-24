import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Dimensions, FlatList, Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GameData } from './explore'; // Tip tanımını diğer dosyadan aldık

const { width, height } = Dimensions.get('window');

export default function FavoritesScreen() {
  const [favs, setFavs] = useState<GameData[]>([]);
  const router = useRouter();

  // Sayfa her açıldığında favorileri hafızadan yeniden çek
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    try {
      const favsStr = await AsyncStorage.getItem('favorites');
      if (favsStr) {
        setFavs(JSON.parse(favsStr));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const renderItem = ({ item }: { item: GameData }) => (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={() => {
        router.push({
          pathname: "/(tabs)/character/[id]",
          params: { id: item.id, characterData: JSON.stringify(item) }
        });
      }}
    >
      <LinearGradient
        colors={['rgba(43, 15, 66, 0.9)', 'rgba(5, 5, 5, 0.95)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.roleText}>{item.role}</Text>
          {/* Ufak bir favori ikonu süs olsun */}
          <Ionicons name="star" size={16} color="#ffd700" style={{marginTop: 5}} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('../../assets/background.png')} style={styles.backgroundImage} imageStyle={{ opacity: 0.2 }}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>FAVORİLER</Text>
        </View>

        {/* LİSTE */}
        <FlatList
          data={favs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="star-outline" size={50} color="#333" />
              <Text style={styles.emptyText}>Henüz favori eklemedin...</Text>
            </View>
          }
        />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: width, height: height, backgroundColor: '#000000' },
  safeArea: { flex: 1 },
  headerContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#bc13fe' },
  headerTitle: { fontSize: 22, color: '#ffd700', fontFamily: 'Orbitron', fontWeight: 'bold', textShadowColor: 'rgba(255, 215, 0, 0.5)', textShadowRadius: 10 },
  
  listContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 },
  
  card: { flexDirection: 'row', marginBottom: 16, borderRadius: 12, borderWidth: 1, borderColor: '#ffd700', padding: 10, alignItems: 'center' }, // Favori olduğu belli olsun diye Sarı çerçeve
  image: { width: 70, height: 70, borderRadius: 8, borderWidth: 1, borderColor: '#ffd700', backgroundColor: '#222' },
  infoContainer: { marginLeft: 15, flex: 1, justifyContent: 'center' },
  name: { fontSize: 18, color: '#ffffff', fontFamily: 'Orbitron', marginBottom: 4, fontWeight: 'bold' },
  roleText: { fontSize: 14, color: '#bc13fe', fontFamily: 'Orbitron' },

  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#666', marginTop: 10, fontFamily: 'Orbitron', fontSize: 16 }
});