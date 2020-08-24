---
layout: default
title: Installing Pinta - Pinta
---
# Installing Pinta

Pinta can be installed on Linux, Mac, Windows, or *BSD. Due to this, there are multiple ways to install Pinta based on what you are using as your operating system.

This document will show you the multiple ways to install Pinta.

## Installing Pinta on Ubuntu
### Install Pinta from default Ubuntu repository
Pinta is available in default Ubuntu repository. You can install it using:

* Click on Ubuntu Software Center from Launcher (left site icon panel).
* At the top right input box type in: Pinta and press Enter.
* Pinta is displayed in list bellow. Click on it and click the Install button.

But Pinta from default Ubuntu repository can be an old version, so you may want to install more recent version of Pinta from Pinta maintainers PPA repository. See below.

### Install Pinta from Pinta maintainers PPA repository using terminal (for advanced users)

Open terminal with CTRL+ALT+T

First, [install the latest version of Mono](https://www.mono-project.com/download/stable/#download-lin) (**version 6.10 or higher is strongly recommended**)

Add [Pinta stable PPA repository](https://launchpad.net/~pinta-maintainers/+archive/ubuntu/pinta-stable):

`sudo add-apt-repository ppa:pinta-maintainers/pinta-stable`

Note: Instead of *pinta-stable* you can add *pinta-daily* if you like to test latest and the greatest Pinta, but it may be buggy.

Update system package lists:

`sudo apt-get update`

Install pinta:

`sudo apt-get install pinta`
<br />
## Installing Pinta on *BSD
### FreeBSD and DragonFly BSD
Pinta is available in FreeBSD and DragonFly BSD ports.

You can install the binary package using:

`sudo pkg install pinta`

or compile it using:

`cd /usr/ports/graphics/pinta && sudo make install clean`
<br />
### OpenBSD
Pinta is available in OpenBSD ports.

You can install the binary package using:

`sudo pkg_add pinta`

or compile it using:

`cd /usr/ports/graphics/pinta && sudo make install`
<br />
## Using the Tarball

A tarball is like a ZIP file. It is a single file with many files inside it. Like a ZIP file, it has to be extracted before you can use the files in them.

First, you must download the tarball. Head on over to the [Download][2] page and click on the Download link under Tarball. Download the file where ever you'd like, just be sure you remember where.

Second, we need to extract it. You can either use your mouse to right-click on the Tarball file and select 'Extract here' or you can use the terminal if you are more comfortable with that.

Here is the command to extract the files via the terminal, be sure you are in the same folder as the tarball:

`tar -zxf pinta-VERSION.tar.gz`

[1]: http://help.launchpad.net/Packaging/PPA
[2]: http://pinta-project.com/releases
