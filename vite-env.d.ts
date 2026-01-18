// This file provides type definitions for environment variables
// augmenting the NodeJS namespace which is commonly available.

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY?: string;
    [key: string]: string | undefined;
  }
}
