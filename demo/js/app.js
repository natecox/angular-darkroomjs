(function(angular) {
    'use strict';

    var AppConfig = function(flowFactoryProvider) {
        flowFactoryProvider.defaults = {singleFile: true};
    }

    var AppCtrl = function($scope) {
        var _me = this;
        _me.image = '';
        _me.preview_image = '';

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
        }

        $scope.$on('flow::fileAdded', function(event, $flow, flowFile) {
            load_new_image(flowFile.file);
        });

        return _me;
    }

    angular
        .module('ncDarkroomTest', ['flow', 'angular-darkroom'])
        .config(AppConfig)
        .controller('AppCtrl', AppCtrl);
})(angular);
