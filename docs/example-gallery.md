# Example Gallery Implementation

This document describes the implementation of the Example Gallery feature for the TiDB for AI documentation site.

## Overview

The Example Gallery automatically syncs examples from the [pytidb repository](https://github.com/pingcap/pytidb/tree/main/examples) and converts them into documentation pages, avoiding duplication of content between repositories.

## Architecture

### Files and Structure

```
scripts/
└── sync_examples_from_pytidb.py    # Main sync script

src/ai/examples/                    # Generated example files
├── auto-embedding-with-pytidb.md
├── basic-with-pytidb.md
├── fulltext-search-with-pytidb.md
├── hybrid-search-with-pytidb.md
├── image-search-with-pytidb.md
├── memory-with-pytidb.md
├── quickstart-with-pytidb.md
├── rag-with-pytidb.md
├── text2sql-with-pytidb.md
└── vector-search-with-pytidb.md

mkdocs.yml                          # Updated with Examples section
Makefile                           # Build commands
README.md                          # Updated with Example Gallery info
pyproject.toml                     # All dependencies managed here
```

### Sync Process

1. **Fetch Examples**: The script queries the GitHub API to get all example directories from the pytidb repository
2. **Download README**: For each example, it downloads the README.md file
3. **Process Content**: It adds metadata, fixes links, and formats the content for the documentation site
4. **Generate Files**: Creates local markdown files with proper naming convention
5. **Update Navigation**: Provides output to update the mkdocs.yml navigation

### Content Processing

Each example file is processed to:

- Add YAML front matter with title, description, and source repository
- Include a source repository info box
- Fix relative links to point to the original repository
- Fix relative image links to use raw GitHub URLs
- Apply consistent naming and formatting

## Usage

### Initial Setup

```bash
# Install dependencies (from pyproject.toml)
make install

# Sync examples
make sync-examples
```

### Regular Updates

To sync the latest examples from the pytidb repository:

```bash
make sync-examples
```

Or run the script directly:

```bash
python scripts/sync_examples_from_pytidb.py
```

### Development

```bash
# Start development server
make serve

# Build documentation
make build

# Clean build artifacts
make clean
```

## Configuration

### Dependency Management

All dependencies are managed through `pyproject.toml` for consistency:

```toml
dependencies = [
    "mkdocs-material>=9.6.12",
    "mkdocs-jupyter>=0.25.1",
    "mkdocstrings[python]>=0.29.1",
    "mkdocs>=1.6.1",
    "mkdocs-redirects>=1.2.2",
    "requests>=2.31.0",      # For sync script
    "PyYAML>=6.0",           # For sync script
]
```

### Example Display Names

The sync script includes a mapping for display names:

```python
EXAMPLE_DISPLAY_NAMES = {
    "auto_embedding": "Auto Embedding",
    "basic": "Basic Usage",
    "fulltext_search": "Fulltext Search",
    "hybrid_search": "Hybrid Search",
    "image_search": "Image Search",
    "memory": "Memory",
    "quickstart": "Quickstart",
    "rag": "RAG",
    "text2sql": "Text2SQL",
    "vector_search": "Vector Search",
}
```

### MkDocs Navigation

The Examples section is configured in `mkdocs.yml`:

```yaml
nav:
  - Home:
    # ... other sections ...
    - 💡 Examples:
      - Auto Embedding: ai/examples/auto-embedding-with-pytidb.md
      - Basic Usage: ai/examples/basic-with-pytidb.md
      # ... other examples ...
  - Examples:
    - Auto Embedding: ai/examples/auto-embedding-with-pytidb.md
    - Basic Usage: ai/examples/basic-with-pytidb.md
    # ... other examples ...
```

## Benefits

1. **No Duplication**: Avoids maintaining the same content in multiple repositories
2. **Always Up-to-Date**: Examples are synced from the source repository
3. **Proper Attribution**: Each example clearly links back to the original source
4. **Consistent Formatting**: All examples follow the same documentation style
5. **Easy Maintenance**: Single command to update all examples

## Maintenance

### Adding New Examples

When new examples are added to the pytidb repository:

1. Run `make sync-examples` to fetch the new examples
2. Update the `EXAMPLE_DISPLAY_NAMES` mapping if needed
3. The mkdocs.yml navigation will need to be updated manually

### Removing Examples

If examples are removed from the pytidb repository:

1. Run `make sync-examples` (it will skip missing examples)
2. Manually remove the corresponding files from `src/ai/examples/`
3. Update the mkdocs.yml navigation

### Customization

To customize the processing:

1. Modify the `process_readme_content()` function in the sync script
2. Update the `EXAMPLE_DISPLAY_NAMES` mapping
3. Adjust the file naming convention in `create_example_file()`

## Future Enhancements

Potential improvements:

1. **Automatic mkdocs.yml Updates**: Automatically update the navigation section
2. **Caching**: Cache downloaded content to avoid unnecessary API calls
3. **Validation**: Validate that all links and images are accessible
4. **Metadata Enhancement**: Extract more metadata from the examples
5. **Multi-language Support**: Support for multiple language versions 