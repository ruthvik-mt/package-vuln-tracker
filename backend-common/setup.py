from setuptools import setup, find_packages

setup(
    name="backend-common",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "python-jose[cryptography]",
        "passlib[bcrypt]",
        "pydantic-settings",
        "asyncpg",
        "python-multipart",
        "prometheus-fastapi-instrumentator",
        "redis"
    ],
)
