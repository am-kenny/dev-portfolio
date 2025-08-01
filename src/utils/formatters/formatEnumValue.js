/**
 * Formats location type for display
 * @param {string} location - The location type (e.g., 'remote', 'on-site', 'hybrid')
 * @returns {string} - Pretty formatted location (e.g., 'Remote', 'On Site', 'Hybrid')
 */
export const formatEnumValue = (location) => {
  if (!location) return '';
  return location.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}; 