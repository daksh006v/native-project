import AsyncStorage from '@react-native-async-storage/async-storage';

export type Survey = {
  id: string;
  siteName: string;
  clientName: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  createdAt: string;
};

const SURVEYS_KEY = '@smart_survey:surveys';

export const saveSurvey = async (survey: Omit<Survey, 'id' | 'createdAt'>): Promise<Survey> => {
  try {
    const existingStr = await AsyncStorage.getItem(SURVEYS_KEY);
    const existing: Survey[] = existingStr ? JSON.parse(existingStr) : [];
    
    const newSurvey: Survey = {
      ...survey,
      id: `SRV-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
    };
    
    const updated = [newSurvey, ...existing];
    await AsyncStorage.setItem(SURVEYS_KEY, JSON.stringify(updated));
    return newSurvey;
  } catch (error) {
    console.error('Error saving survey:', error);
    throw error;
  }
};

export const getSurveys = async (): Promise<Survey[]> => {
  try {
    const data = await AsyncStorage.getItem(SURVEYS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting surveys:', error);
    return [];
  }
};

export const deleteSurvey = async (id: string): Promise<void> => {
  try {
    const existing = await getSurveys();
    const updated = existing.filter(s => s.id !== id);
    await AsyncStorage.setItem(SURVEYS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting survey:', error);
    throw error;
  }
};
