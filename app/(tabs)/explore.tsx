import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, ImageBackground, LayoutAnimation, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width, height } = Dimensions.get('window');

export interface GameData {
  id: number;
  name: string;
  role: string;
  difficulty: string;
  image: string;
  description: string;
  stats: { power: number; defense: number; magic: number; speed: number; };
}

export default function ExploreScreen() {
  const [data, setData] = useState<GameData[]>([]);
  const [filteredData, setFilteredData] = useState<GameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState('ALL');
  
  const router = useRouter();

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const url = 'https://gist.githubusercontent.com/canmese/b342a0ac9755ad2637aeee42aef67dbb/raw/0f9ac3a7be53c31afcbfe51e56e200b13a944821/game-data.json';
      const apiRes = await fetch(url);
      const apiJson = await apiRes.json();
      const localCharsStr = await AsyncStorage.getItem('custom_chars');
      const localChars = localCharsStr ? JSON.parse(localCharsStr) : [];
      const combined = [...localChars, ...apiJson];
      
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setData(combined);
      setFilteredData(combined);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllData();
    }, [])
  );

  const applySort = (type: string) => {
    setActiveSort(type);
    let sorted = [...filteredData];
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    if (type === 'ALL') { handleSearch(searchQuery); return; }
    if (type === 'PWR') sorted.sort((a, b) => (b.stats?.power || 0) - (a.stats?.power || 0));
    if (type === 'SPD') sorted.sort((a, b) => (b.stats?.speed || 0) - (a.stats?.speed || 0));
    if (type === 'MGC') sorted.sort((a, b) => (b.stats?.magic || 0) - (a.stats?.magic || 0));
    setFilteredData(sorted);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const newData = data.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : '';
        const roleData = item.role ? item.role.toUpperCase() : '';
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1 || roleData.indexOf(textData) > -1;
      });
      setFilteredData(newData);
    } else {
      setFilteredData(data);
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
          <View style={{flexDirection:'row', gap:10, marginTop:5}}>
            <Text style={{color:'#00f3ff', fontSize:10, fontFamily:'Orbitron'}}>⚔ {item.stats?.power}</Text>
            <Text style={{color:'#ffeb3b', fontSize:10, fontFamily:'Orbitron'}}>⚡ {item.stats?.speed}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('../../assets/background.png')} style={styles.backgroundImage} imageStyle={{ opacity: 0.2 }}>
      <SafeAreaView style={styles.safeArea}>
        
        {/* HEADER: Butonları kaldırdık, sadece başlık ortada */}
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>CYBER DATABASE</Text>
        </View>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#bc13fe" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Karakter Ara..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* SIRALAMA */}
        <View style={styles.filterContainer}>
          {['ALL', 'PWR', 'SPD', 'MGC'].map((type) => (
            <TouchableOpacity 
              key={type} 
              onPress={() => applySort(type)}
              style={[styles.chip, activeSort === type && styles.activeChip]}
            >
              <Text style={[styles.chipText, activeSort === type && styles.activeChipText]}>
                {type === 'ALL' ? 'HEPSİ' : type === 'PWR' ? 'GÜÇLÜ' : type === 'SPD' ? 'HIZLI' : 'BÜYÜ'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#00f3ff" /></View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<Text style={styles.emptyText}>Kayıt Bulunamadı...</Text>}
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1, width: width, height: height, backgroundColor: '#000000' },
  safeArea: { flex: 1 },
  // HEADER GÜNCELLENDİ: Ortalanmış başlık
  headerContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 15, marginBottom: 5 },
  headerTitle: { fontSize: 22, color: '#00f3ff', fontFamily: 'Orbitron', fontWeight: 'bold', textShadowColor: 'rgba(0, 243, 255, 0.75)', textShadowRadius: 10 },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(20, 20, 20, 0.9)', marginHorizontal: 16, marginBottom: 10, borderRadius: 12, borderWidth: 1, borderColor: '#bc13fe', paddingHorizontal: 10, height: 50 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#ffffff', fontFamily: 'Orbitron', fontSize: 14 },
  
  filterContainer: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 15, gap: 10 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#333', backgroundColor: '#111' },
  activeChip: { backgroundColor: '#bc13fe', borderColor: '#bc13fe' },
  chipText: { color: '#666', fontFamily: 'Orbitron', fontSize: 12 },
  activeChipText: { color: '#fff', fontWeight: 'bold' },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  emptyText: { color: '#666', textAlign: 'center', marginTop: 50, fontFamily: 'Orbitron' },
  
  card: { flexDirection: 'row', marginBottom: 16, borderRadius: 12, borderWidth: 1, borderColor: '#bc13fe', padding: 10, alignItems: 'center' },
  image: { width: 70, height: 70, borderRadius: 8, borderWidth: 1, borderColor: '#00f3ff', backgroundColor: '#222' },
  infoContainer: { marginLeft: 15, flex: 1, justifyContent: 'center' },
  name: { fontSize: 18, color: '#ffffff', fontFamily: 'Orbitron', marginBottom: 4, fontWeight: 'bold' },
  roleText: { fontSize: 14, color: '#bc13fe', fontFamily: 'Orbitron' },
});