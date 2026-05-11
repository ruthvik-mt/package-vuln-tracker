from common.database import Database
from ..core.config import settings

db = Database(settings.DATABASE_URL)
