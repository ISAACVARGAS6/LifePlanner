from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Configuración de la base de datos
    DATABASE_URL: str = "sqlite:///./lifeplanner.db"
    
    # Configuración del servidor
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Configuración de seguridad
    SECRET_KEY: str = "your-secret-key-here"  # Cambiar en producción
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Configuración de CORS
    ALLOWED_ORIGINS: list = [
        "https://your-production-domain.com",
        "http://localhost:3000",
        "http://localhost:19006"  # Puerto por defecto de Expo
    ]

    class Config:
        env_file = ".env"

settings = Settings() 