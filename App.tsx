import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  BackHandler,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';

const WEBSITE_URL = 'https://xiaoswz.vercel.app';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = useRef<WebView>(null);

  // 注入的 JavaScript 代码，优化阅读体验
  const injectedJavaScript = `
    (function() {
      // 1. 隐藏导航栏和 footer（在阅读页）
      const isInChapter = window.location.pathname.includes('/chapters/');
      if (isInChapter) {
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        if (header) header.style.display = 'none';
        if (footer) footer.style.display = 'none';
      }
      
      // 2. 优化阅读体验
      const content = document.querySelector('.chapter-content');
      if (content) {
        content.style.padding = '16px';
        content.style.fontSize = '18px';
        content.style.lineHeight = '1.8';
      }
      
      // 3. 监听返回按钮
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'navigation',
        canGoBack: window.history.length > 1
      }));
    })();
  `;

  // 处理 WebView 消息
  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'navigation') {
        setCanGoBack(data.canGoBack);
      }
    } catch (e) {
      // ignore
    }
  };

  // 返回按钮处理
  const handleBackButton = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true;
    }
    Alert.alert(
      '退出应用',
      '确定要退出冲浪中文阅读吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '退出', onPress: () => BackHandler.exitApp() }
      ]
    );
    return true;
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, [canGoBack]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Loading Indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      )}
      
      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: WEBSITE_URL }}
        style={styles.webView}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        injectedJavaScript={injectedJavaScript}
        onMessage={onMessage}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}
        // 性能优化
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        // 缓存策略
        cacheEnabled={true}
        cacheMode="LOAD_DEFAULT"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
  },
});
