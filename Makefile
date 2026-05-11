.PHONY: build up down test lint clean

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

test:
	pytest package-service
	pytest vuln-service
	cd frontend && npm test

lint:
	ruff check .
	cd frontend && npm run type-check

clean:
	docker-compose down -v
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
