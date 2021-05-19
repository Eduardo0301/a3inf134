import {MyToolkit} from './mytoolkit.js';

// Implement a MyToolkit Button

//Button demo
var btn = new MyToolkit.Button("Button");
btn.setText("Submit")
btn.move(0,0);
btn.stateChanged(function(e){
    console.log("Button State Change: ");
    console.log(e);
})
btn.onclick(function(e){
    console.log("Button Click Event: ");
    console.log(e);
});

// CheckBox Demo
var cbx = new MyToolkit.CheckBox("CheckBox");
cbx.move(0,50);
cbx.setText("CheckBox #1");
cbx.stateChange(function (e) {
    console.log("CheckBox State Change: ");
    console.log(e);
})
cbx.checkChange(function (e) {
    console.log("Check Event: ");
    console.log(e);
})


//Radio Button demo
var rbx = new MyToolkit.RadioButton([["Radio Button 1",false],["rdiobutn",false],["Radio Button 3",false]])

rbx.move(0,100)
rbx.setText(1, "Radio Button 2")
rbx.checkChange(function(e) {
    console.log("RadioButton Check Change")
    console.log(e)
})
rbx.stateChange(function (e) {
    console.log("RadioButton State Change")
    console.log(e);
})


//TextBox Demo
var tbx = new MyToolkit.TextBox();
tbx.move(125,0)

tbx.textChange(function (e) {
    console.log("Text Change Event")
    console.log(e);
})

tbx.stateChange(function(e) {
    console.log("State Change Event")
    console.log(e)
    console.log("getText: " + tbx.getText());
})

// Progress Bar demo
var pbar = new MyToolkit.ProgressBar(200);
pbar.setWidth(300)
pbar.move(150, 50)
setInterval(progress, 2000)
let p = 0;
function progress(){
    p += 20;
    if(p>100){
        p = 0;
        pbar.increment(p)
    }
    else
        pbar.increment(p)
}

pbar.stateChange(function(e){
    console.log("Progress Bar State Change: " + pbar.getIncrement())
    console.log(e);
})
pbar.incrementChange(function(e) {
    console.log("Progress Bar Increment Event: ")
    console.log(e);
})



// Scroll Bar Demo
var sbar = new MyToolkit.ScrollBar(100);
sbar.setHeight(300)
sbar.move(200, 100)
sbar.stateChange(function (e){
    console.log("Scroll Bar State Change: " + sbar.getPosition());
    console.log(e);
})
sbar.thumbChange(function (e){
    console.log("Thumb Change Event: ");
    console.log(e)
})

//Number Input Demo
var numb = new MyToolkit.NumberBox(10, 20);
numb.move(0,200);

numb.stateChange(function(e){
    console.log("Number Input State Change: " + numb.getNumber());
    console.log(e)
})
numb.numChange(function (e){
    console.log("Number Change: ");
    console.log(e);
})