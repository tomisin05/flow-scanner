# EcoFlow: Debate Flow Management System

EcoFlow is a comprehensive web application designed to streamline the management of debate flows. It provides a user-friendly interface for debaters to upload, organize, and analyze their debate flows, enhancing their preparation and performance in competitive debate tournaments.

This application leverages modern web technologies and cloud services to offer a robust platform for debate flow management. Users can easily upload their flows, categorize them by tournaments, rounds, and teams, and access them from anywhere. The system also includes features for filtering and searching flows, making it an invaluable tool for debaters looking to improve their skills and track their progress over time.

EcoFlow is built with React for the frontend, Express.js for the backend, and utilizes Firebase for authentication, database, and file storage. This architecture ensures a scalable, secure, and responsive application that can handle the needs of individual debaters and debate teams alike.

## Repository Structure

The repository is organized into several key directories:

- `src/`: Contains the main React application code
  - `components/`: React components used throughout the application
  - `contexts/`: Context providers, including AuthContext for user authentication
  - `lib/`: Utility functions and Firebase configuration
  - `pages/`: Main page components for different routes
- `server/`: Express.js server code
  - `routes/`: API route handlers for flows and users
- `public/`: Static assets and HTML template

Key files:
- `src/App.jsx`: Main application component and routing setup
- `src/main.jsx`: Entry point for the React application
- `server/index.js`: Express server setup and API route configuration
- `firebase.json`: Firebase configuration file
- `firestore.indexes.json`: Firestore database index definitions

## Usage Instructions

### Installation

Prerequisites:
- Node.js (v14 or later)
- npm (v6 or later)
- Firebase account and project

Steps:
1. Clone the repository:
   ```
   git clone <repository-url>
   cd flow-scanner
   ```
2. Install dependencies for both client and server:
   ```
   npm install
   cd server && npm install && cd ..
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add the following Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Getting Started

1. Start the development server:
   ```
   npm run dev
   ```
2. In a separate terminal, start the Express server:
   ```
   cd server && npm start
   ```
3. Open your browser and navigate to `http://localhost:5173`

### Configuration Options

- Firebase configuration can be adjusted in `src/lib/firebase/config.js`
- Express server port can be changed in `server/index.js`

### Common Use Cases

1. Uploading a Flow:
   ```javascript
   const handleFlowSubmit = async (flowData) => {
     try {
       await uploadFlow(file, metadata, userId);
       alert('Flow uploaded successfully!');
     } catch (error) {
       console.error('Error uploading flow:', error);
       alert('Failed to upload flow: ' + error.message);
     }
   };
   ```

2. Fetching User Flows:
   ```javascript
   const fetchFlows = async () => {
     try {
       const flowsData = await getFilteredFlows(user.uid, filters);
       setFlows(flowsData);
     } catch (error) {
       console.error('Error fetching flows:', error);
       alert('Failed to fetch flows');
     }
   };
   ```

### Testing & Quality

To run tests:
```
npm test
```

### Troubleshooting

1. Issue: Firebase authentication fails
   - Error message: "Firebase: Error (auth/...)"
   - Diagnostic process:
     1. Check if Firebase configuration in `.env` is correct
     2. Ensure Firebase Authentication is enabled in Firebase Console
     3. Verify that the correct Firebase SDK version is installed
   - Debug: Enable Firebase debug mode in the browser console:
     ```javascript
     firebase.debug.enable('*');
     ```

2. Issue: Flows not displaying in the dashboard
   - Error message: "Error fetching flows"
   - Diagnostic process:
     1. Check browser console for specific error messages
     2. Verify that the user is authenticated
     3. Ensure Firestore rules allow read access for authenticated users
   - Debug: Enable verbose logging in `src/lib/firebase/flows.js`:
     ```javascript
     console.log('Fetching flows with filters:', filters);
     ```

3. Issue: File upload fails
   - Error message: "Failed to upload flow"
   - Diagnostic process:
     1. Check if Firebase Storage is properly configured
     2. Verify file size is within allowed limits
     3. Ensure proper CORS configuration for Firebase Storage
   - Debug: Add logging in `src/lib/firebase/storage-utils.js`:
     ```javascript
     console.log('Uploading file:', file.name, 'Size:', file.size);
     ```

Performance optimization:
- Monitor Firestore read/write operations in Firebase Console
- Use Firebase Performance Monitoring to track app performance
- Implement pagination for large datasets in the dashboard

## Data Flow

The EcoFlow application follows a client-server architecture with Firebase as the backend service. Here's an overview of the data flow:

1. User Authentication:
   Client (React) -> Firebase Authentication -> Client receives auth token

2. Flow Upload:
   Client -> Express Server -> Firebase Storage (file) -> Firestore (metadata)

3. Fetching Flows:
   Client -> Express Server -> Firestore -> Client receives flow data

4. Updating Flows:
   Client -> Express Server -> Firestore -> Client receives updated data

5. Deleting Flows:
   Client -> Express Server -> Firestore (delete document) -> Firebase Storage (delete file)

```
+--------+    Auth    +-------------------+
| Client | <---------> | Firebase Auth    |
+--------+             +-------------------+
    |
    | API Requests
    v
+--------+             +-------------------+
| Express| <---------> | Firestore Database|
| Server |             +-------------------+
+--------+
    |                  +-------------------+
    +-----------------> | Firebase Storage  |
                       +-------------------+
```

Note: The Express server acts as a middleware to handle complex operations and maintain security by not exposing Firebase credentials to the client.

## Infrastructure

The EcoFlow application utilizes Firebase for its backend infrastructure. Key resources defined in the configuration files include:

Firestore Database:
- Collection: `flows`
  - Indexes:
    - Composite index on `userId` (ASC), `status` (ASC), `createdAt` (DESC)
    - Various other indexes for efficient querying based on tournament, round, team, and other fields

Firebase Storage:
- Used for storing uploaded flow files

Firebase Authentication:
- Handles user authentication and authorization

These resources are configured in the `firebase.json` and `firestore.indexes.json` files, ensuring optimal performance and security for the application.