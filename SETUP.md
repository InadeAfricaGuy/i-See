# Development Environment Setup Guide

This guide will help you set up your development environment for the i-See mobile application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Platform-Specific Setup](#platform-specific-setup)
- [Environment Configuration](#environment-configuration)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [IDE Setup](#ide-setup)
- [Development Tools](#development-tools)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

#### macOS (for iOS and Android development)

- **macOS 12.0 (Monterey) or later** - Required for iOS development
- **Node.js 18.x or later** - [Download](https://nodejs.org/)
- **npm 9.x or later** - Comes with Node.js
- **Xcode 14.0 or later** - [Download from App Store](https://apps.apple.com/app/xcode/id497799835)
- **CocoaPods 1.12 or later** - iOS dependency manager
- **Android Studio** - [Download](https://developer.android.com/studio)
- **Java Development Kit (JDK) 17** - Required for Android

#### Linux (for Android development only)

- **Ubuntu 20.04 LTS or later** (or equivalent Linux distribution)
- **Node.js 18.x or later**
- **npm 9.x or later**
- **Android Studio**
- **Java Development Kit (JDK) 17**

#### Windows (for Android development only)

- **Windows 10/11**
- **Node.js 18.x or later**
- **npm 9.x or later**
- **Android Studio**
- **Java Development Kit (JDK) 17**

### Optional but Recommended

- **Git** - Version control
- **Watchman** - File watching service (macOS/Linux)
- **VS Code** - Recommended IDE
- **React Native Debugger** - Standalone debugging app

## Installation Steps

### 1. Install Node.js and npm

#### macOS/Linux

Using nvm (Node Version Manager) - recommended:

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.bashrc  # or ~/.zshrc for zsh

# Install Node.js
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
node --version  # Should be v18.x.x or later
npm --version   # Should be 9.x.x or later
```

#### Windows

Download and install from [nodejs.org](https://nodejs.org/)

### 2. Install Watchman (macOS/Linux only)

#### macOS

```bash
brew install watchman
```

#### Linux

```bash
# Follow instructions at https://facebook.github.io/watchman/docs/install
```

### 3. Install Git

#### macOS

```bash
brew install git
```

#### Linux

```bash
sudo apt-get install git
```

#### Windows

Download from [git-scm.com](https://git-scm.com/)

## Platform-Specific Setup

### iOS Development (macOS only)

#### 1. Install Xcode

1. Download Xcode from the Mac App Store
2. Open Xcode and accept the license agreement
3. Install Xcode Command Line Tools:

```bash
xcode-select --install
```

#### 2. Install CocoaPods

```bash
sudo gem install cocoapods
```

Or using Homebrew:

```bash
brew install cocoapods
```

#### 3. Configure Xcode

1. Open Xcode
2. Go to Preferences → Locations
3. Ensure Command Line Tools is set to your Xcode version

### Android Development (All platforms)

#### 1. Install Java Development Kit (JDK) 17

##### macOS

```bash
brew install openjdk@17

# Add to PATH
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

##### Linux

```bash
sudo apt-get install openjdk-17-jdk
```

##### Windows

Download and install from [Oracle](https://www.oracle.com/java/technologies/downloads/) or [Adoptium](https://adoptium.net/)

#### 2. Install Android Studio

1. Download from [developer.android.com/studio](https://developer.android.com/studio)
2. Run the installer
3. During installation, ensure these components are selected:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device

#### 3. Configure Android SDK

1. Open Android Studio
2. Go to Settings → Appearance & Behavior → System Settings → Android SDK
3. Install the following:
   - Android SDK Platform 33 (Android 13)
   - Android SDK Build-Tools
   - Android SDK Command-line Tools
   - Android SDK Platform-Tools
   - Android Emulator
   - Intel x86 Emulator Accelerator (HAXM installer)

#### 4. Set Environment Variables

##### macOS/Linux

Add to `~/.zshrc` or `~/.bashrc`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# export ANDROID_HOME=$HOME/Android/Sdk  # Linux

export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Then run:

```bash
source ~/.zshrc  # or ~/.bashrc
```

##### Windows

1. Open System Properties → Advanced → Environment Variables
2. Add new system variables:
   - `ANDROID_HOME` = `C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk`
3. Add to PATH:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\emulator`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`

#### 5. Create Android Virtual Device (AVD)

1. Open Android Studio
2. Go to Tools → Device Manager
3. Click "Create Device"
4. Select a device (e.g., Pixel 5)
5. Select a system image (e.g., Android 13 - API 33)
6. Finish the setup

## Environment Configuration

### 1. Clone the Repository

```bash
git clone https://github.com/InadeAfricaGuy/i-See.git
cd i-See
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install
```

### 3. Install iOS Dependencies (macOS only)

```bash
cd ios
pod install
cd ..
```

### 4. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration
# nano .env  # or use your preferred editor
```

Required environment variables:

```env
API_BASE_URL=https://api.inadeafrica.com/v1
API_KEY=your_api_key_here
MQTT_BROKER_URL=wss://mqtt.inadeafrica.com:8883
MQTT_USERNAME=app
MQTT_PASSWORD=your_mqtt_password
```

## Verification

### 1. Verify React Native Environment

```bash
npx react-native doctor
```

This will check your environment and report any issues.

### 2. Run the Application

#### iOS (macOS only)

```bash
npm run ios
```

Or open in Xcode:

```bash
open ios/iSee.xcworkspace
```

#### Android

```bash
# Start an emulator first, then:
npm run android
```

### 3. Run Tests

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run linter
npm run lint

# Type checking
npm run type-check
```

## Troubleshooting

### Common Issues

#### iOS Build Failures

**Issue**: CocoaPods not found or pod install fails

**Solution**:
```bash
sudo gem install cocoapods
cd ios
pod repo update
pod install --repo-update
cd ..
```

**Issue**: Xcode build fails with signing errors

**Solution**:
1. Open `ios/iSee.xcworkspace` in Xcode
2. Select the project in the navigator
3. Go to Signing & Capabilities
4. Select your development team

#### Android Build Failures

**Issue**: SDK location not found

**Solution**:
Create `android/local.properties`:
```
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk  # macOS
# sdk.dir=/home/YOUR_USERNAME/Android/Sdk  # Linux
# sdk.dir=C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk  # Windows
```

**Issue**: Gradle build fails

**Solution**:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**Issue**: Unable to load script from Metro bundler

**Solution**:
```bash
npm start -- --reset-cache
```

#### Metro Bundler Issues

**Issue**: Port 8081 already in use

**Solution**:
```bash
# macOS/Linux
lsof -ti:8081 | xargs kill -9

# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F
```

**Issue**: Bundler cache issues

**Solution**:
```bash
npm start -- --reset-cache
```

#### General Issues

**Issue**: Module not found errors

**Solution**:
```bash
rm -rf node_modules
npm install

# iOS
cd ios && pod install && cd ..
```

**Issue**: TypeScript errors

**Solution**:
```bash
npm run type-check
# Fix reported errors
```

## IDE Setup

### Visual Studio Code (Recommended)

#### Install Extensions

1. **React Native Tools** - Microsoft
2. **ES7+ React/Redux/React-Native snippets** - dsznajder
3. **ESLint** - Microsoft
4. **Prettier** - Prettier
5. **TypeScript React code snippets** - infeng
6. **GitLens** - GitKraken
7. **Auto Import** - steoates

#### Configure Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Other IDEs

- **WebStorm**: Built-in React Native support
- **Atom**: Install `nuclide` package
- **Sublime Text**: Install `TypeScript` and `ESLint` packages

## Development Tools

### React Native Debugger

```bash
# macOS
brew install --cask react-native-debugger

# Or download from
# https://github.com/jhen0409/react-native-debugger/releases
```

### Flipper (Recommended)

Download from [fbflipper.com](https://fbflipper.com/)

Features:
- React DevTools
- Network inspector
- Async storage inspector
- Redux inspector
- Layout inspector

### Chrome DevTools

Enable in running app:
- iOS Simulator: `Cmd + D`
- Android Emulator: `Cmd + M` (macOS) or `Ctrl + M` (Windows/Linux)
- Select "Debug"

## Next Steps

After completing the setup:

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
2. Check out the [documentation](./docs) for architecture and API specs
3. Review existing code to understand the project structure
4. Start building! 🚀

## Additional Resources

- [React Native Documentation](https://reactnative.dev/docs/environment-setup)
- [Android Studio User Guide](https://developer.android.com/studio/intro)
- [Xcode Documentation](https://developer.apple.com/xcode/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Support

If you encounter issues not covered in this guide:

1. Check [existing GitHub issues](https://github.com/InadeAfricaGuy/i-See/issues)
2. Create a new issue with detailed information
3. Contact tech@inadeafrica.com

---

**Happy coding! 🎉**
