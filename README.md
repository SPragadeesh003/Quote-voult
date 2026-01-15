# QuickVault 📚✨

A beautifully designed React Native quote collection app built with Expo, featuring personalized themes, daily inspirations, and seamless cloud sync.

![Platform](https://img.shields.io/badge/Platform-%20Android-blue)
![Framework](https://img.shields.io/badge/Framework-Expo%20%7C%20React%20Native-purple)
![Backend](https://img.shields.io/badge/Backend-Supabase-green)

## Features

- 🎨 **Dual Visual Styles** - Switch between Material UI (colorful) and Custom UI (dark/glassy) themes
- 🌈 **Accent Color Themes** - Choose from Nature, Spring, Autumn, and Sunset palettes
- 📱 **Daily Quote Widget** - Android home screen widget with daily inspiration
- 🔔 **Configurable Notifications** - Set your preferred time for daily quote reminders
- 📂 **Collections** - Organize favorite quotes into custom collections
- 🔍 **Smart Search** - Search across quotes, authors, and categories
- 📤 **Share Cards** - Export beautiful quote cards with multiple templates
- 🔐 **Authentication** - Secure sign-up/sign-in with email verification

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/QuickVault.git
cd QuickVault/Quick-Vault
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Supabase Configuration

Create a Supabase project at [supabase.com](https://supabase.com) and configure the following:

#### Database Tables

Create these tables in your Supabase SQL editor:

```sql
-- Quotes table
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text TEXT NOT NULL,
    author TEXT,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    username TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Favorites table
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, quote_id)
);

-- Collections table
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collection Items table
CREATE TABLE collection_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(collection_id, quote_id)
);
```

#### Storage Bucket

Create a storage bucket named `quick-volt-pragadeesh` for avatar uploads.

#### Environment Variables

Create a `.env` file in the project root (this file should NOT be committed to git):

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> ⚠️ **Security Note**: Never commit your `.env` file. It's already included in `.gitignore`.

#### Supabase Client Configuration

The app uses this configuration in `config/supabaseConfig.ts`:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

#### Authentication Settings

In Supabase Dashboard → Authentication → URL Configuration:
- Add `quickvault://(tabs)/home` to Redirect URLs for deep linking

### 4. Run the App

```bash
# Start development server
npx expo start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios
```

---

## 🤖 AI Coding Approach & Workflow

This project was developed using an **AI-assisted pair programming** methodology with Google's Gemini-powered coding assistant (Antigravity/Claude).

### Development Workflow

1. **Planning Phase**
   - Created detailed implementation plans for each feature
   - AI analyzed existing codebase structure before proposing changes
   - Used task breakdown artifacts to track progress

2. **Execution Phase**  
   - AI generated code following existing patterns and conventions
   - Iterative refinement based on user feedback
   - Real-time error detection and fix suggestions

3. **Verification Phase**
   - AI identified potential issues and edge cases
   - Code cleanup including comment removal for production
   - Type safety verification with TypeScript

**AI Chat Link**: https://claude.ai/share/6ec810f6-b4af-4dd0-a26d-e92ebf5991d6, https://gemini.google.com/share/5ff49dc5c461 

### Key AI Contributions

| Feature | AI Contribution |
|---------|-----------------|
| Theme System | Designed ThemeContext with persistence, accent colors, and visual style switching |
| Collections CRUD | Implemented Supabase queries with optimistic updates and error handling |
| Share Templates | Created 4 quote card templates with font scaling controls |
| Deep Linking | Configured email verification flow with manual token parsing |
| Android Widget | Set up react-native-android-widget with daily quote updates |

---

## 🧰 AI Tools Used

| Tool | Purpose |
|------|---------|
| **Gemini/Antigravity** | Primary AI coding assistant for code generation, debugging, and refactoring |
| **GitHub Copilot** | Inline code suggestions and autocompletion |
| **Figma AI (Stitch)** | UI/UX design ideation and mockup generation |

---

## 🎨 Design Resources

### Figma/Stitch Designs

- **Main Design File**: [QuickVault Figma](https://stitch.withgoogle.com/projects/2987496056418618667?pli=1, https://www.figma.com/make/5vW1ZLrgjdIIlYO8qOFiYX/QuoteVault-App-Design?p=f&t=pJF8eKX30JjjIINa-0, https://www.figma.com/make/x4zxN8jW1Q5LxnZZVPOJdK/QuoteVault-App-Design?p=f&t=6MNE6FlS4jIdOY6v-0)
- **Component Library**: Based on Material Design 3 and iOS Human Interface Guidelines
- **Color Palettes**: Custom Nature, Spring, Autumn, and Sunset themes

### Design System

```
Typography:
- Primary: Google Sans Flex (Variable)
- Secondary: Outfit
- Accent: Oswald (Bold templates)
- Handwriting: Sue Ellen Francisco

Colors:
- Nature: #4F7942 (Fern Green)
- Spring: #8BC34A (Spring Green)  
- Autumn: #FF9800 (Autumn Orange)
- Sunset: #D32F2F (Sunset Red)
```

---

## ⚠️ Known Limitations & Incomplete Features

### Current Limitations

1. **Offline Support**
   - App requires internet connection for data sync
   - No offline caching implemented yet

### Incomplete Features

- [ ] **iOS Widget** - Only Android widget implemented
- [ ] **Push Notifications** - Currently local notifications only

---

## 📁 Project Structure

```
Quick-Vault/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   ├── auth/              # Authentication screens
│   ├── category/          # Dynamic category routes
│   └── collection/        # Collection detail routes
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/           # React Context providers
│   ├── screens/           # Screen components
│   ├── services/          # API and utility services
│   └── styles/            # StyleSheet definitions
├── constants/             # Colors, Fonts, Theme configs
├── types/                 # TypeScript type definitions
├── utils/                 # Helper utilities
└── config/                # Supabase configuration
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Expo](https://expo.dev) - React Native framework
- [Supabase](https://supabase.com) - Backend as a Service
- [Lucide Icons](https://lucide.dev) - Icon library
- [react-native-android-widget](https://github.com/nicovalencia/react-native-android-widget) - Android widget support

---
