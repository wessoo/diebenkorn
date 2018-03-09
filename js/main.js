var num_revealed = 0;
var box_peek = false;
var lens_left, lens_top;
var current_boxpeek;
var reveal_array;
var revealComplete = false;

(function (interact) {

    reveal_array = [$('#box-1-1'), $('#box-1-2'), $('#box-1-3'), $('#box-1-4'),
                    $('#box-2-1'), $('#box-2-2'), $('#box-2-3'), $('#box-2-4'),
                    $('#box-3-1'), $('#box-3-2'), $('#box-3-3'), $('#box-3-4'),
                    $('#box-4-1'), $('#box-4-2'), $('#box-4-3'), $('#box-4-4'),]
    // MAIN AREA

    animateDiv();

    // setup drop areas. Make all dragboxes check for overlap with #ir-lens
    setupDropzone('#dragbox-1-1', '#ir-lens');
    setupDropzone('#dragbox-1-2', '#ir-lens');
    setupDropzone('#dragbox-1-3', '#ir-lens');
    setupDropzone('#dragbox-1-4', '#ir-lens');
    setupDropzone('#dragbox-2-1', '#ir-lens');
    setupDropzone('#dragbox-2-2', '#ir-lens');
    setupDropzone('#dragbox-2-3', '#ir-lens');
    setupDropzone('#dragbox-2-4', '#ir-lens');
    setupDropzone('#dragbox-3-1', '#ir-lens');
    setupDropzone('#dragbox-3-2', '#ir-lens');
    setupDropzone('#dragbox-3-3', '#ir-lens');
    setupDropzone('#dragbox-3-4', '#ir-lens');
    setupDropzone('#dragbox-4-1', '#ir-lens');
    setupDropzone('#dragbox-4-2', '#ir-lens');
    setupDropzone('#dragbox-4-3', '#ir-lens');
    setupDropzone('#dragbox-4-4', '#ir-lens');

    interact.maxInteractions(Infinity);


    /**
     *
     */
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

            if(allRevealed() && revealComplete == false) {
                $('#whiteflash').delay(1000).fadeIn().fadeOut();
                $('#dotgrid').fadeOut(0);
                $('#ir-lens').fadeOut();

                revealComplete = true;

                transitionStep2();
            }
        }); // -- END interact() 
    
    $('#btn-continue').click(function() {
        console.log('CLICK');
        
        $('#text-irr').fadeOut(function(){ 
            $('#text-layers').fadeIn(); 
            $('#layer-pentimento').fadeIn();
        });
    })

    $('#radio-visible').click(function() {
        $('#ir-painting').fadeOut();
        $('#layer-pentimento').fadeOut();
        $('#layer-stilllife').fadeOut();
        $('#layer-femalenude').fadeOut();

        $('#radiofill-visible').fadeIn();
        $('#radiofill-pentimento').fadeOut();
        $('#radiofill-stilllife').fadeOut();
        $('#radiofill-femalenude').fadeOut();
    });

    $('#radio-pentimento').click(function() {
        $('#ir-painting').fadeIn();
        $('#layer-pentimento').fadeIn();
        $('#layer-stilllife').fadeOut();
        $('#layer-femalenude').fadeOut();

        $('#radiofill-visible').fadeOut();
        $('#radiofill-pentimento').fadeIn();
        $('#radiofill-stilllife').fadeOut();
        $('#radiofill-femalenude').fadeOut();
    });

    $('#radio-stilllife').click(function() {
        $('#ir-painting').fadeIn();
        $('#layer-pentimento').fadeOut();
        $('#layer-stilllife').fadeIn();
        $('#layer-femalenude').fadeOut();

        $('#radiofill-visible').fadeOut();
        $('#radiofill-pentimento').fadeOut();
        $('#radiofill-stilllife').fadeIn();
        $('#radiofill-femalenude').fadeOut();
    });

    $('#radio-femalenude').click(function() {
        $('#ir-painting').fadeIn();
        $('#layer-pentimento').fadeOut();
        $('#layer-stilllife').fadeOut();
        $('#layer-femalenude').fadeIn();

        $('#radiofill-visible').fadeOut();
        $('#radiofill-pentimento').fadeOut();
        $('#radiofill-stilllife').fadeOut();
        $('#radiofill-femalenude').fadeIn();
    });

    // -- END MAIN AREA


    /* FUNCTION SECTION */


    /**
     * Setup a given element as a dropzone.
     *
     * @param {HTMLElement|String} el
     * @param {String} accept
     */
    function setupDropzone(el, accept) {
        interact(el)
            .dropzone({
                accept: accept,
                ondropactivate: function (event) {
                    addClass(event.relatedTarget, '-drop-possible');
                },
                ondropdeactivate: function (event) {
                    removeClass(event.relatedTarget, '-drop-possible');
                },
                overlap: 0.7    //reveal when 70% overlap
            })
            .on('dropactivate', function (event) {
                var active = event.target.getAttribute('active')|0;

                // change style if it was previously not active
                if (active === 0) {
                    addClass(event.target, '-drop-possible');
                    // event.target.textContent = 'Drop me here!';
                }

                event.target.setAttribute('active', active + 1);
            })
            .on('dropdeactivate', function (event) {
                var active = event.target.getAttribute('active')|0;

                // change style if it was previously active
                // but will no longer be active
                if (active === 1) {
                    removeClass(event.target, '-drop-possible');
                    // event.target.textContent = 'Dropzone';
                }

                event.target.setAttribute('active', active - 1);
            })
            .on('dragenter', function (event) {
                addClass(event.target, '-drop-over');
                
                // event.target.textContent = 'Overlapped!';
                
                var converted_id = event.target.id.replace('dragbox','box');
                

                // console.log($('#' + converted_id).css('display'));

                // if(num_revealed < 16 && $('#' + converted_id).css('display') != 'none') {
                    

                $('#' + converted_id).fadeOut(800);
                
                console.log('All revealed? ' + allRevealed());

                if(allRevealed()) {
                    revealComplete = true;
                    $('#whiteflash').delay(1000).fadeIn().fadeOut();
                    $('#dotgrid').fadeOut(0);
                    $('#ir-lens').fadeOut();

                    transitionStep2();
                }

                // } else if(num_revealed >= 16) {
                //     $('#whiteflash').delay(1000).fadeIn().fadeOut();
                //     $('#dotgrid').fadeOut(0);

                //     $('#ir-lens').fadeOut();

                //     // call transition animation
                // }


            })
            .on('dragleave', function (event) {
                removeClass(event.target, '-drop-over');
                // event.target.textContent = 'Drop me here!';
            })
            .on('drop', function (event) {
                removeClass(event.target, '-drop-over');
                // event.relatedTarget.textContent = 'Dropped';
            });
    }

    /**
     *
     */
    function transitionStep2 () {

        $('#ir-painting').delay(1500).animate({left: 0}, 1500, function() {
            $('#text-irr').fadeIn();
        });

    }

    /**
     *
     */
    function allRevealed () {

        for(i = 0; i < reveal_array.length; i++) {
            if(reveal_array[i].css('display') != 'none') {
                return false;  // something still not revealed
            }
        }

        return true;

    }

    /**
     *
     */
    function addClass (element, className) {
        if (element.classList) {
            return element.classList.add(className);
        }
        else {
            element.className += ' ' + className;
        }
    }

    /**
     *
     */
    function removeClass (element, className) {
        if (element.classList) {
            return element.classList.remove(className);
        }
        else {
            element.className = element.className.replace(new RegExp(className + ' *', 'g'), '');
        }
    }

    /**
     *
     */
    function makeNewPosition(){
	    // Get viewport dimensions (remove the dimension of the div)
	    var h = $(window).height() - 270;
	    var w = $(window).width()/2 - 233;
	    
	    var nh = Math.floor(Math.random() * h);
	    var nw = Math.floor(Math.random() * w);
	    
	    return [nh,nw];    
	    
	}

    /**
     * 
     */
	function animateDiv(){
	    var newq = makeNewPosition();
	    var oldq = $('#ir-lens').offset();
	    var speed = calcSpeed([oldq.top, oldq.left], newq);
	    
	    $('#ir-lens').animate({ top: newq[0], left: newq[1] }, {
	    	duration: speed, 
	    	step: function() { // !!! called every frame
	    		
                lens_left = $('#ir-lens').position().left;
                lens_top = $('#ir-lens').position().top;

	    		$('#ir-mask').css({
	    			left: '-' + lens_left-20 + 'px',
                	top: '-' + lens_top-20 + 'px'
	    		});

                // console.log(checkOverlap($('#ir-mask'), $('#box-1-1')));

                
                // if box is overlapping
                //     if box_peek not T
                //         turn on appropriate square
                //         set box_peek to T
                // else 
                //     if box_peek is T
                //         turn off all squares
                //         set box_peek to F



                if(isOverlap()) {   // If there's overlap
                    
                    if(!box_peek) {
                        // turn on appropriate square
                        // console.log('turn on ' + current_boxpeek);
                        $(current_boxpeek).stop().animate({opacity: 0}, 500);

                        box_peek = true;
                    }
                    
                } else {

                    if(box_peek) {
                        // turn off appropriate square
                        // console.log('turn off ' + current_boxpeek);
                        $(current_boxpeek).delay(1000).stop().animate({opacity: 1}, 2000)
                        
                        box_peek = false;
                    }
                }
                
	    	},
	    	done: function() { //called at the end of this path
				animateDiv();
	    }});
	    
	};

    /**
     *
     */
    function isOverlap() {
        
        var overlap;

        var lens_xcenter = lens_left + 117;
        var lens_ycenter = lens_top + 135;

        if(lens_xcenter > 17 && lens_xcenter < 216 && lens_ycenter > 20 && lens_ycenter < 250) {
            current_boxpeek = '#box-1-1';
            return true;

        } else if(lens_xcenter > 250 && lens_xcenter < 449 && lens_ycenter > 20 && lens_ycenter < 250) {
            current_boxpeek = '#box-1-2';
            return true;

        } else if(lens_xcenter > 483 && lens_xcenter < 682 && lens_ycenter > 20 && lens_ycenter < 250) {
            current_boxpeek = '#box-1-3';
            return true;

        } else if(lens_xcenter > 716 && lens_xcenter < 915 && lens_ycenter > 20 && lens_ycenter < 250) {
            current_boxpeek = '#box-1-4';
            return true;

        } else if(lens_xcenter > 17 && lens_xcenter < 216 && lens_ycenter > 290 && lens_ycenter < 520) {
            current_boxpeek = '#box-2-1';
            return true;

        } else if(lens_xcenter > 250 && lens_xcenter < 449 && lens_ycenter > 290 && lens_ycenter < 520) {
            current_boxpeek = '#box-2-2';
            return true;

        } else if(lens_xcenter > 483 && lens_xcenter < 682 && lens_ycenter > 290 && lens_ycenter < 520) {
            current_boxpeek = '#box-2-3';
            return true;

        } else if(lens_xcenter > 716 && lens_xcenter < 915 && lens_ycenter > 290 && lens_ycenter < 520) {
            current_boxpeek = '#box-2-4';
            return true;

        } else if(lens_xcenter > 17 && lens_xcenter < 216 && lens_ycenter > 560 && lens_ycenter < 790) {
            current_boxpeek = '#box-3-1';
            return true;

        } else if(lens_xcenter > 250 && lens_xcenter < 449 && lens_ycenter > 560 && lens_ycenter < 790) {
            current_boxpeek = '#box-3-2';
            return true;

        } else if(lens_xcenter > 483 && lens_xcenter < 682 && lens_ycenter > 560 && lens_ycenter < 790) {
            current_boxpeek = '#box-3-3';
            return true;

        } else if(lens_xcenter > 716 && lens_xcenter < 915 && lens_ycenter > 560 && lens_ycenter < 790) {
            current_boxpeek = '#box-3-4';
            return true;

        } else if(lens_xcenter > 17 && lens_xcenter < 216 && lens_ycenter > 830 && lens_ycenter < 1060) {
            current_boxpeek = '#box-4-1';
            return true;

        } else if(lens_xcenter > 250 && lens_xcenter < 449 && lens_ycenter > 830 && lens_ycenter < 1060) {
            current_boxpeek = '#box-4-2';
            return true;

        } else if(lens_xcenter > 483 && lens_xcenter < 682 && lens_ycenter > 830 && lens_ycenter < 1060) {
            current_boxpeek = '#box-4-3';
            return true;

        } else if(lens_xcenter > 716 && lens_xcenter < 915 && lens_ycenter > 830 && lens_ycenter < 1060) {
            current_boxpeek = '#box-4-4';
            return true;

        } else {
            return false;
        }
    }

    /**
     *
     */
	function calcSpeed(prev, next) {
	    
	    var x = Math.abs(prev[1] - next[1]);
	    var y = Math.abs(prev[0] - next[0]);
	    
	    var greatest = x > y ? x : y;
	    
	    var speedModifier = 0.15;

	    var speed = Math.ceil(greatest/speedModifier);

	    return speed;

	}

    
}(window.interact));