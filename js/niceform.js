/*!
 * formBeauty JavaScript Library v1.0 *
 *
 * Released under the MIT license
 *
 * Date: Mon Jan 13 2014 19:20:33 GMT-0530 (Eastern Standard Time)
 */

(function($) {
    $.fn.niceform = function(options) {
        var settings = {
            placeholder: {
                text: 'Enter text...',
                password: 'Password...',
                color: '#ededed',
                date: 'mm/dd/yy',
                email: 'example@abc.com',
                number: 'enter your age',
                tel: 'Enter telephone number'
            }
        };
        var opts = $.extend({}, settings, options);
        //html5 support check
        var isAttrSupport = function(tag, attr) {
            if ((!tag || typeof tag === 'undefined') || (!attr || typeof attr === 'undefined')) {
                return false;
            }
            var element = document.createElement(tag);
            return attr in element;
        };
        
        var select = function(obj) {
            obj.addClass('niceFormHide');
            var
                    selectDivObj = obj.parent().append('<div class="select"></div>').find('div.select'),
                    selectDivOptionObj = selectDivObj.append('<span class="optionText"></span><div class="option"></div><div class="arrow-down"></div>').find('div.option');
            selectDivOptionObj.siblings('.optionText').text($('option:selected', obj).text());
            var optionText = function() {
                var arr = [];
                obj.find('option').each(function() {
                    arr.push($(this).text());
                });
                return arr;
            };
            var ListElement = $('<ul />');
            for (var i = 0; i < optionText().length; i++) {
                ListElement.append('<li>' + optionText()[i] + '</li>');
            }
            selectDivOptionObj.append(ListElement);
            ListElement.find('li').click(function() {
                $(this).parents('div.select').find('span.optionText').text($(this).text());
                obj.prop('selectedIndex', $(this).index());
            });
            selectDivObj.on('click', function() {
                var
                        $this = $(this),
                        showOption = true;
                if ($this.find('.option').is(':visible')) {
                    showOption = false;
                }
                $('.option').hide();
                $('.arrow-up').removeClass('arrow-up').addClass('arrow-down');
                if (!showOption) {
                    $this.find('.option').hide('fast');
                    $this.find('.arrow-down').removeClass('arrow-up').addClass('arrow-down');
                    return;
                }
                $this.find('.option').slideDown('fast');
                $this.find('.arrow-down').removeClass('arrow-down').addClass('arrow-up');
            });
        };//select end
        var radio = function(obj) {
            obj.addClass('niceFormHide');
            var radioDivObj = obj.parent().append('<div class="radio"></div>').find('.radio');
            radioDivObj.click(function() {
                $('.radio').removeClass('checked');
                $(this).addClass('checked').siblings(':radio').prop('checked', true);
            });
        };
        var checkbox = function(obj) {
            obj.addClass('niceFormHide');
            var checkboxDivObj = obj.parent().append('<div class="checkbox"></div>').find('.checkbox');

            checkboxDivObj.click(function() {
                if ($(this).hasClass('checked')) {
                    $(this).removeClass('checked').siblings(':checkbox').prop('checked', false);
                    return;
                }
                $(this).addClass('checked').siblings(':checkbox').prop('checked', true);
            });
        };
        var file = function(obj) {
            obj.addClass('niceFormHide');
            var fileDivObj = obj.parent().append('<div class="fileButton">Choose the file Name</div>').find('.fileButton');
            fileDivObj.click(function() {
                obj.trigger('click');
            });
            obj.change(function() {
                var selectedFile = obj.get(0).files[0];
                var fileUrl = window.URL.createObjectURL(selectedFile);
                obj.parent().append('<div class="browseImageBox"><img src="' + fileUrl + '" alt="' + fileUrl + '"></div>');
            });
        };

        var placeHolder = function(obj) {
            if (typeof obj.attr('placeholder') !== 'undefined' && obj.attr('placeholder') !== '') {
                return false;
            }
            switch (obj.attr('type')) {
                case 'text':
                    ph = opts.placeholder.text;
                    break;
                case 'password':
                    ph = opts.placeholder.password;
                    break;
                case 'color':
                    ph = opts.placeholder.color;
                    break;
                case 'date':
                    ph = opts.placeholder.date;
                    break;
                case 'email':
                    ph = opts.placeholder.email;
                    break;
                case 'tel':
                    ph = opts.placeholder.tel;
                    break;
                case 'number':
                    ph = opts.placeholder.number;
                    break;
            }
            if (isAttrSupport('input', 'placeholder')) {
                obj.attr('placeholder', ph);
            } else {
                obj.attr({
                    'value': ph,
                    'data-ph': ph
                });
                obj.on('focus', function() {
                    if (obj.val() === obj.data('ph')) {
                        obj.val('');
                    }
                }).on('blur', function() {
                    if (obj.val() === '') {
                        obj.val(obj.data('ph'));
                    }
                });
            }
        };
        var initFormBeauty = function(obj) {
            obj.each(function() {
                var
                        $this = $(this),
                        elementContainer = $this.children('input, select, :radio, :checkbox').wrap('<div class="niceFormWrapper"></div>').parent(),
                        inputElement = $this.find('input'),
                        selectElement = $this.find('select'),
                        radioElement = $this.find(':radio'),
                        checkElement = $this.find(':checkbox'),
                        fileElement = $this.find(':file');

                if (inputElement.attr('type') !== 'radio' && inputElement.attr('type') !== 'checkbox' && inputElement.attr('type') !== 'submit' && inputElement.attr('type') !== 'reset' && inputElement.attr('type') !== 'button') {
                    placeHolder(inputElement);
                }
                if (selectElement) {
                    select(selectElement);
                }
                if (checkElement) {
                    checkbox(checkElement);
                }
                if (radioElement) {
                    radio(radioElement);
                }
                if (fileElement) {
                    file(fileElement);
                }
            });
        };

        return this.each(function() {
            var $this = $(this);
            $this.find(':reset').click(function() {
                $this.find('.checked').removeClass('checked');
                $this.find('.optionText').each(function() {
                    $(this).text($(this).parent().siblings('select').find('option').first().text());
                });
                $this.find('.browseImageBox').html('');
            });
            initFormBeauty($this.find('.form-row'));
        });
    };
})(jQuery);