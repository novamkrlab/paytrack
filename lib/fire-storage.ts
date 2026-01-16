/**
 * FIRE Ayarları AsyncStorage Yönetimi
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FireSettings } from '@/types/fire';
import { DEFAULT_FIRE_SETTINGS } from '@/types/fire';

const FIRE_SETTINGS_KEY = '@fire_settings';

/**
 * FIRE ayarlarını kaydet
 * @param settings FIRE ayarları
 */
export async function saveFireSettings(settings: FireSettings): Promise<void> {
  try {
    const settingsWithTimestamp = {
      ...settings,
      lastUpdated: new Date().toISOString(),
    };
    await AsyncStorage.setItem(FIRE_SETTINGS_KEY, JSON.stringify(settingsWithTimestamp));
  } catch (error) {
    console.error('FIRE ayarları kaydedilemedi:', error);
    throw error;
  }
}

/**
 * FIRE ayarlarını yükle
 * @returns FIRE ayarları veya null
 */
export async function loadFireSettings(): Promise<FireSettings | null> {
  try {
    const json = await AsyncStorage.getItem(FIRE_SETTINGS_KEY);
    if (!json) {
      return null;
    }
    return JSON.parse(json) as FireSettings;
  } catch (error) {
    console.error('FIRE ayarları yüklenemedi:', error);
    return null;
  }
}

/**
 * FIRE ayarlarını sıfırla
 */
export async function resetFireSettings(): Promise<void> {
  try {
    await AsyncStorage.removeItem(FIRE_SETTINGS_KEY);
  } catch (error) {
    console.error('FIRE ayarları sıfırlanamadı:', error);
    throw error;
  }
}

/**
 * FIRE ayarlarını güncelle (kısmi güncelleme)
 * @param updates Güncellenecek alanlar
 */
export async function updateFireSettings(updates: Partial<FireSettings>): Promise<FireSettings> {
  try {
    const current = await loadFireSettings();
    const updated = {
      ...(current || DEFAULT_FIRE_SETTINGS),
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    await saveFireSettings(updated);
    return updated;
  } catch (error) {
    console.error('FIRE ayarları güncellenemedi:', error);
    throw error;
  }
}
