from fastapi import Depends
from common.auth import get_current_user as common_get_current_user, oauth2_scheme
from .config import settings

async def get_current_user(token: str = Depends(oauth2_scheme)):
    return await common_get_current_user(
        token, 
        settings.JWT_SECRET, 
        settings.JWT_ALGORITHM, 
        settings.ADMIN_USERNAME
    )
