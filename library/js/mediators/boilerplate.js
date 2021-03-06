define([
    'jquery',
    'require',
    'hammer.jquery',
    'modules/data-url-to-blob',
    'moddef',
    'minicolors',
    'vendor/chroma',
    'canvas-draw',
    'physicsjs',
    'physicsjs/renderers/canvas',
    'physicsjs/behaviors/interactive',
    'physicsjs/behaviors/newtonian',
    'physicsjs/behaviors/body-collision-detection',
    'physicsjs/behaviors/sweep-prune',
    'physicsjs/bodies/circle',
    'raf'
], function(
    $,
    require,
    _hjq,
    dataURLtoBlob,
    M,
    _jqminicolors,
    chroma,
    Draw,

    Physics
) {
    'use strict';

    var G = 0.5;
    var minuteLabsLogo = new Image();
    minuteLabsLogo.src = 'data:image/png;base64,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';
    var initialSetupHash = 'planetarySystem=W3sieCI6LTUuMTg1OTA2ODUxMjE0NDcyLCJ5IjotMC4xNjkwMTI0MzQzMDk3NjM5MywidngiOi0wLjAwMDA4MDUzMDY4ODMzMTk2MjU0LCJ2eSI6MC4wMDM1NjE3Mzg2NDM5ODg2MzgsIm1hc3MiOjEwMCwiY29sb3IiOiIjZWFmNTE2IiwicGF0aCI6dHJ1ZX0seyJ4IjoxMzUuODE0MDkzMTQ4Nzg1NTMsInkiOjQuODMwOTg3NTY1NjkwMjQzNSwidngiOjAuMDE0MjcxNDQ1Mzk0OTAzNzM0LCJ2eSI6LTAuNTk4NDczNzUyMzc2NTEwMSwibWFzcyI6MC4xLCJjb2xvciI6IiNlYjcwMzIiLCJwYXRoIjp0cnVlfSx7IngiOi0yMDguNDIzOTA4ODEwMDc4MiwieSI6MC45Mjg5MzA3NTg2MzgzMjg5LCJ2eCI6LTAuMDIwMTQ1ODAxNzA2NDYyMDE1LCJ2eSI6MC41MjAxMjYzMjMyNDU4MjIyLCJtYXNzIjowLjEsImNvbG9yIjoiIzI5ZTYzMyIsInBhdGgiOnRydWV9LHsieCI6NDc2LjYxODM1ODI0MDgzNDQsInkiOjE0Ljk0ODE0MzA1NDUwNzY4NywidngiOjAuMDA3MjIzODY4MTU4NTU5Nzk1LCJ2eSI6LTAuMjk5Mzk1NzkzNjczMTIxODYsIm1hc3MiOjEsImNvbG9yIjoiIzc5ZTUwMCIsInBhdGgiOnRydWV9LHsieCI6NDkyLjMzMzA4NDQ2NzQyMSwieSI6MTMuNzcxMDg1NDQwMzU4NDczLCJ2eCI6MC4wMTQxNjYzNjMwNTgwMzIwNDQsInZ5IjotMC40ODk0MzMyNzgxMjYwNzU1LCJtYXNzIjowLjEsImNvbG9yIjoiI2RjZGNkYyIsInBhdGgiOnRydWV9XQ%3D%3D';

    var vFactor = 400; // scale the velocity rendering

    function clearArray(arr){
        var l = arr.length;
        while( l-- ){
            arr.pop();
        }
        return arr;
    }

    var colors = {
        'grey': 'rgb(220, 220, 220)'
        ,'greyLight': 'rgb(237, 237, 237)'
        ,'greyDark': 'rgb(200, 200, 200)'

        ,'deepGrey': 'rgb(67, 67, 67)'
        ,'deepGreyLight': 'rgb(98, 98, 98)'

        ,'blue': 'rgb(40, 136, 228)'
        ,'blueLight': 'rgb(91, 191, 243)'
        ,'blueDark': 'rgb(18, 84, 151)'

        ,'blueGlass': 'rgb(221, 249, 255)'

        ,'blueFire': '#626ead'

        ,'green': 'rgb(121, 229, 0)'
        ,'greenLight': 'rgb(125, 242, 129)'
        ,'greenDark': 'rgb(64, 128, 0)'

        ,'red': 'rgb(233, 63, 51)'
        ,'redLight': 'rgb(244, 183, 168)'
        ,'redDark': 'rgb(167, 42, 34)'

        ,'orange': 'rgb(239, 132, 51)'
        ,'orangeLight': 'rgb(247, 195, 138)'
        ,'orangeDark': 'rgb(159, 80, 31)'

        ,'yellow': 'rgb(228, 212, 44)'
        ,'yellowLight': 'rgb(242, 232, 110)'
        ,'yellowDark': 'rgb(139, 129, 23)'

    };

    function debugColor(){
        var i = debugColor.i|0;
        i++;
        debugColor.i = i;
        return debugColor.colors[ i % 6 ];
    }

    debugColor.colors = ['red', 'green', 'blue', 'cyan', 'magenta', 'yellow'];

    function throttle( fn, delay, scope ){
        var to
            ,call = false
            ,args
            ,cb = function(){
                clearTimeout( to );
                if ( call ){
                    call = false;
                    to = setTimeout(cb, delay);
                    fn.apply(scope, args);
                } else {
                    to = false;
                }
            }
            ;

        scope = scope || null;

        return function(){
            call = true;
            args = arguments;
            if ( !to ){
                cb();
            }
        };
    }

    var log = throttle(function( arg ){
        window.console.log( arg );
    }, 100);

    $.fn.slider = function( opts ){
        var startevent = window.Modernizr.touch ? 'touchstart' : 'mousedown';
        var moveevent = window.Modernizr.touch ? 'touchmove' : 'mousemove';
        var endevent = window.Modernizr.touch ? 'touchend' : 'mouseup';

        return $(this).each(function(){
            var $this = $(this).addClass('slider')
                ,options = $.extend({
                    min: parseFloat($this.attr('data-min')) || 0
                    ,max: parseFloat($this.attr('data-max')) || 1
                    ,value: parseFloat($this.attr('data-value')) || 0.5
                }, opts)
                ,factor = options.max - options.min
                ,val = (options.value - options.min) / factor
                ,$handle = $('<div>').appendTo($this).addClass('handle')
                ,$meter = $('<div>').appendTo($this).addClass('meter')
                ;

            function set( x ){
                var width = $this.width();
                if ( x !== undefined ){
                    x = Math.max(0, Math.min(width, x));
                    val = x / width;
                } else {
                    x = val * width;
                }

                $handle.css('left', x);
                $meter.css('width', (val * 100) + '%');

                $this.trigger('change', val * factor + options.min);
            }

            $this.css({
                position: this.style.position || 'relative'
            });

            $meter.css({
                display: 'block'
                ,position: 'absolute'
                ,top: '0'
                ,left: '0'
                ,bottom: '0'
            });

            $handle.css({
                position: 'absolute'
                ,top: '50%'
                ,marginLeft: -$handle.outerWidth() * 0.5
                ,marginTop: -$handle.outerHeight() * 0.5
            });

            var dragging = false;
            var drag = throttle(function( e ){

                if ( dragging ){

                    e.preventDefault();

                    if ( e.originalEvent.targetTouches ){
                        e = e.originalEvent.targetTouches[0];
                    }

                    var offset = $this.offset()
                        ,x = e.pageX - offset.left
                        ,y = e.pageY - offset.top
                        ;

                    set( x );
                }

            }, 20);

            function end(){
                dragging = false;
                $(document).off(moveevent, drag);
            }

            $this.on(startevent, function( e ){
                dragging = true;
                drag( e );

                $(document).on(moveevent, drag);
            });
            $(document).on(endevent, end);

            $this.on('mousedown', function(){
                return false;
            });

            $this.on('refresh', function( e, v ){
                v = Math.min(Math.max(v, options.min), options.max);
                val = (v - options.min) / factor;
                set();
            });

            set( val * $this.width() );
        });
    };

    var vectorStyles = {
            strokeStyle: colors.blueDark
            ,fillStyle: colors.blueDark
            ,lineWidth: 2
        }
        ,pathStyles = {
            lineWidth: 3
            ,lineCap: 'butt'
            ,shadowBlur: 1
        }
        ,selectedStyles = {
            lineWidth: 3
            ,strokeStyle: colors.red
            ,fillStyle: colors.red
        }
        ,selectedOutline = {
            lineWidth: 1
            ,lineDash: [3.14]
            ,strokeStyle: colors.greyLight
        }
        ,defaultPathColor = '#b9770b'
        ;

    function lerp(a, b, p) {
        return (b-a)*p + a;
    }
    function lerpv(a, b, p){
        return new Physics.vector( lerp(a.x,b.x,p), lerp(a.y,b.y,p) );
    }

    Physics.behavior('position-tracker', function( parent ){

        return {
            connect: function( world ){

                world.on('integrate:positions', this.behave, this, -100);
            },
            disconnect: function( world ){
                world.off('integrate:positions', this.behave);
            },
            clear: function(){
                var bodies = this.getTargets()
                    ,body
                    ;
                for ( var i = 0, l = bodies.length; i < l; ++i ){

                    body = bodies[ i ];
                    body.positionBuffer = [];
                }
            },
            behave: function(){
                var bodies = this.getTargets()
                    ,body
                    ,list
                    ,com = bodies[0].state.pos
                    ;

                for ( var i = 0, l = bodies.length; i < l; ++i ){

                    body = bodies[ i ];
                    if ( !body.disabled ){
                        list = body.positionBuffer || (body.positionBuffer = []);
                        if ( list.length > 100 ){
                            list.splice( 0, list.length - 100 );
                        }
                        list.push(
                            body.state.old.pos.x - com.x,
                            body.state.old.pos.y - com.y
                            );
                    }
                }
            }
        };
    });

    Physics.body.mixin({
        'refreshView': function(){
            var th = 2;
            var r = (2*Math.log(this.mass+1) + 1 + th);
            Draw('hidden', r * 2, r * 2)
                .offset(0, 0)
                .styles({
                    fillStyle: this.path ? this.color() : colors.greyDark
                    ,lineWidth: th
                    ,strokeStyle: colors.greyDark
                })
                .circle( r, r, r - th )
                .fill()
                ;

            this.view = new Image();
            this.view.src = Draw.ctx.canvas.toDataURL('image/png');
        }
        ,'color': function( hex ){
            if ( !hex ){
                return this._color;
            }

            this._color = chroma(hex).hex();
            this.oldColor = this._color;
            this.colorScale = getColorScale( this );
        }
        ,'velocityArrowHead': function( ret ){

            ret = ret || Physics.vector();
            return ret.clone( this.state.vel )
                .mult( vFactor )
                .vadd( this.state.pos )
                ;
        }
    });

    function getColorScale( body ){
        var c = chroma( body._color );
        var s = chroma.scale([ c.alpha(0.1), body._color ]).mode('lab').out('css');

        return function( v ){
            v /= (1 * body.maxSpeed);
            v = v > 0.7 ? Math.log(v+1) + 0.17 : v;
            v = Math.min(1, Math.max( 0 , v ));
            // v = (Math.exp( v ) - 1)/(Math.E - 1);
            var val = lerp(1, 0.1, v);
            return s( val );
        };
    }

    function randomDir( v ){
        return v.set( 1, 0 ).rotate( Math.random() * Math.PI * 2 );
    }

    function closestNeighbourDist( pos, bodies ){
        var dist = 100000;
        var i = bodies.length;
        while ( i-- > 0 ){
            dist = Math.min( dist, bodies[ i ].state.pos.dist( pos ) );
        }
        return dist;
    }

    var PlanetarySystem = function( world, x, y, g ){
        this.init( world, x, y, g );
    };

    PlanetarySystem.prototype = {
        init: function( world, x, y, g ){
            var self = this;
            this.center = Physics.body('circle', {
                x: x
                ,y: y
                ,treatment: 'static'
                ,radius: 5
            });

            this.g = g;

            this.colors = [ colors.blueFire, colors.red, colors.yellow, colors.green, colors.grey, colors.blue ];

            this.world = world;
            this.bodies = [ this.center ];

            // init collision actions
            world.on('collisions:detected', function( data ){
                var cols = data.collisions
                    ,col
                    ;

                for ( var i = 0, l = cols.length; i < l; i++ ){
                    col = cols[ i ];
                    self.merge( col.bodyA, col.bodyB );
                }
            });
        }
        // merge two bodies into one
        ,merge: function( bodyA, bodyB ){
            var scratch = Physics.scratchpad();
            var r = scratch.vector();
            // remove bodyB from world
            this.world.remove( bodyB );
            bodyB.disabled = true;
            bodyA.initial.mass = bodyA.mass;
            r.clone( bodyA.state.pos );

            // conservation of momentum
            bodyA.state.vel.mult( bodyA.mass ).vadd( bodyB.state.vel.mult(bodyB.mass) );
            bodyA.state.pos.mult( bodyA.mass ).vadd( bodyB.state.pos.mult(bodyB.mass) );
            bodyA.mass += bodyB.mass;
            bodyA.state.vel.mult( 1/bodyA.mass );
            bodyA.state.pos.mult( 1/bodyA.mass );
            bodyA.state.old.pos.vadd( r.vsub(bodyA.state.pos) );
            bodyA.initial.color = bodyA.color();
            bodyA.color(chroma.interpolate(
                chroma.hex( bodyA.color() ),
                chroma.hex( bodyB.color() ),
                0.5, 'lab' ).hex());

            bodyA.refreshView();
            scratch.done();
            this.world.emit('merge', { body: bodyA });
        }
        ,calcCenterOfMass: function(lerp, all){

            // center of mass pos (x) = ( m1*x1 + m2*x2 ... ) / ( m1 + m2 ... )
            // center of mass vel (v) = ( m1*v1 + m2*v2 ... ) / ( m1 + m2 ... )

            var b
                ,sumPosX = 0
                ,sumPosY = 0
                ,sumVelX = 0
                ,sumVelY = 0
                ,sumMass = 0
                ,com=this.center.state
                ;

            for ( var i = 1, l = this.bodies.length; i < l; i++ ){
                b = this.bodies[ i ];
                if ( all || !b.disabled ){
                    sumPosX += b.mass * b.state.pos.x;
                    sumPosY += b.mass * b.state.pos.y;
                    sumVelX += b.mass * b.state.vel.x;
                    sumVelY += b.mass * b.state.vel.y;
                    sumMass += b.mass;
                }
            }

            if (lerp) {
                // TODO: not necessary to create new vectors. reuse the current com.pos and com.vel
                com.pos = lerpv( com.pos, new Physics.vector(
                    sumPosX/sumMass,
                    sumPosY/sumMass)
                ,0.5);
                com.vel = lerpv( com.vel, new Physics.vector(
                    sumVelX/sumMass,
                    sumVelY/sumMass)
                ,0.5);
            }else{
                com.pos.set(
                    sumPosX/sumMass,
                    sumPosY/sumMass);
                com.vel.set(
                    sumVelX/sumMass,
                    sumVelY/sumMass);
            }

        }
        ,subtractCenterOfMass: function(){
            var b, com = this.center.state;
            for ( var i = 1, l = this.bodies.length; i < l; i++ ){
                b = this.bodies[ i ];
                b.state.pos.vsub( com.pos );
                b.state.vel.vsub( com.vel );
                b.initial.x = b.state.pos.x;
                b.initial.y = b.state.pos.y;
                b.initial.vel.x = b.state.vel.x;
                b.initial.vel.y = b.state.vel.y;
            }
            com.pos.zero();
            com.vel.zero();
        }
        ,addVertex: function( x, y ){

            var l = this.bodies.length;
            var v = { x: x, y: y, vel: { x: 0, y: 0 } };
            var b = Physics.body('circle', {
                x: x
                ,y: y
                ,radius: 4
                ,initial: v
                ,path: true
                ,maxSpeed: 1
            });

            b.color( this.colors[ l - 1 ] || defaultPathColor );
            b.refreshView();
            this.bodies.push( b );
            this.world.add( b );

            return b;
        }
        ,removeVertex: function(){
            var self = this;
            if ( this.bodies.length > 1 ){
                var b = this.bodies.pop();
                this.world.remove( b );
            }
        }
        ,reset: function(){
            var v, b, w = this.maxAngularVel(), r, last = this.center, h = 0, com = this.center.state;
            last.maxSpeed = 0;

            //this.calcCenterOfMass( false, true );

            for ( var i = 1, l = this.bodies.length; i < l; i++ ){
                b = this.bodies[ i ];
                v = b.initial;

                // subtract com
                // v.x -= com.pos.x;
                // v.y -= com.pos.y;
                // v.vel.x -= com.vel.x;
                // v.vel.y -= com.vel.y;

                b.state.pos.clone( v );
                b.state.old.pos.clone( v );
                b.state.vel.clone( v.vel );
                b.state.old.vel.zero();
                b.state.acc.zero();
                b.state.old.acc.zero();
                if ( v.mass ){
                    b.mass = v.mass;
                    v.mass = null;
                }
                if ( v.color ){
                    b.color( v.color );
                    v.color = null;
                }
                // set the max anticipated speed based
                // TODO: this doesn't really apply anymore
                r = last.state.pos.dist( b.state.pos );
                h += r;
                b.maxSpeed = w * r + (last.maxSpeed);
                b.maxSpeed *= 1.3 * lerp(0.5, 1.4, Math.abs(last.mass - b.mass)/(last.mass + b.mass)) / i; // multiply by a fudge factor
                b.refreshView();
                last = b;
                if ( b.started ){
                    b.started(false);
                }
                b.disabled = false;
                this.world.add( b ); // duplicate adding check is built into physicsjs
            }

            com.pos.zero();
            com.vel.zero();
            this.Estart = this.calcEnergy();

            return this;
        }
        ,maxAngularVel: function(){
            var w = 0
                ,E
                ,last = this.center
                ,v
                ,b
                ,h = 0
                ,g = this.g
                ,scratch = Physics.scratchpad()
                ,r = scratch.vector()
                ,tmp = scratch.vector()
                ;

            for ( var i = 1, l = this.bodies.length; i < l; i++ ){
                b = this.bodies[ i ];
                v = b.initial;
                h += r.clone(last.initial || last.state.pos).dist( tmp.clone( v ) );
                E = (0.5 * tmp.clone(v.vel).normSq() + g * (h - (v.y - this.center.state.pos.y)));
                w = Math.max( w, Math.sqrt(2*E) / h );
                last = b;
            }

            return scratch.done( w );
        }
        ,calcEnergy: function(){
            var self = this;
            //calc energy
            var i, j, l, b, b2;
            var K = 0;
            var U = 0;

            for (i = 1, l = self.bodies.length; i < l; i++ ){
                b = self.bodies[ i ];
                if ( !b.disabled ){
                    K += 0.5 * b.state.vel.normSq() * b.mass;
                    for ( j = i + 1; j < l; j++ ){
                        b2 = self.bodies[ j ];
                        if ( !b2.disabled ){
                            U -= G * b2.mass * b.mass / b2.state.pos.dist( b.state.pos );
                        }
                    }
                }
            }

            return K + U;
        }
        ,correctEnergy: function(){
            var E = this.calcEnergy()
                ,b
                ,i
                ,l
                ,corr
                ,delta = (E - this.Estart)
                ,phi
                ;

            if ( Math.abs(delta) < 0.1 ){
                return;
            }

            phi = 2 * delta / (this.bodies.length - 1);
            // produces weird behavior, but might do for now...
            for ( i = 1, l = this.bodies.length; i < l; i++ ){
                b = this.bodies[ i ];
                corr = Math.sqrt( 1 - phi / (b.mass * b.state.vel.normSq()) );

                if ( !isNaN(corr) ){
                    b.state.vel.mult( corr );
                }
            }
        }
        ,randomize: function( maxDist ){
            maxDist = maxDist || 100;
            var minDist = 100;
            var n = ((4 * Math.random()) + 2) | 0;
            var dir = Physics.vector( 1, 0 );
            var center = this.center;
            var vertex;
            var i;
            var maxMass = 10;
            var angVel = ( Math.random() > 0.5 ? 1 : -1 ) * 10;
            var vref;

            // clear
            while ( this.bodies.length > 1 ){
                this.removeVertex();
            }

            for ( i = 0; i < n; i++ ){
                randomDir( dir ).mult( Math.random() * (maxDist - minDist) + minDist );

                if ( closestNeighbourDist( dir, this.bodies ) < 50 ){
                    // try again
                    i--;

                } else {

                    vertex = this.addVertex( dir.x, dir.y );
                    vertex.mass = Math.random() * maxMass;

                }
            }

            this.calcCenterOfMass();

            for ( i = 1, n = this.bodies.length; i < n; i++ ){
                vertex = this.bodies[ i ];
                vref = dir.clone( vertex.state.pos ).vsub( center.state.pos ).perp().mult( angVel / dir.normSq()  );
                // randomDir( dir ).mult( Math.random() * 0.2 * vref.norm() ).vadd( vref );

                vertex.initial.vel.x = dir.x;
                vertex.initial.vel.y = dir.y;
                vertex.state.vel.clone( dir );
            }

            this.reset();
        }

        ,hash: function( hash ){
            var data, i, l, b;
            if ( hash === undefined ){
                data = [];
                for ( i = 1, l = this.bodies.length; i < l; i++ ){
                    b = this.bodies[ i ];
                    data.push({
                        x: b.initial.x
                        ,y: b.initial.y
                        ,vx: b.initial.vel.x
                        ,vy: b.initial.vel.y
                        ,mass: b.mass
                        ,color: b.color()
                        ,path: b.path
                    });
                }
                return '#planetarySystem=' + window.encodeURIComponent(window.btoa(JSON.stringify( data )));
            }

            // find settings
            hash = hash.match(/planetarySystem=([^&]*)/);

            if ( !hash || !hash.length ){
                return false;
            }

            // decode
            try {
                hash = window.atob(window.decodeURIComponent(hash[1]));
                data = $.parseJSON(hash);
            } catch( e ){
                return false;
            }

            if ( !data ){
                return false;
            }

            // set planetarySystem state
            while ( this.bodies.length > 1 ){
                this.removeVertex();
            }

            for ( i = 0, l = data.length; i < l; i++ ){
                b = this.addVertex( data[i].x, data[i].y );
                b.initial.vel.x = data[i].vx;
                b.initial.vel.y = data[i].vy;
                b.mass = data[i].mass;
                b.color( data[i].color );
                b.path = data[i].path;
            }

            this.reset();
            return true;
        }
    };

    // Page-level Mediator
    var Mediator = M({

        // Mediator Constructor
        constructor: function(){

            var self = this;
            self.edit = false;
            self.initEvents();

            $(function(){
                self.onDomReady();
                self.resolve('domready');
            });
        }

        // Initialize events
        ,initEvents: function(){

            var self = this;

            window.addEventListener('resize', function(){
                self.width = window.innerWidth;
                self.height = window.innerHeight;
                self.emit('resize');
            }, true);

            self.on({
                pause: function(){
                    $('#controls .ctrl-pause')
                        .addClass('paused')
                        .html('Unpause')
                        ;
                }
                ,unpause: function(){
                    $('#controls .ctrl-pause')
                        .removeClass('paused')
                        .html('Pause')
                        ;
                }
            });

            $(function(){
                var ctrls = $('#controls');

                ctrls.hammer()
                    .on('touch', '.ctrl-download', function( e ){
                        var img = self.getImage();
                        if ( window.URL ){
                            img = window.URL.createObjectURL( dataURLtoBlob(img) );
                            setTimeout(function(){
                                window.URL.revokeObjectURL( img );
                            }, 5000);
                        }

                        $(this).attr('href', img).attr('target', '_blank');
                        this.download = 'minutelabs-chaotic-planets.png';
                    })
                    .on('touch', '.ctrl-pause', function( e ){
                        e.preventDefault();
                        var $this = $(this)
                            ,paused = $this.hasClass('paused')
                            ;

                        self.emit(paused ? 'unpause' : 'pause');
                    })
                    .on('touch', '.ctrl-edit', function( e ){
                        e.preventDefault();
                        var $this = $(this);
                        self.edit = !self.edit;

                        ctrls.toggleClass('edit', self.edit);

                        $this
                            .html( self.edit ? 'Start' : 'Edit' )
                            .toggleClass('ok', self.edit)
                            .toggleClass('pop', !self.edit)
                            ;

                        self.emit(self.edit ? 'edit' : 'start');
                    })
                    .on('touch', '.ctrl-add', function( e ){
                        e.preventDefault();
                        self.emit('add');
                    })
                    .on('touch', '.ctrl-share', function( e ){
                        e.preventDefault();
                        self.emit('share');
                    })
                    .on('touch', '.ctrl-remove', function( e ){
                        e.preventDefault();
                        self.emit('remove');
                    })
                    .on('touch', '.ctrl-randomize', function( e ){
                        e.preventDefault();
                        self.emit('randomize');
                    })
                    .on('touch', '.ctrl-edit-velocities, .ctrl-edit-positions', function( e ){
                        e.preventDefault();
                        var on = !self.editVelocities;
                        self.emit('edit-velocities', on);
                    })
                    ;

                self.on('edit-velocities', function( e, on ){
                    ctrls.toggleClass('state-edit-velocities', on);
                    ctrls.find('.ctrl-edit-velocities').toggleClass('on', on);
                    ctrls.find('.ctrl-edit-positions').toggleClass('on', !on);
                    self.editVelocities = on;
                    self.contextualMenu( null );
                });

                var body;

                // get a function to test whether bodies are near pos
                function $near( pos, r ){
                    pos = Physics.vector( pos );
                    return function( body ){
                        return body.state.pos.dist( pos ) <= r;
                    };
                }

                var grabRadius = 15;

                $('#viewport').hammer()
                    .on('touchstart', 'canvas', function( e ){
                        e.preventDefault();
                    })
                    .on('touch', 'canvas', function( e ){
                        var pos = e.gesture.center;
                        pos = { x: pos.pageX - self.width / 2, y: pos.pageY - self.height/2 };
                        e.preventDefault();
                        if ( self.edit ){

                            body = self.world.findOne($near(pos, grabRadius));

                            if ( body ){
                                self.emit('select', body);
                                return;
                            }

                            if ( !body ){
                                pos = Physics.vector( pos );
                                body = self.world.findOne(function( body ){
                                    if ( body.velocityArrowHead().dist( pos ) < 10 ){
                                        return true;
                                    }
                                });
                                if ( body ){
                                    self.emit('grab-velocity', body);
                                    body = false;
                                    return;
                                }
                            }

                            if ( !body ) {

                                self.emit( 'create', pos );
                            }

                            self.emit('select', null);
                        }
                    })
                    .on('release', 'canvas', function( e ){
                        e.preventDefault();
                        body = false;
                        self.emit('release', e.gesture);
                    })
                    .on('dragstart', 'canvas', function( e ){
                        self.emit('grab', body);
                    })
                    .on('drag', 'canvas', function( e ){
                        e.preventDefault();
                        self.emit('drag', e.gesture);
                    })
                    ;
            });
        }

        ,getImage: function(){
            var layers = ['paths']
                ,el = this.renderer.layer('paths').hdel
                ,ctx = this.renderer.hiddenCtx
                ,canvas = this.renderer.hiddenCanvas
                ,opacity
                ,w = el.width
                ,h = el.height
                ;

            var com = this.planetarySystem.center.state.pos;

            canvas.width = w;
            canvas.height = h;
            ctx.fillStyle = colors.deepGreyDark;
            ctx.fillRect( 0, 0, w, h );

            var imgWidth=5100, imgHeight=3300;
            var imgScale = Math.max( w/imgWidth, h/imgHeight );
            Draw( ctx )
                .image(
                    require.toUrl('../../images/nightsky.png')
                    ,w/2
                    ,h/2
                    ,imgScale * imgWidth
                    ,imgScale * imgHeight
                    ,ctx
                    );

            ctx.drawImage( el, 0, 0 );
            ctx.drawImage( minuteLabsLogo, 0, h - 96 );
            Draw( ctx )
                .offset(
                     - com.x,
                     - com.y)
                .styles({
                    fillStyle: colors.grey,
                    font: '40px "latin-modern-mono-light", Courier, monospace'
                })
                ;
            ctx.fillText('MinuteLabs.io', 96 + 30, h - 96/2 + 10 );

            ctx.globalAlpha = 1;

            return canvas.toDataURL('image/png');
        }

        ,initPhysics: function( world ){

            var self = this
                ,viewWidth = self.width
                ,viewHeight = self.height
                // bounds of the window
                ,viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight)
                ,center = Physics.vector( viewWidth, viewHeight ).mult( 0.5 )
                ,renderer
                ,tracker = Physics.behavior('position-tracker')
                ,startT = Date.now()
                ,g = 0.0
                ;

            // create a renderer
            self.renderer = renderer = Physics.renderer('canvas', {
                el: 'physics'
                ,width: viewWidth
                ,height: viewHeight
                ,offset: center
                // ,meta:true
            });

            // add the renderer
            world.add(renderer);

            // planetarySystem
            var planetarySystem = self.planetarySystem = new PlanetarySystem( world, 0, 0, g );

            world.on('integrate:positions', function(){
                planetarySystem.calcCenterOfMass();
                // energy correction is too weird
                // planetarySystem.correctEnergy();
            });

            self.on({
                resize: function() {

                    var img = renderer.layer('paths').ctx.getImageData(0, 0, viewWidth, viewHeight);
                    var dx = (self.width - viewWidth)/2;
                    var dy = (self.height - viewHeight)/2;

                    viewWidth = self.width;
                    viewHeight = self.height;

                    renderer.resize( viewWidth, viewHeight );

                    renderer.layer('paths').ctx.putImageData( img, dx, dy );

                    center = Physics.vector( viewWidth, viewHeight ).mult( 0.5 );
                    renderer.layer('main').options.offset = center;
                }
                ,'edit-velocities': function( e, on ){
                    renderer.layer('vectors').el.style.zIndex = on ? 3 : 1;
                }
                ,randomize: function( e ){
                    planetarySystem.randomize( Math.min(viewHeight, viewWidth)*0.25 );
                    planetarySystem.reset();
                    Draw.clear( renderer.layer('paths').ctx );
                    Draw.clear( renderer.layer('paths').hdctx );
                    tracker.applyTo( planetarySystem.bodies );
                    self.emit('modified');
                }
                ,add: function(){
                    var lastArm = Physics.vector();
                    var dir = Physics.vector();
                    var end = planetarySystem.bodies[ planetarySystem.bodies.length - 1 ].state.pos;
                    lastArm.clone( end ).vsub( planetarySystem.bodies[ planetarySystem.bodies.length - 2 ].state.pos );
                    dir.clone( planetarySystem.center.state.pos ).vsub( end );
                    dir.rotate( Math.PI * Math.random() / 4 );
                    dir.normalize().mult( 40 + 30 * Math.random() );

                    if ( lastArm.angle( dir ) < Math.PI/8 ){
                        dir.rotate( Math.PI/6 );
                    }

                    self.contextualMenu( null );
                    self.emit('create', dir.vadd( end ));
                    self.emit('release', dir);
                }
                ,create: function( e, pos ){
                    if ( !self.selectedBody && !self.editVelocities ){
                        var p = planetarySystem.addVertex( pos.x, pos.y );
                        tracker.applyTo( planetarySystem.bodies );
                        self.emit('grab', p);
                    }
                }
                ,grab: function( e, body ){
                    var drag, orig, vis;

                    if ( body && body.initial ){
                        if ( self.editVelocities ){

                            self.emit('grab-velocity', body);

                        } else {
                            vis = self.$ctxMenu.is(':visible');
                            orig = body.state.pos.clone();
                            drag = function( e, g ){
                                body.state.pos.set( g.deltaX, g.deltaY ).vadd( orig );
                                body.initial.x = body.state.pos.x;
                                body.initial.y = body.state.pos.y;
                            };

                            self.on('drag', drag);
                            self.on('release', function( e ){
                                self.off(e.topic, e.handler);
                                self.off('drag', drag);
                                if ( vis ){
                                    self.contextualMenu( body );
                                }
                                self.emit('modified');
                            });
                            self.$ctxMenu.hide();
                        }
                    } else if ( body === planetarySystem.center ){

                        // move the center (and all others relative to center)
                        vis = self.$ctxMenu.is(':visible');
                        orig = body.state.pos.clone();
                        var delta = Physics.vector();
                        drag = function( e, g ){
                            var b;
                            body.state.pos.set( g.deltaX, g.deltaY ).vadd( orig );
                            delta.clone( body.state.pos ).vsub( orig );
                            for ( var i = 1, l = planetarySystem.bodies.length; i < l; i++ ){
                                b = planetarySystem.bodies[ i ];
                                b.state.pos.clone( b.initial ).vadd( delta );
                            }
                        };

                        self.on('drag', drag);
                        self.on('release', function( e ){
                            var b;
                            for ( var i = 1, l = planetarySystem.bodies.length; i < l; i++ ){
                                b = planetarySystem.bodies[ i ];
                                b.initial.x = b.state.pos.x;
                                b.initial.y = b.state.pos.y;
                            }

                            self.off(e.topic, e.handler);
                            self.off('drag', drag);
                            if ( vis ){
                                self.contextualMenu( body );
                            }
                            self.emit('modified');
                        });
                        self.$ctxMenu.hide();
                    }
                }
                ,'grab-velocity': function( e, body ){
                    var drag, orig, vis = self.$ctxMenu.is(':visible');
                    if ( body && body.initial ){
                        drag = function( e, g ){
                            body.state.vel
                                .set( g.center.pageX, g.center.pageY )
                                .vsub( center )
                                .vsub( body.state.pos )
                                .mult( 1/vFactor )
                                ;

                            body.initial.vel.x = body.state.vel.x;
                            body.initial.vel.y = body.state.vel.y;
                        };

                        self.on('drag', drag);
                        self.on('release', function( e ){
                            self.off(e.topic, e.handler);
                            self.off('drag', drag);
                            if ( vis ){
                                self.contextualMenu( body );
                            }
                            self.emit('modified');
                        });
                        self.$ctxMenu.hide();
                    }
                }
                ,select: function( e, body ){
                    if ( body && body.initial ){
                        self.contextualMenu( body );
                    } else {
                        self.contextualMenu( null );
                    }
                }
                ,edit: function(){
                    self.emit('edit-velocities', false);
                    self.emit('pause');
                    planetarySystem.reset();
                    setTimeout(function(){
                        world._meta.interpolateTime = 0;
                        tracker.clear();
                        Draw.clear( renderer.layer('paths').ctx );
                        Draw.clear( renderer.layer('paths').hdctx );
                        self.contextualMenu( planetarySystem.bodies[ planetarySystem.bodies.length - 1 ] );
                        world.render();
                    }, 100);
                }
                ,start: function(){
                    self.contextualMenu( null );
                    planetarySystem.reset();
                    self.emit('unpause');
                }
                ,pause: function(){
                    world.pause();
                }
                ,unpause: function(){
                    world.unpause();
                }
                ,remove: function(){
                    self.contextualMenu( null );
                    planetarySystem.removeVertex();
                }
                ,modified: function(){
                    window.location.hash = planetarySystem.hash();
                }
            });

            if ( !planetarySystem.hash( window.location.hash ) ){
                planetarySystem.hash( initialSetupHash );
            }

            planetarySystem.reset();
            tracker.applyTo( planetarySystem.bodies );

            function len( x, y, x2, y2 ){
                x -= x2;
                y -= y2;
                return Math.sqrt( x*x + y*y );
            }

            renderer.layer('main').options({
                zIndex: 2,
                offset: center,
                follow: planetarySystem.center
            });
            var oldrender = renderer.layer('main').render;
            renderer.layer('main').render = function(){
                var b, p;

                Draw( this.ctx )
                    .offset( center.x, center.y )
                    .clear()
                    ;

                oldrender.call(this, false);

                if ( self.selectedBody ){
                    b = self.selectedBody;
                    Draw( this.ctx )
                        .styles( selectedOutline )
                        .circle( b.state.pos.x, b.state.pos.y, 15 )
                        ;
                }
            };

            var pathRenderer = renderer.addLayer('paths', null, { zIndex: 1, offset: center });
            pathRenderer.hdel = document.createElement('canvas');
            pathRenderer.hdel.width = viewWidth * 2;
            pathRenderer.hdel.height = viewHeight * 2;
            pathRenderer.hdctx = pathRenderer.hdel.getContext('2d');
            pathRenderer.hdctx.translate( pathRenderer.hdel.width/4 - center.x, pathRenderer.hdel.height/4 - center.y );
            pathRenderer.hdctx.scale( 2, 2 );

            pathRenderer.render = function(){
                var b, p, grad, c, oldc, j, ll, path = [];
                //var com = planetarySystem.center.state.pos;

                if ( self.edit ){
                    return;
                }

                Draw( this.ctx )
                    .offset( center.x, center.y )
                    ;

                pathRenderer.ctx.globalCompositeOperation = 'color-dodge';
                pathRenderer.hdctx.globalCompositeOperation = 'color-dodge';

                for ( var i = 0, l = planetarySystem.bodies.length; i < l; i++ ){
                    b = planetarySystem.bodies[i];
                    p = b.positionBuffer;
                    if (!p){ continue; }

                    ll = p.length;
                    if ( !b.disabled && b.path && ll >= 4 ){

                        oldc = b.oldColor;
                        c = b.colorScale( b.state.vel.norm() );
                        // c = 'rgb(222,20,0)';//debugColor();
                        // grad = this.ctx.createLinearGradient( p[0], p[1], p[ll-2], p[ll-1] );
                        // grad.addColorStop( 0, oldc || c );
                        // grad.addColorStop( 1, c );
                        pathStyles.strokeStyle = grad || c;
                        pathStyles.shadowColor = c;

                        Draw( this.ctx )
                            .styles( pathStyles )
                            ;

                        Draw( this.hdctx )
                            .styles( pathStyles )
                            ;

                        b.oldColor = c;

                        Draw( this.ctx )
                            // .lines( p )
                            .continuousPath( p )
                            ;

                        // draw to HD canvas
                        Draw( this.hdctx )
                            // .lines( p )
                            .continuousPath( p )
                            ;
                    }

                    if ( p[ ll-1 ] ){
                        b.positionBuffer = [p[ll-4], p[ll-3], p[ll-2], p[ll-1]];
                    } else {
                        clearArray( p );
                    }
                }
            };

            renderer.addLayer('vectors', null, { zIndex: 1, offset: center }).render = function(){
                var b
                    ,p
                    ,scratch = Physics.scratchpad()
                    ,v = scratch.vector()
                    ,int = scratch.vector()
                    ,t = renderer.interpolateTime || 0
                    ,ang
                    ,com = planetarySystem.center.state
                    ;

                Draw( this.ctx ).offset( 0, 0 ).styles( vectorStyles ).clear();

                for ( var i = 1, l = planetarySystem.bodies.length; i < l; i++ ){
                    b = planetarySystem.bodies[i];

                    if ( !b.disabled ){
                        // put both velocity vector direction and position in terms of com
                        v.clone( b.state.vel ).vsub( com.vel );
                        ang = v.angle();
                        v.mult( vFactor )
                            .vadd( int.clone(b.state.vel).mult(t).vadd(b.state.pos) )
                            .vadd( center )
                            ;

                        v.vsub( com.pos );
                        int.vsub( com.pos );

                        Draw
                            .line( center.x + int.x, center.y + int.y, v.x, v.y )
                            ;

                        this.ctx.translate( v.x, v.y );
                        this.ctx.rotate( ang );
                        Draw.arrowHead( 'right', 0, 0, 5 ).fill();
                        this.ctx.rotate( -ang );
                        this.ctx.translate( -v.x, -v.y );
                    }
                }

                scratch.done();
            };

            var explosions = [];
            renderer.addLayer('explosions', null, { zIndex: 1, offset: center }).render = function(){
                var exp;
                var ctx = this.ctx;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.save();
                ctx.translate( this.options.offset.x - this.options.follow.state.pos.x, this.options.offset.y - this.options.follow.state.pos.y );
                for ( var i = 0, l = explosions.length; i < l; i++ ){
                    exp = explosions[ i ];
                    if ( exp ){
                        exp.render( ctx );
                    }
                }
                ctx.restore();
            };

            world.on('merge', function( data ){
                var exp = {
                    n: 14
                    ,particles: []
                    ,lifetime: 30
                    ,count: 0
                    ,r: 100
                    ,render: function( ctx ){
                        var scratch = Physics.scratchpad();
                        var tmp = scratch.vector();
                        var p;
                        var progress = this.count/this.lifetime;
                        this.count++;

                        // draw little dust particles at their corresponding locations
                        // lerp makes them move from their initial pos to their end pos
                        for ( var i = 0; i < this.n; i++ ){
                            p = this.particles[ i ];
                            tmp.clone( p.dir ).mult( lerp(0, p.end, progress) ).vadd( data.body.state.pos );
                            ctx.fillStyle = 'rgba(255,255,255,'+(1-progress)+')';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.arc(tmp.x, tmp.y, 1, 0, Math.PI*2, false);
                            ctx.closePath();
                            ctx.fill();
                        }

                        if ( this.count > this.lifetime ){
                            explosions.splice( Physics.util.indexOf( explosions, this ), 1 );
                        }
                        scratch.done();
                    }
                };

                for ( var i = 0; i < exp.n; i++ ){
                    exp.particles.push({
                        dir: randomDir( Physics.vector() )
                        ,end: exp.r * Math.random()
                    });
                }

                explosions.push(exp);
            });

            // follow the center of mass
            renderer.layer('main').options.follow = planetarySystem.center;
            renderer.layer('explosions').options.follow = planetarySystem.center;

            // add newtonian attraction to the world
            world.add([
                Physics.behavior('newtonian', { strength: G, min: 5 })
                ,Physics.behavior('body-collision-detection')
                ,Physics.behavior('sweep-prune')
                ,tracker
            ]);

            // subscribe to ticker to advance the simulation
            Physics.util.ticker.on(function( time ) {
                if (self.edit){
                    planetarySystem.calcCenterOfMass(true, true);
                    planetarySystem.subtractCenterOfMass();
                }
                world.step( time );
                world.render();
            });

            // start the ticker
            Physics.util.ticker.start();
        }

        ,contextualMenu: function( body ){

            var self = this
                ,el = self.$ctxMenu || (self.$ctxMenu = $('#ctx-menu'))
                ,oldBody = el.data('body')
                ;

            if ( !body ){
                el.data('body', null).hide();
                self.selectedBody = null;
                return;
            }

            // var x = body.state.pos.x + self.width / 2 + 10
            //     ,y = body.state.pos.y + self.height / 2 + 20
            //     ;
            //
            // if ( x > (self.width - el.outerWidth()) ){
            //     x -= (x + el.outerWidth() - self.width + 20);
            // }
            // if ( y > (self.height - el.outerHeight()) ){
            //     y -= el.outerHeight() + 20;
            // }

            self.selectedBody = body;

            el.data('body', body).show();
            // .css({
            //     top: y
            //     ,left: x
            // });

            el.find('#ctrl-mass').trigger('refresh', body.mass);
            el.find('#ctrl-color').minicolors( 'value', body.color() );
            el.find('#ctrl-path').prop( 'checked', body.path );
        }

        // DomReady Callback
        ,onDomReady: function(){

            var self = this;
            self.width = window.innerWidth;
            self.height = window.innerHeight;
            self.$ctxMenu = $('#ctx-menu');
            var massLabel = $('input.ctrl-mass');
            var massSlider = $('#ctrl-mass').slider({ min: 0.1, max: 100, val: 1 }).on('change', function( e, val ){
                var b = self.$ctxMenu.data('body');
                massLabel.val( val.toFixed(2) );
                if ( b ){
                    b.mass = val;
                    b.refreshView();
                }
                self.emit('modified');
            });
            massLabel.on('change', function(){
                massSlider.trigger('refresh', parseFloat( massLabel.val() ));
            });

            $('input[type="text"]').on('blur', function(){
                $(document).scrollTop(0);
            });

            $('input.color').on('touchstart', function( e ){
                e.preventDefault();
                $(this).focus();
            });

            $('#ctrl-color').minicolors({
                'change': function( hex ){
                    var b = self.$ctxMenu.data('body');
                    if ( b ){
                        b.color(hex);
                        b.refreshView();
                    }
                    self.emit('modified');
                }
            });

            $('#ctrl-path').on('change', function( e ){
                var b = self.$ctxMenu.data('body');
                if ( b ){
                    b.path = $(this).is(':checked');
                    b.refreshView();
                }
                self.emit('modified');
            });

            self.$ctxMenu.hammer().on('touch', '.ctrl-close', function( e ){
                e.preventDefault();
                self.contextualMenu( null );
            });

            var url;
            self.on('modified', function(){
                url = false;
            });
            self.on('share', function(){

                var ov = $('#shareOverlay');
                if ( url ){
                    ov.fadeIn(function(){
                        ov.find('input').val( url ).focus().select();
                    });
                    return;
                }

                $.ajax({
                    url: 'https://www.googleapis.com/urlshortener/v1/url'
                    ,contentType: "application/json; charset=utf-8"
                    ,type: 'post'
                    ,dataType: "json"
                    ,data: '{"longUrl": "'+window.location.href+'"}'
                }).then(function( data ){
                    url = data.id;
                    ov.fadeIn(function(){
                        ov.find('input').val( data.id ).focus().select();
                    });
                });
            });

            $(document).hammer().on('tap', '#shareOverlay .ctrl-close', function(){
                var ov = $('#shareOverlay').fadeOut();
            }).on('tap', function( e ){
                var ov = $('#shareOverlay');

                if (!ov.has(e.target).length && !ov.is(':animated') && e.target !== ov[0]){
                    ov.fadeOut();
                }
            });


            self.world = Physics( { timestep: 4 }, self.initPhysics.bind( self ) );

            Draw.preload(require.toUrl('../../images/nightsky.png'));
        }

    }, ['events']);

    return new Mediator();
});
