(function( root ) {

  var diffy = function diffy( expected, actual, alreadyProcessed ) {

    var myExpected  = _.clone( expected ),
        myActual    = _.clone( actual ),
        myProcessed = alreadyProcessed || [],
        same = false,
        subcompare,
        key;

    // TODO: something better with functions?
    if ( (typeof myExpected) == (typeof myActual) ) {
      if ( _.isArray( myExpected ) && _.isArray( myActual ) ) {
        // compare each element
        same = true; // initialization
        _( myExpected ).each(function ( expectedValue, index ) {
          subcompare = diffy( expectedValue, myActual[ index ], myProcessed );
          if ( subcompare.same ) {
            myExpected[ index ] = undefined;
            if ( index < myActual.length ) {
              myActual[ index ] = undefined;
            }
          } 
          else {
            myExpected[ index ] = subcompare.expected;
            if ( index < myActual.length ) {
              myActual[ index ] = subcompare.actual;
            }
          }
          same = same && subcompare.same;
        });
      } 
      else if ( typeof myExpected == 'object' ) {
        if ( (_.indexOf( myProcessed, myExpected ) == -1) &&
             (_.indexOf( myProcessed, myActual ) == -1) ) {

          myProcessed.push( myExpected );
          myProcessed.push( myActual );

          // compare each key's value
          _( myExpected ).each(function ( expectedValue, key ) {
            if ( myExpected.hasOwnProperty( key ) ) {
              subcompare = diffy( expectedValue, myActual[ key ], myProcessed );
              if ( subcompare.same ) {
                delete myExpected[ key ];
                delete myActual[ key ];
              } 
              else {
                myExpected[ key ] = subcompare.expected;
                if ( myActual.hasOwnProperty( key ) ) {
                  myActual[ key ] = subcompare.actual;
                }
              }
            }
          });
        }
        same = _.isEmpty( myExpected ) && _.isEmpty( myActual );
      } 
      else {
        // straight comparison
        same = ( myExpected === myActual );
      }
    } // else leave them--they're different

    return {
      'same': same,
      'expected': myExpected,
      'actual':   myActual
    };
  };

  // Handle node, amd, and global systems
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = diffy;
    }
    exports.diffy = diffy;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define('diffy', function() {
        return diffy;
      });
    }
    // Leak a global regardless of module system
    root.diffy = diffy;
  }

})( this );