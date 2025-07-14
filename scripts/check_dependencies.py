#!/usr/bin/env python3
"""Simple dependency check for TiDB for AI documentation."""

import sys
import subprocess

def main():
    print("🚀 TiDB for AI Documentation - Quick Check")
    
    # Check UV
    try:
        result = subprocess.run(["uv", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ UV is available")
        else:
            print("❌ UV not working")
            return 1
    except FileNotFoundError:
        print("❌ UV not found - Install: curl -LsSf https://astral.sh/uv/install.sh | sh")
        return 1
    
    # Check basic imports
    try:
        import mkdocs, requests, yaml
        print("✅ Dependencies are installed")
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("💡 Run: make install")
        return 1
    
    print("🎉 Ready to go! Run 'make serve' to start.")
    return 0

if __name__ == "__main__":
    sys.exit(main()) 