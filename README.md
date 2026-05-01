# DairyDesk

A modern, intuitive web application for managing dairy business operations, customer deliveries, and billing. Built with React, Vite, and Firebase for real-time data synchronization and seamless cloud integration.

## 🎯 Overview

DairyDesk is designed to streamline dairy farm and delivery management. Whether you're running a small dairy operation or managing multiple customers, DairyDesk helps you track deliveries, manage customers, calculate bills, and gain business insights—all in one elegant application.

### Key Features

- **📊 Dashboard**: Real-time overview of today's and monthly statistics
- **👥 Customer Management**: Add, edit, and manage customer information and delivery history
- **📝 Entry Tracking**: Log milk and curd deliveries with automatic tracking
- **💰 Billing System**: Generate bills with automatic calculation based on configurable rates
- **🌙 Dark/Light Mode**: Switch between themes for comfortable viewing
- **🔐 Firebase Authentication**: Secure login and user management
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🔔 Notifications**: Real-time notifications with toast messages
- **⚡ PWA Support**: Service worker support for offline functionality
- **🚀 Lightning Fast**: Powered by Vite for instant builds and hot module reloading

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Features & Usage](#features--usage)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn** package manager
- A **Firebase project** with Firestore database enabled

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/dairydesk.git
   cd dairydesk
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Firebase configuration**
   - Create a `.env.local` file in the project root
   - Add your Firebase credentials (see [Configuration](#configuration) section)

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## ⚙️ Configuration

### Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable **Authentication** (Email/Password)
3. Create a **Firestore Database**
4. Get your Firebase configuration from Project Settings

### Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the values with your Firebase project credentials found in your Firebase console under **Project Settings > General**.

## 📁 Project Structure

```
dairydesk/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── BottomNav.jsx
│   │   ├── EntryForm.jsx
│   │   ├── CustomerCard.jsx
│   │   ├── BillCard.jsx
│   │   ├── StatCard.jsx
│   │   ├── ConfirmDialog.jsx
│   │   └── ...
│   ├── pages/              # Page components (routes)
│   │   ├── Dashboard.jsx
│   │   ├── Customers.jsx
│   │   ├── CustomerDetail.jsx
│   │   ├── Entries.jsx
│   │   ├── Bills.jsx
│   │   ├── BillDetail.jsx
│   │   ├── Settings.jsx
│   │   └── Login.jsx
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx     # Authentication state
│   │   ├── AppContext.jsx      # App-wide data state
│   │   └── ThemeContext.jsx    # Theme management
│   ├── hooks/              # Custom React hooks
│   │   ├── useCustomers.js
│   │   ├── useEntries.js
│   │   └── useSettings.js
│   ├── firebase/           # Firebase configuration
│   │   ├── config.js
│   │   ├── auth.js
│   │   └── firestore.js
│   ├── utils/              # Utility functions
│   │   ├── formatters.js   # Date and currency formatting
│   │   └── billCalculator.js  # Bill calculation logic
│   ├── App.jsx             # Main app component with routing
│   └── main.jsx            # React entry point
├── public/                 # Static files
│   └── sw.js              # Service worker
├── package.json
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── README.md
```

## 🔧 Available Scripts

In the project directory, you can run:

### `npm run dev`

Starts the development server with hot reload.

- Access at: `http://localhost:5173`
- Changes auto-reload in browser

### `npm run build`

Creates a production-ready build.

- Optimized bundle in `dist/` directory
- Ready for deployment

### `npm run preview`

Preview the production build locally.

- Serves the optimized build at `http://localhost:4173`
- Test production behavior before deployment

### `npm run lint`

Runs ESLint to check code quality.

- Identifies code style issues
- Shows warnings and errors

## 📱 Features & Usage

### Dashboard

- **Welcome Banner**: Time-based greeting with current date
- **Today's Stats**: Quick view of today's milk and curd deliveries with calculated revenue
- **Monthly Stats**: Summary of the current month's business
- **Active Customers**: Quick access to top customers with recent activity
- **Recent Entries**: Last 5 delivery entries for quick review
- **Add Entry FAB**: Floating Action Button for quick entry creation

### Customer Management

- **Add Customers**: Create new customer profiles with contact information
- **View Details**: See complete customer history, deliveries, and billing
- **Edit Customer**: Update customer information
- **Customer History**: Track all deliveries for each customer
- **Delete Customer**: Remove customers (with confirmation)

### Entry Tracking

- **Log Deliveries**: Record milk and curd deliveries
- **Track Date**: Automatic date stamping
- **Quantity Management**: Log quantities for each product
- **Bulk Operations**: View and manage all entries across customers
- **Edit/Delete**: Modify or remove entries as needed

### Billing System

- **Auto Calculation**: Bills auto-calculate based on configurable rates
- **Monthly Bills**: Generate bills for specific months
- **View Details**: See itemized billing breakdown
- **Print Bills**: Print-friendly bill view
- **Bill History**: Access past bills for audit purposes

### Settings

- **Pricing Rates**: Configure milk rate per packet and curd rate per packet
- **Currency Selection**: Choose your preferred currency
- **Theme Settings**: Toggle between light and dark mode
- **Profile Management**: View and update user profile

## 🛠️ Technology Stack

### Frontend

- **React 18.3+** - UI library
- **React Router 6.28+** - Client-side routing
- **Vite 6.0+** - Build tool and dev server
- **Tailwind CSS 3.4+** - Utility-first CSS framework
- **Lucide React 0.460+** - Icon library
- **React Hot Toast 2.4+** - Notification system

### Backend & Services

- **Firebase 11.0+**
  - Firebase Authentication - User login and management
  - Firebase Firestore - Real-time database
  - Cloud Storage - File storage (if needed)

### Development Tools

- **ESLint** - Code quality and style checking
- **PostCSS 8.4+** - CSS transformation
- **Autoprefixer 10.4+** - Vendor prefixes

## 🏗️ Architecture

### State Management

The application uses React Context API for state management:

- **AuthContext**: Manages user authentication state and login/logout
- **AppContext**: Manages application-wide data (entries, customers, settings)
- **ThemeContext**: Handles light/dark theme switching

### Authentication Flow

1. User navigates to app
2. Firebase checks authentication state
3. If not authenticated → redirected to Login page
4. Upon login → user data loaded
5. All routes protected via `ProtectedRoute` component

### Data Flow

1. Components subscribe to context providers
2. Context hooks (useCustomers, useEntries, useSettings) fetch Firestore data
3. Data updates trigger component re-renders
4. Firebase Firestore acts as single source of truth

### Real-time Features

- Live data synchronization via Firestore listeners
- Instant updates across all tabs/windows
- Offline support via Service Worker

## 🔐 Security

- **Protected Routes**: All pages except login require authentication
- **Firebase Rules**: Configure Firestore security rules in Firebase console
- **Environment Variables**: Sensitive data stored in `.env.local`
- **Input Validation**: Form inputs validated before submission

## 📱 Responsive Design

The app uses Tailwind CSS breakpoints for responsive design:

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Bottom navigation on mobile, sidebar navigation on desktop for optimal UX.

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

### Netlify

```bash
npm run build
# Connect your Git repository to Netlify
# Netlify auto-builds and deploys on push
```

**Important**: Add environment variables in your deployment platform's settings before deploying.

## 🐛 Troubleshooting

### Firebase Connection Issues

- Verify `.env.local` has correct credentials
- Check Firebase security rules allow read/write
- Ensure Firestore database is created and initialized

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use

```bash
# Use a different port
npm run dev -- --port 3000
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Router Documentation](https://reactrouter.com)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

For issues, feature requests, or questions:

- Open an issue on GitHub
- Check existing documentation
- Review Firebase console for configuration issues

---

**Made with ❤️ for dairy businesses everywhere**

Last Updated: 2026-05-01
