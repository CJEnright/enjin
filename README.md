# Enjin (Because you can't call your engine, engine)  
Enjin is a small and (hopefully) easy to learn 2D game engine for the HTML5 canvas element.  

It has all the features you'd expect from an engine, and can easily be extended by writing a new module and adding it alongside the rest of the requires in src/core.js

## Features 
 * Update loop using requestAnimFrame with fallbacks
 * Delta time based updating
 * Camera with support for layers (Parallax)
 * Timing module following game time
 * Tweening module for easing between values
 * Game states and support for switching between them
 * Particle system with Emitters and Pulses
 * Full JDOC documentation
 * Small footprint (~10 kb minified)

## Examples  
Check out example code in the [Example folder](https://github.com/CJEnright/enjin/example), and see them in action at the [showcase](cjenright.github.io/enjin/showcase).

## Showcase  
### Planets  
![Planet Preview](TODO)  

More to come soon...  

## Building and developing  
To build, just clone this repo, ```npm install```, and then ```npm run build```.  You should have an "enjin.js" file in the public folder.  

For developing, install the dev dependencies and run ```grunt serve```.  Your browser should open a page at [localhost:8100](localhost:8100) which will automatically rebuild and reload when you edit any file in the src/ directory.

