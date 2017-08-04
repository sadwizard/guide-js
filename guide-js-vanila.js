
var Guide = function(steps , options){

  this.steps = steps || [];
  this.options = options || {};

  this.outerPadding = 'outerPadding' in this.options ? this.options.outerPadding : 5,
  this.currentStep = 0;

  var qs = function (selector){return document.querySelector(selector)};

  this.overlay  = qs('.js-step__overlay');
  this.overlayL = qs('.js-step__overlay-l');
  this.overlayR = qs('.js-step__overlay-r');
  this.overlayT = qs('.js-step__overlay-t');

  this.overlayHint = qs('.js-step__overlay-hint');
  this.overlayHintTxt = qs('.js-step__hint');
  this.overlayHintWr = qs('.js-step__hint-wr');

  this.nextStepBtn = qs('.js-step__btn-next');
  this.cancelStepsBtn = qs('.js-step__btn-cancel');

};

Guide.prototype.start = function(){
    
    var self = this;

    this.overlay.classList.add('_active');  
    this.overlayHintWr.classList.add('_active'); 
    this.nextStepBtn.style.display = 'block';
    this.currentStep = 0; 

    this.setStep(this.currentStep);

    this.listeners = {
      resize: this.events.resize.bind(this),
      nextStep: this.events.nextStep.bind(this),
      cancel: this.events.cancel.bind(this)
    }

    window.addEventListener('resize', this.listeners.resize);
    this.nextStepBtn.addEventListener('click' , this.listeners.nextStep);
    this.cancelStepsBtn.addEventListener('click', this.listeners.cancel);

};

Guide.prototype.events = {

  resize: function(){
    this.setStep(this.currentStep);
  },

  nextStep: function(e){
    this.currentStep+=1;

    if(this.currentStep === (this.steps.length-1)){
      e.target.style.display = 'none';
    }

    if(this.currentStep <= (this.steps.length-1)){
      this.setStep();
    }
  },
 
  cancel: function(){
      
      this.overlay.classList.remove('_active');  
      this.overlayHintWr.classList.remove('_active');

      // удаляем текущий шаг с блока overlay__helper
      if(this.options.followHelperCurrentStep){
         this.overlayHintWr.classList.remove(this.getCurrentStepClass());
      }

      this.nextStepBtn.removeEventListener('click' , this.listeners.nextStep);
      this.cancelStepsBtn.removeEventListener('click' , this.listeners.cancel);
      window.removeEventListener('resize' , this.listeners.resize);
  }
};

Guide.prototype.setStep = function(){
  var step = this.steps[this.currentStep].element,
      hint = this.steps[this.currentStep].hint;

    this.setHint(hint);
    this.setOverlayPos(step);
}

Guide.prototype.getOverlayPos = function(side , stepEl){

  var stepPos = this.stepCurrentPos(stepEl),
      innerW  = window.innerWidth,
      innerH  = window.innerHeight,
      outerPadding = this.outerPadding;

  if(side === 'bottom'){
    return {top: (stepPos.height + stepPos.top + outerPadding) };
  }
  
  if(side === 'left'){
    return {
      width: (stepPos.left - outerPadding),
      height: (stepPos.height + outerPadding*2),
      top: (stepPos.top - outerPadding)
    };
  }
  
  if(side === 'right'){
    return {
      width: ((innerW -(stepPos.left+ stepPos.width)) - outerPadding),
      height: (stepPos.height + outerPadding*2),
      top: (stepPos.top - outerPadding)
    };
  }
  
  if(side === 'top'){
      return {height: (stepPos.top - outerPadding)};
  }

};

Guide.prototype.setOverlayPos = function(step){
  this.overlayR.style = toStrStyle(this.getOverlayPos('right' , step));
  this.overlayL.style = toStrStyle(this.getOverlayPos('left' , step));
  this.overlayT.style = toStrStyle(this.getOverlayPos('top' , step));
  this.overlay.style = toStrStyle(this.getOverlayPos('bottom' , step));

  function toStrStyle(arr){
    var r = "";
    for(var key in arr){
      if(key === ('top' || 'left' || 'right' || 'bottom')){
        r+= key+": " + arr[key] +"px;";
      }else{
        if(arr[key] > 0){
          r+= key+": " + arr[key] +"px;";      
        }else{
          r+= key+": 0px;";
        }
      }
    }
    return r;
  }
}

Guide.prototype.setHint = function(text){

  // класс элемента шага
  var step = this.steps[this.currentStep].element;
  // текущая позиция шага
  var stepPos = this.stepCurrentPos(step);


  this.overlayHintTxt.innerHTML = text;


  // опция нужна для того чтобы была возможность позиционировать
  // блок overlay__halper в зависимости от текущего шага
  if(this.options.followHelperCurrentStep){

    this.overlayHintWr.classList.add(step.slice(1));
    var prevClass = this.getPrevStepClass();

    if(prevClass){
      this.overlayHintWr.classList.remove(prevClass); 
    }
  }else{

    // автоматическая расположение блока overlay__helper
    var top = (stepPos.height+ stepPos.top + this.outerPadding + 10) + 'px';
    var left = (stepPos.left+ 10) + 'px';
    this.overlayHintWr.style = "top: "+top+";left: "+left+";";
  }


}

Guide.prototype.getPrevStepClass = function() {
  var className = '';
  var step = this.currentStep - 1;
  if(step == -1){
    step = false;
  }

  if(step || (step === 0)){
    className = this.steps[step].element;
  }else{
    className = false;
  }
  className = typeof className === "string" ?  className.slice(1) : className;
  return className;
}

Guide.prototype.getCurrentStepClass = function() {
  return this.steps[this.currentStep].element;
}

Guide.prototype.stepCurrentPos = function(el){
  var el = document.querySelector(el),
      s = window.getComputedStyle(el);

  var n = function(val){return parseInt(val.slice(0,-2))};

  var width = n(s.width) + n(s.paddingLeft) + n(s.paddingRight);
  var height = n(s.height) + n(s.paddingBottom) + n(s.paddingTop);
  var oLeft  = el.offsetLeft;
  var oTop  = el.offsetTop;
  return {
    width: width,
    height: height,
    top: oTop,
    left: oLeft
  }
};
