(function(angular) {
    'use strict';

    function NcDarkroom() {
        return {
            restrict: 'E',
            template: '<img />',
            scope: {
                image: '=',
                onCrop: '&',
                history: '=',
                crop: '=',
                rotate: '=',
                save: '=',
                minWidth: '=',
                minHeight: '=',
                maxWidth: '=',
                maxHeight: '=',
                rawDarkroom: '=?'
            },
            link: function(scope, element, attrs) {
                var darkroom = scope.rawDarkroom = null;
                var clearing_darkroom = false;

                function clear_darkroom() {
                    if (darkroom) {
                        darkroom.selfDestroy();
                        clearing_darkroom = true;
                    }
                }

                function load_new_image() {
                    var imgElt = element.find('img');

                    // If darkroom has previously been instantiated
                    // we need to destroy it and start fresh with the new image.
                    if (darkroom) {
                        // Clearing the plugin image takes a moment.
                        // Don't bother proceeding until it's done.
                        if (imgElt.attr('data-used')) {
                            // If we're not already clearing the darkroom, start now.
                            if (!clearing_darkroom) {
                                clear_darkroom();
                            }

                            // Chill for half a second and try again.
                            setTimeout(load_new_image, 0.5);
                            return false;
                        } else {
                            // clearing is done! Proceed.
                            clearing_darkroom = false;
                            // Patch for darkroom#selfDestroy, they didn't clear their listener.
                            imgElt[0].onload = null;
                        }
                    }

                    imgElt.attr({
                        crossOrigin: 'anonymous',
                        src: scope.image,
                        'data-used': true
                    });

                    scope.rawDarkroom = darkroom = new Darkroom(imgElt[0], {
                        // Size options
                        minWidth: scope.minWidth || 100,
                        minHeight: scope.minHeight || 100,
                        maxWidth: scope.maxWidth || 650,
                        maxHeight: scope.maxHeight || 500,
                        plugins: {
                            save: scope.save || false,
                            rotate: scope.rotate || false,
                            crop: scope.crop || false,
                            history: scope.history || false
                        },
                        initialize: function() {
                            var instance = this,
                                cropPlugin = this.plugins['crop'];

                            cropPlugin.requireFocus();

                            instance.addEventListener('core:transformation', function() {
                                scope.onCrop({
                                    image: instance.canvas.toDataURL()
                                });
                            });
                        }
                    });
                }

                scope.$watch('image', function(new_value) {
                    if (new_value)
                        load_new_image();
                });
            }
        };
    }
    angular
        .module('angular-darkroom', [])
        .directive('ncDarkroom', NcDarkroom);
})(angular);
