// The main module of the rublind Add-on.

// Modules needed are `require`d, similar to CommonJS modules.
// In this case, creating a Widget that opens a new tab needs both the
// `widget` and the `tabs` modules.
var Widget = require("widget").Widget;
var tabs = require('tabs');
var data = require('self').data;
var clipboard = require('clipboard')
var Request = require('request').Request;
var notifications = require('notifications');

exports.main = function() {

    // Widget documentation: https://addons.mozilla.org/en-US/developers/docs/sdk/latest/packages/addon-kit/widget.html

    new Widget({
        // Mandatory string used to identify your widget in order to
        // save its location when the user moves it in the browser.
        // This string has to be unique and must not be changed over time.
        id: "rt.fm",

        // A required string description of the widget used for
        // accessibility, title bars, and error reporting.
        label: "rt.fm url shortener",


        // An optional string URL to content to load into the widget.
        // This can be local content or remote content, an image or
        // web content. Widgets must have either the content property
        // or the contentURL property set.
        //
        // If the content is an image, it is automatically scaled to
        // be 16x16 pixels.
        contentURL: data.url('icon_16.png'),

        // Add a function to trigger when the Widget is clicked.
        onClick: function(event) {
            
            // Tabs documentation: https://addons.mozilla.org/en-US/developers/docs/sdk/latest/packages/addon-kit/tabs.html

            // Open a new tab in the currently active window.
            var currentURL = tabs.activeTab.url;
            var url = 'https://rt.fm/s';
            var xhr = new Request({
                url: url,
                contentType: 'application/x-www-form-urlencoded',
                content: 'submit=New ShortURL&url=' + currentURL,
                onComplete: function(response) {
                    var shortURL = response.text.match(/>(http:\/\/rt\.fm\/s[^<]+)</)[1];
                    clipboard.set(shortURL);
                    notifications.notify({
                        title: "rt.fm",
                        text: shortURL + ' was copied to the clipboard',
                    });
                }
            });
            xhr.post();
        }
    });
};
