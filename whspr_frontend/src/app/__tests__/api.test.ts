import axios from "axios";
import api, { getCurrentUser } from "../lib/api";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("API Client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset axios create mock
    mockedAxios.create.mockReturnValue({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    } as any);
  });

  test("should create axios instance with correct config", () => {
    // Re-import to trigger the axios.create call
    jest.isolateModules(() => {
      require("../lib/api");
    });

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 10_000,
    });
  });

  test("should add Authorization header when token exists in localStorage", () => {
    const mockToken = "test-token-123";
    localStorageMock.getItem.mockReturnValue(mockToken);

    // Mock the interceptor function
    let requestInterceptor: any;
    const mockAxiosInstance = {
      interceptors: {
        request: {
          use: jest.fn((interceptorFn) => {
            requestInterceptor = interceptorFn;
          }),
        },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

    // Re-import to set up interceptor
    jest.isolateModules(() => {
      require("../lib/api");
    });

    // Test the interceptor
    const mockConfig = { headers: {} };
    const result = requestInterceptor(mockConfig);

    expect(localStorageMock.getItem).toHaveBeenCalledWith("token");
    expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
  });

  test("should not add Authorization header when no token in localStorage", () => {
    localStorageMock.getItem.mockReturnValue(null);

    let requestInterceptor: any;
    const mockAxiosInstance = {
      interceptors: {
        request: {
          use: jest.fn((interceptorFn) => {
            requestInterceptor = interceptorFn;
          }),
        },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

    jest.isolateModules(() => {
      require("../lib/api");
    });

    const mockConfig = { headers: {} };
    const result = requestInterceptor(mockConfig);

    expect(result.headers.Authorization).toBeUndefined();
  });

  test("getCurrentUser should make GET request to /users/me", async () => {
    const mockUserData = { id: 1, name: "John Doe", email: "john@example.com" };
    const mockResponse = { data: mockUserData };

    const mockGet = jest.fn().mockResolvedValue(mockResponse);
    const mockAxiosInstance = {
      get: mockGet,
      interceptors: {
        request: { use: jest.fn() },
      },
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

    // Re-import to get the fresh instance
    const { getCurrentUser: freshGetCurrentUser } = await import("../lib/api");

    const result = await freshGetCurrentUser();

    expect(mockGet).toHaveBeenCalledWith("/users/me");
    expect(result).toEqual(mockUserData);
  });

  // test("getCurrentUser should handle API errors", async () => {
  //   const mockError = new Error("Network Error");
  //   const mockGet = jest.fn().mockRejectedValue(mockError);

  //   const mockAxiosInstance = {
  //     get: mockGet,
  //     interceptors: {
  //       request: { use: jest.fn() },
  //     },
  //   };

  //   mockedAxios.create.mockReturnValue(mockAxiosInstance as any);

  //   const { getCurrentUser } = await import("../lib/api");

  //   await expect(getCurrentUser()).rejects.toThrow("Network Error");
  // });
});
