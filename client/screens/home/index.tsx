import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function HomeScreen() {
  const router = useSafeRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [hasPermission, setHasPermission] = useState(false);
  const [currentDecibel, setCurrentDecibel] = useState(-60);

  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 呼吸动画
  const breatheScale = useSharedValue(1);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    if (isRecording) {
      // 开始录音时长计时
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      // 启动呼吸动画
      breatheScale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      // 模拟分贝值变化（实际应该从录音数据获取）
      const decibelInterval = setInterval(() => {
        setCurrentDecibel(Math.random() * 20 - 50); // -50 到 -30 dB
      }, 200);

      return () => {
        clearInterval(timerRef.current!);
        clearInterval(decibelInterval);
      };
    } else {
      // 使用 setTimeout 避免 setState 在 effect 中直接调用
      const cleanupTimer = setTimeout(() => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        breatheScale.value = 1;
      }, 0);

      return () => clearTimeout(cleanupTimer);
    }
  }, [isRecording, breatheScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breatheScale.value }],
  }));

  const startRecording = async () => {
    if (!hasPermission) {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('需要录音权限才能使用此功能');
        return;
      }
      setHasPermission(true);
    }

    if (recordingRef.current) {
      await recordingRef.current.stopAndUnloadAsync();
      recordingRef.current = null;
    }

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();

      recordingRef.current = recording;
      setIsRecording(true);

      // 触觉反馈
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.error('录音失败:', error);
      alert('录音启动失败');
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);

      // 触觉反馈
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      // 跳转到详情页面
      if (uri) {
        router.push('/detail', { uri, duration: recordingDuration });
      }
    } catch (error) {
      console.error('停止录音失败:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDecibelColor = (decibel: number) => {
    if (decibel > -35) return '#F2A7E0'; // 极光粉 - 高
    if (decibel > -45) return '#5CE0D8'; // 极光青 - 中
    return '#7B6EF6'; // 极光紫 - 低
  };

  const renderWaveform = () => {
    const bars = 20;
    return (
      <View style={styles.waveformContainer}>
        {Array.from({ length: bars }).map((_, i) => {
          const barHeight = isRecording
            ? Math.random() * 60 + 20
            : 8;
          return (
            <AnimatedView
              key={i}
              style={[
                styles.waveformBar,
                {
                  height: isRecording ? barHeight : 8,
                  backgroundColor: getDecibelColor(currentDecibel),
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <Screen style={styles.container}>
      {/* 顶部极光渐变 */}
      <View style={styles.auroraHeader}>
        <LinearGradient
          colors={['rgba(123, 110, 246, 0.25)', 'rgba(92, 224, 216, 0.15)', 'transparent']}
          style={styles.gradient}
        />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>呼噜娃</Text>
          <Text style={styles.headerSubtitle}>
            {isRecording ? '正在监测中...' : '监测您的睡眠声音'}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 录音时长 */}
        {isRecording && (
          <View style={styles.durationContainer}>
            <Text style={styles.durationText}>{formatTime(recordingDuration)}</Text>
          </View>
        )}

        {/* 实时分贝显示 */}
        {isRecording && (
          <View style={styles.decibelContainer}>
            <Text style={styles.decibelLabel}>当前音量</Text>
            <Text
              style={[
                styles.decibelValue,
                { color: getDecibelColor(currentDecibel) },
              ]}
            >
              {currentDecibel.toFixed(1)} dB
            </Text>
          </View>
        )}

        {/* 波形可视化 */}
        {isRecording && (
          <BlurView intensity={20} tint="dark" style={styles.waveformBlur}>
            <View style={styles.waveformCard}>
              {renderWaveform()}
            </View>
          </BlurView>
        )}

        {/* 中央录音按钮 */}
        <View style={styles.buttonContainer}>
          <AnimatedView style={animatedStyle}>
            <TouchableOpacity
              onPress={isRecording ? stopRecording : startRecording}
              activeOpacity={0.8}
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
              ]}
            >
              <LinearGradient
                colors={
                  isRecording
                    ? ['#F2A7E0', '#FF6B6B']
                    : ['#7B6EF6', '#5CE0D8']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.recordButtonGradient}
              >
                <View
                  style={[
                    styles.recordButtonInner,
                    isRecording && styles.recordButtonInnerActive,
                  ]}
                >
                  <Text style={styles.recordButtonText}>
                    {isRecording ? '停止' : '开始录音'}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </AnimatedView>

          <Text style={styles.buttonHint}>
            {isRecording ? '再次点击停止录音' : '点击开始睡眠监测'}
          </Text>
        </View>

        {/* 使用提示 */}
        <BlurView intensity={20} tint="dark" style={styles.tipBlur}>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>使用提示</Text>
            <Text style={styles.tipText}>
              • 将手机放置在床头，距离约 1-2 米
            </Text>
            <Text style={styles.tipText}>
              • 保持麦克风朝向睡眠方向
            </Text>
            <Text style={styles.tipText}>
              • 睡眠期间保持网络畅通
            </Text>
          </View>
        </BlurView>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1026',
  },
  auroraHeader: {
    height: 280,
    overflow: 'hidden',
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  headerContent: {
    marginTop: 80,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '300',
    color: '#EEEAF6',
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8BA3',
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
    alignItems: 'center',
  },
  durationContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  durationText: {
    fontSize: 64,
    fontWeight: '200',
    color: '#EEEAF6',
    letterSpacing: 4,
  },
  decibelContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  decibelLabel: {
    fontSize: 13,
    color: '#8E8BA3',
    marginBottom: 4,
  },
  decibelValue: {
    fontSize: 28,
    fontWeight: '600',
  },
  waveformBlur: {
    width: '100%',
    marginBottom: 32,
  },
  waveformCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
  },
  waveformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
  },
  waveformBar: {
    width: 8,
    borderRadius: 4,
    backgroundColor: '#7B6EF6',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  recordButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    shadowColor: '#7B6EF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 12,
  },
  recordButtonActive: {
    shadowColor: '#F2A7E0',
  },
  recordButtonGradient: {
    flex: 1,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInner: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInnerActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  recordButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EEEAF6',
    letterSpacing: 1,
  },
  buttonHint: {
    fontSize: 13,
    color: '#8E8BA3',
    marginTop: 20,
  },
  tipBlur: {
    width: '100%',
  },
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 20,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EEEAF6',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#8E8BA3',
    lineHeight: 22,
    marginBottom: 8,
  },
});
