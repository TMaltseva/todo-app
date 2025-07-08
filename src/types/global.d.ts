declare global {
  interface Window {
    localStorageMock: {
      getItem: jest.Mock;
      setItem: jest.Mock;
      removeItem: jest.Mock;
      clear: jest.Mock;
    };
  }
}
