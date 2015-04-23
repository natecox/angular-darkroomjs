(function(fabric, angular) {
    'use strict';

    var AppCtrl = function($scope) {
        var _me = this;
        _me.image = '';
        _me.preview_image = '';

        console.log(fabric);

        function load_new_image(file) {
            var oFReader = new FileReader();
            oFReader.readAsDataURL(file);

            oFReader.onload = function(ofr_event) {
                _me.image = ofr_event.target.result;
                $scope.$apply();
            };
        }

        _me.image_changed = function(image) {
            _me.preview_image = image;
            $scope.$apply();
        };

        _me.upload_by_url = function() {
            console.log('called', _me.image_url);
            fabric.Image.fromURL(_me.image_url, function(img) {
                console.log(img.toString());
            })
            _me.image = _me.image_url;
        };

        $scope.$on('flow::fileAdded', function(event, $flow, flowFile) {
            load_new_image(flowFile.file);
        });

        return _me;
    }

    angular
        .module('ncDarkroomTest', ['flow', 'angular-darkroom'])
        .controller('AppCtrl', AppCtrl);
})(fabric, angular);
