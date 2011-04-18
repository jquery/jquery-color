TEST_DIR = test
BUILD_DIR = build
PREFIX = .
DIST_DIR = ${PREFIX}/dist

JS_ENGINE ?= `which node nodejs`
COMPILER = ${JS_ENGINE} ${BUILD_DIR}/uglify.js --unsafe
POST_COMPILER = ${JS_ENGINE} ${BUILD_DIR}/post-compile.js

BASE_FILE = jquery.color.js

COLOR = ${DIST_DIR}/jquery-color.js
COLOR_MIN = ${DIST_DIR}/jquery-color.min.js

DATE=$(shell git log -1 --pretty=format:%ad)

JQ_VER = $(shell cat version.txt)
VER = sed "s/@VERSION/${JQ_VER}/"

all: update_submodules core

core: color min lint
	@@echo "jQuery-color build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

color: ${COLOR}

${COLOR}: jquery.color.js ${DIST_DIR}
	@@echo "Building" ${COLOR}

	@@cat jquery.color.js | \
		sed 's/@DATE/'"${DATE}"'/' | \
		${VER} > ${COLOR};

lint: color
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Checking jQuery.color against JSLint..."; \
		${JS_ENGINE} build/jslint-check.js; \
	else \
		echo "You must have NodeJS installed in order to test jQuery against JSLint."; \
	fi

min: color ${COLOR_MIN}

${COLOR_MIN}: ${COLOR}
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Minifying jQuery.color" ${COLOR_MIN}; \
		${COMPILER} ${COLOR} > ${COLOR_MIN}.tmp; \
		${POST_COMPILER} ${COLOR_MIN}.tmp > ${COLOR_MIN}; \
		rm -f ${COLOR_MIN}.tmp; \
	else \
		echo "You must have NodeJS installed in order to minify jQuery."; \
	fi

distclean: clean
	@@echo "Removing submodules"
	@@rm -rf test/qunit src/sizzle

# change pointers for submodules and update them to what is specified in jQuery
# --merge  doesn't work when doing an initial clone, thus test if we have non-existing
#  submodules, then do an real update
update_submodules:
	@@if [ -d .git ]; then \
		if git submodule status | grep -q -E '^-'; then \
			git submodule update --init --recursive; \
		else \
			git submodule update --init --recursive --merge; \
		fi; \
	fi;

# update the submodules to the latest at the most logical branch
pull_submodules:
	@@git submodule foreach "git pull \$$(git config remote.origin.url)"
	@@git submodule summary

pull: pull_submodules
	@@git pull ${REMOTE} ${BRANCH}


clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}
