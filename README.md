# TaskPulse

> A high-performance cloud-based task management platform with real-time synchronization and AI-powered features

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.17-orange.svg)](https://firebase.google.com/)

## 🚀 Overview

TaskPulse is a modern, full-featured task management application designed for professionals and teams who demand high performance, real-time collaboration, and intelligent task organization. Built with React and powered by Firebase, it provides seamless cloud synchronization, advanced filtering, and AI-enhanced productivity features.

## ✨ Key Features

- **🌐 Real-Time Cloud Sync** - Automatic synchronization across all devices using Firebase Firestore
- **🔐 Secure Authentication** - Firebase Auth integration for safe and reliable user authentication
- **📊 Advanced Analytics** - Interactive workspace analytics and task statistics dashboard
- **🎨 Dark & Light Themes** - Customizable theme system for comfortable all-day use
- **📱 Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **🤖 AI-Powered Features** - Google Gemini API integration for intelligent task assistance
- **⚡ High Performance** - Built with Vite for lightning-fast development and production builds
- **🎯 Smart Filtering & Sorting** - Multiple filtering options and sorting capabilities
- **✅ Task Lifecycle Management** - Create, read, update, and delete tasks with ease
- **🏷️ Priority & Status Tracking** - Organize tasks by priority levels and completion status

## 🛠️ Tech Stack

### Frontend
- **React** 19.0+ - Modern UI library
- **TypeScript** 5.8+ - Type-safe JavaScript
- **Vite** 6.2+ - Next-generation build tool
- **Tailwind CSS** 4.1+ - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Motion** - Smooth animation library

### Backend & Services
- **Firebase** 12.17+ - Backend-as-a-Service platform
  - Authentication
  - Firestore Database
  - Cloud Storage
- **Google Gemini API** - AI-powered features
- **Express.js** - Node.js server framework

### Development Tools
- **TypeScript** - Static type checking
- **ESBuild** - Fast JavaScript bundler
- **Autoprefixer** - CSS vendor prefixing
- **TSX** - TypeScript executor

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Firebase Account** - [Create one here](https://firebase.google.com/)
- **Google Cloud Project** - For Gemini API access

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/nilasarker950-web/taskpulse.git
cd taskpulse
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Alternatively, use the Firebase configuration files provided:
- `firebase-applet-config.json` - Application configuration
- `firebase-blueprint.json` - Data model definitions

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
```

Production files will be generated in the `dist/` directory.

## 📁 Project Structure

```
taskpulse/
├── src/
│   ├── components/          # React components
│   │   ├── AuthPage.tsx     # Authentication interface
│   │   ├── TaskCard.tsx     # Individual task display
│   │   ├── TaskModal.tsx    # Task creation/editing
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── Sidebar.tsx      # Sidebar navigation
│   │   └── ...              # Other UI components
│   ├── context/             # React Context providers
│   │   ├── AuthContext.tsx  # Authentication state
│   │   └── ThemeContext.tsx # Theme management
│   ├── services/            # API & Firebase services
│   │   └── taskService.ts   # Task operations
│   ├── lib/                 # Firebase configuration
│   │   └── firebase.ts
│   ├── utils/               # Utility functions
│   │   └── storage.ts
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── assets/                  # Static assets
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firestore.rules          # Firestore security rules
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies & scripts
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run clean` | Remove dist and build artifacts |
| `npm run lint` | Type check with TypeScript |

## 🔐 Firebase Security

This project includes Firestore security rules (`firestore.rules`) that enforce:
- User authentication requirements
- Data ownership validation
- User-specific data access
- Secure read/write operations

Review and customize security rules before deploying to production.

## 🎨 Customization

### Theme Configuration
Themes can be customized through the `ThemeContext` provider. The application supports:
- Light mode
- Dark mode
- System preference detection
- Custom theme preferences stored in local storage

### Firebase Configuration
Update Firebase settings in `src/lib/firebase.ts` or through environment variables.

## 📊 Database Schema

The application uses Firestore with the following main entity:

### Task Entity
```typescript
{
  id: string;              // Unique identifier
  userId: string;          // Firebase Auth UID
  userEmail: string;       // User email
  userName: string;        // User display name
  taskName: string;        // Task title (1-200 chars)
  description: string;     // Task description
  status: TaskStatus;      // Task status (TODO, IN_PROGRESS, DONE)
  priority: string;        // Priority level
  dueDate: string;         // Due date
  createdAt: timestamp;    // Creation timestamp
  updatedAt: timestamp;    // Last update timestamp
  // ... additional fields
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💡 Performance Tips

- Clear browser cache after major updates
- Use incognito mode to test authentication flows
- Monitor Firestore read/write operations in Firebase Console
- Consider implementing pagination for large task lists

## 🔗 Useful Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Google Gemini API](https://ai.google.dev/)

## 📧 Support

For support, email support@taskpulse.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Firebase](https://firebase.google.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide React](https://lucide.dev/)
- AI features by [Google Gemini](https://ai.google.dev/)

---

<div align="center">

**[⬆ Back to Top](#taskpulse)**

Made with ❤️ by the TaskPulse Team

</div>
