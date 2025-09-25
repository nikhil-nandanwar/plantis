# Plantis 🌱

A React Native mobile application for plant health analysis using AI-powered leaf disease detection.

## Features

- **Plant Health Scanner**: Upload leaf images via camera or gallery
- **AI Analysis**: Get instant classification results (healthy/diseased)
- **Care Tips**: Receive personalized plant care recommendations
- **Scan History**: View and manage your previous plant scans
- **Nature-Inspired UI**: Clean, green-themed interface with friendly messaging

## Tech Stack

- **React Native** with Expo
- **Tailwind CSS** (NativeWind) for styling
- **TypeScript** for type safety
- **Expo Camera** & **Image Picker** for media access
- **AsyncStorage** for local data persistence

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Scan the QR code with Expo Go on your device

## API Integration

The app expects a backend API endpoint at `/analyze` that accepts:
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Body**: image file
- **Response**: JSON `{ "status": "healthy" | "diseased", "confidence": number }`

## Screenshots

[Add screenshots here when available]

## License

MIT
