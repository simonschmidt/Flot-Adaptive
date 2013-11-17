(function ($){
	var options = { series: { adaptive: null }};

	function init(plot) {
		// Generate n equidistant points between xmin and xmax inclusive
		function linspace(xmin, xmax, n){
			var l=[xmin];
			var step = (xmax - xmin)/(n - 1);
			for(var i=1; i < n; i++){
				l.push(xmin + step*i);
			};
			return l
		}

		// Return [l[1]-l[0], l[2]-l[1], ..., l[n] - l[n-1]]
		function diff(l){
			return l.slice(1).map(function(x, i){
				return x - l[i];
			});
		}

		// Thread f over x and y, returns [f[x[0], y[0]], f[x[1],y[1]], ...]
		function thread(f, x, y){
			return x.map(function(v, i){
				return f(v, y[i]);
			});
		}

		// Return angle between successive points
		function angles(x, y){
			return thread(Math.atan2, diff(y), diff(x));
		}

		// Return indices of x where f is true
		function position(f, x){
			res = [];
			x.forEach(function(v, i){
				if(f(v)){ res.push(i);}
			});
			return res;
		}

		function deleteDuplicatesOnSorted(x){
			if( (x.length ==0) )
				return x;
			var res = [x[0]];
			var last = x[0];
			x.forEach(function(v){
				if( v != last){
					res.push(v);
					last = v;
				}
			});
			return res;
		}

		// Sorted union of a and b
		function union(a, b){
			return deleteDuplicatesOnSorted(
				[].concat(a,b).sort(
					function(a,b){
						return a-b;
					}));
		}

		function sampleFunction(opts){
			if (opts.f === undefined){
				console.error('[sampleFunction] Function required');
				return;
			}
			opts = jQuery.extend({},{
				range: [0, 1],
				initialPoints: 25,
				extraPoints: null,
				maxRecursion: 5,
				maxAngle: .1,
				minStep: 0.001,
				minStepAbsolute: null,
				debug: false}, opts);

			var xmin = opts.range[0], xmax = opts.range[1];
			var minstep = (xmax - xmin)*opts.minStep;

			if( opts.minStepAbsolute ){
				minstep = opts.minStepAbsolute;
			}

			// Initial points
			var x = linspace(xmin, xmax, Math.max(2, opts.initialPoints));
			if( opts.extraPoints ){
				x = union(opts.extraPoints, x);
			}
			var y = x.map(opts.f);

			for(var rec = 0; rec < opts.maxRecursion; rec++){
				// Calculate change in angles
				var dangle = diff(angles(x, y)).map(Math.abs);
				if( opts.debug ){
					console.log('max angle diff', rec, Math.max.apply(null,dangle));
					console.log('npts', rec, x.length);
				}


				// Find all points where the change in angle is too much
				var indices = position(function(v){ return v > opts.maxAngle; }, dangle);

				var offset=0;
				var last=-2;
				indices.forEach(
					function(i){

						var c=offset+i+1;
						var xl = (x[c-1] + x[c])/2;
						var xr = (x[c] + x[c+1])/2;

						if(last+1 != i && minstep < x[c]-xl){
							x.splice(c, 0, xl);
							y.splice(c, 0, opts.f(xl));
							x.splice(c+2, 0, xr);
							y.splice(c+2, 0, opts.f(xr));
							offset+=2;
							last = i;
						}else if(minstep < xr - x[c]){
							x.splice(c+1, 0, xr);
							y.splice(c+1, 0, opts.f(xr));
							offset++;
							last = i;
						}
					});

				if( offset == 0 )
					break;

			}
			return [x, y];

		}

		function processAdaptive(plot, s, data, datapoints){
			// Strange things happen when no data: [...]  is given
			// the data argument here becomes all the options, so try to recover
			if( !s.adaptive && !(data.hasOwnProperty('adaptive') && data.adaptive) ){
				return;
			}
			if( !s.adaptive){
				for( key in data)
					s[key]=jQuery.extend(s[key], data[key]);
				s.data = [];
			}
			window.spoints=s.points;
			var opts = s.adaptive;
			if( !opts.range || !opts.f){
				console.error("[Flot.adaptive] Missing arguments f and range are required.");
				return;
			}

			// TODO if data is non-empty append to extraPoints
			if( s.adaptive &&  s.data.length != 0){
				console.log("[Flot.adaptive] Provided data discarded,",
							"put the x-values in the extraPoints option instead");
			}

			var plotopts = plot.getOptions();

			var transformY = plotopts.yaxis.transform && plotopts.yaxis.inverseTransform;
			var transformX = plotopts.xaxis.transform && plotopts.xaxis.inverseTransform;

			// TODO: Technically could still be smart without y-inverse by simply resampling
			if( (!transformY && plotopts.yaxis.transform) || (!transformX && plotopts.xaxis.transform) ){
				console.log("[Flot.adaptive] Axis transform given without inverseTransform,",
					          "can't be smart when sampling function");
			}

			if(transformY){
				var oldf = opts.f;
				opts.f = function(x){
					return plotopts.yaxis.transform(oldf(x));
				}
			}

			if(transformX){
				var oldf = opts.f;
				opts.f = function(x){
					return oldf(plotopts.xaxis.transform(x));
				}

				if(opts.extraPoints){
					opts.extraPoints = opts.extraPoints.map(plotopts.xaxis.transform);
				}
				opts.range = opts.range.map(plotopts.xaxis.transform);

			}

			// Generate function samples
			var newpts = sampleFunction(opts);
			var x = newpts[0], y=newpts[1];

			if(transformY)
				y = y.map(plotopts.yaxis.inverseTransform);
			if(transformX)
				x = x.map(plotopts.xaxis.inverseTransform);

			// Zip together data
			s.data = x.map(function(v, i){return [v, y[i]];});

		}

		plot.hooks.processRawData.push(processAdaptive);
	}

	$.plot.plugins.push({
		init: init,
		options: options,
		name: 'adaptive',
		version: '0.1'
	});

})(jQuery);
