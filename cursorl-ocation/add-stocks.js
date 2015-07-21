(function($) {

    // keycode
    var KEY_ENTER = 13;
    var KEY_UP = 38;
    var KEY_DOWN = 40;
    var KEY_SPACE = 32;
    var KEY_CANCEL = 8;
    var KEY_PRESS_INTERVAL = 200; // 按键间隔（毫秒）用来触发搜索

    //由于恒生暂时不支持中文
    var valReg = /[^a-z0-9]+/gi;

    var preventDefault = function(event) {
        if (event && event.preventDefault)
            event.preventDefault();
        else
            window.event.returnValue = false;
        return false;
    };

    var StocksBox = (function() {

        var $stocksBoxCopy = $(
            '<div class="widget-stocks-container">' +
            '<div class="stocks-box-title">请输入您要添加的股票代码/首字母</div>' +
            '<ul class="stocks-box-list"></ul>' +
            '</div>' +
            '<div class="widget-to-location">' +
            '<span data-before></span>' +
            '<span data-flag>$</span>' +
            '<span data-after></span>' +
            '</div>'
        );

        var fixPosition = function($self, val) {
            var tWidth = $self.outerWidth();
            var tHeight = $self.outerHeight();
            var tPos = $self.offset();
            var tpadTop = $self.css('padding-top');
            var tpadLeft = $self.css('padding-left');
            var move2Top = tPos.top + tHeight;
            var move2Left = tPos.left;
            var widget2Location = $('.widget-to-location');

            tVal = val.replace(/\n/g, "<br/>");
            splitVal(tVal, widget2Location);

            widget2Location.css({
                'width': tWidth,
                'height': tHeight,
                'top': move2Top,
                'left': move2Left,
                'padding-top': tpadTop,
                'padding-left': tpadLeft
            });

            var lastSpan = widget2Location.find('span[data-flag]');
            var lastSpanPos = lastSpan.offset();

            $('.widget-stocks-container').css({
                left: (lastSpanPos.left + 20) + 'px',
                top: (lastSpanPos.top - tHeight + 30) + 'px'
            });
        }

        var stocksSearch = function(searchVal, $searchList) {
            var trueSearchVal = searchVal.replace(valReg, '');
            var wizard = new HsDataFactoryList['wizard']({
                prod_code: trueSearchVal,
                en_finance_mic: 'SS,SZ'
            });
            wizard.onDataReady(function(data) {

                updateSearch(data, $searchList)

            }).init()
        }

        var updateSearch = function(data, $searchList) {
            $searchList.empty();
            for (var i = 0; i < data.length; i++) {
                var codeGroup = data[i]['prod_code'].split('.');
                if (codeGroup[1].toUpperCase() == 'SS') {
                    codeGroup[1] = 'SH'
                }
                $searchList.append('<li class="stocks-box-item">' + data[i]['prod_name'] + '(' + codeGroup[1] + codeGroup[0] + ')' + '</li>');
            }
        }

        var searchListScroll = function(isDown, $searchListContainer, $searchList) {
            var scrollTop = $searchListContainer.scrollTop();
            var viewMin = scrollTop;
            var viewMax = viewMin + $searchListContainer.height();

            var $target = $searchList.children('li.active');
            var deltaOffset = $target.offset().top - $searchListContainer.offset().top + scrollTop;
            isDown && (deltaOffset += $target.height());

            // deltaOffset要在视窗范围里
            if (deltaOffset > viewMax) {
                $searchListContainer.scrollTop(scrollTop + deltaOffset - viewMax)
            } else if (deltaOffset < viewMin) {
                $searchListContainer.scrollTop(scrollTop - (viewMin - deltaOffset))
            }
        };

        var searchListScrollPrev = function($searchListContainer, $searchList) {
            var $cur = $searchList.children('li.active');
            $cur.removeClass && $cur.removeClass('active');

            if ($cur.length == 0 || $cur.index() == 0) {
                $searchList.children('li').last().addClass('active');
                searchListScroll(true, $searchListContainer, $searchList);
            } else {
                $searchList.children('li').eq($cur.index() - 1).addClass('active');
                searchListScroll(false, $searchListContainer, $searchList);
            }
        };

        var searchListScrollNext = function($searchListContainer, $searchList) {
            var $cur = $searchList.children('li.active');
            $cur.removeClass && $cur.removeClass('active');

            if ($cur.length == 0 || $cur.index() == $searchList.children().length - 1) {
                $searchList.children('li').first().addClass('active');
                searchListScroll(false, $searchListContainer, $searchList);
            } else {
                $searchList.children('li').eq($cur.index() + 1).addClass('active');
                searchListScroll(true, $searchListContainer, $searchList);
            }
        };

        var searchSchoolChosen = function($searchList) {
            // 转向click event
            $searchList.children('li.active').click();
        };

        var splitVal = function(val, target) {
            var valArr = val.split('$');
            var strBefore = valArr.slice(0, valArr.length - 1).join('$');
            var strAfter = valArr.slice(-1);
            target.find('span[data-before]').html(strBefore)
            target.find('span[data-after]').html(strAfter);
        }


        var init = function(instance) {
            // 生成元素
            var $parent = $(instance.opts.appendTo);
            $parent.append($stocksBoxCopy.clone());

            var timeClock; //计时器
            // 记录上次搜索输入的timestamp

            var widget2Location = $('.widget-to-location');
            var $searchListContainer = $parent.find('.widget-stocks-container');
            var $searchList = $parent.find('.stocks-box-list');
            var $spanFlag = widget2Location.find('span[data-flag]');
            var $spanAfter = widget2Location.find('span[data-after]');

            //click事件
            $(document).on('click', '.stocks-box-item', function(event) {
                var val = $('.widget-focus').val();
                var originalVal = widget2Location.find('[data-before]').html();
                var addVal = $(this).text();
                $('.widget-focus').val(originalVal + '$' + addVal + '$ ').focus();
                $searchListContainer.hide();
                $spanFlag.attr('data-flag', 'false');
            })

            //hover事件
            $(document).on('mouseover mouseout', '.stocks-box-item', function() {
                if (event.type == "mouseover") {
                    $(this).addClass('active');
                } else if (event.type == "mouseout") {
                    $(this).removeClass('active');
                }
            })


            //按键事件
            $parent.on('keyup', '[widget-add-stocks]', function(event) {
                //通过widget-focus类判断对象 
                $('[widget-add-stocks]').removeClass('widget-focus');
                $(this).addClass('widget-focus');

                clearTimeout(timeClock);

                var val = $(this).val();
                var lastVal = val.substr(-1);
                var $self = $(this);
                if (lastVal === '$') {
                    fixPosition($self, val);
                    $searchListContainer.show();
                    $searchList.empty();
                    splitVal(val, widget2Location);
                    $spanFlag.attr('data-flag', 'true');
                }

                if ($spanFlag.attr('data-flag') == 'true') {
                    // 特殊按键（动作键）
                    switch (event.keyCode) {
                        case KEY_ENTER:
                            searchSchoolChosen($searchList);
                            return preventDefault(event);
                            break;
                        case KEY_UP:
                            searchListScrollPrev($searchListContainer, $searchList);
                            return preventDefault(event);
                            break;
                        case KEY_DOWN:
                            searchListScrollNext($searchListContainer, $searchList);
                            return preventDefault(event);
                            break;
                        case KEY_SPACE:
                            $searchListContainer.hide();
                            $spanFlag.attr('data-flag', 'false');
                            $searchList.empty();
                            break;
                            // case KEY_CANCEL:
                            //     $searchListContainer.hide();
                            //     $spanFlag.attr('data-flag', 'false');
                            //     $searchList.empty();
                            //     break;
                        default:
                            break;
                    }

                    splitVal(val, widget2Location);
                    var spanAfterVal = $spanAfter.text();

                    // NOTE: 持续快速输入时不触发搜索
                    timeClock = setTimeout(function() {
                        spanAfterVal.length >= 2 && stocksSearch(spanAfterVal, $searchList);
                    }, 300)
                }

            });

        };

        // ***************
        // 
        // ***************
        return function(options) {
            // 默认配置
            this.opts = $.extend({
                appendTo: 'body',
            }, options);

            // 即popup效果
            // if (this.opts.appendTo === 'body') {
            //     this.opts.popup = true;
            // }

            // 自定义事件观察者
            this.handlers = {};

            // 初始化生成
            init(this);
            // this.init();
        };
    })();


    // *********
    // 对外API
    // *********
    StocksBox.prototype = {
        // init: function() {
        //     // popup时初始化隐藏
        //     if (this.opts.popup) {
        //         // $(this.opts.appendTo).find('.widget-stocks-container').addClass('school-box-hide');
        //     }
        // },
        show: function(self) {
            var targetTextarea = self.closest('div').find('[widget-add-stocks]');
            var val = targetTextarea.val();
            targetTextarea.focus().val(val + '$').keyup();
        },
        // hide: function() {
        //     $(this.opts.appendTo).find('.widget-stocks-container')
        //         .addClass('hide');
        // }
    };

    // export
    window.StocksBox = StocksBox;

})(jQuery);
