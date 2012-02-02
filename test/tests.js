describe( 'diffy.js tests', function () {

  it ( 'diffy number test', function () {

    var result = diffy( 1, 1 );
    expect( result.same ).to.be.ok();
    expect( result.expected ).to.be( 1 );
    expect( result.actual ).to.be( 1 );

    result = diffy( 2, 1 );
    expect(result.same).to.not.be.ok();
    expect(result.expected).to.be( 2 );
    expect(result.actual).to.be( 1 );
  });

  it ( 'diffy string test', function () {

    var result = diffy( 'foo', 'foo' );
    expect( result.same ).to.be.ok();
    expect( result.expected ).to.be( 'foo' );
    expect( result.actual ).to.be( 'foo' );

    result = diffy( 'foo', 'bar' );
    expect( result.same ).to.not.be.ok();
    expect( result.expected ).to.be( 'foo' );
    expect( result.actual ).to.be( 'bar' );
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

  it ( 'diffy object test', function () {
    var result = diffy( object1, object2 );
    expect( result.same ).to.be.ok();
    expect( _.isEmpty( result.expected ) ).to.be.ok();
    expect( _.isEmpty( result.actual ) ).to.be.ok();

    result = diffy( object1, object3 );
    expect( result.same ).to.not.be.ok();
    expect( _.isEmpty( result.expected ) ).to.be.ok();
    expect( result.actual ).to.eql( { extra: null } );

    result = diffy( object1, object4 );
    expect( result.same ).to.not.be.ok();
    expect( result.expected ).to.eql( { bar: "baz" } );
    expect( _.isEmpty( result.actual ) ).to.be.ok();

    result = diffy( object1, object5 );
    expect( result.same ).to.not.be.ok();
    expect( result.expected ).to.eql( { foo: 1 } );
    expect( result.actual ).to.eql( { foo: 'apple' } );
  });

  it ( 'diffy array test', function () {
    var result = diffy( [ 'foo', 3, null ], [ 'foo', 3, null ] );
    expect( result.same ).to.be.ok();
    expect( result.expected ).to.eql([ undefined, undefined, undefined ]);
    expect( result.actual ).to.eql([ undefined, undefined, undefined ]);

    result = diffy( [ 'foo', 3, null ], [ 'foo', 3, 'apple' ] );
    expect( result.same ).to.not.be.ok();
    expect( result.expected ).to.eql([ undefined, undefined, null ]);
    expect( result.actual ).to.eql([ undefined, undefined, 'apple' ]);
  });

  it ( 'diffy does not hose nested objects', function () {
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

  it('faq test', function() {
    // NF: demonstrates that underscore.indexOf() operates on ===
    // var obj = {};
    // var arr = [ obj ];
    // var other = [ {} ];
    // expect( _.indexOf( arr, obj ) ).to.be( 0 );
    // expect( _.indexOf( other, obj ) ).to.be( -1 );
  });
});