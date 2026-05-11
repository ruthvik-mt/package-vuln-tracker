from common.config import BaseConfig

class Settings(BaseConfig):
    DATABASE_URL: str
    PORT: int = 8002
    PACKAGE_SERVICE_URL: str = "http://package-service:8001"
    
    class Config:
        env_file = ".env"

settings = Settings()
