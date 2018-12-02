install:
	npm install

submodules:
	git submodule update --init --recursive

build:
	npm run build

serve: install submodules
	npm run start