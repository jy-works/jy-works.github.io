/*
Copyright (c) 2011, STRAIGHTLINE All rights reserved.
*/

/* 
---------------------------------------------------------------------------------------------------
    Extra Init
---------------------------------------------------------------------------------------------------
*/
var ExtraInit = new Class({
	Implements: [Options,Events],
    resizeTimer: null,
    scrollTimer: null,
    wrapper: null,
    content: null,
    contentInner: null,
    bottomNavHeight: null,
    globalArea: null,
    newsContainer: null,
    featuresContainer: null,
    options: {
        onSizeChanged: function() {}
    },
    initialize: function(options) {
        this.setOptions(options);
        this.wrapper = $('wrapper');
    },
    
    run: function() {
        $$('#global-nav .en, #footer-nav .en, #content-title .en').each(function(en) {
            en.set('text', en.get('text').replace(/\-/g, ' '));
        });
        
        $('global-nav').getElements('li').each(function(li) {
            var anchor = li.getElement('a');
            var ja = li.getElement('.ja');
            var en = li.getElement('.en');
            var text = li.getElement('.en-ja');
            var textInner = li.getElement('.en-ja-inner');
            text.setStyles({
                display: 'block',
                overflow: 'hidden',
                height: en.getSize().y
            });
            
            textInner.setStyles({
                display: 'block'
            });
            
            anchor.setStyles({
                height: anchor.getComputedSize().height
            });
            
            var fx = new Fx.Tween(text, {
                property: 'height',
                transition: 'expo:out',
                link: 'cancel'
            });
            var fxInner = new Fx.Tween(textInner, {
                property: 'margin-top',
                transition: 'expo:out',
                link: 'cancel'
            });
            anchor.addEvents({
                mouseenter: function() {
                    fx.start(ja.getSize().y);
                    fxInner.start(- en.getSize().y);
                }.bind(this),
                mouseleave: function() {
                    fx.start(en.getSize().y);
                    fxInner.start(0);
                }.bind(this)
            });
        }.bind(this));
        
        $$('#global-nav .global-nav-main li a').each(function(a) {
            var fx = new Fx.Tween(a, {
                property: 'background-color',
                transition: 'expo:out',
                link: 'cancel'
            });
            a.addEvents({
                mouseenter: function() {
                    fx.start('#ff0');
                },
                
                mouseleave: function() {
                    fx.start('#fff');
                }
            });
        });
        
        var header = $('header');
        var content = $('content');
	var contentIndex = $('content_index');
        var pageTop = $(document.body).getElement('.page-top');
        if (header && content && pageTop) {
            var headerHeight = header.getSize().y;
            var contentHeight = content.getSize().y;
            if (headerHeight > contentHeight) {
                pageTop.setStyle('margin-top', pageTop.getStyle('margin-top').toInt() + headerHeight - contentHeight);
            }
        }
        
        $$('#title, .link-kanra').each(function(element) {
            var fx = new Fx.Tween(element.getElement('a'), {
                property: 'opacity',
                duration: 300,
                transition: 'expo:out',
                link: 'cancel'
            });
            element.addEvents({
                mouseenter: function() {
                    fx.start(0.7);
                },
                mouseleave: function() {
                    fx.start(1);
                }
            });
        });
        
        var contentTitle = $('content-title');
        if (contentTitle) {
            $('title').getElement('a').setStyle('height', contentTitle.getSize().y);
        }
        
        var mmIcon = $('mm-product-icon');
        if (mmIcon) {
            var mm = $('mm-product');
            var mmInner = $('mm-product-inner');
            mmInner.setStyle('opacity', 0);
            var iconMorph = new Fx.Morph(mmIcon, {
                duration: 1000,
                link: 'cancel'
            });
            var morph = new Fx.Morph(mm, {
                duration: 1000,
                transition: 'expo:out',
                link: 'cancel'
            });
            var iconTop = mmIcon.getStyle('top').toInt();
            var iconLeft = mmIcon.getStyle('left').toInt();
            var iconWidth = mmIcon.getSize().x;
            var iconHeight = mmIcon.getSize().y;
            var width = mm.getSize().x;
            var height = mm.getSize().y;
            var left = mm.getStyle('left').toInt();
            var right = left + width;
            var timer = null;
            mm.addEvents({
                mouseenter: function() {
                    if ($(document.body).hasClass('narrow')) {
                        return;
                    }
                    clearTimeout(timer);
                    iconMorph.start({
                        top: height / 2 - iconHeight * 2,
                        left: iconLeft + (width * 2) / 2
                    });
                    morph.start({
                        width: width * 3,
                        left: left - (width * 3) / 2
                    }).chain(
                        function() {
                            mmInner.set('tween', {
                                property: 'opacity',
                                duration: 500,
                                link: 'cancel'
                            }).get('tween').start(1);
                        }
                    );
                },
                mouseleave: function() {
                    if ($(document.body).hasClass('narrow')) {
                        return;
                    }
                    timer = (function() {
                        mmInner.set('tween', {
                            property: 'opacity',
                            duration: 0,
                            link: 'cancel'
                        }).get('tween').start(0);
                        iconMorph.start({
                            top: iconTop,
                            left: iconLeft
                        });
                        morph.start({
                            width: width,
                            left: left
                        });
                    }).delay(500);
                }
            });
            var resize = function() {
                if (getWindowSize().x < right) {
                    mmInner.set('tween', {
                        property: 'opacity',
                        duration: 500,
                        link: 'cancel'
                    }).get('tween').start(1);
                    $(document.body).addClass('narrow');
                } else {
                    mmInner.set('tween', {
                        property: 'opacity',
                        duration: 0,
                        link: 'cancel'
                    }).get('tween').start(0);
                    $(document.body).removeClass('narrow');
                }
            };
            window.addEvents({
                resize: function() {
                    clearTimeout(this.resizeTimer);
                    this.resizeTimer = (function() {
                        resize();
                    }.bind(this)).delay(200);
                }.bind(this)
            });
            resize();
        }
        
        $('wrapper').tween('opacity', 1);
    }
    
});


/* 
---------------------------------------------------------------------------------------------------
    Extra Load CSS
---------------------------------------------------------------------------------------------------
*/
var ExtraLoadCSS = new Class({
	Implements: [Options,Events],
    options: {
        css: new Array()
    },
    initialize: function(options) {
        this.setOptions(options);

        var cssContainer = new Element('div', {
            styles: {
                position: 'fixed',
                top: 0,
                left: 0
            }
        });
        this.options.css.each(function(css, index) {
            var cssNo = new Element('span', {
                text: index + 1,
                styles: {
                    display: 'inline-block',
                    cursor: 'pointer',
                    padding: '5px'
                },
                events: {
                    click: function() {
                        Asset.css(css + '?' + (new Date()).getTime());
                    }
                }
            });
            cssContainer.adopt(cssNo);
        });
        
        $(document.body).adopt(cssContainer);
    }
});

/* 
---------------------------------------------------------------------------------------------------
    Extra News
---------------------------------------------------------------------------------------------------
*/
var ExtraNews = new Class({
	Implements: [Options,Events],
    resizeTimer: null,
    postTitles: new Array(),
    options: {
    },
    initialize: function(options) {
        this.setOptions(options);
        $$('#global-area .category-news .post-title').each(function(postTitle) {
            postTitle.setStyle('display', 'none');
        });
    },
    
    run: function() {
        this.postTitles = $$('#global-area .category-news .post-title');
        (function() {
            this.postTitles.each(function(postTitle, index) {
                (function() {
                    var postThumbnail = postTitle.getParent('.post-section').getElement('.post-thumbnail');
                    if (postThumbnail) {
                        postTitle.setStyles({
                            width: postThumbnail.getSize().x,
                            top: postThumbnail.getSize().y,
                            display: 'block'
                        });
                        new Fx.Tween(postTitle, {
                            property: 'top',
                            duration: 500,
                            transition: 'expo:out',
                            onComplete: function() {
                                postTitle.store('defaultTop', postTitle.getCoordinates($('wrapper')).top);
                            
                                if (index + 1 == this.postTitles.length) {
                                    window.addEvents({
                                        resize: function() {
                                            clearTimeout(this.resizeTimer);
                                            this.resizeTimer = (function() {
                                                this.adjust.apply(this);
                                            }.bind(this)).delay(200);
                                        }.bind(this),
                                        scroll: function() {
                                            this.adjust.apply(this);
                                        }.bind(this)
                                    });
                                    this.adjust.apply(this);
                                }
                            }.bind(this)
                        }).start(postThumbnail.getSize().y - postTitle.getSize().y + postTitle.getParent('.post-section').getStyle('padding-top').toInt());
                    }
                }.bind(this)).delay(100 * index);
            }.bind(this));
        }.bind(this)).delay(1000);
    },
    
    adjust: function(animation) {
        var top = window.getScrollTop();
        var bottom = top + window.getSize().y;
        this.postTitles.each(function(postTitle, index) {
            var postTitleTop = postTitle.retrieve('defaultTop');
            postTitle.set('tween', {
                property: 'margin-top',
                duration: 500,
                transition: 'expo:out',
                link: 'cancel'
            });
            if (postTitleTop + postTitle.getSize().y > bottom) {
                postTitle.get('tween').start(- (postTitleTop - bottom + postTitle.getSize().y));
            } else {
                postTitle.get('tween').start(0);
            }
        }.bind(this));
    }
});
