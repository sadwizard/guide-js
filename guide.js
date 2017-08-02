
var Guide = function(steps , options){

  this.steps = steps || [];
  this.options = options || {};

  this.outerPadding = 'outerPadding' in this.options ? this.options.outerPadding : 5,
  this.currentStep = 0;

  this.overlay  = $('.js-step__overlay');
  this.overlayL = $('.js-step__overlay-l');
  this.overlayR = $('.js-step__overlay-r');
  this.overlayT = $('.js-step__overlay-t');

  this.overlayHint = $('.js-step__overlay-hint');
  this.overlayHintTxt = $('.js-step__hint');
  this.overlayHintWr = $('.js-step__hint-wr');

  this.nextStepBtn = $('.js-step__btn-next');
  this.cancelStepsBtn = $('.js-step__btn-cancel');

};

Guide.prototype.start = function(){
    
    var self = this;

    this.overlay.addClass('_active');  
    this.overlayHintWr.addClass('_active'); 
    this.nextStepBtn.show();
    this.currentStep = 0; 
    console.log(this.currentStep)
    this.setStep(this.currentStep);

    $(window).bind('resize', this.events.resize.bind(this));
    this.nextStepBtn.bind('click' , this.events.nextStep.bind(this));
    this.cancelStepsBtn.bind('click', this.events.cancel.bind(this));

};

Guide.prototype.events = {

  resize: function(){
    this.setStep(this.currentStep);
  },

  nextStep: function(e){
    this.currentStep+=1;

    if(this.currentStep === (this.steps.length-1)){
      $(e.target).hide();
    }

    if(this.currentStep <= (this.steps.length-1)){
      
      this.setStep();
    }

  },

  cancel: function(){
      this.overlay.removeClass('_active');  
      this.overlayHintWr.removeClass('_active');

      this.nextStepBtn.unbind('click');
      this.cancelStepsBtn.unbind('click');
      $(window).unbind('resize');
  }
};

Guide.prototype.setStep = function(){
    var step = $(this.steps[this.currentStep].element),
        hint = this.steps[this.currentStep].hint;

    this.setHint(hint);
    this.setOverlayPos(step);
}

Guide.prototype.getOverlayPos = function(side , stepEl){

  var stepPos = this.stepCurrentPos(stepEl),
      innerW  = window.innerWidth,
      innerH  = window.innerHeight,
      outerPadding = this.outerPadding,
      ed = 'px';
  
  if(side === 'bottom'){
    return {
      top: (stepPos.height + stepPos.top + outerPadding) + ed
    }
  }
  
  if(side === 'left'){
    return {
      width: (stepPos.left - outerPadding) + ed,
      height: (stepPos.height + outerPadding*2) + ed,
      top: (stepPos.top - outerPadding) + ed
    }
  }
  
  if(side === 'right'){
    return {
      width: ((innerW -(stepPos.left+ stepPos.width)) - outerPadding) + ed,
      height: (stepPos.height + outerPadding*2) + ed,
      top: (stepPos.top - outerPadding) + ed
    }
  }
  
  if(side === 'top'){
    return {
      height: (stepPos.top - outerPadding) + ed
    }
  }

};

Guide.prototype.setOverlayPos = function(step){
  this.overlayR.css(this.getOverlayPos('right' , step));
  this.overlayL.css(this.getOverlayPos('left' , step));
  this.overlayT.css(this.getOverlayPos('top' , step));
  this.overlay.css(this.getOverlayPos('bottom' , step));
}

Guide.prototype.setHint = function(text){
  var step = $(this.steps[this.currentStep].element);
  var stepPos = this.stepCurrentPos(step);

  var top = (stepPos.height+ stepPos.top + this.outerPadding + 10) + 'px';
  var left = (stepPos.left+ 10) + 'px';
  this.overlayHintTxt.html(text);
  this.overlayHintWr.css({top: top , left: left});

}

Guide.prototype.stepCurrentPos = function(el){
  var elOffset = el.position();
  return {
    width: el.outerWidth(),
    height: el.outerHeight(),
    top: elOffset.top,
    left: elOffset.left
  }
};


