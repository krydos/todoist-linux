DIST_DIR=dist
VERSION=1.4.0
DROPBOX_DIR=~/Dropbox/projects/binaries

.PHONY: up
up:
	cd src && npm start

.PHONY: build-all
build-all:
	./node_modules/.bin/electron-builder --linux

.PHONY: archive-unpacked
archive-unpacked:
	zip -r $(DIST_DIR)/todoist-linux.zip $(DIST_DIR)/linux-unpacked/*

.PHONY: copy-to-dropbox
copy-to-dropbox: archive-unpacked
	cp $(DIST_DIR)/Todoist_$(VERSION)_amd64.deb $(DROPBOX_DIR)/Todoist.deb && \
	cp $(DIST_DIR)/Todoist-$(VERSION).x86_64.rpm $(DROPBOX_DIR)/Todoist.rpm && \
	cp $(DIST_DIR)/todoist-linux.zip $(DROPBOX_DIR)/todoist-linux.zip

.PHONY: set-version
set-version:
	cd src && npm version $(VERSION)
