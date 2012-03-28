#!/bin/bash

# Script for server-side mocha-based testing.

case "$1" in
	"-debug" )
	echo " ---starting mocha--- "
	./node_modules/mocha/bin/mocha --debug-brk --reporter spec ./test/tests.js &
	node-inspector --web-port=5005 &
	echo "Press any key when done"
	read -p input
	echo "Killing all node processes (sry if you were running node)"
	killall node
	;;
	"" )
    ./node_modules/mocha/bin/mocha --reporter spec ./test/tests.js
    ./node_modules/mocha/bin/mocha --reporter spec ./test/leaked_init_test.js
	;;
esac