<img src="https://github.com/AdrLfv/esla/blob/master/components/logo%20esla.png?raw=true" alt="drawing" width="100" class="center"/>   

# SLEA - a Sign Language Eductive Avatar

## Description

This project allows to control a 3D avatar directly from a website. The user's coordinates are retrieved through a webcam and processed via MediaPipe. The loading of models, display and rendering are done with JavaScript and Three.js.
This program aims to be implemented on an augmented mirror using the "gosai" operating system. For the moment, it only allows to display a cube following the head movements of the user.
The program implements a recording mode for the animations (made in motion capture) and a loading mode for reading them.

## Implementation

To install this program, you must first have clone gosai on your device link: [Gosai github](https://github.com/GOSAI-DVIC/gosai.git) . Then go to the /core folder and clone the increased mirror code: [Second-self github](https://github.com/GOSAI-DVIC/second-self.git) . Then go to the /home/apps/ folder and clone ESLA: [ESLA github](https://github.com/AdrLfv/esla.git) . Then go to the gosai folder and run "make build && make launch" to get gosai running.

## Tests

To run unit tests on the three.js scene, just go to the folder in /components/test_zone and type "mocha" in the console. Mocha is a Javascript testing framework with many features. Only for the test phase, Node.js was added to the project and Mocha installed with npm. Test programs check that Three.js has been loaded and that the scene creation has worked. The light, camera, and correct loading of the model are also checked. The test program is "eslaSpecs.js" and it is situaded in /components/test_zone/test/eslaSpecs.js .
A simple test to check the size of the coordinate array retrieved by MediaPipe and transfered in the processing of esla, the value is always 31 points (when the user is in front of the camera). The data is valid and does not undergo any transformation.

All the node\_modules package used for unit testing are not on the github and are to be installed in the components with the command "npm init", "npm install three", "npm i mocha", and "npm i chai".

## Bugs

Unfortunately due to the time-consuming implementation of the adapted rotation of one bone around another, loading and saving coordinate sequences to play animations could not be implemented.
Its accuracy is sometimes poor, with MediaPipe detection sometimes causing "Ragdoll" type bugs. Its appearance also needs to be changed.

<style>
img {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>

