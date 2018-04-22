ELECTRON_FOLDER=todoist-linux
PATHTOPACK=./$(ELECTRON_FOLDER)/resources/app

.PHONY: up
up:
	cd src && npm start

.PHONY: package
package:
	mkdir -p $(PATHTOPACK) && \
	cp -r src/* $(PATHTOPACK) && \
	cp todoist $(ELECTRON_FOLDER)

.PHONY: release
release:
	zip -r todoist-linux.zip $(ELECTRON_FOLDER)

.PHONY: up-package
up-package:
	./$(ELECTRON_FOLDER)/todoist
