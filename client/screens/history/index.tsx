import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import { Feather } from '@expo/vector-icons';

// 模拟数据
const mockRecordings = [
  {
    id: '1',
    date: '2026-02-06',
    duration: 284, // 秒
    snoreCount: 23,
    fileSize: '4.2 MB',
    avgDecibel: -42.3,
  },
  {
    id: '2',
    date: '2026-02-05',
    duration: 312,
    snoreCount: 18,
    fileSize: '4.6 MB',
    avgDecibel: -45.1,
  },
  {
    id: '3',
    date: '2026-02-04',
    duration: 298,
    snoreCount: 31,
    fileSize: '4.3 MB',
    avgDecibel: -38.7,
  },
];

export default function HistoryScreen() {
  const router = useSafeRouter();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[date.getDay()];
    return `${month}月${day}日 ${weekday}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  const getSnoreLevelColor = (count: number) => {
    if (count <= 15) return '#5CE0D8'; // 极光青 - 轻
    if (count <= 25) return '#7B6EF6'; // 极光紫 - 中
    return '#F2A7E0'; // 极光粉 - 重
  };

  const getSnoreLevelText = (count: number) => {
    if (count <= 15) return '轻度';
    if (count <= 25) return '中度';
    return '较重';
  };

  const renderRecordingItem = ({ item }: { item: typeof mockRecordings[0] }) => (
    <TouchableOpacity
      onPress={() =>
        router.push('/detail', {
          id: item.id,
          date: item.date,
          duration: item.duration,
          snoreCount: item.snoreCount,
          avgDecibel: item.avgDecibel,
        })
      }
      activeOpacity={0.8}
    >
      <BlurView intensity={20} tint="dark" style={styles.cardBlur}>
        <View style={styles.card}>
          {/* 日期标题 */}
          <View style={styles.cardHeader}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{formatDate(item.date)}</Text>
            </View>
            <View
              style={[
                styles.snoreLevelBadge,
                { backgroundColor: `${getSnoreLevelColor(item.snoreCount)}15` },
              ]}
            >
              <Text
                style={[
                  styles.snoreLevelText,
                  { color: getSnoreLevelColor(item.snoreCount) },
                ]}
              >
                {getSnoreLevelText(item.snoreCount)}
              </Text>
            </View>
          </View>

          {/* 数据统计 */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Feather name="clock" size={20} color="#5CE0D8" />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>录音时长</Text>
                <Text style={styles.statValue}>{formatDuration(item.duration)}</Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Feather name="volume-2" size={20} color="#7B6EF6" />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>疑似打鼾</Text>
                <Text style={styles.statValue}>{item.snoreCount} 次</Text>
              </View>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Feather name="database" size={20} color="#F2A7E0" />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>文件大小</Text>
                <Text style={styles.statValue}>{item.fileSize}</Text>
              </View>
            </View>
          </View>

          {/* 分贝显示 */}
          <View style={styles.decibelBar}>
            <View style={styles.decibelBarBg}>
              <LinearGradient
                colors={['#7B6EF6', '#5CE0D8', '#F2A7E0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.decibelBarFill,
                  {
                    width: `${Math.min(
                      Math.max(
                        ((item.avgDecibel + 60) / 30) * 100,
                        10
                      ),
                      100
                    )}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.decibelText}>
              平均 {item.avgDecibel.toFixed(1)} dB
            </Text>
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <Screen style={styles.container}>
      {/* 顶部标题 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>历史记录</Text>
        <Text style={styles.headerSubtitle}>共 {mockRecordings.length} 条录音</Text>
      </View>

      {/* 列表 */}
      <FlatList
        data={mockRecordings}
        renderItem={renderRecordingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1026',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#EEEAF6',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8BA3',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  cardBlur: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
    shadowColor: '#7B6EF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#EEEAF6',
  },
  snoreLevelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  snoreLevelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(123, 110, 246, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statInfo: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#8E8BA3',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EEEAF6',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 12,
  },
  decibelBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  decibelBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    marginRight: 12,
    overflow: 'hidden',
  },
  decibelBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  decibelText: {
    fontSize: 13,
    color: '#8E8BA3',
  },
});
