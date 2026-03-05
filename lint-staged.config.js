export default {
  '*.{ts,tsx}': ['eslint --fix', () => 'npm run typecheck'],
  '*.{js,jsx}': 'eslint --fix',
  '*.{js,jsx,ts,tsx,css,html,json,md}': 'prettier --write',
}
