var first_ix = false;

(function (interact) {

    // 'use strict';

    // var transformProp;

    interact.maxInteractions(Infinity);

    // setup draggable elements.
    interact('#ir-lens')
        .draggable({ max: Infinity, inertia: true })
        .on('dragstart', function (event) {
            // event.interaction.x = parseInt(event.target.getAttribute('data-x'), 10) || 0;
            // event.interaction.y = parseInt(event.target.getAttribute('data-y'), 10) || 0;

            event.interaction.x = $('#ir-lens').position().left;
            event.interaction.y = $('#ir-lens').position().top;

            

            // console.log('STOP!');
            $('#ir-lens').stop();
            $('#ir-mask').stop();

        })
        .on('dragmove', function (event) {

            event.interaction.x += event.dx;
            event.interaction.y += event.dy;

            // if (transformProp) {
            //     event.target.style[transformProp] =
            //         'translate(' + event.interaction.x + 'px, ' + event.interaction.y + 'px)';
            // }
            // else {
                // event.target.style.left = event.interaction.x + 'px';
                // event.target.style.top  = event.interaction.y + 'px';

                // translated into jquery, cuz it's easier to read for me                
                $('#ir-lens').css({
                	left: event.interaction.x + 'px',
                	top: event.interaction.y + 'px'
                });

                $('#ir-mask').css({
                	left: '-' + event.interaction.x-20 + 'px',
                	top: '-' + event.interaction.y-20 + 'px'
                });
            // }
        })
        .on('dragend', function (event) {
            event.target.setAttribute('data-x', event.interaction.x);
            event.target.setAttribute('data-y', event.interaction.y);
        });

    // setup drop areas.
    // dropzone #1 accepts draggable #1
    // setupDropzone('#drop1', '#drag1');
    // // dropzone #2 accepts draggable #1 and #2
    // setupDropzone('#drop2', '#drag1, #drag2');
    // // every dropzone accepts draggable #3
    // setupDropzone('.js-drop', '#drag3');

    /**
     * Setup a given element as a dropzone.
     *
     * @param {HTMLElement|String} el
     * @param {String} accept
     */
    // function setupDropzone(el, accept) {
    //     interact(el)
    //         .dropzone({
    //             accept: accept,
    //             ondropactivate: function (event) {
    //                 addClass(event.relatedTarget, '-drop-possible');
    //             },
    //             ondropdeactivate: function (event) {
    //                 removeClass(event.relatedTarget, '-drop-possible');
    //             }
    //         })
    //         .on('dropactivate', function (event) {
    //             var active = event.target.getAttribute('active')|0;

    //             // change style if it was previously not active
    //             if (active === 0) {
    //                 addClass(event.target, '-drop-possible');
    //                 event.target.textContent = 'Drop me here!';
    //             }

    //             event.target.setAttribute('active', active + 1);
    //         })
    //         .on('dropdeactivate', function (event) {
    //             var active = event.target.getAttribute('active')|0;

    //             // change style if it was previously active
    //             // but will no longer be active
    //             if (active === 1) {
    //                 removeClass(event.target, '-drop-possible');
    //                 event.target.textContent = 'Dropzone';
    //             }

    //             event.target.setAttribute('active', active - 1);
    //         })
    //         .on('dragenter', function (event) {
    //             addClass(event.target, '-drop-over');
    //             event.relatedTarget.textContent = 'I\'m in';
    //         })
    //         .on('dragleave', function (event) {
    //             removeClass(event.target, '-drop-over');
    //             event.relatedTarget.textContent = 'Drag me…';
    //         })
    //         .on('drop', function (event) {
    //             removeClass(event.target, '-drop-over');
    //             event.relatedTarget.textContent = 'Dropped';
    //         });
    // }

    // function addClass (element, className) {
    //     if (element.classList) {
    //         return element.classList.add(className);
    //     }
    //     else {
    //         element.className += ' ' + className;
    //     }
    // }

    // function removeClass (element, className) {
    //     if (element.classList) {
    //         return element.classList.remove(className);
    //     }
    //     else {
    //         element.className = element.className.replace(new RegExp(className + ' *', 'g'), '');
    //     }
    // }

    // interact(document).on('ready', function () {
    //     transformProp = 'transform' in document.body.style
    //         ? 'transform': 'webkitTransform' in document.body.style
    //         ? 'webkitTransform': 'mozTransform' in document.body.style
    //         ? 'mozTransform': 'oTransform' in document.body.style
    //         ? 'oTransform': 'msTransform' in document.body.style
    //         ? 'msTransform': null;
    // });

    animateDiv();

    function makeNewPosition(){
	    // Get viewport dimensions (remove the dimension of the div)
	    var h = $(window).height() - 270;
	    var w = $(window).width()/2 - 233;
	    
	    var nh = Math.floor(Math.random() * h);
	    var nw = Math.floor(Math.random() * w);
	    
	    return [nh,nw];    
	    
	}

	function animateDiv(){
	    var newq = makeNewPosition();
	    var oldq = $('#ir-lens').offset();
	    var speed = calcSpeed([oldq.top, oldq.left], newq);
	    // var speed = 5000
	    
	    $('#ir-lens').animate({ top: newq[0], left: newq[1] }, {
	    	duration: speed, 
	    	step: function() { //called every frame
	    		
	    		$('#ir-mask').css({
	    			left: '-' + $('#ir-lens').position().left-20 + 'px',
                	top: '-' + $('#ir-lens').position().top-20 + 'px'
	    		});
                
	    	},
	    	done: function() { //called at the end of this path
				animateDiv();
	    }});
	    
	};

	function calcSpeed(prev, next) {
	    
	    var x = Math.abs(prev[1] - next[1]);
	    var y = Math.abs(prev[0] - next[0]);
	    
	    var greatest = x > y ? x : y;
	    
	    var speedModifier = 0.1;

	    var speed = Math.ceil(greatest/speedModifier);

	    return speed;

	}

    
}(window.interact));