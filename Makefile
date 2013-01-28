##############################################################
##                    COPYRIGHT NOTICE
##
## Copyright (C) 2009-2013. ViniSketch  (c) All rights reserved
##
##############################################################

###                     Declaration 
##############################################################

SHELL = /bin/sh
CHMOD = chmod
CP = cp
XTEMP = ../lib/manage_template.sh 
MV = mv
NOOP = $(SHELL) -c true
RM_F = rm -f
RM_RF = rm -rf
TEST_F = test -f
TOUCH = touch
UMASK_NULL = umask 0
DEV_NULL = > /dev/null 2>&1
MKPATH = mkdir -p
CAT = cat
MAKE = make
OPEN = open
ECHO = echo
ECHO_N = echo -n
JAVA = java
COMPILE = $(JAVA) -jar tools/closurecompiler/compiler.jar --language_in=ECMASCRIPT5
COMPILE_ADV = $(JAVA) -jar tools/closurecompiler/compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS
COMPILE_YUI = $(JAVA) -cp tools/yuicompressor/jargs-1.0.jar:tools/yuicompressor/rhino-1.6R7.jar -jar tools/yuicompressor/yuicompressor-2.4.2.jar
GENDOC = $(JAVA) -jar tools/jsdoc-toolkit/jsrun.jar tools/jsdoc-toolkit/app/run.js 
COMPILE_LESS = /usr/local/bin/lessc

###                         RELEASE
##############################################################

all :: release

Debug :: debug
Release :: release

release :: clean makedirs libs_release transform_js_release

debug :: clean makedirs libs_debug transform_js_debug

clean :: clean_libs

clean_libs:
	-$(RM_RF) build
		
makedirs:
	-$(MKPATH) build/
	-$(MKPATH) build/libs/

###                    transform_js
##############################################################

transform_js_release: build/transform.js
	-$(COMPILE) --js=build/transform.js --js_output_file=build/transform_min.js
	
transform_js_debug: build/transform.js

build/transform.js: src/Point.js src/Transform.js
	$(CAT) src/Point.js >> $@
	$(CAT) src/Transform.js >> $@


###                    libs
##############################################################

libs_release: src/libs/FirminCSSMatrix.js src/libs/util.js 
	-$(CP) src/libs/FirminCSSMatrix.js build/libs/firminCSSMatrix.js
	-$(COMPILE) --js=build/libs/firminCSSMatrix.js --js_output_file=build/libs/firminCSSMatrix_min.js
	-$(CP) src/libs/util.js build/libs/util.js
	-$(COMPILE) --js=build/libs/util.js --js_output_file=build/libs/util_min.js
	
libs_debug: src/libs/FirminCSSMatrix.js src/libs/util.js
	-$(CP) src/libs/firminCSSMatrix.js build/libs/firminCSSMatrix.js
	-$(CP) src/libs/util.js build/libs/util.js

