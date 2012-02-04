describe( 'diffy.js tests', function () {

  describe( 'tests for scalar number comparison', function() {

    it('says that the same numbers are the same', function () {
      var result = diffy( 1, 1 );
      expect( result.same ).to.be.ok();
      expect( result.expected ).to.be( 1 );
      expect( result.actual ).to.be( 1 );
    });

    it('says that different numbers are different', function () {
      var result = diffy( 2, 1 );
      expect(result.same).to.not.be.ok();
      expect(result.expected).to.be( 2 );
      expect(result.actual).to.be( 1 );
    });

  });

  describe( 'tests for scalar string comparison', function() {

    it('says that the same strings are the same', function () {
      var result = diffy( 'foo', 'foo' );
      expect( result.same ).to.be.ok();
      expect( result.expected ).to.be( 'foo' );
      expect( result.actual ).to.be( 'foo' );
    });

    it('says that different strings are different', function () {
      var result = diffy( 'foo', 'bar' );
      expect( result.same ).to.not.be.ok();
      expect( result.expected ).to.be( 'foo' );
      expect( result.actual ).to.be( 'bar' );
    });

  });

  describe( 'tests for scalar boolean comparison', function() {

    it('says that the same booleans are the same', function () {
      var result = diffy( true, true );
      expect( result.same ).to.be.ok();
      expect( result.expected ).to.be( true );
      expect( result.actual ).to.be( true );
    });

    it('says that different booleans are different', function () {
      var result = diffy( true, false );
      expect( result.same ).to.not.be.ok();
      expect( result.expected ).to.be( true );
      expect( result.actual ).to.be( false );
    });

    _([ '', 0 ]). each(function ( value ) {
      it('does not coerce ' + value + ' into false', function () {
        var result = diffy( false, value );
        expect( result.same ).to.not.be.ok();
        expect( result.expected ).to.be( false );
        expect( result.actual ).to.be( value );
      });
    });

  });

  describe( 'tests for array comparison', function() {

    it('recognizes arrays with the same elements as the same', function () {
      var result = diffy( [ 'foo', 3, null ], [ 'foo', 3, null ] );
      expect( result.same ).to.be.ok();
      expect( result.expected ).to.eql([ undefined, undefined, undefined ]);
      expect( result.actual ).to.eql([ undefined, undefined, undefined ]);
    });

    it('recognizes differing elements of a pair of arrays', function () {
      var result = diffy( [ 'foo', 3, null ], [ 'foo', 3, 'apple' ] );
      expect( result.same ).to.not.be.ok();
      expect( result.expected ).to.eql([ undefined, undefined, null ]);
      expect( result.actual ).to.eql([ undefined, undefined, 'apple' ]);
    });

    it('handles when the expected argument is longer than the actual argument', function() {
      var result = diffy( [ 'foo', 3, true ], [ 'foo', 3 ] );
      expect( result.same ).to.not.be.ok();
      expect( result.expected ).to.eql([ undefined, undefined, true ]);
      expect( result.actual ).to.eql([ undefined, undefined ]);
    });

    it('handles when the expected argument is shorter than the actual argument', function() {
        var result = diffy( [ 'foo', 3 ], [ 'foo', 3, false ] );
        expect( result.same ).to.not.be.ok();
        expect( result.expected ).to.eql([ undefined, undefined ]);
        expect( result.actual ).to.eql([ undefined, undefined, false ]);
      }
    );

    it('says not same when only expected is an array', function() {
      var result = diffy([ 'foo', 3, true ], 'bar' );
      expect( result.same ).to.not.be.ok();
      expect( result.expected ).to.eql([ 'foo', 3, true ]);
      expect( result.actual ).to.eql( 'bar' );
    });

  });

  var object1 = {
    foo: 1,
    bar: "baz"
  };

  var object2 = {
    foo: 1,
    bar: "baz"
  };

  var object3 = {
    foo: 1,
    bar: "baz",
    extra: null
  };

  var object4 = {
    foo: 1
  };

  var object5 = {
    foo: "apple",
    bar: "baz"
  };

  describe( 'tests for simple object comparison', function() {

    it('says objects with the same contents are the same', function () {
      var result = diffy( object1, object2 );
      expect( result.same ).to.be.ok();
      expect( _.isEmpty( result.expected ) ).to.be.ok();
      expect( _.isEmpty( result.actual ) ).to.be.ok();
    });

    it('recognizes when the actual argument has an additional attribute', function () {
      var result = diffy( object1, object3 );
      expect( result.same ).to.not.be.ok();
      expect( _.isEmpty( result.expected ) ).to.be.ok();
      expect( result.actual ).to.eql( { extra: null } );
    });

    it('recognizes when the expected argument has an additional attribute', function () {
      var result = diffy( object1, object4 );
      expect( result.same ).to.not.be.ok();
      expect( result.expected ).to.eql( { bar: "baz" } );
      expect( _.isEmpty( result.actual ) ).to.be.ok();
    });

    it('recognizes when the expected and actual arguments each have an attribute that the other does not', function () {
      var result = diffy( object1, object5 );
      expect( result.same ).to.not.be.ok();
      expect( result.expected ).to.eql( { foo: 1 } );
      expect( result.actual ).to.eql( { foo: 'apple' } );
    });

    it('says an expected object is not the same as an actual value', function() {
      var result = diffy( object1, "foo" );
      expect( result.same ).to.not.be.ok();
      expect( result.expected ).to.eql( object1 );
      expect( result.actual ).to.eql( "foo" );
    })

    it('says an expected value is not the same as an actual object', function() {
      var result = diffy( "foo", object1 );
      expect( result.same ).to.not.be.ok();
      expect( result.actual ).to.eql( object1 );
      expect( result.expected ).to.eql( "foo" );
    })

  });

  describe( 'tests for nested object comparison', function() {

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
      var result = diffy( obj1, obj2 );
      expect( result.same ).to.be.ok();
      expect( _.isEmpty( result.expected ) ).to.be.ok();
      expect( _.isEmpty( result.actual ) ).to.be.ok();
      expect( _.isEmpty( obj1.SecondaryRatings.Value ) ).to.not.be.ok();
      expect( _.isEmpty( obj2.SecondaryRatings.Value ) ).to.not.be.ok();
    });

  });

  describe( 'tests for comparison of objects with cycles', function() {

    it ('diffy trivial cycle test' // TODO: PENDING--terminates, but yields wrong answer
      // , function() {
      //   var obj1 = {},
      //       obj2 = {};
      //   obj1.self = obj1;
      //   obj2.self = obj2;
      //   var result = diffy( obj1, obj2 );
      //   expect( result.same ).to.be.ok();
      //   expect( _.isEmpty( result.expected ) ).to.be.ok();
      //   expect( _.isEmpty( result.actual ) ).to.be.ok();
      // }
    );

  });

});