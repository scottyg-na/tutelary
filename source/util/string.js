export const permissionsToTitleCase = (item: string) => item
  .toLowerCase()
  .replace(/guild/g, 'Server')
  .replace(/_/g, ' ')
  .replace(/\b[a-z]/g, (t) => t.toUpperCase());
