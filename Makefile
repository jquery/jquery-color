TEST_DIR = test
BUILD_DIR = build
DIST_DIR = ./dist

JS_ENGINE ?= `which node nodejs`
COMPILER = ${JS_ENGINE} ${BUILD_DIR}/uglify.js --unsafe
POST_COMPILER = ${JS_ENGINE} ${BUILD_DIR}/post-compile.js

SRC = jquery.color.js

MAX = ${DIST_DIR}/jquery.color.js
MIN = ${DIST_DIR}/jquery.color.min.js

COLOR_DATE = $(shell git log -1 --pretty=format:%ad)
SED_DATE = sed "s/@DATE/${COLOR_DATE}/"

COLOR_VER = $(shell cat version.txt)
SED_VER = sed "s/@VERSION/${COLOR_VER}/"


all: update color

color: max min lint size
	@@echo "jQuery color build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

max: ${MAX}

${MAX}: ${SRC} ${DIST_DIR}
	@@echo "Building" ${MAX}

	@@cat ${SRC} | ${SED_DATE} | ${SED_VER} > ${MAX};

lint: max
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Checking jQuery.color against JSLint..."; \
		${JS_ENGINE} build/jslint-check.js; \
	else \
		echo "You must have NodeJS installed in order to test jQuery against JSLint."; \
	fi

size: max min
	@@if test ! -z ${JS_ENGINE}; then \
		gzip -c ${MIN} > ${MIN}.gz; \
		echo "Size compared to last make"; \
		wc -c ${MAX} ${MIN} ${MIN}.gz | ${JS_ENGINE} ${BUILD_DIR}/sizer.js; \
		rm ${MIN}.gz; \
	else \
		echo "You must have NodeJS installed in order to size jQuery."; \
	fi

min: max ${MIN}

${MIN}: ${MAX}
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Minifying jQuery.color" ${MIN}; \
		${COMPILER} ${MAX} > ${MIN}.tmp; \
		${POST_COMPILER} ${MIN}.tmp > ${MIN}; \
		rm -f ${MIN}.tmp; \
		echo "gzipping ${MIN}.gz"; \
		gzip -c9 ${MIN} > ${MIN}.gz; \
	else \
		echo "You must have NodeJS installed in order to minify jQuery."; \
	fi

distclean: clean
	@@echo "Removing submodules"
	@@rm -rf test/qunit

# change pointers for submodules and update them to what is specified in jQuery
# --merge  doesn't work when doing an initial clone, thus test if we have non-existing
#  submodules, then do an real update
update:
	@@if [ -d .git ]; then \
		if git submodule status | grep -q -E '^-'; then \
			git submodule update --init --recursive; \
		else \
			git submodule update --init --recursive --merge; \
		fi; \
	fi;

# update the submodules to the latest at the most logical branch
pull:
	@@git submodule foreach "git pull \$$(git config remote.origin.url)"
	@@git submodule summary

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}
