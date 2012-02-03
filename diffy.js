(function( root ) {

  var diffy = function diffy( expected, actual, alreadyProcessed ) {

    var expectedCopy  = _.clone( expected ),
        actualCopy    = _.clone( actual ),
        same = false,
        subcompare,
        key;
        
    alreadyProcessed = alreadyProcessed || [];

    // TODO: something better with functions?
    if ( (typeof expectedCopy) == (typeof actualCopy) ) {
      if ( _.isArray( expectedCopy ) && _.isArray( actualCopy ) ) {

        // TODO: handle the case where the actual array is longer
        //       likely factor the below code out into a separate method
        //       that iterates on the longer array, then swap arguments
        //       as necessary.

        // compare each element
        same = true; // initialization
        _( expectedCopy ).each(function ( expectedValue, index ) {
          subcompare = diffy( expectedValue, actualCopy[ index ], alreadyProcessed );
          if ( subcompare.same ) {
            expectedCopy[ index ] = undefined;
            if ( index < actualCopy.length ) {
              actualCopy[ index ] = undefined;
            }
          } 
          else {
            expectedCopy[ index ] = subcompare.expected;
            if ( index < actualCopy.length ) {
              actualCopy[ index ] = subcompare.actual;
            }
          }
          same = same && subcompare.same;
        });
      } 
      else if ( typeof expectedCopy == 'object' ) {
        if ( (_.indexOf( alreadyProcessed, expectedCopy ) == -1) &&
             (_.indexOf( alreadyProcessed, actualCopy ) == -1) ) {

          alreadyProcessed.push( expectedCopy );
          alreadyProcessed.push( actualCopy );

          // compare each key's value
          _( expectedCopy ).each(function ( expectedValue, key ) {
            if ( expectedCopy.hasOwnProperty( key ) ) {
              subcompare = diffy( expectedValue, actualCopy[ key ], alreadyProcessed );
              if ( subcompare.same ) {
                delete expectedCopy[ key ];
                delete actualCopy[ key ];
              } 
              else {
                expectedCopy[ key ] = subcompare.expected;
                if ( actualCopy.hasOwnProperty( key ) ) {
                  actualCopy[ key ] = subcompare.actual;
                }
              }
            }
          });
        }
        same = _.isEmpty( expectedCopy ) && _.isEmpty( actualCopy );
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