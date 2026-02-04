# Contributing to i-See

Thank you for your interest in contributing to the i-See mobile application! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Environment Setup](#development-environment-setup)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/i-See.git
   cd i-See
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/InadeAfricaGuy/i-See.git
   ```
4. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## Development Environment Setup

See [SETUP.md](SETUP.md) for detailed instructions on setting up your development environment.

### Quick Setup

```bash
# Install dependencies
npm install

# Install iOS dependencies (macOS only)
cd ios && pod install && cd ..

# Copy environment variables
cp .env.example .env

# Run the app
npm run ios      # for iOS
npm run android  # for Android
```

## Development Workflow

1. **Keep your fork up to date**:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**:
   - Write clean, readable code
   - Follow the coding standards
   - Add tests for new functionality
   - Update documentation as needed

4. **Test your changes**:
   ```bash
   npm run lint        # Check code style
   npm run type-check  # Check TypeScript types
   npm test           # Run unit tests
   ```

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** on GitHub

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode in tsconfig.json
- Avoid using `any` type; use proper type definitions
- Use interfaces for object types and types for unions/intersections

### React Native

- Use functional components with hooks
- Keep components small and focused
- Use React.memo() for performance optimization when needed
- Follow the existing component structure

### Naming Conventions

- **Files**: PascalCase for components (e.g., `DashboardScreen.tsx`), camelCase for utilities (e.g., `apiClient.ts`)
- **Components**: PascalCase (e.g., `LoadingSpinner`)
- **Functions/Variables**: camelCase (e.g., `getUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Interfaces/Types**: PascalCase with 'I' prefix for interfaces (e.g., `IUser`) or without prefix (e.g., `User`)

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Maximum line length: 100 characters
- Use trailing commas in multi-line objects/arrays

Run `npm run lint:fix` to automatically fix most style issues.

## Testing Guidelines

### Unit Tests

- Write unit tests for all new functionality
- Use Jest and React Testing Library
- Aim for at least 80% code coverage
- Test file naming: `ComponentName.test.tsx`

Example:
```typescript
import { render, screen } from '@testing-library/react-native';
import Loading from '../Loading';

describe('Loading', () => {
  it('renders loading indicator', () => {
    render(<Loading />);
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });
});
```

### Integration Tests

- Test user flows and component interactions
- Use realistic data and scenarios
- Test both happy paths and error cases

### E2E Tests

- Use Detox for end-to-end testing
- Focus on critical user journeys
- Run before major releases

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `ci`: CI/CD configuration changes

### Examples

```
feat(auth): add biometric authentication

Implemented Face ID/Touch ID support for iOS and Android.
- Added biometric authentication service
- Updated login screen with biometric option
- Added settings toggle for biometric auth

Closes #123
```

```
fix(dashboard): correct battery percentage calculation

Fixed an issue where battery percentage was showing incorrect values
when the battery was in charging state.

Fixes #456
```

## Pull Request Process

1. **Ensure your PR**:
   - Follows the coding standards
   - Includes tests for new functionality
   - Updates relevant documentation
   - Passes all CI checks

2. **PR Title**: Use conventional commit format (e.g., `feat: add dark mode`)

3. **PR Description**: Use the PR template and provide:
   - Clear description of changes
   - Related issue numbers
   - Testing instructions
   - Screenshots/videos (for UI changes)

4. **Review Process**:
   - At least one maintainer review is required
   - Address review comments
   - Keep the PR scope focused and manageable

5. **Merging**:
   - PRs are merged using "Squash and merge"
   - Ensure commit message follows conventional commits
   - Delete branch after merging

## Issue Reporting

### Before Creating an Issue

- Check if the issue already exists
- Verify you're using the latest version
- Ensure the issue is reproducible

### Creating a Good Issue

1. Use the appropriate issue template (Bug Report or Feature Request)
2. Provide a clear and descriptive title
3. Include all requested information
4. Add screenshots/videos when relevant
5. Specify platform, OS version, and app version

### Bug Reports Should Include

- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Device/OS information
- App version
- Relevant logs or error messages

### Feature Requests Should Include

- Problem statement
- Proposed solution
- Use cases
- Alternative solutions considered

## Development Tips

### Debugging

```bash
# Enable React Native debugger
npm run start

# View logs
npx react-native log-android  # Android logs
npx react-native log-ios      # iOS logs
```

### Performance Profiling

- Use React DevTools Profiler
- Monitor bundle size with `npx react-native-bundle-visualizer`
- Use Flipper for advanced debugging

### Useful Commands

```bash
# Clear caches
npm run clean

# Reset Metro bundler
npm start -- --reset-cache

# Reinstall dependencies
rm -rf node_modules && npm install
```

## Questions?

If you have questions or need help:

- Check the [documentation](./docs)
- Search existing issues
- Ask in the project's discussions
- Contact the maintainers at tech@inadeafrica.com

## License

By contributing to i-See, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to i-See! 🎉
