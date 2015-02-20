(function() {
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
                maxHeight: '='
            },
            link: function(scope, element, attrs) {

                var darkroom = false;
                var clearing_darkroom = false;

                function clear_darkroom() {
                    if (darkroom) {
                        darkroom.selfDestroy();
                        clearing_darkroom = true;
                    }
                }

                function load_new_image() {
                    var img_tag = element.find('img')[0];

                    // If darkroom has previously been instantiated
                    // we need to destroy it and start fresh with the new image.
                    if (darkroom) {
                        // Clearing the plugin image takes a moment.
                        // Don't bother proceeding until it's done.
                        if (!img_tag) {
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
                        }
                    }

                    angular.element(img_tag).attr('src', scope.image);

                    darkroom = new Darkroom(img_tag, {
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
                        init: function() {
                            var _init = this;

                            var cropPlugin = _init.getPlugin('crop');

                            cropPlugin.selectZone(170, 25, 300, 300);

                            _init.addEventListener('image:change', function() {
                                scope.onCrop({
                                    image: _init.snapshotImage()
                                });
                            });
                            _init.addEventListener('history:navigate', function() {
                                console.log('navigate');
                                scope.onCrop({
                                    image: _init.snapshotImage()
                                });
                            });
                        }
                    });
                }

                scope.$watch('image', function(new_value) {
                    load_new_image();
                })
            }
        };
    }
    angular
        .module('angular-darkroom', [])
        .directive('ncDarkroom', NcDarkroom)
    ;
})();
