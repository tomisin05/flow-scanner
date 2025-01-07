# Debate Flow Storage App - Technical Requirements

## Core Features
1. User Authentication
   - Sign up/Login functionality
   - Personal space for each debater
   - Secure user data storage

2. Flow Storage System
   - Image upload capability
   - Camera integration for direct capture
   - Image storage and organization
   - Tagging/categorization system for flows

3. Environmental Impact Tracking
   - Paper savings calculator
   - Environmental impact leaderboard
   - Metrics display (trees saved, paper sheets saved)

## Technical Stack Requirements

### Frontend
- React.js (already set up)
- Additional required packages:
  - `@auth0/auth0-react` for authentication
  - `@aws-sdk/client-s3` for image storage
  - `@tanstack/react-query` for data fetching
  - `tailwindcss` for styling
  - `react-webcam` for camera integration
  - `react-router-dom` for routing

### Backend
- Need to implement:
  - Node.js/Express.js server
  - MongoDB for user data and metadata storage
  - AWS S3 for image storage
  - REST API endpoints for:
    - User management
    - Image upload/retrieval
    - Environmental impact calculations

### Infrastructure
- AWS S3 bucket for image storage
- MongoDB Atlas for database
- Vercel/Netlify for frontend hosting
- Heroku/Railway for backend hosting

## Next Steps
1. Set up project structure
2. Install required dependencies
3. Create basic authentication flow
4. Implement image upload functionality
5. Create environmental impact tracking system
6. Design and implement UI/UX

## Environmental Impact Calculation
- Each paper sheet saved = 0.006 kg CO2 saved
- Track number of uploads as paper sheets saved
- Convert to environmental metrics:
  - Trees saved (500 sheets = 1 tree)
  - CO2 emissions prevented
  - Water saved