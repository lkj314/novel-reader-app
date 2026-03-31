import React, { useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';

const WEBSITE_URL = 'https://xiaoswz.vercel.app';

// 注入的 JavaScript 代码，优化阅读体验
const injectCustomJS = `
  (function() {
    // 隐藏顶部导航栏和底部信息，提供沉浸式阅读体验
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    
    // 优化阅读页面
    const readerContent = document.querySelector('.chapter-content');
    if (readerContent) {
      readerContent.style.padding = '20px 16px';
      readerContent.style.fontSize = '18px';
      readerContent.style.lineHeight = '1.8';
    }
    
    // 添加加载完成标记
    window.ReactNativeWebView && window.ReactNativeWebView.postMessage('loaded');
  })();
`;

export default function App() {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const handleNavigationStateChange = (navState) => {
    // 当页面加载完成时注入 JS
    if (!navState.loading && webViewRef.current) {
      webViewRef.current.injectJavaScript(injectCustomJS);
    }
  };

  const handleMessage = (event) => {
    if (event.nativeEvent.data === 'loaded') {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        )}
        <WebView
          ref={webViewRef}
          source={{ uri: WEBSITE_URL }}
          onNavigationStateChange={handleNavigationStateChange}
          onMessage={handleMessage}
          onLoadEnd={() => setLoading(false)}
          startInLoadingState={true}
          renderLoading={() => null}
          style={styles.webview}
          // 允许文件访问
          allowFileAccess={true}
          allowFileAccessFromFileURLs={true}
          // 启用 JavaScript
          javaScriptEnabled={true}
          domStorageEnabled={true}
          // 缓存策略
          cacheEnabled={true}
          // 缩放设置
          scalesPageToFit={true}
          // 混合内容模式（允许 HTTP 内容）
          mixedContentMode="compatibility"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
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
    backgroundColor: '#fff',
    zIndex: 10,
  },
});
