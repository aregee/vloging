'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Video = new Module('video');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Video.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Video.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Video.menus.add({
    title: 'video example page',
    link: 'video example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Video.aggregateAsset('css', 'video.css');
  Video.aggregateAsset('css', '../lib/videojs/dist/video-js/video-js.min.css');
  Video.aggregateAsset('js', '../lib/videojs/dist/video-js/video.js');


  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Video.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Video.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Video.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Video;
});
