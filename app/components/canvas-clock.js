import Ember from 'ember';
/*
Reference: http://mrbool.com/how-to-create-an-analog-clock-with-html5/26976
*/

var CanvasClockComponent = Ember.Component.extend({
  tagName: 'canvas',
  width: 70,
  height: 70,
  font: 0,
  thick: 0,
  x: 0,
  Hx: 0,
  r: 0,
  Hr: 0,
  ctx: 0,

  setProperty: function() {
  	var width = this.get('width');
  	var radius = width/2;
	this.set('font', width/8); 
	this.set('thick', width/36);
	this.set('x', width/5);
	this.set('Hx', width/11);
	this.set('r', radius);
	this.set('Hr', width/2 - width/9);
	this.set('ctx', this.get('element').getContext('2d'));
    this.createClock();
  }.on('didInsertElement'),
  
  createClock: function() {
    var context = this.get('ctx');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, this.get('width'), this.get('height'));
    context.font = this.get('font')+'px Arial'; 

	var timetext = this.get('data');
	var timepart = timetext.split(" ")[0];
	this.set('ampm', timetext.split(" ")[1]);
	this.set('hour', timepart.split(":")[0]);
	this.set('minute', timepart.split(":")[1]);
	this.set('seconds', timepart.split(":")[2]);
	this.set('millisec', timepart.split(":")[3]);
 	
	this.createClockHelper();
  }.observes('data'),
  

  createClockHelper: function() { 
  	var context = this.get('ctx'),
	hour = this.get('hour'),
	ampm = this.get('ampm');
  	context.beginPath(); 
	context.arc(this.get('width')/2, this.get('height')/2, this.get('r'), 0, Math.PI*2, true); 
    context.fillStyle = '#efefef';
	if (((hour >= 6 && hour!=='12') && ampm === 'PM')|| ((hour<6 || hour==='12') && ampm === 'AM')){
			context.fillStyle = 'black';
	}
    context.fill();
    this.drawhands();
	this.createnos();
  },
  
  createnos: function() { 
	var ampm = this.get('ampm'),
	hour = this.get('hour'),
	angle = 0, 
	nowidth = 0,
	width = this.get('width'),
	height = this.get('height'),
	font = this.get('font'),
	Hr = this.get('Hr'),
	context = this.get('ctx');
	context.fillStyle = 'black';
	if (((hour >= 6 && hour!=='12') && ampm === 'PM')|| ((hour<6 || hour==='12') && ampm === 'AM')){
			context.fillStyle = 'white';
	}
	for (var i=1; i<=12; i++) {
		angle = Math.PI/6 * (i-3); 
		nowidth = context.measureText(i).width;
		context.fillText(i,width/2 + Math.cos(angle)*Hr - nowidth/2, height/2 + Math.sin(angle)*Hr + font/3); 
	}
	context.beginPath(); 
	context.arc(width/2, height/2, this.get('thick'), 0, Math.PI*2, true); 
	context.fillStyle = 'black';
	if (((hour >= 6 && hour!=='12') && ampm === 'PM')|| ((hour<6 || hour==='12') && ampm === 'AM')){
		context.fillStyle = 'white';
	}
	context.fill(); 
  }, 
  
  drawhand: function (loc, handType) { 
    var context = this.get('ctx'),
	ampm = this.get('ampm'),
	hour = this.get('hour'),
    width = this.get('width'),
    height = this.get('height'),
    millisec = this.get('millisec'),
    thick = this.get('thick'),
	angle = (Math.PI*2)*(loc/60) - Math.PI/2, 
	handRadius = handType === 'hour'?this.get('r')-this.get('x')-this.get('Hx'):this.get('r')-this.get('x');
    	
	context.beginPath();
	if (handType === 'second'){
	    handRadius = handRadius - thick;
	    angle = angle + (Math.PI*2/60)*(millisec/1000);
        context.lineWidth = thick/2;
		context.strokeStyle = 'red';
	}
	else{
		context.lineWidth = thick;
		context.strokeStyle = 'black';
		if (((hour >= 6 && hour!=='12') && ampm === 'PM')|| ((hour<6 || hour==='12') && ampm === 'AM')){
			context.strokeStyle = 'white';
		}
	}
	context.moveTo(width/2, height/2); 
	context.lineTo(width/2 + Math.cos(angle)*handRadius, height/2 + Math.sin(angle)*handRadius); 
	context.stroke(); 
  },
  
  drawhands: function() { 
  	this.drawhand(this.get('hour')*5 + (this.get('minute')/60)*5, 'hour',0.5);
    this.drawhand(this.get('minute'), 'minute',0.5); 
	this.drawhand(this.get('seconds'), 'second',0.2);
  }
});

export default CanvasClockComponent;