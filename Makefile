DIST_DIR=dist

.PHONY: up
up:
	cd src && npm start

.PHONY: build-all
build-all:
	./node_modules/.bin/electron-builder --linux
