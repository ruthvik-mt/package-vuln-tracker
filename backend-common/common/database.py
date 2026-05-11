import asyncpg
from typing import Optional

class Database:
    def __init__(self, database_url: str):
        self.database_url = database_url
        self.pool: Optional[asyncpg.Pool] = None

    async def connect(self):
        if not self.pool:
            import asyncio
            import logging
            import socket
            logger = logging.getLogger("common.database")
            retries = 10
            delay = 2
            while retries > 0:
                try:
                    self.pool = await asyncpg.create_pool(self.database_url)
                    logger.info("Successfully connected to the database")
                    return
                except (ConnectionRefusedError, socket.gaierror, Exception) as e:
                    retries -= 1
                    if retries == 0:
                        logger.error(f"Failed to connect to database at {self.database_url} after multiple retries.")
                        raise e
                    logger.warning(f"Database connection attempt failed: {e}. Retrying in {delay}s... ({retries} retries left)")
                    await asyncio.sleep(delay)

    async def disconnect(self):
        if self.pool:
            await self.pool.close()

    async def fetch(self, query: str, *args):
        async with self.pool.acquire() as connection:
            return await connection.fetch(query, *args)

    async def fetchrow(self, query: str, *args):
        async with self.pool.acquire() as connection:
            return await connection.fetchrow(query, *args)

    async def execute(self, query: str, *args):
        async with self.pool.acquire() as connection:
            return await connection.execute(query, *args)

    async def fetchval(self, query: str, *args):
        async with self.pool.acquire() as connection:
            return await connection.fetchval(query, *args)
