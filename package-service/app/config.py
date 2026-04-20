from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Hardcoded credentials for simplicity
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD_HASH: str = "$2b$12$TIwYdCCHjsU5LS6w7Sqtrui9FLuIjHi.AaZowidjO3H2yS8K.1NSa" # verified hash for "admin"

    class Config:
        env_file = ".env"

settings = Settings()
