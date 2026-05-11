from ..repositories.package_repository import PackageRepository
from ..repositories.version_repository import VersionRepository

class PackageService:
    def __init__(self):
        self.package_repo = PackageRepository()
        self.version_repo = VersionRepository()

    async def get_all_with_versions(self):
        packages = await self.package_repo.get_all()
        result = []
        for pkg in packages:
            versions = await self.version_repo.get_by_package(pkg['id'])
            pkg_dict = dict(pkg)
            pkg_dict['versions'] = [dict(v) for v in versions]
            result.append(pkg_dict)
        return result

    async def create_package(self, name: str, ecosystem: str):
        return await self.package_repo.create(name, ecosystem)

    async def delete_package(self, package_id: int):
        # Transactional delete would be better, but asyncpg handle it if we use a connection.
        # For now, just delete versions then package.
        await self.version_repo.delete_by_package(package_id)
        return await self.package_repo.delete(package_id)
