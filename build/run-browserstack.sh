#!/bin/bash

for run in \
	"./build/browserstack-current.json" \
	"./build/browserstack-legacy.json"
do
	export BROWSERSTACK_JSON=$run
	if ! node_modules/.bin/browserstack-runner ; then
		exit 1
	fi
done

exit 0
