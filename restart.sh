#!/bin/bash
npm install
if [ -d "src/server/lib" ] && [ -f "src/server/lib/glassfish-4-1.zip.partaa" ] && 
	[ -f "src/server/lib/glassfish-4-1.zip.partab" ] && 
	[ -f "src/server/lib/glassfish-4-1.zip.partac" ] && 
	[ -f "src/server/lib/glassfish-4-1.zip.partad" ] && 
	[ -f "src/server/lib/glassfish-4-1.zip.partae" ] && 
	[ -f "src/server/lib/glassfish-4-1.zip.partaf" ] && 
	[ -f "src/server/lib/glassfish-4-1.zip.partag" ] && 
	[ ! -d "src/server/lib/glassfish4" ]; then
  cd src/server/lib/
  ./installNC.sh
  cd ../../..
fi
if [ -d "src/server/ext" ] && [ ! -d "src/server/ext/IVY" ] &&
    [ -f "src/server/ext/IVY.zip.partaa" ] && 
	[ -f "src/server/ext/IVY.zip.partab" ] && 
	[ -f "src/server/ext/IVY.zip.partac" ]; then
  cd src/server/ext/
  ./installIVY.sh
  cd ../../..
fi
cd src/server
node pvssocketserver.js restart
