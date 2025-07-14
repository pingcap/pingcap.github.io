# TiDB for AI Documentation Site

.PHONY: help install sync-examples serve build clean check

help:
	@echo "TiDB for AI Documentation Site"
	@echo "============================="
	@echo "Available commands:"
	@echo "  install       - Install dependencies using UV"
	@echo "  sync-examples - Sync examples from pytidb repository"
	@echo "  serve         - Start the development server"
	@echo "  build         - Build the documentation site"
	@echo "  clean         - Clean build artifacts"
	@echo "  check         - Check dependencies and project setup"
	@echo ""
	@echo "Prerequisites:"
	@echo "  UV package manager - curl -LsSf https://astral.sh/uv/install.sh | sh"

install:
	uv pip install -e .

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