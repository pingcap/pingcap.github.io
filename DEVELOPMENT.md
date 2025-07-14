# Development Guide

This guide covers the development setup and maintenance of the TiDB for AI documentation site.

## Prerequisites

This project uses [UV](https://docs.astral.sh/uv/) for fast dependency management. Install UV first:

```bash
# Install UV
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Installation

Install the project dependencies:

```bash
# Install all dependencies
make install
```

Or use UV directly:

```bash
uv pip install -e .
```

## Available Commands

This project includes a Makefile with the following commands:

```bash
# Show available commands
make help

# Install dependencies using UV
make install

# Sync examples from pytidb repository
make sync-examples

# Start the development server
make serve

# Build the documentation site
make build

# Clean build artifacts
make clean

# Check dependencies and project setup
make check
```

## Example Gallery Maintenance

The Example Gallery automatically syncs content from the [pytidb repository](https://github.com/pingcap/pytidb/tree/main/examples).

### Updating Examples

To sync the latest examples from the pytidb repository:

```bash
make sync-examples
```

Or run the script directly:

```bash
python scripts/sync_examples_from_pytidb.py
```

### How It Works

The sync script:
1. Fetches README.md files from the pytidb repository using GitHub API
2. Processes content by adding YAML frontmatter and fixing relative links
3. Creates local markdown files with naming convention: `{example_name}-with-pytidb.md`
4. Updates the navigation configuration automatically
