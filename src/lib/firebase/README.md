# Firebase Integration Structure

This directory contains a structured approach to Firebase integration with consistent patterns across all operations.

## Core Components

### Database Operations (`db-operations.js`)
- Centralized Firestore operations
- Consistent timestamp handling
- Standard error handling

### Storage Operations (`storage-utils.js`)
- Firebase Storage utilities
- Upload and delete operations
- Consistent error handling

### Error Handling (`errors.js`)
Standard error types:
- `NotFoundError`: Document/resource not found
- `UnauthorizedError`: User not authorized
- `ValidationError`: Invalid data/parameters

### Validation (`validation.js`)
Centralized validation for:
- User data/profiles
- Tournament data
- Flow data and metadata
- Update operations

## Domain Operations

### Users (`users.js`)
- User document management
- Profile operations
- Statistics tracking

### Tournaments (`tournaments.js`)
- Tournament CRUD operations
- Participant management
- Flow associations

### Flows (`flows.js`)
- Flow document management
- File storage integration
- Tournament associations

## Key Features

1. Consistent timestamp handling using `createdAt` and `updatedAt`
2. Centralized validation
3. Standard error handling
4. Authorization checks
5. Atomic operations where possible
6. Consistent return patterns