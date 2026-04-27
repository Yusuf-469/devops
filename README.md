# Healix - AI-Powered Medical Dashboard

Healix is a web-based medical dashboard application that leverages AI and 3D visualizations to provide comprehensive health management tools. It serves as a personal health assistant with features for AI-powered medical consultations, report analysis, treatment tracking, and medication management.

## Technical Details

### Languages and Technologies
- **Languages**: JavaScript (with JSX for React components), HTML, CSS
- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **3D Graphics**: Three.js (via @react-three/fiber and @react-three/drei)
- **Animation**: Framer Motion and @react-spring/web
- **State Management**: Zustand
- **Routing**: React Router DOM 7
- **AI Integration**: Secure Vercel serverless functions, OpenRouter Free AI
- **Utilities**: html2canvas (for screenshots), jspdf (for PDF generation), react-hot-toast (notifications), lucide-react (icons)
- **Deployment**: Vercel (based on vercel.json)

### Architecture
- **Structure**: Single-page application (SPA) with lazy-loaded components to optimize performance. The main dashboard is lazy-loaded to prevent unnecessary Three.js loading on the landing page.
- **Routing**: BrowserRouter with three main routes:
  - `/` (LandingPage): Marketing page with feature sections and 3D model previews
  - `/login` (LoginPage): Authentication interface
  - `/dashboard` (MainDashboard): Core application with 3D interface and modals
- **Component Organization**:
  - `pages/`: Top-level page components (LandingPage, LoginPage, MainDashboard)
  - `components/`: Reusable UI components organized into subfolders:
    - `landing/`: Sections for the marketing page (Hero, Features, Tech Stack, etc.)
    - `3d/`: Three.js models (DoctorModel, PillBottleModel, SyringeModel, StethoscopeModel, DashboardModel) and loaders
    - `modals/`: Interactive modals for features (ChatModal, AnalyzerModal, MedicationModal, TrackerModal, EmergencyModal)
    - `ui/`: Shared UI elements (Sidebar, TopBar, HealixLogo, etc.)
  - `store/`: Zustand state management
  - `services/`: AI integration services (ai.js, fallbackAI.js, aiTest.js)
- **3D Assets**: Preloaded GLB models stored in `public/models/` (medical doctor, stethoscope, syringe, pill bottle, dashboard)
- **Build Output**: Compiled to `dist/` directory with sourcemaps disabled and ESBuild minification

## Environment Setup

### Local Development
Create a `.env` file in the project root:
```bash
# Frontend environment variables only
# API keys are stored server-side for security

# Emergency Numbers (safe to expose to frontend)
VITE_EMERGENCY_NUMBER=102
VITE_HELP_NUMBER=7903810922
```

For AI functionality in local development, set:
```bash
# Server-side API key for local development
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### Production Deployment (Vercel)
Set these environment variables in your Vercel dashboard:

- `OPENROUTER_API_KEY`: Your OpenRouter API key from [OpenRouter Dashboard](https://openrouter.ai/keys)

**Security Note**: API keys are stored server-side only. The `.env` file contains only safe frontend variables.

### Development Commands

```bash
# Frontend only (no AI functionality)
npm run dev

# Full development with AI API server
npm run dev:full

# API server only
npm run dev:api
```

**Note**: Use `npm run dev:full` for complete AI functionality during development.

## Implementing Cloud and DevOps Tools

### Authentication with Firebase
To implement Firebase authentication:

1. Install Firebase SDK:
   ```bash
   npm install firebase
   ```

2. Initialize Firebase in your app (create `src/firebase.js`):
   ```javascript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';

   const firebaseConfig = {
     apiKey: process.env.VITE_FIREBASE_API_KEY,
     authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
     projectId: process.env.VITE_FIREBASE_PROJECT_ID,
     // ... other config
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   ```

3. Add Firebase Auth provider in `src/main.jsx`:
   ```javascript
   import { AuthProvider } from './contexts/AuthContext';
   // Wrap your App with AuthProvider
   ```

4. Implement login/logout in your LoginPage and protect routes.

### DevOps Implementation
The project is currently configured for Vercel deployment. To enhance DevOps:

1. **CI/CD Pipeline**: Use GitHub Actions for automated testing and deployment
2. **Docker Containerization**: Create Dockerfile for containerized deployment
3. **Monitoring**: Integrate error tracking with Sentry or LogRocket
4. **Environment Management**: Use environment variables for different stages (dev/staging/prod)
5. **Testing**: Add unit tests with Vitest and E2E tests with Playwright
6. **Performance Monitoring**: Implement Core Web Vitals tracking

### Cloud Services Integration
- **Firebase**: Authentication, Firestore for data storage, Cloud Functions for backend logic
- **Vercel**: Hosting, serverless functions, edge functions for AI API calls
- **Cloudinary/AWS S3**: For storing medical images and reports
- **Stripe**: Payment processing for premium features

## Docker Deployment

HEALIX supports containerized deployment with Docker for both development and production environments.

### Prerequisites

- Docker Desktop installed
- Docker Compose installed

### Quick Start

#### Local Development with Hot Reload

```bash
# Copy environment template
cp docker-compose.override.yml.example docker-compose.override.yml

# Edit docker-compose.override.yml with your API keys
# Set VITE_OPENROUTER_API_KEY in the override file

# Run development server with hot reload
docker-compose --profile dev up

# Access at: http://localhost:3000
```

#### Production Build Locally

```bash
# Build and run production container
docker-compose --profile prod up

# Access at: http://localhost:8080
```

### Docker Commands

#### Build Production Image

```bash
# Build image
docker build -t healix:latest .

# Run container
docker run -p 8080:80 \
  -e VITE_EMERGENCY_NUMBER=102 \
  -e VITE_HELP_NUMBER=7903810922 \
  healix:latest
```

#### Development Commands

```bash
# Start development environment
docker-compose --profile dev up

# View logs
docker-compose --profile dev logs -f

# Stop containers
docker-compose down

# Rebuild after code changes
docker-compose --profile dev up --build
```

#### Production Deployment

```bash
# Build for production
docker build -t healix:latest .

# Run production container
docker run -d \
  --name healix-prod \
  -p 80:80 \
  --restart unless-stopped \
  healix:latest
```

### Docker Configuration Files

- **`Dockerfile`**: Multi-stage build (Node.js build → Nginx serve)
- **`Dockerfile.dev`**: Development container with hot reload
- **`docker-compose.yml`**: Orchestration for dev/prod environments
- **`docker/nginx.conf`**: Production Nginx configuration with SPA routing
- **`.dockerignore`**: Optimized build context
- **`docker-build.sh`**: Convenience script for common operations

### Environment Variables

For Docker deployment, set these environment variables:

```yaml
# In docker-compose.override.yml (development)
environment:
  - VITE_OPENROUTER_API_KEY=your-api-key-here
  - VITE_EMERGENCY_NUMBER=102
  - VITE_HELP_NUMBER=7903810922

# Or pass at runtime
docker run -e VITE_OPENROUTER_API_KEY=your-key healix:latest
```

### Health Checks

The production container includes health checks:

```bash
# Check container health
docker ps

# View health status
docker inspect healix-prod | grep -A 5 "Health"
```

### File Structure

```
├── Dockerfile              # Production build
├── Dockerfile.dev          # Development build
├── docker-compose.yml      # Container orchestration
├── .dockerignore          # Build optimization
├── docker-build.sh        # Build script
└── docker/
    └── nginx.conf         # Production web server config
```