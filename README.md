# 🔥 Ephemeral Chat P2P

<div align="center">
  
  **Private temporary chat for two people. Messages that disappear after 10 minutes.**
  
  [![Vercel](https://img.shields.io/badge/deploy-vercel-black?style=for-the-badge&logo=vercel)](https://realtimechatp2p.vercel.app)
  [![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
  [![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
  [![Upstash](https://img.shields.io/badge/Upstash-Realtime-00C9B7?style=for-the-badge&logo=upstash)](https://upstash.com)
  
  ### 🌐 **[realtimechatp2p.vercel.app](https://realtimechatp2p.vercel.app)**
  
</div>

## 📋 Description

An ephemeral chat room designed for **private conversations between two people**. Each room has a maximum duration of **10 minutes**, after which all messages self-destruct without leaving a trace.

> ⚡ Perfect for sensitive conversations, quick meetings, or simply chatting without leaving a history.

## ✨ Key Features

- **👥 One-to-one chat** - Exclusively for two participants
- **⏱️ Limited duration** - 10 minutes and the room disappears
- **🧹 Complete self-destruction** - Messages permanently deleted
- **🔗 Instant links** - Create a room and share the link
- **🔒 No registration** - No account needed, just the link
- **📱 Mobile first** - Responsive design that works on any device
- **⚡ Real-time** - Instant messages without reloading

## 🎯 How It Works

### To start a conversation:

1. **Go to [realtimechatp2p.vercel.app](https://realtimechatp2p.vercel.app)**
2. **Click on "Create new room"**
3. **Share the generated link** with the person you want to talk to
4. **Wait for them to connect** and you're ready!

### During the chat:

- You'll see a **countdown timer** of 10 minutes
- Messages appear **instantly**
- Only you and the other person can see the messages
- **You can't join once there are 2 people** in the room

### When it ends:

- ⏰ **After 10 minutes**, the room automatically closes
- 🗑️ **All messages are permanently deleted**
- 🔗 **The link stops working**

## 🛠️ Technologies Used

### Frontend
- **Next.js 16.1.1** - React framework with App Router and Server Components
- **React 19.2.3** - Latest version with React Compiler
- **Tailwind CSS v4** - Modern and responsive styling
- **TanStack Query v5** - State and cache management
- **TypeScript** - Static typing for enhanced security

### Backend & Real-time
- **Elysia v1.4.22** - Type-safe API backend
- **Upstash Realtime v1.0.2** - Serverless real-time communication
- **Upstash Redis v1.36.1** - Temporary in-memory storage
- **Zod v4.3.6** - Data validation
- **Nanoid v5.1.6** - Unique ID generation

## 🚀 Deployment

The project is deployed on **Vercel** and available at:
### 🔗 **[realtimechatp2p.vercel.app](https://realtimechatp2p.vercel.app)**

## 💻 Detailed Tech Stack

```json
{
  "framework": "Next.js 16.1.1",
  "ui": "React 19 + Tailwind CSS",
  "backend": "Elysia API",
  "database": "Upstash Redis (temporary)",
  "realtime": "Upstash Realtime",
  "validation": "Zod",
  "state": "TanStack Query",
  "ids": "Nanoid"
}