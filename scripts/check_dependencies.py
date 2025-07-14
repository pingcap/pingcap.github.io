#!/usr/bin/env python3
"""
Check if all dependencies are properly installed and configured.
"""

import sys
import importlib
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible."""
    min_version = (3, 12)
    current_version = sys.version_info[:2]
    
    print("🐍 Python Version Check:")
    print(f"  Current: {'.'.join(map(str, current_version))}")
    print(f"  Required: {'.'.join(map(str, min_version))}+")
    
    if current_version >= min_version:
        print("  ✅ Python version is compatible")
        return True
    else:
        print("  ❌ Python version is too old")
        return False

def check_dependencies():
    """Check if all required dependencies are installed."""
    dependencies = [
        ("mkdocs", "MkDocs"),
        ("material", "MkDocs Material"),
        ("mkdocs_jupyter", "MkDocs Jupyter"),
        ("mkdocstrings", "MkDocstrings"),
        ("requests", "Requests"),
        ("yaml", "PyYAML"),
    ]
    
    print("\n📦 Dependency Check:")
    all_ok = True
    
    for module_name, display_name in dependencies:
        try:
            module = importlib.import_module(module_name)
            version = getattr(module, '__version__', 'unknown')
            print(f"  ✅ {display_name}: {version}")
        except ImportError:
            print(f"  ❌ {display_name}: not installed")
            all_ok = False
    
    return all_ok

def check_project_structure():
    """Check if project structure is correct."""
    required_files = [
        "pyproject.toml",
        "mkdocs.yml",
        "src/ai/quickstart.md",
        "scripts/sync_examples_from_pytidb.py",
        "Makefile",
    ]
    
    print("\n📁 Project Structure Check:")
    all_ok = True
    
    for file_path in required_files:
        path = Path(file_path)
        if path.exists():
            print(f"  ✅ {file_path}")
        else:
            print(f"  ❌ {file_path}: missing")
            all_ok = False
    
    return all_ok

def check_examples_directory():
    """Check if examples directory exists and has content."""
    examples_dir = Path("src/ai/examples")
    
    print("\n📚 Examples Directory Check:")
    
    if not examples_dir.exists():
        print("  ❌ Examples directory not found")
        print("  💡 Run 'make sync-examples' to create it")
        return False
    
    example_files = list(examples_dir.glob("*-with-pytidb.md"))
    
    if not example_files:
        print("  ❌ No example files found")
        print("  💡 Run 'make sync-examples' to sync examples")
        return False
    
    print(f"  ✅ Found {len(example_files)} example files")
    for file in sorted(example_files):
        print(f"    - {file.name}")
    
    return True

def check_uv_availability():
    """Check if uv is available."""
    print("\n⚡ UV Package Manager Check:")
    
    try:
        result = subprocess.run(
            ["uv", "--version"],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            version = result.stdout.strip()
            print(f"  ✅ UV is available: {version}")
            return True
        else:
            print("  ❌ UV not working properly")
            return False
    except FileNotFoundError:
        print("  ❌ UV not found")
        print("  💡 Install UV: curl -LsSf https://astral.sh/uv/install.sh | sh")
        return False

def check_makefile_commands():
    """Check if Makefile commands are available."""
    commands = ["install", "sync-examples", "serve", "build", "clean"]
    
    print("\n🔧 Makefile Commands Check:")
    
    try:
        result = subprocess.run(
            ["make", "-n", "help"],
            capture_output=True,
            text=True,
            cwd=Path.cwd()
        )
        
        if result.returncode == 0:
            print("  ✅ Makefile is available")
            for cmd in commands:
                print(f"    - make {cmd}")
        else:
            print("  ❌ Makefile not found or not working")
            return False
    except FileNotFoundError:
        print("  ❌ 'make' command not found")
        return False
    
    return True

def main():
    """Main function to run all checks."""
    print("🚀 TiDB for AI Documentation - Dependency Check")
    print("=" * 50)
    
    checks = [
        check_python_version(),
        check_uv_availability(),
        check_dependencies(),
        check_project_structure(),
        check_examples_directory(),
        check_makefile_commands(),
    ]
    
    print("\n📊 Summary:")
    print("=" * 50)
    
    if all(checks):
        print("✅ All checks passed! Your environment is ready.")
        print("\n🎉 Next steps:")
        print("  1. Run 'make sync-examples' to sync latest examples")
        print("  2. Run 'make serve' to start the development server")
        print("  3. Visit http://localhost:8000 to view the documentation")
        return 0
    else:
        print("❌ Some checks failed. Please fix the issues above.")
        print("\n🔧 Common solutions:")
        print("  1. Install UV: curl -LsSf https://astral.sh/uv/install.sh | sh")
        print("  2. Install dependencies: make install")
        print("  3. Sync examples: make sync-examples")
        print("  4. Check Python version: python --version")
        return 1

if __name__ == "__main__":
    sys.exit(main()) 