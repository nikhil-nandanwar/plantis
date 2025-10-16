// Utility functions for the Plantis app

/**
 * Formats a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

/**
 * Generates a unique ID based on timestamp
 */
export function generateId(): string {
  return Date.now().toString();
}

/**
 * Returns color classes based on plant health status
 */
export function getStatusColors(status: 'healthy' | 'diseased') {
  return {
    text: status === 'healthy' ? 'text-green-600' : 'text-red-600',
    bg: status === 'healthy' ? 'bg-green-50' : 'bg-red-50',
    border: status === 'healthy' ? 'border-green-200' : 'border-red-200',
    icon: status === 'healthy' ? '✅' : '⚠️'
  };
}

/**
 * Formats confidence score as percentage
 */
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}
