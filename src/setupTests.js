// src/setupTests.js
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Автоматичне очищення після кожного тесту
afterEach(() => {
  cleanup();
});
