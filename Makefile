BUILD_DIR=Todoist-linux-x64

.PHONY: up
up:
	cd src && npm start

.PHONY: package
package:
	./src/node_modules/.bin/electron-packager src Todoist --platform=linux --arch=x64 --version-string.FileDescription=todoist --overwrite

.PHONY: release
release: package
	zip -r todoist-linux.zip $(BUILD_DIR)

.PHONY: up-package
up-package:
	./$(BUILD_DIR)/Todoist
