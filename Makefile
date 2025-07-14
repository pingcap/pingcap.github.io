# TiDB for AI Documentation Site

.PHONY: help install generate-demos serve build clean check

help:
	@echo "TiDB for AI Documentation Site"
	@echo "============================="
	@echo "Available commands:"
	@echo "  install         - Install dependencies using UV"
	@echo "  generate-demos  - Generate demo pages and gallery from demos.yml config"
	@echo "  serve           - Start the development server"
	@echo "  build           - Build the documentation site"
	@echo "  clean           - Clean build artifacts"
	@echo "  check           - Check dependencies and project setup"
	@echo ""
	@echo "Demo gallery configuration:"
	@echo "  Edit demos.yml in the project root to manage gallery content"
	@echo ""
	@echo "Prerequisites:"
	@echo "  UV package manager - curl -LsSf https://astral.sh/uv/install.sh | sh"

install:
	uv pip install -e .

generate-demos:
	python scripts/generate_demos.py

serve:
	mkdocs serve

build:
	mkdocs build

clean:
	rm -rf site/
	rm -rf .mkdocs_cache/

check:
	python scripts/check_dependencies.py 