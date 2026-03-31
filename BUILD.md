# 构建说明

本文档说明如何在本地构建冲浪中文阅读 Android APK。

## 前置要求

### 1. 安装 Node.js

```bash
# 下载并安装 Node.js 18 LTS
# https://nodejs.org/

# 验证安装
node -v  # 应显示 v18.x.x
npm -v   # 应显示 9.x.x
```

### 2. 安装 Java JDK 17

```bash
# Windows
# 下载并安装 OpenJDK 17
# https://adoptium.net/

# 验证安装
java -version  # 应显示 17.x.x
```

### 3. 安装 Android Studio

```bash
# 下载并安装 Android Studio
# https://developer.android.com/studio

# 安装 Android SDK
# 在 Android Studio 中：Tools → SDK Manager
# 勾选 Android 13.0 (API 33) 和 Android SDK Build-Tools 33

# 设置环境变量（Windows）
# ANDROID_HOME = C:\Users\[用户名]\AppData\Local\Android\Sdk
# PATH 添加: %ANDROID_HOME%\platform-tools
```

### 4. 安装 React Native CLI

```bash
npm install -g react-native-cli
```

## 构建步骤

### 1. 初始化项目

```bash
# 进入项目目录
cd novel-reader-app

# 安装依赖
npm install
```

### 2. 配置 Android 项目

由于我们需要完整的 Android 项目结构，建议：

**方法一：使用 `npx react-native init` 初始化（推荐）**

```bash
# 在上级目录创建临时项目
cd ..
npx react-native init NovelReaderTemp --version 0.73.0

# 复制 Android 文件夹
cp -r NovelReaderTemp/android novel-reader-app/

# 删除临时项目
rm -rf NovelReaderTemp

# 回到项目目录
cd novel-reader-app
```

**方法二：手动配置（较复杂）**

参考 React Native 官方文档手动创建 Android 配置文件。

### 3. 修改应用信息

编辑 `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        applicationId "com.xiaoswz.reader"  // 应用包名
        minSdkVersion 21
        targetSdkVersion 33
        versionCode 1
        versionName "1.0.0"
    }
}
```

编辑 `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.xiaoswz.reader">
    
    <uses-permission android:name="android.permission.INTERNET" />
    
    <application
        android:name=".MainApplication"
        android:label="冲浪中文阅读"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:allowBackup="false"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:label="冲浪中文阅读"
            android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
            android:launchMode="singleTask"
            android:windowSoftInputMode="adjustResize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

### 4. 替换应用图标

准备以下尺寸的图标文件：
- `mipmap-mdpi/ic_launcher.png` (48x48)
- `mipmap-hdpi/ic_launcher.png` (72x72)
- `mipmap-xhdpi/ic_launcher.png` (96x96)
- `mipmap-xxhdpi/ic_launcher.png` (144x144)
- `mipmap-xxxhdpi/ic_launcher.png` (192x192)

放置到 `android/app/src/main/res/` 对应文件夹。

### 5. 构建调试版 APK

```bash
# 进入 Android 目录
cd android

# 清理之前的构建
./gradlew clean

# 构建调试版 APK
./gradlew assembleDebug

# 生成的 APK 位于：
# android/app/build/outputs/apk/debug/app-debug.apk
```

### 6. 构建发布版 APK

```bash
# 生成签名密钥
keytool -genkeypair -v -storetype PKCS12 -keystore xiaoswz-release.keystore -alias xiaoswz -keyalg RSA -keysize 2048 -validity 10000

# 编辑 android/gradle.properties 添加签名配置
MYAPP_RELEASE_STORE_FILE=xiaoswz-release.keystore
MYAPP_RELEASE_KEY_ALIAS=xiaoswz
MYAPP_RELEASE_STORE_PASSWORD=你的密码
MYAPP_RELEASE_KEY_PASSWORD=你的密码

# 编辑 android/app/build.gradle 添加签名配置
android {
    signingConfigs {
        release {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}

# 构建发布版 APK
./gradlew assembleRelease

# 生成的 APK 位于：
# android/app/build/outputs/apk/release/app-release.apk
```

## 常见问题

### 1. Gradle 下载慢

编辑 `android/gradle/wrapper/gradle-wrapper.properties`:
```properties
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-7.5.1-all.zip
```

### 2. SDK 未找到

确保设置了 `ANDROID_HOME` 环境变量：
```bash
# Windows
setx ANDROID_HOME "C:\Users\[用户名]\AppData\Local\Android\Sdk"

# 重启命令行窗口后验证
echo %ANDROID_HOME%
```

### 3. 构建失败

```bash
# 清理缓存
cd android
./gradlew clean
rm -rf app/build

# 重新构建
./gradlew assembleRelease
```

## 发布到 GitHub Releases

1. 重命名 APK：
   ```bash
   mv app-release.apk xiaoswz-reader-v1.0.0.apk
   ```

2. 计算文件哈希：
   ```bash
   certutil -hashfile xiaoswz-reader-v1.0.0.apk SHA256
   ```

3. 上传到 GitHub：
   - 进入仓库的 Releases 页面
   - 点击 "Draft a new release"
   - 填写版本号（v1.0.0）
   - 上传 APK 文件
   - 发布 Release

## 自动化构建（可选）

创建 GitHub Actions 工作流：

`.github/workflows/build.yml`:
```yaml
name: Build APK

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build APK
        run: |
          cd android
          ./gradlew assembleRelease
          
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-release
          path: android/app/build/outputs/apk/release/app-release.apk
```

## 下一步

- [ ] 添加离线缓存功能
- [ ] 添加夜间模式
- [ ] 添加书架功能
- [ ] 优化阅读体验
