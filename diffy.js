(function( root ) {

  var cycleSentinel = {},
    newCycleMarker = function( cycleId ) {
      return {
        __diffyCycleSentinal: cycleSentinel,
        id: cycleId
      };
    },
    isCycleMarker = function( obj ) {
      if ( typeof obj == 'object' ) {
        return obj.__diffyCycleSentinal == cycleSentinel;
      }
      return false;
    },
    underscore,
    diffy = function ( expected, actual, seenInExpected, seenInActual ) {
      // if our reference to underscore is undefined and there is a global one available, use it
      if ( typeof(underscore) === 'undefined' && typeof(_) !== 'undefined') {
        underscore = _;
      }

      var expectedCopy  = underscore.clone( expected ),
          actualCopy    = underscore.clone( actual ),
          same = false,
          subcompare, key, i, expectedSeenIndex, actualSeenIndex;

      seenInExpected = seenInExpected || [];
      seenInActual = seenInActual || [];

      // TODO: something better with functions?
      if ( (typeof expectedCopy) == (typeof actualCopy) ) {

        if ( typeof expectedCopy == 'object' ) {

          expectedSeenIndex = underscore.indexOf( seenInExpected, expected );
          actualSeenIndex = underscore.indexOf( seenInActual, actual );

          if ( underscore.isArray( expectedCopy ) && underscore.isArray( actualCopy ) ) {

            // TODO CYCLES IN ARRAYS

            // compare each element
            same = true; // initialization
            for (i = 0; ( i < expectedCopy.length ) || ( i < actualCopy.length ); i++ ) {
              if (( i < expectedCopy.length ) && ( i < actualCopy.length )) {
                subcompare = diffy( expectedCopy[ i ], actualCopy[ i ], seenInExpected, seenInActual );
                if ( subcompare.same ) {
                  expectedCopy[ i ] = undefined;
                  actualCopy[ i ] = undefined;
                }
                else {
                  expectedCopy[ i ] = subcompare.expected;
                  actualCopy[ i ] = subcompare.actual;
                }
                same = same && subcompare.same;
              }
              else {
                same = false;
              }
            }
          }
          else if ( typeof expectedCopy == 'object' ) {

            if (( expectedSeenIndex == -1) || ( actualSeenIndex == -1) ) {

              seenInExpected.push( expected );
              seenInActual.push( actual );

              // compare each key's value
              underscore( expectedCopy ).each(function ( expectedValue, key ) {
                if ( expectedCopy.hasOwnProperty( key ) ) {
                  subcompare = diffy( expectedValue, actualCopy[ key ], seenInExpected, seenInActual );
                  if ( subcompare.same ) {
                    delete expectedCopy[ key ];
                    delete actualCopy[ key ];
                  }
                  else {
                    if ( isCycleMarker( subcompare.expected )) {
                      // TODO figure out how to dig the copy back out... (or is this necessary?)
                      // expectedCopy[ key ] =
                    }
                    else {
                      expectedCopy[ key ] = subcompare.expected;
                    }
                    if ( actualCopy.hasOwnProperty( key ) ) {
                      if ( isCycleMarker( subcompare.actual )) {
                        // TODO figure out how to dig the copy back out... (or is this necessary?)
                        // actualCopy[ key ] =
                      }
                      else {
                        actualCopy[ key ] = subcompare.actual;
                      }
                    }
                  }
                }
              });
              same = underscore.isEmpty( expectedCopy ) && underscore.isEmpty( actualCopy );
            }
            else {
              expectedCopy = newCycleMarker( expectedSeenIndex );
              actualCopy = newCycleMarker( actualSeenIndex );
              same = ( expectedSeenIndex == actualSeenIndex );
            }
          }
        }
        else {
          // straight comparison
          same = ( expectedCopy === actualCopy );
        }
      } // else leave them--they're different

      return {
        'same': same,
        'expected': expectedCopy,
        'actual':   actualCopy
      };
    };

  diffy.diff = diffy;
  diffy.init = function ( _ ) {
    underscore = _;
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
      define(function() {
        return diffy;
      });
    }
    // Leak a global regardless of module system
    root.diffy = diffy;
  }

})( this );