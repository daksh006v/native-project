import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  Alert,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { getSurveys, deleteSurvey, type Survey } from '@/utils/storage';
import { Badge } from '@/components/ui/badge';

type Priority = 'low' | 'medium' | 'high' | 'critical';
type FilterOption = 'all' | Priority;

const priorityConfig: Record<Priority, { variant: 'primary' | 'accent' | 'danger' | 'muted'; label: string }> = {
  low: { variant: 'muted', label: 'Low' },
  medium: { variant: 'primary', label: 'Medium' },
  high: { variant: 'accent', label: 'High' },
  critical: { variant: 'danger', label: 'Critical' },
};

const filterOptions: { key: FilterOption; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'low', label: 'Low' },
  { key: 'medium', label: 'Medium' },
  { key: 'high', label: 'High' },
  { key: 'critical', label: 'Critical' },
];

export default function HistoryScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const primaryText = useThemeColor({}, 'primaryText');
  const primaryLight = useThemeColor({}, 'primaryLight');
  const cardColor = useThemeColor({}, 'card');
  const danger = useThemeColor({}, 'danger');

  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const loadSurveys = useCallback(async () => {
    try {
      const data = await getSurveys();
      setSurveys(data);
    } catch {
      Alert.alert('Error', 'Failed to load surveys.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSurveys();
    }, [loadSurveys])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadSurveys();
  }, [loadSurveys]);

  const handleDelete = (survey: Survey) => {
    Alert.alert(
      'Delete Survey',
      `Are you sure you want to delete "${survey.siteName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSurvey(survey.id);
              setSurveys(prev => prev.filter(s => s.id !== survey.id));
            } catch {
              Alert.alert('Error', 'Failed to delete survey.');
            }
          },
        },
      ],
    );
  };

  const handleView = (survey: Survey) => {
    router.push({
      pathname: '/(drawer)/survey-preview',
      params: {
        siteName: survey.siteName,
        clientName: survey.clientName,
        description: survey.description,
        priority: survey.priority,
        date: survey.date,
      },
    });
  };

  const filteredSurveys = useMemo(() => {
    let result = surveys;
    if (activeFilter !== 'all') {
      result = result.filter(s => s.priority === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        s =>
          s.siteName.toLowerCase().includes(q) ||
          s.clientName.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q),
      );
    }
    return result;
  }, [surveys, activeFilter, searchQuery]);

  const renderItem = ({ item }: { item: Survey }) => {
    const config = priorityConfig[item.priority as Priority];
    const dateStr = new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return (
      <Card style={styles.surveyCard}>
        <View style={styles.cardTop}>
          <View style={styles.cardTopLeft}>
            <Text style={[styles.surveyId, { color: muted }]}>{item.id}</Text>
            <Text style={[styles.surveyName, { color: text }]} numberOfLines={1}>
              {item.siteName}
            </Text>
            <View style={styles.clientRow}>
              <MaterialIcons name="person" size={14} color={muted} />
              <Text style={[styles.surveyClient, { color: muted }]}>
                {item.clientName}
              </Text>
            </View>
          </View>
          <View style={styles.cardTopRight}>
            <Badge label={config.label} variant={config.variant} />
            <Text style={[styles.dateText, { color: muted }]}>{dateStr}</Text>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardActions}>
          <Pressable
            style={({ pressed }) => [
              styles.viewBtn,
              { backgroundColor: primary },
              pressed && styles.pressed,
            ]}
            onPress={() => handleView(item)}
          >
            <MaterialIcons name="visibility" size={18} color={primaryText} />
            <Text style={[styles.viewBtnText, { color: primaryText }]}>View Details</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.deleteBtn,
              { backgroundColor: danger + '15' },
              pressed && styles.pressed,
            ]}
            onPress={() => handleDelete(item)}
          >
            <MaterialIcons name="delete-outline" size={20} color={danger} />
          </Pressable>
        </View>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: background }]}>
        <Text style={[styles.headerTitle, { color: text }]}>History</Text>
        <Pressable
          style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          onPress={openDrawer}
          hitSlop={12}
        >
          <MaterialIcons name="menu" size={28} color={text} />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: cardColor }]}>
          <MaterialIcons name="search" size={24} color={muted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: text }]}
            placeholder="Search by site, client, or ID..."
            placeholderTextColor={muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={10} style={styles.clearBtn}>
              <MaterialIcons name="close" size={20} color={muted} />
            </Pressable>
          )}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          data={filterOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          keyExtractor={(item) => item.key}
          renderItem={({ item: filter }) => {
            const isActive = activeFilter === filter.key;
            return (
              <Pressable
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? primary : primaryLight,
                  },
                ]}
                onPress={() => setActiveFilter(filter.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isActive ? primaryText : muted },
                  ]}
                >
                  {filter.label}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <View style={styles.countContainer}>
        <Text style={[styles.countText, { color: muted }]}>
          {filteredSurveys.length} Survey{filteredSurveys.length !== 1 && 's'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={primary} />
        </View>
      ) : (
        <FlatList
          data={filteredSurveys}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={primary}
              colors={[primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIcon, { backgroundColor: primaryLight }]}>
                <MaterialIcons name="history" size={48} color={primaryText} />
              </View>
              <Text style={[styles.emptyTitle, { color: text }]}>No Surveys Found</Text>
              <Text style={[styles.emptyDesc, { color: muted }]}>
                {searchQuery || activeFilter !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Create your first survey to see it here.'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  headerTitle: {
    fontFamily: 'Inter_800ExtraBold',
    fontSize: 24,
    letterSpacing: -0.5,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
      android: { elevation: 2 },
    }),
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
  },
  clearBtn: {
    padding: 4,
  },
  filterContainer: {
    paddingBottom: 12,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  filterChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  countContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  countText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  surveyCard: {
    padding: 20,
    marginBottom: 16,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTopLeft: {
    flex: 1,
    marginRight: 12,
    gap: 6,
  },
  surveyId: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  surveyName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    letterSpacing: -0.3,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  surveyClient: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  cardTopRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  dateText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  cardDivider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginVertical: 16,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  viewBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  deleteBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8,
  },
  emptyDesc: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  pressed: {
    opacity: 0.7,
  },
});
