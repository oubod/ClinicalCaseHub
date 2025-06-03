# ClinicalCaseHub

A platform for medical professionals to share and discuss clinical cases.

## Features

- Secure authentication with Supabase
- Clinical case sharing and management
- Real-time collaboration
- Responsive design with Tailwind CSS
- Dark mode support

## Tech Stack

- Frontend:
  - React with TypeScript
  - Vite
  - Tailwind CSS
  - Supabase Client
  - Shadcn/ui Components

- Backend:
  - Node.js
  - Express
  - PostgreSQL with Supabase
  - TypeScript

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/oubod/ClinicalCaseHub.git
cd ClinicalCaseHub
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both client and server directories
   - Fill in your Supabase credentials and other required variables

4. Start the development servers:
```bash
# Start client (in client directory)
npm run dev

# Start server (in server directory)
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) to view the app

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
