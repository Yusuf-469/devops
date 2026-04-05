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
- **AI Integration**: @openrouter/sdk (for API routing), custom services for Nvidia Nemotron AI
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

### OpenRouter API Key
Healix uses Qwen AI via OpenRouter for intelligent medical consultations. To set up the AI functionality:

1. Create a `.env` file in the project root:
   ```bash
   # OpenRouter API Key for HEALIX AI
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

2. Get your API key from [OpenRouter](https://openrouter.ai/)

3. Restart your development server after adding the environment variable

**Security Note**: Never commit API keys to version control. The `.env` file is already included in `.gitignore`.

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