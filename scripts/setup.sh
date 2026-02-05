#!/bin/bash

# i-See Development Environment Setup Script
# This script automates the setup of the development environment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on macOS
is_macos() {
    [[ "$OSTYPE" == "darwin"* ]]
}

# Check if running on Linux
is_linux() {
    [[ "$OSTYPE" == "linux-gnu"* ]]
}

# Print header
print_header() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║         i-See Development Environment Setup               ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
}

# Check Node.js installation
check_node() {
    log_info "Checking Node.js installation..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed!"
        log_info "Please install Node.js 18.x or later from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js version is too old. Found v$(node --version), need v18 or later."
        exit 1
    fi
    
    log_success "Node.js $(node --version) is installed"
}

# Check npm installation
check_npm() {
    log_info "Checking npm installation..."
    
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed!"
        exit 1
    fi
    
    log_success "npm $(npm --version) is installed"
}

# Install Node.js dependencies
install_node_deps() {
    log_info "Installing Node.js dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    log_success "Node.js dependencies installed"
}

# Check and install CocoaPods (macOS only)
check_cocoapods() {
    if is_macos; then
        log_info "Checking CocoaPods installation..."
        
        if ! command -v pod &> /dev/null; then
            log_warning "CocoaPods not found. Installing..."
            sudo gem install cocoapods
            log_success "CocoaPods installed"
        else
            log_success "CocoaPods $(pod --version) is installed"
        fi
    fi
}

# Install iOS dependencies (macOS only)
install_ios_deps() {
    if is_macos; then
        log_info "Installing iOS dependencies..."
        
        cd ios
        pod install
        cd ..
        
        log_success "iOS dependencies installed"
    else
        log_warning "Skipping iOS setup (not running on macOS)"
    fi
}

# Check Android SDK
check_android_sdk() {
    log_info "Checking Android SDK..."
    
    if [ -z "$ANDROID_HOME" ]; then
        log_warning "ANDROID_HOME is not set!"
        log_info "Please set ANDROID_HOME in your environment variables"
        log_info "See SETUP.md for instructions"
    else
        log_success "ANDROID_HOME is set to: $ANDROID_HOME"
        
        if [ ! -d "$ANDROID_HOME" ]; then
            log_warning "ANDROID_HOME directory does not exist: $ANDROID_HOME"
        fi
    fi
}

# Setup environment variables
setup_env() {
    log_info "Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            log_success "Created .env file from .env.example"
            log_warning "Please update .env with your configuration values"
        else
            log_warning ".env.example not found"
        fi
    else
        log_info ".env file already exists"
    fi
}

# Check Watchman (macOS/Linux)
check_watchman() {
    if is_macos || is_linux; then
        log_info "Checking Watchman..."
        
        if ! command -v watchman &> /dev/null; then
            log_warning "Watchman is not installed"
            
            if is_macos; then
                log_info "Install with: brew install watchman"
            else
                log_info "See: https://facebook.github.io/watchman/docs/install"
            fi
        else
            log_success "Watchman is installed"
        fi
    fi
}

# Verify installation
verify_installation() {
    log_info "Verifying installation..."
    
    # Check if we can run basic npm scripts
    if npm run type-check &> /dev/null; then
        log_success "TypeScript type checking works"
    else
        log_warning "TypeScript type checking failed - this might be expected if there are type errors"
    fi
    
    # Check linting
    if npm run lint &> /dev/null; then
        log_success "ESLint works"
    else
        log_warning "ESLint check failed - this might be expected if there are linting errors"
    fi
}

# Print next steps
print_next_steps() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                   Setup Complete! 🎉                       ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    log_info "Next steps:"
    echo ""
    echo "  1. Update .env file with your configuration values"
    echo "  2. Start Metro bundler:"
    echo "     $ npm start"
    echo ""
    
    if is_macos; then
        echo "  3. Run on iOS:"
        echo "     $ npm run ios"
        echo ""
    fi
    
    echo "  4. Run on Android:"
    echo "     $ npm run android"
    echo ""
    echo "  5. Run tests:"
    echo "     $ npm test"
    echo ""
    echo "For more information, see SETUP.md and CONTRIBUTING.md"
    echo ""
}

# Main setup process
main() {
    print_header
    
    check_node
    check_npm
    check_watchman
    install_node_deps
    setup_env
    check_cocoapods
    install_ios_deps
    check_android_sdk
    verify_installation
    
    print_next_steps
}

# Run main function
main
