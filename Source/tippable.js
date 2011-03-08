/*
---

name: tippable

description: tippable, a quick fly-in, fly-out tooltip for mootols 1.3

author: Dimitar Christoff

license: MIT-style license.

version: 0.9

requires:
  - Core/String
  - Core/Event
  - Core/Element
  - Core/Element.Dimensions

provides: this.tippable

...
*/

this.tippable = new Class({

    Implements: [Options, Events],

    options: {
        // NB: these are zen classes for Slick
        tipClass: "div.tippable",
        text: "",
        textClass: "div.body",
        title: "",
        titleClass: "div.title",
        topOffset: 110, // where it stops above the element
        topOffsetStart: 160, // where the animation starts from.
        leftOffset: false, // if false, center over element, else, integer
        // Fx class options
        fx: {
            duration: 400,
            link: "cancel"
        }
    },

    initialize: function(element, options) {
        // public instantiation

        this.setOptions(options);
        this.element = document.id(element);
        if (!this.element)
            return;

        this.attachTip();
    },

    attachTip: function() {
        // call creation and events addition
        this.createTip();
        this.attachEvents();
    },

    createTip: function() {
        // add tip to dom and set initials

        // first event will be onShow
        this.event = "show";
        this.tip = new Element(this.options.tipClass, {
            styles: {
                opacity: 0
            }
        }).set("morph", Object.merge(this.options.fx, {
            onComplete: function() {
                this.fireEvent(this.event);
            }.bind(this)
        }));

        // store title
        this.title = new Element("div.title").inject(this.tip);

        // tip body
        this.body = new Element("div.body").inject(this.tip);

        // append to DOM
        this.tip.inject(this.element, "top");

        // store instance into the tip element for event use!
        this.tip.store("tippable", this);

        // set initial title and body values
        this.setTitle(this.options.title);
        this.setHTML(this.options.text);

        // now to position element
        if (this.options.leftOffset === false) {
            var tipWidth = this.tip.getSize().x, elWidth = this.element.getSize().x;
            this.tip.setStyle("marginLeft", (elWidth - tipWidth) / 2);
        }
        else {
            this.tip.setStyle("marginLeft", this.options.leftOffset);
        }

    }, // end createTip

    setTitle: function(what) {
        // set the title content public api
        if (what.length) {
            this.title.set("html", what);
        }
    },

    setHTML: function(what) {
        // set body content public api
        this.body.set("html", what);
    },

    attachEvents: function() {
        // private
        this.element.addEvents({
            mouseenter: this.showTip.bind(this),
            mouseleave: this.hideTip.bind(this)
        });
    },

    showTip: function() {
        // triggered on mousenter or called direct

        // fire onBeforeShow
        this.fireEvent("beforeShow");

        // next event will be onShow through morph onComplete
        this.event = "show";

        // animate properties
        this.tip.morph({
            marginTop: [-this.options.topOffsetStart, -this.options.topOffset],
            opacity: [0, 1]
        });

    }, // end showTip

    hideTip: function() {
        // triggered on mouseleave ot called direct

        // fire onBeforeHide
        this.fireEvent("beforeHide");

        // next morph event will be hide
        this.event = "hide";

        // hide animation
        this.tip.morph({
            marginTop: -this.options.topOffsetStart,
            opacity: [1, 0]
        });

    } // end hideTip

}); // end tippable class