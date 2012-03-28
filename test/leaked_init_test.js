expect = require('../node_modules/expect.js/expect');
var underscore = require('../node_modules/underscore/underscore');

diffy = require('../diffy');
// let diffy initalize with a leaked "_" object
_ = underscore;


describe( 'diffy.js initalizations sanity tests', function () {

  describe( 'tests for nested object comparison which uses underscore', function() {

    it('does not corrupt nested objects', function () {
      var obj1 = {
          "SecondaryRatings": {
            "Value": {
              "Value": 4,
              "ValueLabel": null,
              "MaxLabel": null,
              "Label": "Value",
              "Id": "Value",
              "ValueRange": 5,
              "MinLabel": null,
              "DisplayType": "NORMAL"
            },
            "Quality": {
              "Value": 5,
              "ValueLabel": null,
              "MaxLabel": null,
              "Label": "Quality",
              "Id": "Quality",
              "ValueRange": 5,
              "MinLabel": null,
              "DisplayType": "NORMAL"
            }
          }
        },
        obj2 = {
          "SecondaryRatings": {
            "Value": {
              "Value": 4,
              "ValueLabel": null,
              "MaxLabel": null,
              "Label": "Value",
              "Id": "Value",
              "ValueRange": 5,
              "MinLabel": null,
              "DisplayType": "NORMAL"
            },
            "Quality": {
              "Value": 5,
              "ValueLabel": null,
              "MaxLabel": null,
              "Label": "Quality",
              "Id": "Quality",
              "ValueRange": 5,
              "MinLabel": null,
              "DisplayType": "NORMAL"
            }
          }
        };
      var result = diffy.diff( obj1, obj2 );
      expect( result.same ).to.be.ok();
      expect( _.isEmpty( result.expected ) ).to.be.ok();
      expect( _.isEmpty( result.actual ) ).to.be.ok();
      expect( _.isEmpty( obj1.SecondaryRatings.Value ) ).to.not.be.ok();
      expect( _.isEmpty( obj2.SecondaryRatings.Value ) ).to.not.be.ok();
    });

  });

});
