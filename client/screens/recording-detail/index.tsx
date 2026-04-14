import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeRouter, useSafeSearchParams } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import { Feather } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
// import * as Sharing from 'expo-sharing'; // 暂时禁用分享功能

type Params = {
  uri?: string;
  duration?: number;
  snoreCount?: number;
  avgDecibel?: number;
  date?: string;
  id?: string;
};

export default function RecordingDetailScreen() {
  const router = useSafeRouter();
  const params = useSafeSearchParams<Params>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [duration, setDuration] = useState(params.duration || 0);
  const [decibelThreshold, setDecibelThreshold] = useState(-45);
  const [hasPermission, setHasPermission] = useState(false);

  const soundRef = useRef<Audio.Sound | null>(null);

  const onPlaybackStatusUpdate = useCallback((status: any) => {
    if (status.isLoaded) {
      if (status.isPlaying) {
        setPlaybackPosition(status.positionMillis);
      } else {
        setIsPlaying(false);
      }

      if (status.didJustFinish) {
        setPlaybackPosition(0);
        setIsPlaying(false);
      }
    }
  }, []);

  const loadAudio = useCallback(async (uri: string) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis || 0);
      }
    } catch (error) {
      console.error('加载音频失败:', error);
    }
  }, [onPlaybackStatusUpdate]);

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    }).catch(console.error);

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (!params.uri || !hasPermission) return;

    let mounted = true;

    (async () => {
      if (mounted && params.uri) {
        await loadAudio(params.uri);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [params.uri, hasPermission, loadAudio]);

  const togglePlayback = async () => {
    if (!soundRef.current) return;

    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('播放控制失败:', error);
    }
  };

  const seekToPosition = async (position: number) => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.setPositionAsync(position);
      setPlaybackPosition(position);
    } catch (error) {
      console.error('跳转失败:', error);
    }
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDecibel = (decibel: number) => {
    return decibel.toFixed(1);
  };

  const shareRecording = async () => {
    // 暂时禁用分享功能
    // if (params.uri) {
    //   try {
    //     await Sharing.shareAsync(params.uri);
    //   } catch (error) {
    //     console.error('分享失败:', error);
    //   }
    // }
    alert('分享功能暂不可用');
  };

  // 生成模拟波形数据
  const generateWaveformData = () => {
    const bars = 60;
    const data = Array.from({ length: bars }, () => {
      const decibel = Math.random() * 25 - 55; // -55 到 -30 dB
      return {
        height: Math.random() * 40 + 8,
        decibel,
        isHigh: decibel > decibelThreshold,
      };
    });
    return data;
  };

  const waveformData = generateWaveformData();

  return (
    <Screen style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 顶部信息 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#EEEAF6" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>录音详情</Text>
          <TouchableOpacity onPress={shareRecording}>
            <Feather name="share-2" size={24} color="#EEEAF6" />
          </TouchableOpacity>
        </View>

        {/* 录音基本信息 */}
        <BlurView intensity={20} tint="dark" style={styles.infoBlur}>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>录音时长</Text>
                <Text style={styles.infoValue}>{formatTime(duration * 1000)}</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>疑似打鼾</Text>
                <Text style={styles.infoValue}>{params.snoreCount || 0} 次</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>平均分贝</Text>
                <Text style={styles.infoValue}>
                  {formatDecibel(params.avgDecibel || -45)} dB
                </Text>
              </View>
            </View>
          </View>
        </BlurView>

        {/* 波形可视化 */}
        <BlurView intensity={20} tint="dark" style={styles.waveformBlur}>
          <View style={styles.waveformCard}>
            <Text style={styles.waveformTitle}>音频波形</Text>
            <View style={styles.waveformContainer}>
              {waveformData.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.waveformBar,
                    {
                      height: item.height,
                      backgroundColor: item.isHigh ? '#F2A7E0' : '#7B6EF6',
                    },
                  ]}
                />
              ))}
            </View>
            <View style={styles.waveformLegend}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: '#7B6EF6' }]}
                />
                <Text style={styles.legendText}>正常</Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: '#F2A7E0' }]}
                />
                <Text style={styles.legendText}>疑似打鼾</Text>
              </View>
            </View>
          </View>
        </BlurView>

        {/* 分贝阈值调节 */}
        <BlurView intensity={20} tint="dark" style={styles.thresholdBlur}>
          <View style={styles.thresholdCard}>
            <View style={styles.thresholdHeader}>
              <Text style={styles.thresholdTitle}>分贝阈值</Text>
              <View style={styles.thresholdValue}>
                <LinearGradient
                  colors={['#7B6EF6', '#5CE0D8']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.thresholdValueGradient}
                >
                  <Text style={styles.thresholdValueText}>
                    {formatDecibel(decibelThreshold)} dB
                  </Text>
                </LinearGradient>
              </View>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={-60}
              maximumValue={-30}
              step={1}
              value={decibelThreshold}
              onValueChange={setDecibelThreshold}
              minimumTrackTintColor="#7B6EF6"
              maximumTrackTintColor="rgba(255, 255, 255, 0.1)"
              thumbTintColor="#5CE0D8"
            />
            <View style={styles.thresholdLabels}>
              <Text style={styles.thresholdLabel}>-60dB</Text>
              <Text style={styles.thresholdLabel}>-45dB</Text>
              <Text style={styles.thresholdLabel}>-30dB</Text>
            </View>
          </View>
        </BlurView>

        {/* 播放控制 */}
        <View style={styles.playbackContainer}>
          <Text style={styles.playbackTime}>
            {formatTime(playbackPosition)} / {formatTime(duration * 1000)}
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBg}>
              <LinearGradient
                colors={['#7B6EF6', '#5CE0D8', '#F2A7E0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressFill,
                  {
                    width: `${(playbackPosition / (duration * 1000)) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={togglePlayback}
            style={styles.playButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#7B6EF6', '#5CE0D8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.playButtonGradient}
            >
              <Feather
                name={isPlaying ? 'pause' : 'play'}
                size={32}
                color="#EEEAF6"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1026',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#EEEAF6',
  },
  infoBlur: {
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 11,
    color: '#8E8BA3',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EEEAF6',
  },
  infoDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 16,
  },
  waveformBlur: {
    marginBottom: 16,
  },
  waveformCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
  },
  waveformTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EEEAF6',
    marginBottom: 16,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
    marginBottom: 12,
  },
  waveformBar: {
    width: 5,
    borderRadius: 2.5,
    backgroundColor: '#7B6EF6',
  },
  waveformLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#8E8BA3',
  },
  thresholdBlur: {
    marginBottom: 24,
  },
  thresholdCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
  },
  thresholdHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  thresholdTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EEEAF6',
  },
  thresholdValue: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  thresholdValueGradient: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  thresholdValueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#EEEAF6',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  thresholdLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  thresholdLabel: {
    fontSize: 11,
    color: '#8E8BA3',
  },
  playbackContainer: {
    alignItems: 'center',
  },
  playbackTime: {
    fontSize: 14,
    color: '#8E8BA3',
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progressBg: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#7B6EF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  playButtonGradient: {
    flex: 1,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
