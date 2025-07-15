require('@testing-library/jest-dom');

global.TextEncoder = require('util').TextEncoder;

// Ensure React is available globally for JSX
global.React = require('react'); 