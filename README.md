#pintaproject.github.io website

Files for the the github.io website. (Currently only work-in-progress!)

The plan is for this to become the new Pinta homepage (redirected from the standard URL), which will save on hosting costs.
It will be updated with markdown through GitHub Pages's Jekyll system. There is one central config file (_config.yml) where you can set the variables for the current release, that is version numbers and download locations, without messing directly in HTML.


##Adding news
Add a new markdown file in the _posts folder, following the pattern of the previous posts. (The date should be in the filename.)

##Marking a release
Change the values in _config.yml. This will autoupdate the contents of the Download page.
