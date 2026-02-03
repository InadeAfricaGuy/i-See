# Contributing to i-See

First off, thank you for considering contributing to i-See! It's people like you that make i-See such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title** for the issue
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs** if possible
* **Include device information** (OS version, device model)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior** and **explain the behavior you expected to see**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the TypeScript style guide
* Include thoughtfully-worded, well-structured tests
* Document new code
* End all files with a newline

## Development Process

### Setting Up Your Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/i-See.git
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/InadeAfricaGuy/i-See.git
   ```
4. Install dependencies:
   ```bash
   npm install
   cd ios && pod install && cd ..  # macOS only
   ```

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes
3. Write or update tests
4. Run tests:
   ```bash
   npm test
   ```
5. Run linter:
   ```bash
   npm run lint
   ```
6. Commit your changes:
   ```bash
   git commit -m "feat: add amazing feature"
   ```

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

* `feat:` - A new feature
* `fix:` - A bug fix
* `docs:` - Documentation only changes
* `style:` - Changes that do not affect the meaning of the code
* `refactor:` - A code change that neither fixes a bug nor adds a feature
* `perf:` - A code change that improves performance
* `test:` - Adding missing tests or correcting existing tests
* `chore:` - Changes to the build process or auxiliary tools

Examples:
```
feat: add battery health monitoring
fix: resolve crash on installation screen
docs: update API documentation
style: format code with prettier
refactor: simplify authentication logic
perf: optimize chart rendering
test: add tests for dashboard component
chore: update dependencies
```

### Code Style

* Use TypeScript for all new code
* Follow the existing code style
* Use meaningful variable names
* Write comments for complex logic
* Keep functions small and focused
* Avoid nested callbacks (use async/await)

### Testing

* Write unit tests for utilities and services
* Write component tests for React components
* Write integration tests for complex flows
* Aim for >80% code coverage

### Documentation

* Update README.md if needed
* Update API_SPEC.md for API changes
* Add JSDoc comments for public APIs
* Update CHANGELOG.md

## Project Structure

```
src/
├── components/      # Reusable UI components
├── screens/        # Screen components
├── navigation/     # Navigation configuration
├── services/       # API clients and services
├── store/          # Redux store and slices
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── assets/         # Images, fonts, etc.
```

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Update the documentation with any new features
3. The PR will be merged once you have the sign-off of at least one maintainer

## Style Guide

### TypeScript

```typescript
// Use explicit types
function calculatePower(voltage: number, current: number): number {
  return voltage * current;
}

// Use interfaces for object shapes
interface BatteryData {
  charge: number;
  voltage: number;
  current: number;
}

// Use enums for fixed sets of values
enum DeviceStatus {
  Online = 'online',
  Offline = 'offline',
  Error = 'error',
}

// Use async/await instead of callbacks
async function fetchData(): Promise<Data> {
  const response = await apiClient.get('/data');
  return response.data;
}
```

### React Components

```typescript
// Use functional components with TypeScript
interface Props {
  title: string;
  onPress: () => void;
}

export const CustomButton: React.FC<Props> = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

// Use hooks for state and effects
const [loading, setLoading] = useState(false);
useEffect(() => {
  // Effect logic
  return () => {
    // Cleanup
  };
}, [dependencies]);
```

### File Naming

* Components: PascalCase (e.g., `BatteryIndicator.tsx`)
* Utilities: camelCase (e.g., `formatDate.ts`)
* Constants: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)
* Hooks: camelCase with 'use' prefix (e.g., `useAuth.ts`)

## Getting Help

If you need help, you can:

* Open an issue with the "question" label
* Email tech@inadeafrica.com
* Check existing documentation in the docs/ folder

## Recognition

Contributors will be recognized in:

* The CONTRIBUTORS.md file
* Release notes for significant contributions
* The project README

Thank you for contributing to i-See! 🎉
