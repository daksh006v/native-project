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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '@/components/ui/card';
import { getSurveys, deleteSurvey, type Survey } from '@/utils/storage';

type Priority = 'low' | 'medium' | 'high' | 'critical';
type FilterOption = 'all' | Priority;

const priorityColors: Record<Priority, { bg: string; text: string; label: string }> = {
  low: { bg: '#10B98120', text: '#10B981', label: 'Low' },
  medium: { bg: '#F59E0B20', text: '#F59E0B', label: 'Medium' },
  high: { bg: '#F9731620', text: '#F97316', label: 'High' },
  critical: { bg: '#EF444420', text: '#EF4444', label: 'Critical' },
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
  const primaryLight = useThemeColor({}, 'primaryLight');
  const card = useThemeColor({}, 'card');
  const cardBorder = useThemeColor({}, 'cardBorder');
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
    const pColor = priorityColors[item.priority];
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
            <Text style={[styles.surveyClient, { color: muted }]}>
              <MaterialIcons name="person" size={13} color={muted} /> {item.clientName}
            </Text>
          </View>
          <View style={styles.cardTopRight}>
            <View style={[styles.priorityBadge, { backgroundColor: pColor.bg }]}>
              <Text style={[styles.priorityText, { color: pColor.text }]}>{pColor.label}</Text>
            </View>
            <Text style={[styles.dateText, { color: muted }]}>{dateStr}</Text>
          </View>
        </View>

        <View style={[styles.cardDivider, { backgroundColor: cardBorder }]} />

        <View style={styles.cardActions}>
          <Pressable
            style={({ pressed }) => [
              styles.viewBtn,
              { backgroundColor: primaryLight },
              pressed && styles.pressed,
            ]}
            onPress={() => handleView(item)}
          >
            <MaterialIcons name="visibility" size={16} color={primary} />
            <Text style={[styles.viewBtnText, { color: primary }]}>View</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.deleteBtn,
              pressed && styles.pressed,
            ]}
            onPress={() => handleDelete(item)}
          >
            <MaterialIcons name="delete-outline" size={18} color={danger} />
          </Pressable>
        </View>
      </Card>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: background }]}>
        <Pressable
          style={({ pressed }) => [styles.menuButton, pressed && styles.pressed]}
          onPress={openDrawer}
          hitSlop={12}
        >
          <MaterialIcons name="menu" size={28} color={text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: text }]}>Survey History</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: cardBorder }]}>
          <MaterialIcons name="search" size={22} color={muted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: text }]}
            placeholder="Search by site, client, or ID..."
            placeholderTextColor={muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={10}>
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
                    backgroundColor: isActive ? primary : cardBorder,
                  },
                ]}
                onPress={() => setActiveFilter(filter.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: isActive ? '#FFFFFF' : muted },
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
                <MaterialIcons name="history" size={48} color={primary} />
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
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  filterContainer: {
    paddingBottom: 8,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  countContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  countText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  surveyCard: {
    padding: 16,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTopLeft: {
    flex: 1,
    marginRight: 12,
    gap: 4,
  },
  surveyId: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  surveyName: {
    fontSize: 17,
    fontWeight: '700',
  },
  surveyClient: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  cardTopRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardDivider: {
    height: 1,
    width: '100%',
    marginVertical: 12,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  viewBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239,68,68,0.1)',
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
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  pressed: {
    opacity: 0.6,
  },
});
