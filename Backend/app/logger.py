import logging
import sys
from pathlib import Path
from logging.handlers import RotatingFileHandler
import json
from datetime import datetime

# Crear directorio de logs si no existe
log_dir = Path("logs")
log_dir.mkdir(exist_ok=True)

# Configurar el formato del log
class CustomFormatter(logging.Formatter):
    def format(self, record):
        log_obj = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno
        }
        
        if hasattr(record, "request_id"):
            log_obj["request_id"] = record.request_id
            
        if record.exc_info:
            log_obj["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_obj)

# Configurar logger
def setup_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    
    # Handler para archivo
    file_handler = RotatingFileHandler(
        log_dir / "lifeplanner.log",
        maxBytes=10485760,  # 10MB
        backupCount=5
    )
    file_handler.setFormatter(CustomFormatter())
    
    # Handler para consola
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(CustomFormatter())
    
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    return logger

# Crear logger global
logger = setup_logger("lifeplanner")

def get_logger(name: str = None) -> logging.Logger:
    """Obtener un logger configurado.
    
    Args:
        name: Nombre del logger. Si es None, se usa el logger global.
    
    Returns:
        logging.Logger: Logger configurado
    """
    if name:
        return setup_logger(f"lifeplanner.{name}")
    return logger 