/**
 * Used as a constructor for all widgets
 * @constructor
 */
var MyToolkit = (function() {
    //change size of svg body here
    let draw = SVG().addTo('body').size('500','500');


    /**
     * Widget for a button
     * @param {string} txt - text to be placed inside button
     * @returns {{move: move, onclick: onclick, stateChanged: stateChanged, setText: setText}}
     * @constructor
     */
    var Button = function(txt){
        let group = draw.group();
        let rect = draw.rect(100,40).fill('#eafaf1').stroke('black');
        rect.radius(5);
        group.add(rect)
        let text = draw.text(txt)
        text.move(rect.attr('x')+25, rect.attr('y') + 10);
        group.add(text)
        let clickEvent = null
        let stateEvent = null
        let state = "idle"

        group.mouseover(function(){
            if(state === "idle") {
                rect.fill({color: '#D5F5E3'})
                state = "hover"
                transition()
            }
        })

        group.mouseout(function(){
            if(state === "hover"){
                rect.fill({color: "#eafaf1"})
                state = "idle"
                transition()
            }
            else if(state === "pressed"){
                rect.fill({color: "#eafaf1"})
                state = "idle"
                transition()
            }
        })

        group.mouseup(function(event){
            if(state === "pressed"){
                rect.fill({color:"#D5F5E3"})
                state = "hover"
                transition()
                if(clickEvent !== null){
                    clickEvent(event)
                }
            }
        })

        group.mousedown(function(event) {
            if(state ==="hover"){
                rect.fill({color: '#D4EFDF'}) //#eafaf1
                state = "pressed"
                transition()
            }
        })


        function transition(){
            if(stateEvent != null){
                stateEvent(state)
            }
        }

        return {
            move: function(x, y) {
                group.move(x,y)
            },
            onclick: function(eventHandler){
                clickEvent = eventHandler
            },
            setText: function(txt) {
                text.text(txt);
            },
            stateChanged: function(eventHandler){
                stateEvent = eventHandler
            }
        }
    }

    /**
     * Widget for a checkbox
     * @param {string} txt - text to be placed on right-side of checkbox
     * @returns {{move: move, checkChange: checkChange, stateChange: stateChange, setText: setText}}
     * @constructor
     */
    var CheckBox = function(txt) {
        //let draw = SVG().addTo('body').size('100%','100%');
        let group = draw.group();
        let rect = draw.rect(25,25).fill("white").stroke('black')
        rect.radius(5);
        group.add(rect);
        let text = draw.text(txt);
        text.move(rect.attr('x') + 30, rect.attr('y') + 3);
        group.add(text);
        let checkEvent = null;
        let stateEvent = null;
        let state = "unchecked";

        rect.mousedown(function(event){
            if(state === "unchecked"){
                rect.fill({color: "#006666"})
                state = "checked";
                if(checkEvent != null){
                    checkEvent(event)
                }
                transition()
            }
            else if(state === "checked"){
                rect.fill("white");
                state = "unchecked"
                if(checkEvent != null){
                    checkEvent(event)
                }
                transition()
            }
        })

        function transition(){
            if(stateEvent != null){
                stateEvent(state)
            }
        }

        return {
            move: function (x,y) {
                group.move(x,y)
            },
            setText: function(txt) {
                text.text(txt)
            },
            checkChange: function(eventHandler){
                checkEvent = eventHandler;
            },
            stateChange: function (eventHandler){
                stateEvent = eventHandler;
            }
        }
    }

    /**
     * Widget for RadioButton
     * @param options - takes an array of the number of buttons to be created ["name", boolean]
     * @returns {{move: move, checkChange: checkChange, stateChange: stateChange, setText: setText}}
     * @constructor
     */
    var RadioButton = function (options) {
        let radioGroup = draw.group();
        let group = draw.group();
        let currentChecked = -1;
        let state = ["unchecked", currentChecked];

        if(options[0][1]){
            group.add(draw.circle(20).fill("#006666").stroke("black").attr({'x': 0, 'y':0}))
            currentChecked = 0;
            state = ["checked", currentChecked]
        }
        else {
            group.add(draw.circle(20).fill("white").stroke("black").attr({'x': 0, 'y': 0}))
        }
        group.add(draw.text(options[0][0]).attr({x: group.get(0).attr('cx') + 20, y: group.get(0).attr('cy') - 15}))
        radioGroup.add(group);
        for(let i = 1; i<options.length;++i){
            let lastRadio = radioGroup.get(i-1).get(0)
            let group = draw.group()
            if(options[i][1] && currentChecked == -1) {
                group.add(draw.circle(20).fill("#006666").stroke("black").attr({cy: lastRadio.attr("cy") + 25}))
                currentChecked = i;
                state = ["checked", currentChecked]
            }
            else {
                group.add(draw.circle(20).fill("white").stroke("black").attr({cy: lastRadio.attr("cy") + 25}));
            }
            group.add(draw.text(options[i][0]).attr({x: group.get(0).attr('cx') + 20, y: group.get(0).attr('cy') - 15}));
            radioGroup.add(group)
        }
        let checkEvent = null;
        let stateEvent = null;

        for(let i = 0; i<options.length; ++i) {
            radioGroup.get(i).get(0).mousedown(function (event){
                if(i !== currentChecked) {
                    radioGroup.get(i).get(0).fill({color: "#006666"});
                    if(currentChecked != -1)
                        radioGroup.get(currentChecked).get(0).fill({color: "white"});
                    currentChecked = i;
                    if(checkEvent != null){
                        checkEvent({event, currentChecked})
                    }
                    state =["checked", currentChecked]
                    transition();
                }
            })
        }

        function transition(){
            if(stateEvent!==null){
                stateEvent(state);
            }
        }

        return {
            move: function (x,y){
                radioGroup.move(x,y);
            },
            checkChange: function(eventHandler) {
                checkEvent = eventHandler
            },
            stateChange: function (eventHandler) {
                stateEvent = eventHandler;
            },
            setText: function(index, txt) {
                radioGroup.get(index).get(1).text(txt);
            },
        }
    }

    /**
     * Textbox widget that allows for user input, maximum of 25 characters
     * @returns {{move: move, getText: (function(): (*)), stateChange: stateChange, textChange: textChange}}
     * @constructor
     */
    var TextBox = function() {
        // Only allows input when cursor hovers over textbox and is pressed
        let group = draw.group();

        let rect = draw.rect(250,40).fill('white').stroke('black');
        rect.radius(5)
        group.add(rect);
        let text = draw.text("").attr({x: rect.attr('x'), y: rect.attr('y'), 'font-size': "20px", textLength: 5});
        group.add(text);
        let textEvent = null;
        let stateEvent = null;
        let state = "idle"

        let ignore = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Enter", "Shift", "Meta"]

        group.mouseover(function () {
            if(state === "idle"){
                state = "hover";
                text.fill({color: "black"});
                let cursor = text.node.textContent + "|"
                text.text(cursor);
                transition()
            }
        })

        group.mouseout(function() {
            if(state ==="hover") {
                state = "idle";
                let txt = text.node.textContent;
                text.text(txt.substr(0,txt.length-1));
                text.fill({color: "black"});
                transition()
            }
            else if(state === "pressed"){
                state = "idle"
                text.fill({color: "black"})
                let txt = text.node.textContent;
                text.text(txt.substr(0,txt.length-1));

                transition()
            }
        })

        group.mousedown(function() {
            if(state === "hover") {
                state = "pressed"
                text.fill({color: "#006666"})
                transition()
            }
        })

        SVG.on(window, 'keyup', (event) => {
            if(state === "pressed") {
                let txt = text.text();
                if(ignore.includes(event.key)){
                    return;
                }
                if(event.key ==="Backspace"){
                    text.text(txt.substr(0, txt.length-2) + "|");
                    if(textEvent != null){
                        textEvent({"event" : event, "text": text.text().substr(0, txt.length)})
                    }
                    return;
                }
                if(txt.length < 26) {
                    text.text(txt.substr(0, txt.length - 1) + event.key + "|");
                    if (textEvent != null) {
                        textEvent({"event": event, "text": text.text().substr(0, txt.length)})
                    }
                }
                else{
                    state = "full";
                    text.fill({color: "red"})
                    text.text(txt.substr(0,txt.length-1));
                    transition();
                }
            }
            else if(state === "full"){
                let txt = text.text()
                if(event.key ==="Backspace"){
                    text.text(txt.substr(0, txt.length-2) + "|");
                    text.fill({color: '#006666'})
                    state = "pressed"
                    if(textEvent != null){
                        textEvent({"event" : event, "text": text.text().substr(0, txt.length-1)})
                    }
                    transition()
                }
            }
        })

        function transition() {
            if(stateEvent != null) {
                stateEvent(state)
            }
        }

        return{
            move: function(x,y) {
                group.move(x,y);
            },
            getText: function() {
                let txt = text.text();
                if(txt.charAt(txt.length-1) == "|"){
                    return txt.substr(0,txt.length-1);
                }
                return txt;
            },
            textChange: function (eventHandler) {
                textEvent = eventHandler;
            },
            stateChange: function (eventHandler) {
                stateEvent = eventHandler;
            }

        }
    }

    /**
     * ProgressBar widget that can have set width and the amount incremented
     * @param {int} width - width of progress bar
     * @returns {{move: move, increment: increment, getIncrement: (function(): number), stateChange: stateChange, setWidth: setWidth, incrementChange: incrementChange}}
     * @constructor
     */
    var ProgressBar = function(width) {
        let group = draw.group();
        let bar = draw.rect(width, 35).fill({color: "white"}).stroke("black");
        let progress = draw.rect(0, 35).fill("#006666");
        group.add(bar);
        group.add(progress);
        let state = "empty"
        let widthPerc = 0;
        let stateEvent = null;
        let incrementEvent = null;
        let incrementValue = 0;
        function transition() {
            if(stateEvent !== null){
                stateEvent(state);
            }
        }
        return {
            move: function(x,y){
                group.move(x,y);
            },
            increment: function (inc) {
                incrementValue = inc;
                let result = width * (inc/100);
                widthPerc = result;
                if(result >= width && (state == "empty" || state == "progress")){
                    state = "full"
                    progress.attr({width: width})
                    widthPerc = 100;
                    incrementValue= 100;
                    if(incrementEvent != null)
                        incrementEvent({incrementValue});
                    transition();
                }
                else if(state == "full" && result == 0){
                    state = "empty"
                    progress.attr({width: result})
                    if(incrementEvent != null)
                        incrementEvent({incrementValue});
                    transition()
                }
                else if(state == "empty" || state =="progress") {
                    if(state == "empty"){
                        state = "progress"
                        transition();
                    }
                    progress.attr({width: result})
                    if(incrementEvent != null)
                        incrementEvent({incrementValue});
                }
            },
            getIncrement: function() {
                return incrementValue;
            },
            incrementChange: function (eventHandler) {
                incrementEvent = eventHandler;
            },
            stateChange: function (eventHandler) {
                stateEvent = eventHandler
            },
            setWidth: function (w) {
                let newvalue = w * widthPerc/width;
                widthPerc = newvalue;
                width = w;
                bar.attr({'width': width});
                progress.attr({'width': newvalue})
            }
        }
    }

    /**
     * Scroll bar widget.
     * @param {int} height - height of scroll bar.
     * @returns {{move: move, getPosition: (function(): *), stateChange: stateChange, thumbChange: thumbChange, setHeight: setHeight}}
     * @constructor
     */
    var ScrollBar = function (height) {
        let group = draw.group();
        let bar = draw.rect(35, height).fill({color: "white"}).stroke("black");
        let thumb = draw.rect(33, 40).fill({color: "#eafaf1"}).stroke('black').attr({x: 1})
        group.add(bar);
        group.add(thumb);
        let state = "idle"
        let stateEvent = null;
        let thumbEvent = null;


        thumb.mouseover(function () {
            if(state == "idle"){
                state = "hover";
                thumb.fill("#D5F5E3")
                transition();
            }
        })

        thumb.mousedown(function () {
            if(state == "hover"){
                state = "pressed";
                thumb.fill("#006666")
                transition()
            }
        })

        thumb.mouseout(function (){
            if(state =="hover"){
                state = "idle";
                thumb.fill("#eafaf1")
                transition();
            }
            else if(state === "pressed"){
                state = "idle";
                thumb.fill("#eafaf1")
                transition();
            }
        })

        thumb.mousemove(function (e) {
            if(state == "pressed"){
                let previous = thumb.cy()
                let after = e.offsetY;
                if((thumb.attr('height') + thumb.attr('y')) == bar.attr('y') + bar.attr('height')) {
                    if(previous-after < 0){
                        return;
                    }
                    else
                    {
                        thumb.cy(e.offsetY)
                        if(thumbEvent!= null){
                            thumbEvent({"event": e, "direction": "up" });
                        }
                    }
                }
                else if(thumb.attr('y') <= bar.attr('y')) {
                    if(previous-after > 0){
                        return;
                    }
                    else
                    {
                        thumb.cy(e.offsetY)
                        if(thumbEvent!= null){
                            thumbEvent({"event": e, "direction": "down" });
                        }
                    }
                }
                else {
                    thumb.cy(e.offsetY);
                    if(thumbEvent!= null){
                        let direction = "none"
                        if(previous-after > 0){
                            direction  = "up"
                        }
                        else if(previous-after < 0) {
                            direction = "down"
                        }
                        thumbEvent({"event": e, "direction": direction });
                    }
                }

            }
        })
        function transition() {
            if(stateEvent != null){
                stateEvent(state)
            }
        }
        return {
            move: function(x,y) {
                group.move(x,y)
            },
            stateChange: function(eventHandler){
                stateEvent = eventHandler;
            },
            thumbChange: function (eventHandler){
                thumbEvent = eventHandler
            },
            setHeight: function (h) {
                bar.attr({'height': h})
            },
            getPosition: function () {
                return thumb.cy()
            }

        }
    }

    /**
     * NumberBox widget that allows for going up and down number.
     * @param {int} min - mininum that the number can go to.
     * @param {int} max - maximum that the number can go to.
     * @returns {{getNumber: (function(): number), move: move, numChange: numChange, stateChange: stateChange}}
     * @constructor
     */
    var NumberBox = function (min, max) {
        let group = draw.group()
        let rect = draw.rect(35,35).fill("white").stroke("black");
        let up = draw.polygon("28 7, 32 14, 24 14").fill("#D4EFDF").stroke("black");
        let down = draw.polygon("28 27, 32 19, 24 19").fill("#D4EFDF").stroke("black");
        let num = draw.text(min.toString())
        group.add(rect);
        group.add(up);
        group.add(down);
        group.add(num);
        let stateEvent = null;
        let changeEvent = null;
        let state = "idle";

        up.mouseover(function(event) {
            if(state == "idle"){
                state = "hover up";
                up.fill('#006666')
                transition()
            }
        })

        up.mouseout (function (event) {
            if(state == "hover up"){
                state = "idle";
                up.fill("#D4EFDF");
                transition();
            }
        })

        up.mousedown(function (event) {
            if(state == "hover up") {
                let current = parseInt(num.text());
                if(current < max) {
                    num.text((current + 1).toString())
                    if(changeEvent != null){
                        changeEvent({"event": event, "current": current+1})
                    }
                }
            }
        })

        down.mouseover(function (event) {
            if(state == "idle"){
                state = "hover down";
                down.fill('#006666')
                transition()
            }
        })

        down.mouseout(function (event) {
            if(state == "hover down"){
                state = "idle";
                down.fill("#D4EFDF");
                transition();
            }
        })

        down.mousedown(function (event) {
            if(state == "hover down") {
                let current = parseInt(num.text());
                if(current > min) {
                    if(changeEvent != null){
                        changeEvent({"event": event, "current": current-1})
                    }
                    num.text((current - 1).toString())
                }

            }
        })

        function transition() {
            if(stateEvent != null){
                stateEvent(state)
            }
        }

        return {
            move: function (x,y){
                group.move(x,y);
            },
            getNumber: function () {
                return parseInt(num.text());
            },
            stateChange: function (eventHandler) {
                stateEvent = eventHandler;
            },
            numChange: function (eventHandler) {
                changeEvent = eventHandler;
            }
        }
    }

    return {Button, CheckBox, RadioButton, TextBox, ProgressBar, ScrollBar, NumberBox}
}());

export{MyToolkit}