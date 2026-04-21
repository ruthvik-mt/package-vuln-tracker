class PackageQueries:
    @staticmethod
    def get_all_packages():
        return "SELECT * FROM packages"

    @staticmethod
    def get_package_by_id():
        return "SELECT * FROM packages WHERE id = $1"

    @staticmethod
    def create_package():
        return "INSERT INTO packages (name, ecosystem) VALUES ($1, $2) RETURNING *"

    @staticmethod
    def get_versions_by_package_id():
        return "SELECT * FROM versions WHERE package_id = $1"

    @staticmethod
    def create_version():
        return "INSERT INTO versions (package_id, version) VALUES ($1, $2) RETURNING *"

    @staticmethod
    def get_package_by_name():
        return "SELECT * FROM packages WHERE name = $1"
    
    @staticmethod
    def get_version_by_name_and_id():
        return "SELECT * FROM versions WHERE package_id = $1 AND version = $2"

    @staticmethod
    def delete_package():
        return "DELETE FROM packages WHERE id = $1"

    @staticmethod
    def delete_version():
        return "DELETE FROM versions WHERE id = $1"
