(function( root ) {

  var diffy = function diffy( expected, actual, alreadyProcessed ) {

    var expectedCopy  = _.clone( expected ),
        actualCopy    = _.clone( actual ),
        same = false,
        subcompare,
        key, i;
        
    alreadyProcessed = alreadyProcessed || [];

    // TODO: something better with functions?
    if ( (typeof expectedCopy) == (typeof actualCopy) ) {
      if ( _.isArray( expectedCopy ) && _.isArray( actualCopy ) ) {

        // compare each element
        same = true; // initialization
        for (i = 0; ( i < expectedCopy.length ) || ( i < actualCopy.length ); i++ ) {
          if (( i < expectedCopy.length ) && ( i < actualCopy.length )) {
            subcompare = diffy( expectedCopy[ i ], actualCopy[ i ], alreadyProcessed );
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