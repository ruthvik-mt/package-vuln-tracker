from app.db.session import db

class VersionRepository:
    async def get_by_package(self, package_id: int):
        query = "SELECT id, package_id, version FROM versions WHERE package_id = $1"
        return await db.fetch(query, package_id)

    async def create(self, package_id: int, version: str):
        query = "INSERT INTO versions (package_id, version) VALUES ($1, $2) RETURNING id"
        return await db.fetchval(query, package_id, version)

    async def delete(self, version_id: int):
        query = "DELETE FROM versions WHERE id = $1"
        return await db.execute(query, version_id)

    async def delete_by_package(self, package_id: int):
        query = "DELETE FROM versions WHERE package_id = $1"
        return await db.execute(query, package_id)
