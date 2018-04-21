PATHTOPACK=./electron/resources/app

.PHONY: up
up:
	cd src && npm start

.PHONY: package
package:
	mkdir -p $(PATHTOPACK) && \
	cp -r src/* $(PATHTOPACK)

.PHONY: up-package
up-package:
	./electron/electron
