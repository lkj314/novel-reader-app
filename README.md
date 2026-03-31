# 冲浪中文阅读 APP

基于 React Native 开发的 Android 小说阅读应用，内置冲浪中文网书源。

## 功能特性

- ✅ 内置书源，无需手动导入
- ✅ 支持书籍搜索、分类浏览
- ✅ 支持章节目录浏览
- ✅ 支持在线阅读（可调整字体、背景、行距）
- ✅ 支持阅读进度保存
- ✅ 轻量级 APK，无需额外依赖

## 下载安装

### Android APK

前往 [Releases](https://github.com/lkj314/novel-reader-app/releases) 页面下载最新版 APK。

### 系统要求

- Android 5.0 (API 21) 及以上
- 约 10MB 存储空间

## 使用方法

1. 安装 APK
2. 打开应用，自动加载书源
3. 浏览书库或搜索小说
4. 点击书籍查看详情和目录
5. 点击章节开始阅读

## 书源说明

本应用内置冲浪中文网书源，网站地址：https://xiaoswz.vercel.app

### 手动导入书源（适用于 Legado 阅读 APP）

如果你想使用其他阅读 APP（如 Legado 阅读 3.0），可以手动导入书源：

**方法一：网络导入**
```
https://xiaoswz.vercel.app/legado-book-source.json
```

**方法二：本地导入**
1. 下载 `legado-book-source.json` 文件
2. 打开阅读 APP → 我的 → 书源管理 → 本地导入
3. 选择下载的 JSON 文件

## 技术架构

- **框架**: React Native 0.73
- **平台**: Android
- **渲染方式**: WebView + 原生优化
- **书源格式**: Legado 书源 JSON 规范

## 开发说明

### 环境要求

- Node.js 18+
- Java JDK 17
- Android Studio
- React Native CLI

### 构建步骤

```bash
# 克隆仓库
git clone https://github.com/lkj314/novel-reader-app.git
cd novel-reader-app

# 安装依赖
npm install

# 运行调试版
npx react-native run-android

# 构建发布版 APK
cd android
./gradlew assembleRelease
```

### 项目结构

```
novel-reader-app/
├── android/          # Android 原生代码
├── ios/              # iOS 原生代码（未开发）
├── src/
│   ├── components/   # React Native 组件
│   ├── screens/      # 页面组件
│   ├── utils/        # 工具函数
│   └── App.tsx       # 应用入口
├── index.js          # RN 入口
└── package.json      # 依赖配置
```

## 常见问题

**Q: 为什么没有 iOS 版本？**  
A: iOS 需要开发者账号（$99/年）且审核严格，暂不考虑开发。

**Q: 支持离线阅读吗？**  
A: 当前版本不支持离线缓存，需要网络连接。

**Q: 如何更新书源？**  
A: 书源已内置，如有更新会在新版 APK 中发布。

**Q: 可以添加其他书源吗？**  
A: 本应用专注冲浪中文网，如需其他书源请使用 Legado 阅读 APP。

## 许可证

MIT License

## 联系方式

- 网站：https://xiaoswz.vercel.app
- GitHub：https://github.com/lkj314/novel-reader-app
