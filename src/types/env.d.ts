declare namespace NodeJS {
  interface ProcessEnv {
    //  PORT
    PORT: string | undefined;
    // swagger
    SWAGGER_USERNAME: string | undefined;
    SWAGGER_PASSWORD: string | undefined;
    // mongoose
    MONGODB_URL: string | undefined;
    // crypto js
    ENCRYPTION_KEY: string | undefined;
    // jwt
    JWT_SECRET: string | undefined;
    JWT_AccessTokenExpiry: string | undefined;
    JWT_RefreshTokenExpiry: string | undefined;
    // bucket
    BASE_URL: string | undefined;
  }
}
