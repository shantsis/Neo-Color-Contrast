# Introduction
This is a private figma plugin to check the color contrast between any of [Neo's](https://design.avayacloud.com) colors available within the design system. Instead of hard coding the values, it directly pulls the latest color styles from the associated library each time it runs. 

# How to Use
To run the plugin,

1. Install the plugin.
2. From any file, open the menu and run File -> Plugins -> Neo Color Contrast.
3. Once the colors load, change either the foreground or background color to generate a [WCAG color contrast score](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html).

# Demo
![GIF of using the plugin](https://github.com/shantsis/temp-contrast/blob/main/demo.gif)

# Making it Your Own
Link up to your own library or manually enter the colors into the plugin to generate your own values.
* create a file called credentials.ts, and add 2 variables. One for the personal access token, and another for the file ID (where the styles are located)
* in ui.ts, in lines 129-150 adjust how the plugin needs to find the color layers to extract the values

