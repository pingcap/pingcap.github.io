# TiDB for AI Documentation Site

.PHONY: help install sync-examples serve build clean check

help:
	@echo "Available commands:"
	@echo "  install       - Install dependencies"
	@echo "  sync-examples - Sync examples from pytidb repository"
	@echo "  serve         - Start the development server"
	@echo "  build         - Build the documentation site"
	@echo "  clean         - Clean build artifacts"
	@echo "  check         - Check dependencies and project setup"

install:
	pip install -e .

sync-examples:
	python scripts/sync_examples_from_pytidb.py

serve:
	mkdocs serve

build:
	mkdocs build

clean:
	rm -rf site/
	rm -rf .mkdocs_cache/

check:
	python scripts/check_dependencies.py 