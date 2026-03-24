import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, 
        tabBarStyle: {
          backgroundColor: '#050505', 
          borderTopColor: '#bc13fe',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65, 
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        },
        tabBarActiveTintColor: '#00f3ff', // Seçiliyken Mavi
        tabBarInactiveTintColor: '#666666', // Değilken Gri
        tabBarLabelStyle: {
          fontFamily: 'Orbitron',
          fontSize: 10,
          fontWeight: 'bold',
          marginTop: -5
        },
      }}>

      {/* 1. ANA SAYFA */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'ANA ÜS',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "planet" : "planet-outline"} size={24} color={color} />
          ),
        }}
      />

      {/* 2. LİSTE (VERİ TABANI) */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'VERİ TABANI',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />
          ),
        }}
      />

      {/* 3. OLUŞTUR (ORTADAKİ ARTI BUTONU) */}
      <Tabs.Screen
        name="create"
        options={{
          title: 'OLUŞTUR',
          tabBarIcon: ({ color, focused }) => (
            // Büyük ve dikkat çekici bir artı ikonu
            <Ionicons name="add-circle" size={32} color={focused ? "#bc13fe" : color} />
          ),
        }}
      />

      {/* 4. FAVORİLER (YENİ) */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'FAVORİLER',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "star" : "star-outline"} size={24} color={focused ? "#ffd700" : color} />
          ),
        }}
      />

      {/* 5. DETAY SAYFASI (MENÜDE GİZLİ) */}
      <Tabs.Screen
        name="character/[id]"
        options={{
          href: null, // Gizli
        }}
      />
    </Tabs>
  );
}