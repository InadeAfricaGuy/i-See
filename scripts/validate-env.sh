#!/bin/bash

# i-See Environment Validation Script
# Validates that the development environment is properly configured

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

# Check functions
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED_CHECKS++))
    ((TOTAL_CHECKS++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILED_CHECKS++))
    ((TOTAL_CHECKS++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARNING_CHECKS++))
    ((TOTAL_CHECKS++))
}

# Print header
print_header() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║           i-See Environment Validation                     ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
}

# Check if running on macOS
is_macos() {
    [[ "$OSTYPE" == "darwin"* ]]
}

# Validate Node.js
validate_node() {
    echo ""
    echo "Node.js & npm:"
    echo "──────────────"
    
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'v' -f2 | cut -d'.' -f1)
        
        if [ "$NODE_MAJOR" -ge 18 ]; then
            check_pass "Node.js $NODE_VERSION"
        else
            check_fail "Node.js $NODE_VERSION (version 18+ required)"
        fi
    else
        check_fail "Node.js not installed"
    fi
    
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        check_pass "npm $NPM_VERSION"
    else
        check_fail "npm not installed"
    fi
}

# Validate Git
validate_git() {
    echo ""
    echo "Version Control:"
    echo "────────────────"
    
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version | cut -d' ' -f3)
        check_pass "Git $GIT_VERSION"
    else
        check_fail "Git not installed"
    fi
}

# Validate Watchman
validate_watchman() {
    echo ""
    echo "Development Tools:"
    echo "──────────────────"
    
    if command -v watchman &> /dev/null; then
        WATCHMAN_VERSION=$(watchman --version)
        check_pass "Watchman $WATCHMAN_VERSION"
    else
        if is_macos; then
            check_warn "Watchman not installed (recommended for faster file watching)"
        else
            check_warn "Watchman not installed (optional)"
        fi
    fi
}

# Validate iOS tools (macOS only)
validate_ios_tools() {
    if is_macos; then
        echo ""
        echo "iOS Development:"
        echo "────────────────"
        
        # Check Xcode
        if command -v xcodebuild &> /dev/null; then
            XCODE_VERSION=$(xcodebuild -version | head -n1 | cut -d' ' -f2)
            check_pass "Xcode $XCODE_VERSION"
        else
            check_fail "Xcode not installed"
        fi
        
        # Check Xcode Command Line Tools
        if xcode-select -p &> /dev/null; then
            check_pass "Xcode Command Line Tools"
        else
            check_fail "Xcode Command Line Tools not installed"
        fi
        
        # Check CocoaPods
        if command -v pod &> /dev/null; then
            POD_VERSION=$(pod --version)
            check_pass "CocoaPods $POD_VERSION"
        else
            check_fail "CocoaPods not installed"
        fi
        
        # Check iOS Simulator
        if command -v xcrun &> /dev/null && xcrun simctl list devices &> /dev/null; then
            check_pass "iOS Simulator available"
        else
            check_warn "iOS Simulator may not be properly configured"
        fi
    fi
}

# Validate Android tools
validate_android_tools() {
    echo ""
    echo "Android Development:"
    echo "────────────────────"
    
    # Check ANDROID_HOME
    if [ -n "$ANDROID_HOME" ]; then
        check_pass "ANDROID_HOME is set"
        
        if [ -d "$ANDROID_HOME" ]; then
            check_pass "ANDROID_HOME directory exists"
        else
            check_fail "ANDROID_HOME directory not found: $ANDROID_HOME"
        fi
    else
        check_fail "ANDROID_HOME not set"
    fi
    
    # Check Java
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -n1 | cut -d'"' -f2 | cut -d'.' -f1)
        
        if [ "$JAVA_VERSION" -ge 11 ]; then
            check_pass "Java $JAVA_VERSION"
        else
            check_warn "Java $JAVA_VERSION (version 11+ recommended)"
        fi
    else
        check_fail "Java not installed"
    fi
    
    # Check Android SDK tools
    if [ -n "$ANDROID_HOME" ] && [ -d "$ANDROID_HOME" ]; then
        if [ -f "$ANDROID_HOME/platform-tools/adb" ]; then
            check_pass "Android SDK Platform Tools"
        else
            check_fail "Android SDK Platform Tools not found"
        fi
        
        if [ -d "$ANDROID_HOME/build-tools" ]; then
            BUILD_TOOLS_VERSION=$(ls "$ANDROID_HOME/build-tools" | tail -n1)
            check_pass "Android Build Tools $BUILD_TOOLS_VERSION"
        else
            check_fail "Android Build Tools not found"
        fi
    fi
    
    # Check for Android emulator
    if command -v emulator &> /dev/null; then
        check_pass "Android Emulator available"
    else
        check_warn "Android Emulator not in PATH"
    fi
}

# Validate project dependencies
validate_dependencies() {
    echo ""
    echo "Project Dependencies:"
    echo "─────────────────────"
    
    if [ -d "node_modules" ]; then
        check_pass "node_modules directory exists"
    else
        check_fail "node_modules not found (run 'npm install')"
        return
    fi
    
    # Check if package-lock.json exists
    if [ -f "package-lock.json" ]; then
        check_pass "package-lock.json exists"
    else
        check_warn "package-lock.json not found"
    fi
    
    # Check iOS pods (macOS only)
    if is_macos; then
        if [ -d "ios/Pods" ]; then
            check_pass "iOS Pods installed"
        else
            check_warn "iOS Pods not found (run 'cd ios && pod install')"
        fi
    fi
}

# Validate environment configuration
validate_env_config() {
    echo ""
    echo "Environment Configuration:"
    echo "──────────────────────────"
    
    if [ -f ".env" ]; then
        check_pass ".env file exists"
        
        # Check for required variables
        if grep -q "API_BASE_URL" .env; then
            check_pass "API_BASE_URL configured"
        else
            check_warn "API_BASE_URL not configured in .env"
        fi
    else
        check_warn ".env file not found (copy from .env.example)"
    fi
    
    if [ -f ".env.example" ]; then
        check_pass ".env.example exists"
    else
        check_warn ".env.example not found"
    fi
}

# Validate TypeScript configuration
validate_typescript() {
    echo ""
    echo "TypeScript:"
    echo "───────────"
    
    if [ -f "tsconfig.json" ]; then
        check_pass "tsconfig.json exists"
    else
        check_fail "tsconfig.json not found"
    fi
    
    if [ -f "node_modules/.bin/tsc" ]; then
        TSC_VERSION=$(node_modules/.bin/tsc --version | cut -d' ' -f2)
        check_pass "TypeScript $TSC_VERSION"
    else
        check_fail "TypeScript not installed"
    fi
}

# Run validation tests
run_validation_tests() {
    echo ""
    echo "Validation Tests:"
    echo "─────────────────"
    
    # Type check
    if npm run type-check &> /dev/null; then
        check_pass "TypeScript type checking passes"
    else
        check_warn "TypeScript type checking has errors"
    fi
    
    # Lint check
    if npm run lint &> /dev/null; then
        check_pass "ESLint checking passes"
    else
        check_warn "ESLint has warnings/errors"
    fi
    
    # Test run (just verify it can start)
    if npm test -- --version &> /dev/null; then
        check_pass "Jest test runner works"
    else
        check_warn "Jest test runner may have issues"
    fi
}

# Print summary
print_summary() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                    Validation Summary                      ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Total checks:   $TOTAL_CHECKS"
    echo -e "Passed:         ${GREEN}$PASSED_CHECKS${NC}"
    echo -e "Failed:         ${RED}$FAILED_CHECKS${NC}"
    echo -e "Warnings:       ${YELLOW}$WARNING_CHECKS${NC}"
    echo ""
    
    if [ $FAILED_CHECKS -eq 0 ]; then
        echo -e "${GREEN}✓ Environment validation passed!${NC}"
        echo ""
        echo "You're ready to start development! 🚀"
        echo ""
        echo "Run 'npm start' to start Metro bundler"
        
        if is_macos; then
            echo "Run 'npm run ios' to launch iOS simulator"
        fi
        
        echo "Run 'npm run android' to launch Android emulator"
        echo ""
        return 0
    else
        echo -e "${RED}✗ Environment validation failed${NC}"
        echo ""
        echo "Please address the failed checks above."
        echo "See SETUP.md for detailed setup instructions."
        echo ""
        return 1
    fi
}

# Main validation process
main() {
    print_header
    validate_node
    validate_git
    validate_watchman
    validate_ios_tools
    validate_android_tools
    validate_dependencies
    validate_env_config
    validate_typescript
    run_validation_tests
    print_summary
}

# Run main function
main
