import { ValidationError } from './errors';

export function validateProfileUpdates(updates) {
  const allowedFields = ['displayName', 'photoURL', 'email'];
  const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));
  
  if (invalidFields.length > 0) {
    throw new ValidationError(`Invalid profile fields: ${invalidFields.join(', ')}`);
  }
  
  if (updates.displayName && typeof updates.displayName !== 'string') {
    throw new ValidationError('Display n ame must be a string');
  }
  
  if (updates.email && typeof updates.email !== 'string') {
    throw new ValidationError('Email must be a string'); 
  }
  
  if (updates.email && !updates.email.includes('@')) {
    throw new ValidationError('Invalid email format');
  }
  
  return true;
}

export function validateTournamentData(data) {
  if (!data.name) throw new ValidationError('Tournament name is required');
  if (!data.date) throw new ValidationError('Tournament date is required');
  if (!data.location) throw new ValidationError('Tournament location is required');
  
  if (typeof data.name !== 'string') {
    throw new ValidationError('Tournament name must be a string');
  }
  
  if (!(data.date instanceof Date) && isNaN(new Date(data.date))) {
    throw new ValidationError('Invalid tournament date');
  }
  
  if (typeof data.location !== 'string') {
    throw new ValidationError('Tournament location must be a string');
  }
  
  return true;
}

export function validateUserData(user) {
  if (!user.uid) throw new ValidationError('User ID is required');
  if (!user.email) throw new ValidationError('User email is required');
  if (typeof user.email !== 'string' || !user.email.includes('@')) {
    throw new ValidationError('Invalid email format');
  }
  return true;
}

export function validateFlowData(flowData) {
  if (!flowData.title) throw new ValidationError('Title is required');
  if (!flowData.userId) throw new ValidationError('User ID is required');
  if (!flowData.fileUrl) throw new ValidationError('File URL is required');
  return true;
}

export function validateFlowMetadata(metadata) {
  if (!metadata.title) throw new ValidationError('Flow title is required');
  if (metadata.pageCount && typeof metadata.pageCount !== 'number') {
    throw new ValidationError('Page count must be a number');
  }
  if (metadata.round && typeof metadata.round !== 'string') {
    throw new ValidationError('Round must be a string');
  }
  if (metadata.team && typeof metadata.team !== 'string') {
    throw new ValidationError('Team must be a string');
  }
  if (metadata.tags && !Array.isArray(metadata.tags)) {
    throw new ValidationError('Tags must be an array');
  }
  return true;
}

export function validateFlowUpdates(updates) {
  const allowedFields = ['title', 'tournament', 'round', 'team', 'tags'];
  const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));
  
  if (invalidFields.length > 0) {
    throw new ValidationError(`Invalid flow update fields: ${invalidFields.join(', ')}`);
  }
  
  if (updates.title && typeof updates.title !== 'string') {
    throw new ValidationError('Flow title must be a string');
  }
  
  if (updates.round && typeof updates.round !== 'string') {
    throw new ValidationError('Round must be a string');
  }
  
  if (updates.team && typeof updates.team !== 'string') {
    throw new ValidationError('Team must be a string');
  }
  
  if (updates.tags && !Array.isArray(updates.tags)) {
    throw new ValidationError('Tags must be an array');
  }
  
  return true;
}