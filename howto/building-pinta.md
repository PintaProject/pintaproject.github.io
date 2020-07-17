---
layout: default
title: Building - Pinta
---
# Building Pinta

## Building Pinta on Linux or *BSD

On Linux you can build Pinta on two ways: Either you can build by opening Pinta.sln in MonoDevelop and building from there, or you can use the makefile. When using the makefile you can install Pinta directly in to the default directory or specify a directory.

### Building with the makefile

Building Pinta requires the following software:

`mono mono-xbuild automake autoconf libmono-cairo2.0-cil gtk-sharp2`

Pinta only supports version 2.8 or higher of Mono. Ubuntu 14.04 for example ships Mono 3.2.8. To check the version of Mono execute command:

`mono -V`

To build Pinta, run:

`./autogen.sh`

`make`

`sudo make install`

or if building from a tarball, run:

`./configure`

`make`

`sudo make install`

To use different installation directory than the default (/usr), run this instead:

`./autogen.sh --prefix=<install directory>`

To uninstall Pinta, run:

`sudo make uninstall`

To clean all files created during the build process, run:

`make cleanall`

Note This will require you to rerun autogen.sh in order to run more make commands.

For a list of more make commands, run:

`make help`

### Building Pinta on Ubuntu

Follow the below instructions to compile Pinta from GitHub on your Ubuntu system.

Install build development tools:

`sudo apt-get build-dep pinta`

Install git version control system:

`sudo apt-get install git`

Download program's source code:

`git clone https://github.com/PintaProject/Pinta.git Pinta`

Change directory to Pinta:

`cd Pinta`

Automatic build system preparation:

`./autogen.sh`

Compile the code:

`make`

Run Pinta:

`make install`


## Building Pinta on Windows & Mac

On Windows and Mac, you open Pinta.sln with Monodevelop, SharpDevelop or Visual Studio and build from there. To build the Windows installer you can use Visual Studio with the Votive plugin to build the WiX project.
