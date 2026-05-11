from app.db.session import db

class PackageRepository:
    async def get_all(self):
        query = "SELECT id, name, ecosystem FROM packages"
        return await db.fetch(query)

    async def get_by_id(self, package_id: int):
        query = "SELECT id, name, ecosystem FROM packages WHERE id = $1"
        return await db.fetchrow(query, package_id)

    async def get_by_name(self, name: str):
        query = "SELECT id, name, ecosystem FROM packages WHERE name = $1"
        return await db.fetchrow(query, name)

    async def create(self, name: str, ecosystem: str):
        query = "INSERT INTO packages (name, ecosystem) VALUES ($1, $2) RETURNING id"
        return await db.fetchval(query, name, ecosystem)

    async def delete(self, package_id: int):
        query = "DELETE FROM packages WHERE id = $1"
        return await db.execute(query, package_id)

# Adding fetchval support to our Database class in common would be good, 
# but for now I'll use fetchrow and extract the id.
