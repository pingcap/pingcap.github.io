# Development Guide

This guide covers the development setup and maintenance of the TiDB for AI documentation site.

## Quick Start

1. **Install UV** (fast dependency manager):

   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

2. **Install dependencies**:

   ```bash
   make install
   ```

3. **Start development server**:

   ```bash
   make serve
   ```

## Project Structure

```
├── demos.yml                    # Demo Gallery configuration
├── scripts/generate_demos.py    # Demo Gallery generation script  
├── src/
│   ├── templates/               # Jinja2 templates
│   └── ai/examples/             # Generated demo pages
└── Makefile                     # Build commands
``` 

## Helpful Commands

```bash
# Dependencies
make check          # Check dependencies and setup
make install        # Install/update dependencies

# Development workflow
make serve          # Start development server
make build          # Build documentation site
make clean          # Clean build artifacts

# Demo management
make generate-demos     # Generate demo pages and gallery from demos.yml config

# Other
make help           # Show all available commands
```

## Maintain the Demo Gallery

The Demo Gallery showcases AI demos of TiDB and is configured via [demos.yml](demos.yml).

To regenerate the demo gallery from configuration, run:

```bash
make generate-demos
```

### How to add a new demo

You can follow the steps below to add a new demo:

1. Add entry to `demos` array in `demos.yml` with unique `id`, title, description, and display properties

  For example:

  ```yaml
  demos:
    - id: "basic"
      title: "Basic Usage"
      description: "Learn fundamental PyTiDB operations"
      icon: "⚙️"
      background: "linear-gradient(135deg, #10b981, var(--brand-color))"
      link: "basic-with-pytidb/"
      doc_link: "https://github.com/pingcap/pytidb/tree/main/examples/basic/README.md"
      cover_image: null
  ```

2. Add the demo `id` to appropriate category's `demos` array

  For example:

  ```yaml
  categories:
    - id: "featured"
      title: "Search"
      demos: ["image-search"]
  ```

3. Run `make generate-demos` to regenerate
4. Commit changes
