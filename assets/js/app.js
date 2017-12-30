'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
	'use strict';
	// polyfill for IE

	(function (e) {
		e.matches || (e.matches = e.matchesSelector || function (selector) {
			var matches = document.querySelectorAll(selector),
			    th = this;
			return Array.prototype.some.call(matches, function (e) {
				return e === th;
			});
		});
		e.closest = e.closest || function (css) {
			var node = this;

			while (node) {
				if (node.matches(css)) return node;else node = node.parentElement;
			}
			return null;
		};
		if (!Array.from) {
			Array.from = function () {
				var toStr = Object.prototype.toString;
				var isCallable = function isCallable(fn) {
					return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
				};
				var toInteger = function toInteger(value) {
					var number = Number(value);
					if (isNaN(number)) {
						return 0;
					}
					if (number === 0 || !isFinite(number)) {
						return number;
					}
					return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
				};
				var maxSafeInteger = Math.pow(2, 53) - 1;
				var toLength = function toLength(value) {
					var len = toInteger(value);
					return Math.min(Math.max(len, 0), maxSafeInteger);
				};

				return function from(arrayLike) {
					var C = this;
					var items = Object(arrayLike);

					if (arrayLike == null) {
						throw new TypeError('Array.from requires an array-like object - not null or undefined');
					}
					var mapFn = arguments[1];
					if (typeof mapFn !== 'undefined') {
						mapFn = arguments.length > 1 ? arguments[1] : void undefined;

						if (!isCallable(mapFn)) {
							throw new TypeError('Array.from: when provided, the second argument must be a function');
						}

						if (arguments.length > 2) {
							var T = arguments[2];
						}
					}

					var len = toLength(items.length);

					var A = isCallable(C) ? Object(new C(len)) : new Array(len);

					var k = 0;
					var kValue;
					while (k < len) {
						kValue = items[k];
						if (mapFn) {
							A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
						} else {
							A[k] = kValue;
						}
						k += 1;
					}
					A.length = len;
					return A;
				};
			}();
		}
	})(Element.prototype);
})();
// **********************************************************************************
'use strict';
function getElement(elem) {
	return document.querySelector(elem);
};

function getAllElements(elem) {
	return document.querySelectorAll(elem);
};

// **********************************************************************************
var switchDisplay = function () {
	// add as argument css-selector of DOM element that you need to toggle display
	// example switchDisplay.toggleDisplay('.css-selctor')
	var elem = null;
	function toggleDisplay() {
		for (var i = 0; i < arguments.length; i++) {
			elem = document.querySelector(arguments[i]);
			var styles = getComputedStyle(elem);
			if (styles.display === 'block') {
				elem.style.display = 'none';
			} else {
				elem.style.display = 'block';
			}
		}
	};

	return {
		toggleDisplay: toggleDisplay
	};
}();

// **********************************************************************************

var toggleElementAtAnyPoint = function () {
	function toggleElementAtAnyPoint(selector, func) {
		_classCallCheck(this, toggleElementAtAnyPoint);

		this.elem = selector;
		this.func = func;
	}

	_createClass(toggleElementAtAnyPoint, [{
		key: 'addWindowEventListener',
		value: function addWindowEventListener() {
			var that = this;
			setTimeout(function () {
				window.addEventListener('click', function handleClose(e) {
					if (!e.target.closest(that.elem)) {
						that.func();
						window.removeEventListener('click', handleClose);
					}
				});
			});
		}
	}]);

	return toggleElementAtAnyPoint;
}();

// **********************************************************************************


var commonModal = function () {

	var curtain = getElement('.curtain');

	// example of parametrs (element, '50%', '-100%', closeBtn)
	function toggleModal(elem, plus, minus, btn) {
		var topPos = elem.style.top;
		var positionOfModal = topPos;

		if (positionOfModal < plus) {
			elem.style.top = plus;
			offScroll();
			// window.addEventListener('scroll', offScroll);
		} else {
			elem.style.top = minus;
			offScroll();
			// window.removeEventListener('scroll', offScroll);
		}
		switchDisplay.toggleDisplay('.curtain');
		btn.addEventListener('click', function () {
			toggleModal(elem, plus, minus, btn);
		});
	}

	function offScroll() {
		var styles = getComputedStyle(document.body);
		var overflow = styles.overflow;
		if (overflow !== "hidden") {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	}

	return {
		toggleModal: toggleModal
	};
}();
"use strict";

var intlTelRequire = function () {

    var init = function init() {
        _setUpListeners();
    };

    var _setUpListeners = function _setUpListeners() {
        $("#phone").intlTelInput({
            initialCountry: "auto",
            geoIpLookup: function geoIpLookup(callback) {
                $.get("https://ipinfo.io", function () {}, "jsonp").always(function (resp) {
                    var countryCode = resp && resp.country ? resp.country : "";
                    callback(countryCode);
                    var phone1 = getElement('#phone');
                    var phone2 = getElement('#phone-2');
                    var orderPhone = getElement('#order-phone');
                    if (phone1) {
                        replaceLabelAndValidate('#phone', '.recall__form', '.recall__input-wrap');
                    }
                    if (phone2) {
                        replaceLabelAndValidate('#phone-2', '.services__form', '.form__input-wrap');
                    }
                    if (orderPhone) {
                        replaceLabelAndValidate('#order-phone', '.order__form', '.form__input-wrap');
                    }
                });
            },
            separateDialCode: true
        });
        $("#phone-2").intlTelInput({
            initialCountry: "auto",
            separateDialCode: true
        });
        $("#order-phone").intlTelInput({
            initialCountry: "auto",
            separateDialCode: true
        });
    };

    function replaceLabelAndValidate(id, wrap, inputWrap) {
        var wrapper = getElement(wrap);
        var intlTelInputWrap = wrapper.querySelector('.intl-tel-input');
        var inputWrapper = intlTelInputWrap.closest(inputWrap);
        var hiddenInput = inputWrapper.querySelector('input[type="hidden"]');
        var label = inputWrapper.querySelector('label');
        intlTelInputWrap.appendChild(label);

        var telInput = $(id);
        telInput.on("input", function (e) {
            var newValue = e.target.placeholder.replace(/[^0-9\.]/g, '').length;
            $(this).on('keyup', function (e) {
                $(this).val($(this).val().replace(/\D/g, ''));
                if ($(this).val().replace(/\D/g, '').length > newValue) {
                    $(this).val($(this).val().substring(0, newValue));
                }
            });
            var intlNumber = $("#order-phone").intlTelInput("getNumber");
            hiddenInput.value = intlNumber;
        });
    }

    return {
        init: init
    };
}();
intlTelRequire.init();
'use strict';

var addCoutnInput = function () {
  var init = function init() {
    if (wrapInput.length) {
      _setUpListners();
    }
  };
  var _setUpListners = function _setUpListners() {
    document.addEventListener('click', addCount);
  };

  var basketInput = getAllElements('.basket__item-content');
  var countInput = getAllElements('.js-add-count');
  var wrapInput = basketInput.length === 0 ? countInput : basketInput;
  var basketTotalCount = getElement('.basket__total-count');
  function addCount(e) {

    Array.from(wrapInput).forEach(function (item) {
      var input = item.querySelector('input'),
          count = parseFloat(input.value),
          inputBtnUp = item.querySelector('.add-input__btn_up'),
          inputBtnDown = item.querySelector('.add-input__btn_down'),
          startPrice = void 0,
          totalPrice = void 0,
          startPriceValue = void 0,
          totalPriceValue = void 0,
          basketTotalCountValue = void 0,
          basketDeleteBtn = void 0;

      if (item.classList.contains('basket__item-content')) {
        startPrice = item.querySelector('.price-start-js .price__numbers');
        totalPrice = item.querySelector('.price-total-js .price__numbers');
        basketDeleteBtn = item.querySelector('.square-btn');
        startPriceValue = parseFloat(startPrice.innerText);
        totalPriceValue = parseFloat(totalPrice.innerText);
        basketTotalCountValue = parseFloat(basketTotalCount.innerText);
      }

      if (e.target === basketDeleteBtn) {
        setTimeout(function () {
          var inputs = document.getElementsByName('count');
          var count = 0;

          Array.from(inputs).forEach(function (input) {
            count += parseFloat(input.value);
          });
          basketTotalCount.innerText = count;
          console.log(count);
        });
      }

      if (isNaN(input.value) || input.value === '') {
        input.value = 1;
        basketTotalCount.innerText = ++basketTotalCountValue;
        return;
      }

      if (e.target === inputBtnUp) {
        count++;
        input.value = count;

        if (totalPrice) {
          basketTotalCount.innerText = ++basketTotalCountValue;
          totalPrice.innerText = (totalPriceValue + startPriceValue).toFixed(2);
        }
      }

      if (e.target === inputBtnDown) {
        if (count === 1) {
          return;
        }
        count--;
        input.value = count;
        if (totalPrice) {
          basketTotalCount.innerText = --basketTotalCountValue;
          totalPrice.innerText = (totalPriceValue - startPriceValue).toFixed(2);
        }
      }

      if (totalPrice) {
        input.addEventListener('input', function () {
          var inputs = document.getElementsByName('count');
          var inputValue = parseFloat(input.value);
          var count = 0;

          Array.from(inputs).forEach(function (input) {
            if (isNaN(input.value) || input.value === '') {
              count += 0;
              inputValue = 1;
              return;
            };
            count += parseFloat(input.value);
          });
          totalPrice.innerText = (startPriceValue * inputValue).toFixed(2);
          basketTotalCount.innerText = count;
        });
      }
    });
  }

  return {
    init: init
  };
}();

addCoutnInput.init();
'use strict';

var addMessage = function () {
    var init = function init(mes) {
        _setUpListeners(mes);
    };

    var _setUpListeners = function _setUpListeners(mes) {
        controller.add(mes);
    };

    var model = {
        visible: function visible(addedElem, visibleElem) {
            var visible = setTimeout(function () {
                getElement(visibleElem).style.opacity = 1;
                var deleting = setTimeout(function () {
                    var elem = getElement(addedElem);
                    document.body.removeChild(elem);
                    clearTimeout(deleting);
                }, 5000);
                clearTimeout(visible);
            }, 0);
        }
    };

    var view = {
        create: function create(mes) {
            var message = '<div class="message-about">\n                                <div class="message-about__content">' + mes + '</div>\n                            </div>';
            return message;
        }
    };

    var controller = {
        add: function add(msg) {
            document.body.insertAdjacentHTML('afterBegin', view.create(msg));
            model.visible('.message-about', '.message-about__content');
        }
    };

    return {
        init: init
    };
}();
'use strict';

var chat = function () {

    var init = function init() {
        if (chatItem.length > 3) {
            showAllListBntText = showAllListBnt.innerText;
            _setUpListeners();
        }
    };

    var _setUpListeners = function _setUpListeners() {
        setHeightofChatList();
        showAllListBnt.addEventListener('click', showAllList);
    };

    var chat = getElement('.chat');
    var chatList = getElement('.chat__list');
    var chatItem = getAllElements('.chat__item');
    var showAllListBnt = getElement('#show-all-list');
    var showAllListBntText = void 0;
    var chatListHeight = 0;

    function setHeightofChatList() {
        for (var i = 0; i < 3; i++) {
            var styles = getComputedStyle(chatItem[i]);
            var marginBottom = parseFloat(styles.marginBottom);
            chatListHeight += chatItem[i].offsetHeight + marginBottom;
        }
        chatList.style.height = chatListHeight + 'px';
    }

    function showAllList() {
        console.log(showAllListBntText);
        if (chatList.style.height === '100%') {
            chatList.style.height = chatListHeight + 'px';
            showAllListBnt.innerText = showAllListBntText;
        } else {
            showAllListBnt.innerText = showAllListBnt.dataset.lang;
            chatList.style.height = '100%';
        }
    }

    return {
        init: init
    };
}();
chat.init();
'use strict';

if ($('[data-toggle="datepicker"]')) {
    window.addEventListener('load', function () {
        var html = document.querySelector('html');
        var lang = html.lang;
        $('[data-toggle="datepicker"]').datepicker({
            language: lang,
            format: 'dd.mm.yyyy',
            autoHide: true
        });
    });
}
'use strict';

var fileUpLoad = function () {

    var init = function init() {
        var inputWrap = getElement('#fileupload-wrap');
        if (inputWrap) {
            inputWrap.insertAdjacentHTML('afterEnd', '<ul class="files-list"></ul>');
        }

        $('#fileupload').fileupload({
            singleFileUploads: false,
            limitMultiFileUploadSizeOverhead: 2,
            add: function add(e, data) {
                return;
            },
            done: function done(e, data) {
                $('#fileupload').bind('fileuploaddone', function (e, data) {
                    console.log('DONE');
                });
            },
            progressall: function progressall(e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .bar').css('width', progress + '%');
            }
        });
        $('#fileupload').bind('fileuploadadd', function (e, data) {
            var filesList = getElement('.files-list');
            data.files.forEach(function (file) {
                filesList.insertAdjacentHTML('beforeEnd', '<li class="files-list__item">' + file.name + '</li>');
            });
        });
    };

    return {
        init: init
    };
}();
fileUpLoad.init();
'use strict';

var mobNav = function () {

    var init = function init() {
        _setUpListeners();
    };

    var _setUpListeners = function _setUpListeners() {
        mobNavBtnShow.addEventListener('click', function () {
            toggleActive(mobNav);
            offScroll();
        });
        mobNav.addEventListener('click', navAction);
    };

    var mobNavBtnShow = getElement('#mob-nav-trigger');
    var mobNavBtnClose = getElement('.mob-nav__close-btn');
    var mobNav = getElement('.mob-nav');
    var container = void 0;
    var backBtn = void 0;

    function offScroll() {
        var styles = getComputedStyle(document.body);
        var overflow = styles.overflow;
        if (overflow !== "hidden") {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }

    function navAction(e) {
        var mobNavLinks = mobNav.querySelectorAll('a');

        if (e.target === mobNavBtnShow || e.target === mobNavBtnClose) {
            toggleActive(mobNav);
            offScroll();
        }

        Array.from(mobNavLinks).forEach(function (link) {
            if (e.target === link) {
                if (link.nextElementSibling) {
                    container = link.nextElementSibling;
                    backBtn = container.querySelector('.mob-nav__back-btn');
                    link.nextElementSibling.classList.add('active');
                }
            }
        });

        if (e.target === backBtn) {
            var list = container.closest('ul');
            toggleActive(container);
            container = list.closest('div');
            if (container) {
                backBtn = container.querySelector('.mob-nav__back-btn');
            }
        }
    }

    function toggleActive(elem) {
        if (elem.classList.contains('active')) {
            elem.classList.remove('active');
        } else {
            elem.classList.add('active');
        }
    }

    return {
        init: init
    };
}();
mobNav.init();
'use strict';

var modalCommon = function () {
    var init = function init() {
        if (modal) {
            _setUpListeners();
        }
    };

    var _setUpListeners = function _setUpListeners() {
        closeBtn.addEventListener('click', function () {
            switchDisplay.toggleDisplay('.modal-common');
        });
    };

    var modal = getElement('.modal-common');
    var closeBtn = getElement('#close-modal-common');

    return {
        init: init
    };
}();
modalCommon.init();
'use strict';

var modalWindow = function () {

	var init = function init() {
		var block = document.querySelector('main.card-product');
		if (block) {
			_setUpListners();
		}
	};
	var _setUpListners = function _setUpListners() {
		closeModalBtn.addEventListener('click', closeModal);
		showModalBtn.addEventListener('click', showModal);
		slideDisplay.addEventListener('click', showModal);
	};

	var modal = getElement('#js-modal'),
	    closeModalBtn = modal.querySelector('#js-close-btn'),
	    modalImg = modal.querySelector('#js-modal-img'),
	    showModalBtn = getElement('#js-show-btn'),
	    slideDisplay = getElement('#js-slideshow-display');

	function offScroll() {
		var styles = getComputedStyle(document.body);
		var overflow = styles.overflow;
		if (overflow !== "hidden") {
			document.body.style.overflow = "hidden";
			return;
		} else {
			document.body.style.overflow = "";
		}
	}

	function closeModal() {
		modal.style.display = 'none';
		offScroll();
	};

	function showModal() {
		var slideDisplayImg = slideDisplay.querySelector('img');
		var imgSrc = slideDisplayImg.attributes.src.value;
		modal.style.display = 'block';
		modalImg.src = imgSrc;
		document.body.style.overflow = "hidden";
	};

	return {
		init: init
	};
}();
modalWindow.init();
'use strict';

var orderCount = function () {

    var init = function init() {
        if (orderList) {
            _setUpListeners();
        }
    };

    var _setUpListeners = function _setUpListeners() {
        window.addEventListener('DOMContentLoaded', countOrder);
    };

    var orderList = getElement('.order__list');
    var totalHeightOfItems = 0;

    function countOrder() {
        var stylesOfOrderList = getComputedStyle(orderList);
        var heightOfOrderList = parseFloat(stylesOfOrderList.height);
        var items = orderList.querySelectorAll('.order__item');

        Array.from(items).forEach(function (item) {
            var itemHeight = parseFloat(item.offsetHeight);
            totalHeightOfItems += itemHeight;

            if (totalHeightOfItems > heightOfOrderList) {
                orderList.classList.add('order__list_overflow-y');
            }
        });
    }

    return {
        init: init
    };
}();
// orderCount.init();
"use strict";

var owlSlider = function () {

    var init = function init() {
        _setUpListeners();
    };

    var _setUpListeners = function _setUpListeners() {
        window.addEventListener('load', function () {
            $("#js-footer-slider").owlCarousel({
                loop: true,
                nav: true,
                items: 6,
                margin: 10,
                autoplay: true,
                autoplayTimeout: 2000,
                autoplayHoverPause: true,
                responsive: {
                    0: {
                        items: 3
                    },
                    600: {
                        items: 4
                    },
                    1024: {
                        items: 6
                    }
                }
            });
            $(".profile-order__list").owlCarousel({
                loop: false,
                nav: true,
                items: 6,
                margin: 10,
                responsive: {
                    0: {
                        items: 2
                    },
                    350: {
                        items: 2
                    },
                    480: {
                        items: 5
                    },
                    768: {
                        items: 5
                    },
                    1024: {
                        items: 6
                    }
                }
            });
        });
    };

    return {
        init: init
    };
}();
owlSlider.init();
'use strict';

var producParams = function () {

    var init = function init() {
        if (listener) {
            _setUpListeners();
        }
    };

    var _setUpListeners = function _setUpListeners() {
        listener.addEventListener('click', _toggleParams);
    };
    var listener = getElement('#basket-listener');
    var btns = getAllElements('.basket__params');

    function _toggleParams(e) {
        Array.from(btns).forEach(function (btn) {
            if (e.target === btn) {
                e.preventDefault();
                var wrap = btn.parentNode;
                var paramsList = wrap.querySelector('.card-product__info');
                var paramsItems = paramsList.querySelectorAll('.card-product__info-row');
                var listHeight = 0;

                Array.from(paramsItems).forEach(function (item) {
                    var styles = getComputedStyle(item);
                    var itemHeight = parseFloat(styles.height);
                    listHeight += itemHeight;
                });

                if (paramsList.style.height === '') {
                    paramsList.style.height = listHeight + 'px';
                } else {
                    paramsList.style.height = '';
                }
            }
        });
    }
    return {
        init: init
    };
}();
producParams.init();
'use strict';

var recallModal = function () {
    var init = function init() {
        _setUpListeners();
    };
    var _setUpListeners = function _setUpListeners() {
        callBtn.addEventListener('click', function () {
            commonModal.toggleModal(modal, '50%', '-300%', closeBtn);
        });
        topicInputWrap.addEventListener('click', choiceOfTopic);
    };

    var callBtn = getElement('#btn-recall');
    var closeBtn = getElement('#close-recall');
    var modal = getElement('.recall');
    var topicInputWrap = getElement('#topic-input');

    function choiceOfTopic(e) {
        e.preventDefault();
        var topicInput = topicInputWrap.querySelector('input[type=text]');
        var hiddenInput = topicInputWrap.querySelector('input[type=hidden]');
        var select = topicInputWrap.querySelector('.select-list');
        var selectItems = select.querySelectorAll('.select-list__link');

        Array.from(selectItems).forEach(function (item) {
            if (e.target === item) {
                topicInput.value = item.innerText;
                hiddenInput.value = item.dataset.id;
                topicInputWrap.style.overflow = 'hidden';
                topicInput.addEventListener('click', function () {
                    topicInputWrap.style.overflow = 'visible';
                });
            }
        });
    }

    return {
        init: init
    };
}();
recallModal.init();
'use strict';

var Registration = function () {

    var init = function init() {
        if (callBtn) {
            _setUpListeners();
        }
    };

    var _setUpListeners = function _setUpListeners() {
        callBtn.addEventListener('click', function () {
            commonModal.toggleModal(registration, '0', '-300%', closeBtn);
        });

        foggotenPasBtn.addEventListener('click', hideForm);
        foggotenPasBackBtn.addEventListener('click', hideForm);
    };

    var callBtn = getElement('#registration');
    var closeBtn = getElement('#close-reg');
    var registration = getElement('.registration');
    var foggotenPasBtn = getElement('.forgotten__password');
    var foggotenPasBackBtn = getElement('.forgotten__password-back');

    function hideForm() {
        var form = this.closest('.registration__form');

        form.style.opacity = 0;
        form.addEventListener('transitionend', function transitionEnd() {
            if (form.nextElementSibling) {
                form.style.display = 'none';
                form.nextElementSibling.style.display = 'block';
            } else if (form.previousElementSibling) {
                form.style.display = 'none';
                form.previousElementSibling.style.display = 'block';
            }
            form.style.opacity = 1;
            form.removeEventListener('transitionend', transitionEnd);
        });
    }

    return {
        init: init
    };
}();
Registration.init();
'use strict';

jQuery(document).ready(function () {
    jQuery('.select-list_scrolled').scrollbar();
    jQuery('.order__list').scrollbar();
});
'use strict';

var sidebar = function () {
    var init = function init() {
        if (aside) {
            _setUpListeners();
        }
    };

    var _setUpListeners = function _setUpListeners() {
        btn.addEventListener('click', toggleSidebar);
    };

    var btn = getElement('#filter-btn');
    var aside = getElement('.products__aside');
    var asideInner = getElement('.products__aside-inner');

    function transitionEnd() {
        aside.style.zIndex = 0;
    }

    function toggleSidebar() {
        var asideWidth = aside.offsetWidth;

        if (aside.classList.contains('active')) {
            asideInner.addEventListener('transitionend', transitionEnd);
            btn.style.left = 0;
            aside.classList.remove('active');
        } else {
            asideInner.removeEventListener('transitionend', transitionEnd);
            btn.style.left = asideWidth + 'px';
            aside.style.zIndex = 2;
            aside.classList.add('active');
        }
    }

    return {
        init: init
    };
}();
sidebar.init();
'use strict';

var addCoutnInput = function () {

	var init = function init() {
		_setUpListners();
	};
	var _setUpListners = function _setUpListners() {
		var block = document.querySelector('.card-product');

		if (block) {
			if (slideShowItms.length === 1) {
				getElement('.slideshow__list-wrap').style.display = 'none';
			}
			slideShowList.insertBefore(slideShowList.lastElementChild, slideShowList.firstElementChild);

			controslBtns.addEventListener('click', moveSlides);
			slideShowList.addEventListener('click', slideToDisplay);
		}
	};

	var slideshowDisplay = getElement('#js-slideshow-display'),
	    slideShowList = getElement('#js-slideshow-list'),
	    slideShowItms = getAllElements('.slideshow__item'),
	    controslBtns = getElement('#js-control-btns');

	function moveSlides(e) {
		e.preventDefault();

		var nextBtn = controslBtns.querySelector('#js-next--btn'),
		    prevBtn = controslBtns.querySelector('#js-prev--btn');

		var firstChild = slideShowList.firstElementChild,
		    lastChild = slideShowList.lastElementChild;

		if (e.target === nextBtn) {
			slideShowList.appendChild(firstChild);
		}

		if (e.target === prevBtn) {
			slideShowList.insertBefore(lastChild, firstChild);
		}
	}

	function slideToDisplay(e) {
		var slideshowDisplayImg = slideshowDisplay.querySelector('img');
		var slideshowDisplayImgSrc = slideshowDisplayImg.attributes.src.value;
		e.preventDefault();
		Array.from(slideShowItms).forEach(function (item) {
			console.dir(slideshowDisplayImgSrc);
			var img = item.querySelector('img');
			if (e.target === img) {
				var imgSrc = img.attributes.src.value;

				slideshowDisplayImg.src = imgSrc;
				img.src = slideshowDisplayImgSrc;
			}
		});
	}

	return {
		init: init
	};
}();

addCoutnInput.init();
'use strict';

var tabs = function () {

	var init = function init() {
		_setUpListners();
	};
	var _setUpListners = function _setUpListners() {
		var block = document.querySelector('.card-product');

		if (block) {
			tabContents[0].style.display = 'block';
			tabControler.addEventListener('click', switchTabs);
		}
	};

	var tabsContainer = getElement('.tabs'),
	    tabControler = getElement('.tabs__controls'),
	    tabContents = getAllElements('.tabs__list-item');

	function switchTabs(e) {
		e.preventDefault();
		var tabLinks = tabsContainer.querySelectorAll('.tabs__controls-link');

		var target = e.target;

		Array.from(tabLinks).forEach(function (link, i) {
			link.parentNode.classList.remove('active');
			tabContents[i].style.display = 'none';
			if (target === link) {
				target.parentNode.classList.add('active');
				tabContents[i].style.display = 'block';
			}
		});
	}

	return {
		init: init
	};
}();
tabs.init();
'use strict';

var tagInput = function () {
    var init = function init() {
        if (inputTag) {
            _setUpListeners();
        }
    };

    var inputTag = document.querySelector('[data-type]');
    var hiddenInput = void 0;
    var tagList = '<ul class="tag-list"></ul>';
    var inputValue = '';

    var _setUpListeners = function _setUpListeners() {
        var wrap = inputTag.parentElement;
        hiddenInput = wrap.querySelector('input[type="hidden"]');
        wrap.insertAdjacentHTML('beforeEnd', tagList);

        wrap.addEventListener('click', deleteItem);
        inputTag.addEventListener('keydown', addTag);
        inputTag.addEventListener('input', addTag);
    };

    function addTag(e) {

        if (e.keyCode === 13) {
            e.preventDefault();
            validate(inputTag.value);
            if (inputTag.value === '') {
                return;
            }
            var _tagList = getElement('.tag-list');
            if (validate(inputTag.value)) {
                inputValue += inputTag.value + ', ';
                console.log(inputValue);
                var valueOfAttrValue = inputValue.slice(0, inputValue.length - 2);
                hiddenInput.value = valueOfAttrValue;
                _tagList.insertAdjacentHTML('beforeEnd', '<li class="tag-list__item">\n                    <span class="tag-list__item-text">' + inputTag.value + '</span>\n                    <span class="delete-item">x</span>\n                </li>');
            }
            inputTag.value = '';
            inputTag.blur();
        }
    }

    function deleteItem(e) {
        var btns = getAllElements('.delete-item');

        Array.from(btns).forEach(function (btn) {
            if (e.target === btn) {
                var item = btn.parentNode;
                var itemContent = item.querySelector('.tag-list__item-text').innerText;
                var list = item.closest('ul');
                var _tagList2 = hiddenInput.value.split(/\s*,\s*/);
                var str = '';

                list.removeChild(item);
                _tagList2.forEach(function (tag, index) {
                    if (tag === itemContent) {
                        _tagList2.splice(index, 1);
                    }
                });
                if (_tagList2.length) {
                    _tagList2.forEach(function (tag) {
                        str += tag + ', ';
                        inputValue = str;
                        hiddenInput.value = inputValue.slice(0, str.length - 2);
                    });
                } else {
                    inputValue = '';
                    hiddenInput.value = inputValue;
                }
            }
        });
    }

    function validate(value) {
        var items = getAllElements('.tag-list__item');
        var regExp = new RegExp('^' + value + '$', 'g');
        var valid = true;
        Array.from(items).forEach(function (item) {
            var itemText = item.querySelector('.tag-list__item-text').innerText;
            item.querySelector('.tag-list__item-text').style.color = 'white';
            if (itemText.match(regExp)) {
                item.querySelector('.tag-list__item-text').style.color = 'red';
                valid = false;
            }
        });
        return valid;
    }

    return {
        init: init
    };
}();
tagInput.init();
'use strict';

var togglePofileList = function () {

    var init = function init() {
        if (triggers) {
            _setUpListeners();
        }
    };

    var _setUpListeners = function _setUpListeners() {
        triggers.addEventListener('click', toggleList);
    };

    var triggers = getElement('.triggers');
    var triggerGallery = getElement('.triggers__gallery');
    var triggerList = getElement('.triggers__list');
    function toggleList(e) {
        var container = getElement('.profile-order__content');

        if (e.target === triggerGallery) {
            triggerList.classList.remove('active');
            triggerGallery.classList.add('active');
            container.classList.remove('modified');
        }

        if (e.target === triggerList) {
            triggerGallery.classList.remove('active');
            triggerList.classList.add('active');
            container.classList.add('modified');
        }
    }

    return {
        init: init
    };
}();
togglePofileList.init();
'use strict';

var toPdf = function () {

    var init = function init() {
        if (pdfBtn) {
            _setUpListeners();
        }
    };

    var _setUpListeners = function _setUpListeners() {
        pdfBtn.addEventListener('click', function () {
            _convertToPdf();
        });
    };

    var pdfBtn = document.querySelector('.topdf-btn');

    function _convertToPdf() {
        var element = document.querySelector('body');

        element.classList.add('page-to-pdf');
        html2pdf(element, {
            margin: 0.1,
            filename: 'myfile.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { letterRendering: true, timeout: 100, width: 770 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        });
        element.classList.remove('page-to-pdf');
    }

    return {
        init: init
    };
}();
toPdf.init();
'use strict';

var toPrint = function () {
    var init = function init() {
        var btn = getElement('.toprint-btn');
        if (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                window.print();
            });
        }
    };

    return {
        init: init
    };
}();
toPrint.init();
'use strict';

var userActions = function () {

	var init = function init() {
		_setUpListners();
	};
	var _setUpListners = function _setUpListners() {
		blockUser.addEventListener('click', handdleUserAction, false);
	};

	var blockUser = getElement('#user-block');

	function handdleUserAction(e) {
		var searchBtn = blockUser.querySelector('.user__btn_search');
		var languageListBtn = blockUser.querySelector('.user__btn_language');
		var profileBtn = blockUser.querySelector('#profile');

		var target = e.target;

		if (target === searchBtn) {
			openSerch();

			// close element by the click at any point of window
			var switchElem = new toggleElementAtAnyPoint('.search', openSerch);
			switchElem.addWindowEventListener();
		}

		if (target === languageListBtn || target.parentNode === languageListBtn) {
			openLanguageList();

			// close element by the click at any point of window
			var _switchElem = new toggleElementAtAnyPoint('.language', openLanguageList);
			_switchElem.addWindowEventListener();
		}

		if (target === profileBtn) {
			openLogoutList();

			// close element by the click at any point of window
			var _switchElem2 = new toggleElementAtAnyPoint('.logout', openLogoutList);
			_switchElem2.addWindowEventListener();
		}
	}

	// search block
	function openSerch() {
		var searchContainer = blockUser.querySelector('.search__input-wrap');
		var searchContainerWidth = parseFloat(searchContainer.style.width);

		if (!searchContainerWidth) {
			if (window.outerWidth > 380) {
				searchContainer.style.width = 355 + 'px';
			} else {
				searchContainer.style.width = 300 + 'px';
			}

			switchDisplay.toggleDisplay('.search__input-list');
		} else {
			searchContainer.style.width = 0;
			switchDisplay.toggleDisplay('.search__input-list');
		}
	}

	// language block
	function openLanguageList() {
		var language = blockUser.querySelector('.language'),
		    languageList = language.querySelector('.language__list');
		var languageHeight = language.clientHeight;

		if (!languageHeight) {
			language.style.height = languageList.clientHeight + 'px';
		} else {
			language.style.height = 0;
		}
	}

	// profile block
	function openLogoutList() {
		var logout = blockUser.querySelector('.logout'),
		    logoutList = logout.querySelector('.logout__list');
		var logoutHeight = logout.clientHeight;

		if (!logoutHeight) {
			logout.style.height = logoutList.clientHeight + 'px';
		} else {
			logout.style.height = 0;
		}
	}

	return {
		init: init
	};
}();
userActions.init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImludGxUZWxSZXF1aXJlLmpzIiwiX2FkZC1jb3VudC1pbnB1dC5qcyIsIl9hZGQtbWVzc2FnZS5qcyIsIl9jaGF0LmpzIiwiX2RhdGVwaWNrZXIuanMiLCJfZmlsaXVwbG9hZC5qcyIsIl9tb2ItbmF2LmpzIiwiX21vZGFsLWNvbW1vbi5qcyIsIl9tb2RhbC13aW5kb3cuanMiLCJfb3JkZXItY291bnQuanMiLCJfb3dsLWNhcm91c2VsLmpzIiwiX3BvZHVjdC1wYXJhbXMuanMiLCJfcmVjYWxsLW1vZGFsLmpzIiwiX3JlZ2lzdHJhdGlvbi5qcyIsIl9zY3JvbGxiYXIuanMiLCJfc2lkZWJhci5qcyIsIl9zbGlkZXNob3cuanMiLCJfdGFicy5qcyIsIl90YWctaW5wdXQuanMiLCJfdG9nZ2xlLXByb2ZpbGUtb3JkZXIuanMiLCJfdG9QZGYuanMiLCJfdG9QcmludC5qcyIsIl91c2VyLWFjdGlvbi5qcyJdLCJuYW1lcyI6WyJlIiwibWF0Y2hlcyIsIm1hdGNoZXNTZWxlY3RvciIsInNlbGVjdG9yIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yQWxsIiwidGgiLCJBcnJheSIsInByb3RvdHlwZSIsInNvbWUiLCJjYWxsIiwiY2xvc2VzdCIsImNzcyIsIm5vZGUiLCJwYXJlbnRFbGVtZW50IiwiZnJvbSIsInRvU3RyIiwiT2JqZWN0IiwidG9TdHJpbmciLCJpc0NhbGxhYmxlIiwiZm4iLCJ0b0ludGVnZXIiLCJ2YWx1ZSIsIm51bWJlciIsIk51bWJlciIsImlzTmFOIiwiaXNGaW5pdGUiLCJNYXRoIiwiZmxvb3IiLCJhYnMiLCJtYXhTYWZlSW50ZWdlciIsInBvdyIsInRvTGVuZ3RoIiwibGVuIiwibWluIiwibWF4IiwiYXJyYXlMaWtlIiwiQyIsIml0ZW1zIiwiVHlwZUVycm9yIiwibWFwRm4iLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJUIiwiQSIsImsiLCJrVmFsdWUiLCJFbGVtZW50IiwiZ2V0RWxlbWVudCIsImVsZW0iLCJxdWVyeVNlbGVjdG9yIiwiZ2V0QWxsRWxlbWVudHMiLCJzd2l0Y2hEaXNwbGF5IiwidG9nZ2xlRGlzcGxheSIsImkiLCJzdHlsZXMiLCJnZXRDb21wdXRlZFN0eWxlIiwiZGlzcGxheSIsInN0eWxlIiwidG9nZ2xlRWxlbWVudEF0QW55UG9pbnQiLCJmdW5jIiwidGhhdCIsInNldFRpbWVvdXQiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiaGFuZGxlQ2xvc2UiLCJ0YXJnZXQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiY29tbW9uTW9kYWwiLCJjdXJ0YWluIiwidG9nZ2xlTW9kYWwiLCJwbHVzIiwibWludXMiLCJidG4iLCJ0b3BQb3MiLCJ0b3AiLCJwb3NpdGlvbk9mTW9kYWwiLCJvZmZTY3JvbGwiLCJib2R5Iiwib3ZlcmZsb3ciLCJpbnRsVGVsUmVxdWlyZSIsImluaXQiLCJfc2V0VXBMaXN0ZW5lcnMiLCIkIiwiaW50bFRlbElucHV0IiwiaW5pdGlhbENvdW50cnkiLCJnZW9JcExvb2t1cCIsImNhbGxiYWNrIiwiZ2V0IiwiYWx3YXlzIiwicmVzcCIsImNvdW50cnlDb2RlIiwiY291bnRyeSIsInBob25lMSIsInBob25lMiIsIm9yZGVyUGhvbmUiLCJyZXBsYWNlTGFiZWxBbmRWYWxpZGF0ZSIsInNlcGFyYXRlRGlhbENvZGUiLCJpZCIsIndyYXAiLCJpbnB1dFdyYXAiLCJ3cmFwcGVyIiwiaW50bFRlbElucHV0V3JhcCIsImlucHV0V3JhcHBlciIsImhpZGRlbklucHV0IiwibGFiZWwiLCJhcHBlbmRDaGlsZCIsInRlbElucHV0Iiwib24iLCJuZXdWYWx1ZSIsInBsYWNlaG9sZGVyIiwicmVwbGFjZSIsInZhbCIsInN1YnN0cmluZyIsImludGxOdW1iZXIiLCJhZGRDb3V0bklucHV0Iiwid3JhcElucHV0IiwiX3NldFVwTGlzdG5lcnMiLCJhZGRDb3VudCIsImJhc2tldElucHV0IiwiY291bnRJbnB1dCIsImJhc2tldFRvdGFsQ291bnQiLCJmb3JFYWNoIiwiaW5wdXQiLCJpdGVtIiwiY291bnQiLCJwYXJzZUZsb2F0IiwiaW5wdXRCdG5VcCIsImlucHV0QnRuRG93biIsInN0YXJ0UHJpY2UiLCJ0b3RhbFByaWNlIiwic3RhcnRQcmljZVZhbHVlIiwidG90YWxQcmljZVZhbHVlIiwiYmFza2V0VG90YWxDb3VudFZhbHVlIiwiYmFza2V0RGVsZXRlQnRuIiwiY2xhc3NMaXN0IiwiY29udGFpbnMiLCJpbm5lclRleHQiLCJpbnB1dHMiLCJnZXRFbGVtZW50c0J5TmFtZSIsImNvbnNvbGUiLCJsb2ciLCJ0b0ZpeGVkIiwiaW5wdXRWYWx1ZSIsImFkZE1lc3NhZ2UiLCJtZXMiLCJjb250cm9sbGVyIiwiYWRkIiwibW9kZWwiLCJ2aXNpYmxlIiwiYWRkZWRFbGVtIiwidmlzaWJsZUVsZW0iLCJvcGFjaXR5IiwiZGVsZXRpbmciLCJyZW1vdmVDaGlsZCIsImNsZWFyVGltZW91dCIsInZpZXciLCJjcmVhdGUiLCJtZXNzYWdlIiwibXNnIiwiaW5zZXJ0QWRqYWNlbnRIVE1MIiwiY2hhdCIsImNoYXRJdGVtIiwic2hvd0FsbExpc3RCbnRUZXh0Iiwic2hvd0FsbExpc3RCbnQiLCJzZXRIZWlnaHRvZkNoYXRMaXN0Iiwic2hvd0FsbExpc3QiLCJjaGF0TGlzdCIsImNoYXRMaXN0SGVpZ2h0IiwibWFyZ2luQm90dG9tIiwib2Zmc2V0SGVpZ2h0IiwiaGVpZ2h0IiwiZGF0YXNldCIsImxhbmciLCJodG1sIiwiZGF0ZXBpY2tlciIsImxhbmd1YWdlIiwiZm9ybWF0IiwiYXV0b0hpZGUiLCJmaWxlVXBMb2FkIiwiZmlsZXVwbG9hZCIsInNpbmdsZUZpbGVVcGxvYWRzIiwibGltaXRNdWx0aUZpbGVVcGxvYWRTaXplT3ZlcmhlYWQiLCJkYXRhIiwiZG9uZSIsImJpbmQiLCJwcm9ncmVzc2FsbCIsInByb2dyZXNzIiwicGFyc2VJbnQiLCJsb2FkZWQiLCJ0b3RhbCIsImZpbGVzTGlzdCIsImZpbGVzIiwiZmlsZSIsIm5hbWUiLCJtb2JOYXYiLCJtb2JOYXZCdG5TaG93IiwidG9nZ2xlQWN0aXZlIiwibmF2QWN0aW9uIiwibW9iTmF2QnRuQ2xvc2UiLCJjb250YWluZXIiLCJiYWNrQnRuIiwibW9iTmF2TGlua3MiLCJsaW5rIiwibmV4dEVsZW1lbnRTaWJsaW5nIiwibGlzdCIsInJlbW92ZSIsIm1vZGFsQ29tbW9uIiwibW9kYWwiLCJjbG9zZUJ0biIsIm1vZGFsV2luZG93IiwiYmxvY2siLCJjbG9zZU1vZGFsQnRuIiwiY2xvc2VNb2RhbCIsInNob3dNb2RhbEJ0biIsInNob3dNb2RhbCIsInNsaWRlRGlzcGxheSIsIm1vZGFsSW1nIiwic2xpZGVEaXNwbGF5SW1nIiwiaW1nU3JjIiwiYXR0cmlidXRlcyIsInNyYyIsIm9yZGVyQ291bnQiLCJvcmRlckxpc3QiLCJjb3VudE9yZGVyIiwidG90YWxIZWlnaHRPZkl0ZW1zIiwic3R5bGVzT2ZPcmRlckxpc3QiLCJoZWlnaHRPZk9yZGVyTGlzdCIsIml0ZW1IZWlnaHQiLCJvd2xTbGlkZXIiLCJvd2xDYXJvdXNlbCIsImxvb3AiLCJuYXYiLCJtYXJnaW4iLCJhdXRvcGxheSIsImF1dG9wbGF5VGltZW91dCIsImF1dG9wbGF5SG92ZXJQYXVzZSIsInJlc3BvbnNpdmUiLCJwcm9kdWNQYXJhbXMiLCJsaXN0ZW5lciIsIl90b2dnbGVQYXJhbXMiLCJidG5zIiwicHJldmVudERlZmF1bHQiLCJwYXJlbnROb2RlIiwicGFyYW1zTGlzdCIsInBhcmFtc0l0ZW1zIiwibGlzdEhlaWdodCIsInJlY2FsbE1vZGFsIiwiY2FsbEJ0biIsInRvcGljSW5wdXRXcmFwIiwiY2hvaWNlT2ZUb3BpYyIsInRvcGljSW5wdXQiLCJzZWxlY3QiLCJzZWxlY3RJdGVtcyIsIlJlZ2lzdHJhdGlvbiIsInJlZ2lzdHJhdGlvbiIsImZvZ2dvdGVuUGFzQnRuIiwiaGlkZUZvcm0iLCJmb2dnb3RlblBhc0JhY2tCdG4iLCJmb3JtIiwidHJhbnNpdGlvbkVuZCIsInByZXZpb3VzRWxlbWVudFNpYmxpbmciLCJqUXVlcnkiLCJyZWFkeSIsInNjcm9sbGJhciIsInNpZGViYXIiLCJhc2lkZSIsInRvZ2dsZVNpZGViYXIiLCJhc2lkZUlubmVyIiwiekluZGV4IiwiYXNpZGVXaWR0aCIsIm9mZnNldFdpZHRoIiwibGVmdCIsInNsaWRlU2hvd0l0bXMiLCJzbGlkZVNob3dMaXN0IiwiaW5zZXJ0QmVmb3JlIiwibGFzdEVsZW1lbnRDaGlsZCIsImZpcnN0RWxlbWVudENoaWxkIiwiY29udHJvc2xCdG5zIiwibW92ZVNsaWRlcyIsInNsaWRlVG9EaXNwbGF5Iiwic2xpZGVzaG93RGlzcGxheSIsIm5leHRCdG4iLCJwcmV2QnRuIiwiZmlyc3RDaGlsZCIsImxhc3RDaGlsZCIsInNsaWRlc2hvd0Rpc3BsYXlJbWciLCJzbGlkZXNob3dEaXNwbGF5SW1nU3JjIiwiZGlyIiwiaW1nIiwidGFicyIsInRhYkNvbnRlbnRzIiwidGFiQ29udHJvbGVyIiwic3dpdGNoVGFicyIsInRhYnNDb250YWluZXIiLCJ0YWJMaW5rcyIsInRhZ0lucHV0IiwiaW5wdXRUYWciLCJ0YWdMaXN0IiwiZGVsZXRlSXRlbSIsImFkZFRhZyIsImtleUNvZGUiLCJ2YWxpZGF0ZSIsInZhbHVlT2ZBdHRyVmFsdWUiLCJzbGljZSIsImJsdXIiLCJpdGVtQ29udGVudCIsInNwbGl0Iiwic3RyIiwidGFnIiwiaW5kZXgiLCJzcGxpY2UiLCJyZWdFeHAiLCJSZWdFeHAiLCJ2YWxpZCIsIml0ZW1UZXh0IiwiY29sb3IiLCJtYXRjaCIsInRvZ2dsZVBvZmlsZUxpc3QiLCJ0cmlnZ2VycyIsInRvZ2dsZUxpc3QiLCJ0cmlnZ2VyR2FsbGVyeSIsInRyaWdnZXJMaXN0IiwidG9QZGYiLCJwZGZCdG4iLCJfY29udmVydFRvUGRmIiwiZWxlbWVudCIsImh0bWwycGRmIiwiZmlsZW5hbWUiLCJpbWFnZSIsInR5cGUiLCJxdWFsaXR5IiwiaHRtbDJjYW52YXMiLCJsZXR0ZXJSZW5kZXJpbmciLCJ0aW1lb3V0Iiwid2lkdGgiLCJqc1BERiIsInVuaXQiLCJvcmllbnRhdGlvbiIsInRvUHJpbnQiLCJwcmludCIsInVzZXJBY3Rpb25zIiwiYmxvY2tVc2VyIiwiaGFuZGRsZVVzZXJBY3Rpb24iLCJzZWFyY2hCdG4iLCJsYW5ndWFnZUxpc3RCdG4iLCJwcm9maWxlQnRuIiwib3BlblNlcmNoIiwic3dpdGNoRWxlbSIsImFkZFdpbmRvd0V2ZW50TGlzdGVuZXIiLCJvcGVuTGFuZ3VhZ2VMaXN0Iiwib3BlbkxvZ291dExpc3QiLCJzZWFyY2hDb250YWluZXIiLCJzZWFyY2hDb250YWluZXJXaWR0aCIsIm91dGVyV2lkdGgiLCJsYW5ndWFnZUxpc3QiLCJsYW5ndWFnZUhlaWdodCIsImNsaWVudEhlaWdodCIsImxvZ291dCIsImxvZ291dExpc3QiLCJsb2dvdXRIZWlnaHQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLENBQUMsWUFBVztBQUNWO0FBQ0Q7O0FBRUEsRUFBQyxVQUFTQSxDQUFULEVBQVc7QUFDWEEsSUFBRUMsT0FBRixLQUFjRCxFQUFFQyxPQUFGLEdBQVVELEVBQUVFLGVBQUYsSUFBbUIsVUFBU0MsUUFBVCxFQUFrQjtBQUM1RCxPQUFJRixVQUFVRyxTQUFTQyxnQkFBVCxDQUEwQkYsUUFBMUIsQ0FBZDtBQUFBLE9BQW1ERyxLQUFLLElBQXhEO0FBQ0EsVUFBT0MsTUFBTUMsU0FBTixDQUFnQkMsSUFBaEIsQ0FBcUJDLElBQXJCLENBQTBCVCxPQUExQixFQUFtQyxVQUFTRCxDQUFULEVBQVc7QUFDcEQsV0FBT0EsTUFBTU0sRUFBYjtBQUNBLElBRk0sQ0FBUDtBQUdBLEdBTEQ7QUFNQU4sSUFBRVcsT0FBRixHQUFZWCxFQUFFVyxPQUFGLElBQWEsVUFBU0MsR0FBVCxFQUFhO0FBQ3JDLE9BQUlDLE9BQU8sSUFBWDs7QUFFQSxVQUFPQSxJQUFQLEVBQWE7QUFDWixRQUFJQSxLQUFLWixPQUFMLENBQWFXLEdBQWIsQ0FBSixFQUF1QixPQUFPQyxJQUFQLENBQXZCLEtBQ0tBLE9BQU9BLEtBQUtDLGFBQVo7QUFDTDtBQUNELFVBQU8sSUFBUDtBQUNBLEdBUkQ7QUFTTSxNQUFJLENBQUNQLE1BQU1RLElBQVgsRUFBaUI7QUFDYlIsU0FBTVEsSUFBTixH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TUFBYixHQUFzQjRMLFdBQVdGLFlBQVgsR0FBMEIsSUFBaEQ7QUFDSCxHQUZELE1BRU87QUFDSEMsVUFBTzVTLEtBQVAsQ0FBYWlILE1BQWIsR0FBc0IsQ0FBdEI7QUFDSDtBQUVKOztBQUdKLFFBQU87QUFDTjFGLFFBQU1BO0FBREEsRUFBUDtBQUlBLENBaEdtQixFQUFwQjtBQWlHQW9RLFlBQVlwUSxJQUFaIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblx0Ly8gcG9seWZpbGwgZm9yIElFXHJcblxyXG5cdChmdW5jdGlvbihlKXtcclxuXHRcdGUubWF0Y2hlcyB8fCAoZS5tYXRjaGVzPWUubWF0Y2hlc1NlbGVjdG9yfHxmdW5jdGlvbihzZWxlY3Rvcil7XHJcblx0XHRcdHZhciBtYXRjaGVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvciksIHRoID0gdGhpcztcclxuXHRcdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zb21lLmNhbGwobWF0Y2hlcywgZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0cmV0dXJuIGUgPT09IHRoO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdFx0ZS5jbG9zZXN0ID0gZS5jbG9zZXN0IHx8IGZ1bmN0aW9uKGNzcyl7XHJcblx0XHRcdHZhciBub2RlID0gdGhpcztcclxuXHJcblx0XHRcdHdoaWxlIChub2RlKSB7XHJcblx0XHRcdFx0aWYgKG5vZGUubWF0Y2hlcyhjc3MpKSByZXR1cm4gbm9kZTtcclxuXHRcdFx0XHRlbHNlIG5vZGUgPSBub2RlLnBhcmVudEVsZW1lbnQ7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9O1xyXG4gICAgICAgIGlmICghQXJyYXkuZnJvbSkge1xyXG4gICAgICAgICAgICBBcnJheS5mcm9tID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRvU3RyID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcclxuICAgICAgICAgICAgICAgIHZhciBpc0NhbGxhYmxlID0gZnVuY3Rpb24oZm4pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIGZuID09PSAnZnVuY3Rpb24nIHx8IHRvU3RyLmNhbGwoZm4pID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHZhciB0b0ludGVnZXIgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbnVtYmVyID0gTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNOYU4obnVtYmVyKSkgeyByZXR1cm4gMDsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChudW1iZXIgPT09IDAgfHwgIWlzRmluaXRlKG51bWJlcikpIHsgcmV0dXJuIG51bWJlcjsgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAobnVtYmVyID4gMCA/IDEgOiAtMSkgKiBNYXRoLmZsb29yKE1hdGguYWJzKG51bWJlcikpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHZhciBtYXhTYWZlSW50ZWdlciA9IE1hdGgucG93KDIsIDUzKSAtIDE7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9MZW5ndGggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGVuID0gdG9JbnRlZ2VyKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobGVuLCAwKSwgbWF4U2FmZUludGVnZXIpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gZnJvbShhcnJheUxpa2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgQyA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gT2JqZWN0KGFycmF5TGlrZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhcnJheUxpa2UgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5mcm9tIHJlcXVpcmVzIGFuIGFycmF5LWxpa2Ugb2JqZWN0IC0gbm90IG51bGwgb3IgdW5kZWZpbmVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXBGbiA9IGFyZ3VtZW50c1sxXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1hcEZuICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBGbiA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdm9pZCB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQ2FsbGFibGUobWFwRm4pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5mcm9tOiB3aGVuIHByb3ZpZGVkLCB0aGUgc2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBUID0gYXJndW1lbnRzWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbGVuID0gdG9MZW5ndGgoaXRlbXMubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIEEgPSBpc0NhbGxhYmxlKEMpID8gT2JqZWN0KG5ldyBDKGxlbikpIDogbmV3IEFycmF5KGxlbik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBrID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIga1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChrIDwgbGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtWYWx1ZSA9IGl0ZW1zW2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobWFwRm4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFba10gPSB0eXBlb2YgVCA9PT0gJ3VuZGVmaW5lZCcgPyBtYXBGbihrVmFsdWUsIGspIDogbWFwRm4uY2FsbChULCBrVmFsdWUsIGspO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQVtrXSA9IGtWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrICs9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIEEubGVuZ3RoID0gbGVuO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBBO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSgpKTtcclxuICAgICAgICB9XHJcblx0fSkoRWxlbWVudC5wcm90b3R5cGUpO1xyXG59KSgpO1xyXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbid1c2Ugc3RyaWN0JztcclxuZnVuY3Rpb24gZ2V0RWxlbWVudChlbGVtKSB7XHJcblx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbSk7XHJcbn07XHJcblxyXG5mdW5jdGlvbiBnZXRBbGxFbGVtZW50cyhlbGVtKSB7XHJcblx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWxlbSk7XHJcbn07XHJcblxyXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbmNvbnN0IHN3aXRjaERpc3BsYXkgPSAoZnVuY3Rpb24gKCkge1xyXG5cdC8vIGFkZCBhcyBhcmd1bWVudCBjc3Mtc2VsZWN0b3Igb2YgRE9NIGVsZW1lbnQgdGhhdCB5b3UgbmVlZCB0byB0b2dnbGUgZGlzcGxheVxyXG5cdC8vIGV4YW1wbGUgc3dpdGNoRGlzcGxheS50b2dnbGVEaXNwbGF5KCcuY3NzLXNlbGN0b3InKVxyXG5cdGxldCBlbGVtID0gbnVsbDtcclxuXHRmdW5jdGlvbiB0b2dnbGVEaXNwbGF5ICgpIHtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGFyZ3VtZW50c1tpXSk7XHJcblx0XHRcdGxldCBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW0pO1xyXG5cdFx0XHRpZiAoc3R5bGVzLmRpc3BsYXkgPT09ICdibG9jaycpIHtcclxuXHRcdFx0XHRlbGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZWxlbS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHR0b2dnbGVEaXNwbGF5OiB0b2dnbGVEaXNwbGF5XHJcblx0fVxyXG5cclxufSkoKTtcclxuXHJcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuY2xhc3MgdG9nZ2xlRWxlbWVudEF0QW55UG9pbnQge1xyXG5cdGNvbnN0cnVjdG9yIChzZWxlY3RvciwgZnVuYykge1xyXG5cdFx0dGhpcy5lbGVtID0gc2VsZWN0b3I7XHJcblx0XHR0aGlzLmZ1bmMgPSBmdW5jO1xyXG5cdH07XHJcblxyXG5cdGFkZFdpbmRvd0V2ZW50TGlzdGVuZXIgKCkge1xyXG5cdFx0Y29uc3QgdGhhdCA9IHRoaXM7XHJcblx0XHRzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gaGFuZGxlQ2xvc2UgKGUpIHtcclxuXHRcdFx0XHRpZighZS50YXJnZXQuY2xvc2VzdCh0aGF0LmVsZW0pKSB7XHJcblx0XHRcdFx0XHR0aGF0LmZ1bmMoKTtcclxuXHRcdFx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRsZUNsb3NlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fTtcclxufVxyXG5cclxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5jb25zdCBjb21tb25Nb2RhbCA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGNvbnN0IGN1cnRhaW4gPSBnZXRFbGVtZW50KCcuY3VydGFpbicpO1xyXG5cclxuXHQvLyBleGFtcGxlIG9mIHBhcmFtZXRycyAoZWxlbWVudCwgJzUwJScsICctMTAwJScsIGNsb3NlQnRuKVxyXG5cdGZ1bmN0aW9uIHRvZ2dsZU1vZGFsKGVsZW0sIHBsdXMsIG1pbnVzLCBidG4pIHtcclxuXHRcdGxldCB0b3BQb3MgPSBlbGVtLnN0eWxlLnRvcDtcclxuXHRcdGxldCBwb3NpdGlvbk9mTW9kYWwgPSB0b3BQb3M7XHJcblxyXG5cdFx0aWYocG9zaXRpb25PZk1vZGFsIDwgcGx1cykge1xyXG5cdFx0XHRlbGVtLnN0eWxlLnRvcCA9IHBsdXM7XHJcblx0XHRcdG9mZlNjcm9sbCgpO1xyXG5cdFx0XHQvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb2ZmU2Nyb2xsKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGVsZW0uc3R5bGUudG9wID0gbWludXM7XHJcblx0XHRcdG9mZlNjcm9sbCgpO1xyXG5cdFx0XHQvLyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgb2ZmU2Nyb2xsKTtcclxuXHRcdH1cclxuXHRcdHN3aXRjaERpc3BsYXkudG9nZ2xlRGlzcGxheSgnLmN1cnRhaW4nKTtcclxuXHRcdGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHRcdFx0dG9nZ2xlTW9kYWwoZWxlbSwgcGx1cywgbWludXMsIGJ0bik7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIG9mZlNjcm9sbCgpIHtcclxuXHRcdGxldCBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpO1xyXG5cdFx0bGV0IG92ZXJmbG93ID0gc3R5bGVzLm92ZXJmbG93O1xyXG5cdFx0aWYgKG92ZXJmbG93ICE9PSBcImhpZGRlblwiKSB7XHJcblx0XHRcdGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJcIlxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdHRvZ2dsZU1vZGFsOiB0b2dnbGVNb2RhbFxyXG5cdH1cclxufSkoKTtcclxuXHJcblxyXG4iLCJjb25zdCBpbnRsVGVsUmVxdWlyZSA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3NldFVwTGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoXCIjcGhvbmVcIikuaW50bFRlbElucHV0KHtcclxuICAgICAgICAgICAgaW5pdGlhbENvdW50cnk6IFwiYXV0b1wiLFxyXG4gICAgICAgICAgICBnZW9JcExvb2t1cDogZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICQuZ2V0KFwiaHR0cHM6Ly9pcGluZm8uaW9cIiwgZnVuY3Rpb24oKSB7fSwgXCJqc29ucFwiKS5hbHdheXMoZnVuY3Rpb24ocmVzcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb3VudHJ5Q29kZSA9IChyZXNwICYmIHJlc3AuY291bnRyeSkgPyByZXNwLmNvdW50cnkgOiBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGNvdW50cnlDb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGhvbmUxID0gZ2V0RWxlbWVudCgnI3Bob25lJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBob25lMiA9IGdldEVsZW1lbnQoJyNwaG9uZS0yJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9yZGVyUGhvbmUgPSBnZXRFbGVtZW50KCcjb3JkZXItcGhvbmUnKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihwaG9uZTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGFjZUxhYmVsQW5kVmFsaWRhdGUoJyNwaG9uZScsICcucmVjYWxsX19mb3JtJywgJy5yZWNhbGxfX2lucHV0LXdyYXAnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocGhvbmUyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxhY2VMYWJlbEFuZFZhbGlkYXRlKCcjcGhvbmUtMicsICcuc2VydmljZXNfX2Zvcm0nLCAnLmZvcm1fX2lucHV0LXdyYXAnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYob3JkZXJQaG9uZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXBsYWNlTGFiZWxBbmRWYWxpZGF0ZSgnI29yZGVyLXBob25lJywgJy5vcmRlcl9fZm9ybScsICcuZm9ybV9faW5wdXQtd3JhcCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzZXBhcmF0ZURpYWxDb2RlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJChcIiNwaG9uZS0yXCIpLmludGxUZWxJbnB1dCh7XHJcbiAgICAgICAgICAgIGluaXRpYWxDb3VudHJ5OiBcImF1dG9cIixcclxuICAgICAgICAgICAgc2VwYXJhdGVEaWFsQ29kZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoXCIjb3JkZXItcGhvbmVcIikuaW50bFRlbElucHV0KHtcclxuICAgICAgICAgICAgaW5pdGlhbENvdW50cnk6IFwiYXV0b1wiLFxyXG4gICAgICAgICAgICBzZXBhcmF0ZURpYWxDb2RlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVwbGFjZUxhYmVsQW5kVmFsaWRhdGUgKGlkLCB3cmFwLCBpbnB1dFdyYXApIHtcclxuICAgICAgICBsZXQgd3JhcHBlciA9IGdldEVsZW1lbnQod3JhcCk7XHJcbiAgICAgICAgbGV0IGludGxUZWxJbnB1dFdyYXAgPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5pbnRsLXRlbC1pbnB1dCcpO1xyXG4gICAgICAgIGxldCBpbnB1dFdyYXBwZXIgPSBpbnRsVGVsSW5wdXRXcmFwLmNsb3Nlc3QoaW5wdXRXcmFwKTtcclxuICAgICAgICBsZXQgaGlkZGVuSW5wdXQgPSBpbnB1dFdyYXBwZXIucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImhpZGRlblwiXScpXHJcbiAgICAgICAgbGV0IGxhYmVsID0gaW5wdXRXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJ2xhYmVsJyk7XHJcbiAgICAgICAgaW50bFRlbElucHV0V3JhcC5hcHBlbmRDaGlsZChsYWJlbCk7XHJcblxyXG4gICAgICAgIHZhciB0ZWxJbnB1dCA9ICQoaWQpO1xyXG4gICAgICAgIHRlbElucHV0Lm9uKFwiaW5wdXRcIiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSBlLnRhcmdldC5wbGFjZWhvbGRlci5yZXBsYWNlKC9bXjAtOVxcLl0vZywnJykubGVuZ3RoO1xyXG4gICAgICAgICAgICAkKHRoaXMpLm9uKCdrZXl1cCcsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS52YWwoJCh0aGlzKS52YWwoKS5yZXBsYWNlKC9cXEQvZywnJykpO1xyXG4gICAgICAgICAgICAgICAgaWYoJCh0aGlzKS52YWwoKS5yZXBsYWNlKC9cXEQvZywnJykubGVuZ3RoPm5ld1ZhbHVlKXtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnZhbCgkKHRoaXMpLnZhbCgpLnN1YnN0cmluZygwLG5ld1ZhbHVlKSkgO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIGludGxOdW1iZXIgPSAkKFwiI29yZGVyLXBob25lXCIpLmludGxUZWxJbnB1dChcImdldE51bWJlclwiKTtcclxuICAgICAgICAgICAgaGlkZGVuSW5wdXQudmFsdWUgPSBpbnRsTnVtYmVyO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdFxyXG4gICAgfVxyXG59KSgpO1xyXG5pbnRsVGVsUmVxdWlyZS5pbml0KCk7XHJcbiIsImNvbnN0IGFkZENvdXRuSW5wdXQgPSAoZnVuY3Rpb24gKCkge1xyXG5cdGNvbnN0IGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZih3cmFwSW5wdXQubGVuZ3RoKSB7XHJcblx0XHRcdF9zZXRVcExpc3RuZXJzKCk7XHJcblx0XHR9XHJcblx0fTtcclxuXHRjb25zdCBfc2V0VXBMaXN0bmVycyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBhZGRDb3VudCk7XHJcblx0fTtcclxuXHJcblx0Y29uc3QgYmFza2V0SW5wdXQgPSBnZXRBbGxFbGVtZW50cygnLmJhc2tldF9faXRlbS1jb250ZW50Jyk7XHJcblx0Y29uc3QgY291bnRJbnB1dCA9IGdldEFsbEVsZW1lbnRzKCcuanMtYWRkLWNvdW50Jyk7XHJcblx0Y29uc3Qgd3JhcElucHV0ID0gYmFza2V0SW5wdXQubGVuZ3RoID09PSAwID8gY291bnRJbnB1dCA6IGJhc2tldElucHV0O1xyXG5cdGNvbnN0IGJhc2tldFRvdGFsQ291bnQgPSBnZXRFbGVtZW50KCcuYmFza2V0X190b3RhbC1jb3VudCcpO1xyXG5cdGZ1bmN0aW9uIGFkZENvdW50KGUpIHtcclxuXHJcbiAgICAgICAgQXJyYXkuZnJvbSh3cmFwSW5wdXQpLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdGxldCBpbnB1dCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignaW5wdXQnKSxcclxuXHRcdFx0XHRjb3VudCA9IHBhcnNlRmxvYXQoaW5wdXQudmFsdWUpLFxyXG5cdFx0XHRcdGlucHV0QnRuVXAgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5hZGQtaW5wdXRfX2J0bl91cCcpLFxyXG5cdFx0XHRcdGlucHV0QnRuRG93biA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLmFkZC1pbnB1dF9fYnRuX2Rvd24nKSxcclxuICAgICAgICAgICAgICAgIHN0YXJ0UHJpY2UsXHJcblx0XHRcdFx0dG90YWxQcmljZSxcclxuICAgICAgICAgICAgICAgIHN0YXJ0UHJpY2VWYWx1ZSxcclxuXHRcdFx0XHR0b3RhbFByaWNlVmFsdWUsXHJcblx0XHRcdFx0YmFza2V0VG90YWxDb3VudFZhbHVlLFxyXG5cdFx0XHRcdGJhc2tldERlbGV0ZUJ0bjtcclxuXHJcblx0XHRcdGlmIChpdGVtLmNsYXNzTGlzdC5jb250YWlucygnYmFza2V0X19pdGVtLWNvbnRlbnQnKSkge1xyXG4gICAgICAgICAgICAgICAgc3RhcnRQcmljZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLnByaWNlLXN0YXJ0LWpzIC5wcmljZV9fbnVtYmVycycpO1xyXG5cdFx0XHRcdHRvdGFsUHJpY2UgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5wcmljZS10b3RhbC1qcyAucHJpY2VfX251bWJlcnMnKTtcclxuICAgICAgICAgICAgICAgIGJhc2tldERlbGV0ZUJ0biA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLnNxdWFyZS1idG4nKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0UHJpY2VWYWx1ZSA9IHBhcnNlRmxvYXQoc3RhcnRQcmljZS5pbm5lclRleHQpO1xyXG5cdFx0XHRcdHRvdGFsUHJpY2VWYWx1ZSA9IHBhcnNlRmxvYXQodG90YWxQcmljZS5pbm5lclRleHQpO1xyXG4gICAgICAgICAgICAgICAgYmFza2V0VG90YWxDb3VudFZhbHVlID0gcGFyc2VGbG9hdChiYXNrZXRUb3RhbENvdW50LmlubmVyVGV4dCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChlLnRhcmdldCA9PT0gYmFza2V0RGVsZXRlQnRuKSB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5wdXRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ2NvdW50Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvdW50ID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgQXJyYXkuZnJvbShpbnB1dHMpLmZvckVhY2goaW5wdXQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudCArPSBwYXJzZUZsb2F0KGlucHV0LnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBiYXNrZXRUb3RhbENvdW50LmlubmVyVGV4dCA9IGNvdW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNvdW50KTtcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNOYU4oaW5wdXQudmFsdWUpIHx8IGlucHV0LnZhbHVlID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSAxO1xyXG4gICAgICAgICAgICAgICAgYmFza2V0VG90YWxDb3VudC5pbm5lclRleHQgPSArK2Jhc2tldFRvdGFsQ291bnRWYWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBpbnB1dEJ0blVwKSB7XHJcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBjb3VudDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZih0b3RhbFByaWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFza2V0VG90YWxDb3VudC5pbm5lclRleHQgPSArK2Jhc2tldFRvdGFsQ291bnRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbFByaWNlLmlubmVyVGV4dCA9ICh0b3RhbFByaWNlVmFsdWUgKyBzdGFydFByaWNlVmFsdWUpLnRvRml4ZWQoMik7XHJcblx0XHRcdFx0fVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IGlucHV0QnRuRG93bikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvdW50ID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY291bnQtLTtcclxuICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gY291bnQ7XHJcbiAgICAgICAgICAgICAgICBpZih0b3RhbFByaWNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFza2V0VG90YWxDb3VudC5pbm5lclRleHQgPSAtLWJhc2tldFRvdGFsQ291bnRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbFByaWNlLmlubmVyVGV4dCA9ICh0b3RhbFByaWNlVmFsdWUgLSBzdGFydFByaWNlVmFsdWUpLnRvRml4ZWQoMik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG5cdFx0XHRpZih0b3RhbFByaWNlKSB7XHJcblx0XHRcdFx0aW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XHJcblx0XHRcdFx0XHRsZXQgaW5wdXRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ2NvdW50Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGlucHV0VmFsdWUgPSBwYXJzZUZsb2F0KGlucHV0LnZhbHVlKTtcclxuXHRcdFx0XHRcdGxldCBjb3VudCA9IDA7XHJcblxyXG5cdFx0XHRcdFx0QXJyYXkuZnJvbShpbnB1dHMpLmZvckVhY2goaW5wdXQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNOYU4oaW5wdXQudmFsdWUpIHx8IGlucHV0LnZhbHVlID09PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQgKz0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0VmFsdWUgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cdFx0XHRcdFx0XHRjb3VudCArPSBwYXJzZUZsb2F0KGlucHV0LnZhbHVlKTtcclxuXHRcdFx0XHRcdH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsUHJpY2UuaW5uZXJUZXh0ID0gKHN0YXJ0UHJpY2VWYWx1ZSAqIGlucHV0VmFsdWUpLnRvRml4ZWQoMik7XHJcblx0XHRcdFx0XHRiYXNrZXRUb3RhbENvdW50LmlubmVyVGV4dCA9IGNvdW50O1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblx0fSBcclxuXHRcdFxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBpbml0XHJcblx0fVxyXG5cclxufSkoKTtcclxuXHJcbmFkZENvdXRuSW5wdXQuaW5pdCgpOyIsImNvbnN0IGFkZE1lc3NhZ2UgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uIChtZXMpIHtcclxuICAgICAgICBfc2V0VXBMaXN0ZW5lcnMobWVzKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKG1lcykge1xyXG4gICAgICAgIGNvbnRyb2xsZXIuYWRkKG1lcyk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG1vZGVsID0ge1xyXG4gICAgICAgIHZpc2libGUgKGFkZGVkRWxlbSwgdmlzaWJsZUVsZW0pIHtcclxuICAgICAgICAgICAgbGV0IHZpc2libGUgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGdldEVsZW1lbnQodmlzaWJsZUVsZW0pLnN0eWxlLm9wYWNpdHkgPSAxO1xyXG4gICAgICAgICAgICAgICAgbGV0IGRlbGV0aW5nID0gc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZWxlbSA9IGdldEVsZW1lbnQoYWRkZWRFbGVtKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChkZWxldGluZyk7XHJcbiAgICAgICAgICAgICAgICB9LCA1MDAwKTtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh2aXNpYmxlKTtcclxuICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCB2aWV3ID0ge1xyXG4gICAgICAgIGNyZWF0ZShtZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IGA8ZGl2IGNsYXNzPVwibWVzc2FnZS1hYm91dFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtZXNzYWdlLWFib3V0X19jb250ZW50XCI+JHttZXN9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5gO1xyXG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGNvbnRyb2xsZXIgPSB7XHJcbiAgICAgICAgYWRkKG1zZykge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5Lmluc2VydEFkamFjZW50SFRNTCgnYWZ0ZXJCZWdpbicsIHZpZXcuY3JlYXRlKG1zZykpO1xyXG4gICAgICAgICAgICBtb2RlbC52aXNpYmxlKCcubWVzc2FnZS1hYm91dCcsICcubWVzc2FnZS1hYm91dF9fY29udGVudCcpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBpbml0XHJcbiAgICB9XHJcbn0pKCk7XHJcbiIsImNvbnN0IGNoYXQgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGNvbnN0IGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYoY2hhdEl0ZW0ubGVuZ3RoID4gMykge1xyXG4gICAgICAgICAgICBzaG93QWxsTGlzdEJudFRleHQgPSBzaG93QWxsTGlzdEJudC5pbm5lclRleHQ7XHJcbiAgICAgICAgICAgIF9zZXRVcExpc3RlbmVycygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNldEhlaWdodG9mQ2hhdExpc3QoKTtcclxuICAgICAgICBzaG93QWxsTGlzdEJudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNob3dBbGxMaXN0KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgY2hhdCA9IGdldEVsZW1lbnQoJy5jaGF0Jyk7XHJcbiAgICBjb25zdCBjaGF0TGlzdCA9IGdldEVsZW1lbnQoJy5jaGF0X19saXN0Jyk7XHJcbiAgICBjb25zdCBjaGF0SXRlbSA9IGdldEFsbEVsZW1lbnRzKCcuY2hhdF9faXRlbScpO1xyXG4gICAgY29uc3Qgc2hvd0FsbExpc3RCbnQgPSBnZXRFbGVtZW50KCcjc2hvdy1hbGwtbGlzdCcpO1xyXG4gICAgbGV0IHNob3dBbGxMaXN0Qm50VGV4dDtcclxuICAgIGxldCBjaGF0TGlzdEhlaWdodCA9IDA7XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0SGVpZ2h0b2ZDaGF0TGlzdCgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgc3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZShjaGF0SXRlbVtpXSk7XHJcbiAgICAgICAgICAgIGxldCBtYXJnaW5Cb3R0b20gPSBwYXJzZUZsb2F0KHN0eWxlcy5tYXJnaW5Cb3R0b20pO1xyXG4gICAgICAgICAgICBjaGF0TGlzdEhlaWdodCArPSBjaGF0SXRlbVtpXS5vZmZzZXRIZWlnaHQgKyBtYXJnaW5Cb3R0b207XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNoYXRMaXN0LnN0eWxlLmhlaWdodCA9IGNoYXRMaXN0SGVpZ2h0ICsgJ3B4JztcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzaG93QWxsTGlzdCgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhzaG93QWxsTGlzdEJudFRleHQpO1xyXG4gICAgICAgIGlmICggY2hhdExpc3Quc3R5bGUuaGVpZ2h0ID09PSAnMTAwJScpIHtcclxuICAgICAgICAgICAgY2hhdExpc3Quc3R5bGUuaGVpZ2h0ID0gY2hhdExpc3RIZWlnaHQgKyAncHgnO1xyXG4gICAgICAgICAgICBzaG93QWxsTGlzdEJudC5pbm5lclRleHQgPSBzaG93QWxsTGlzdEJudFRleHQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2hvd0FsbExpc3RCbnQuaW5uZXJUZXh0ID0gc2hvd0FsbExpc3RCbnQuZGF0YXNldC5sYW5nO1xyXG4gICAgICAgICAgICBjaGF0TGlzdC5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdFxyXG4gICAgfVxyXG59KSgpO1xyXG5jaGF0LmluaXQoKTtcclxuIiwiaWYgKCQoJ1tkYXRhLXRvZ2dsZT1cImRhdGVwaWNrZXJcIl0nKSkge1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaHRtbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2h0bWwnKTtcclxuICAgICAgICBsZXQgbGFuZyA9IGh0bWwubGFuZztcclxuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJkYXRlcGlja2VyXCJdJykuZGF0ZXBpY2tlcih7XHJcbiAgICAgICAgICAgIGxhbmd1YWdlOiBsYW5nLFxyXG4gICAgICAgICAgICBmb3JtYXQ6ICdkZC5tbS55eXl5JyxcclxuICAgICAgICAgICAgYXV0b0hpZGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59IiwiY29uc3QgZmlsZVVwTG9hZCA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zdCBpbnB1dFdyYXAgPSBnZXRFbGVtZW50KCcjZmlsZXVwbG9hZC13cmFwJyk7XHJcbiAgICAgICAgaWYgKGlucHV0V3JhcCkge1xyXG4gICAgICAgICAgICBpbnB1dFdyYXAuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlckVuZCcsIGA8dWwgY2xhc3M9XCJmaWxlcy1saXN0XCI+PC91bD5gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQoJyNmaWxldXBsb2FkJykuZmlsZXVwbG9hZCh7XHJcbiAgICAgICAgICAgIHNpbmdsZUZpbGVVcGxvYWRzOiBmYWxzZSxcclxuICAgICAgICAgICAgbGltaXRNdWx0aUZpbGVVcGxvYWRTaXplT3ZlcmhlYWQ6IDIsXHJcbiAgICAgICAgICAgIGFkZDogZnVuY3Rpb24gKGUsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZG9uZTogZnVuY3Rpb24gKGUsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgICQoJyNmaWxldXBsb2FkJykuYmluZCgnZmlsZXVwbG9hZGRvbmUnLCBmdW5jdGlvbiAoZSwgZGF0YSkge2NvbnNvbGUubG9nKCdET05FJyl9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcHJvZ3Jlc3NhbGw6IGZ1bmN0aW9uIChlLCBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvZ3Jlc3MgPSBwYXJzZUludChkYXRhLmxvYWRlZCAvIGRhdGEudG90YWwgKiAxMDAsIDEwKTtcclxuICAgICAgICAgICAgICAgICQoJyNwcm9ncmVzcyAuYmFyJykuY3NzKFxyXG4gICAgICAgICAgICAgICAgICAgICd3aWR0aCcsXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZ3Jlc3MgKyAnJSdcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAkKCcjZmlsZXVwbG9hZCcpLmJpbmQoJ2ZpbGV1cGxvYWRhZGQnLCBmdW5jdGlvbiAoZSwgZGF0YSkge1xyXG4gICAgICAgICAgICBjb25zdCBmaWxlc0xpc3QgPSBnZXRFbGVtZW50KCcuZmlsZXMtbGlzdCcpO1xyXG4gICAgICAgICAgICBkYXRhLmZpbGVzLmZvckVhY2goZmlsZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmaWxlc0xpc3QuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVFbmQnLCBgPGxpIGNsYXNzPVwiZmlsZXMtbGlzdF9faXRlbVwiPiR7ZmlsZS5uYW1lfTwvbGk+YCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXRcclxuICAgIH1cclxufSkoKTtcclxuZmlsZVVwTG9hZC5pbml0KCk7IiwiY29uc3QgbW9iTmF2ID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBjb25zdCBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9zZXRVcExpc3RlbmVycygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBfc2V0VXBMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbW9iTmF2QnRuU2hvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdG9nZ2xlQWN0aXZlKG1vYk5hdik7XHJcbiAgICAgICAgICAgIG9mZlNjcm9sbCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG1vYk5hdi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG5hdkFjdGlvbik7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG1vYk5hdkJ0blNob3cgPSBnZXRFbGVtZW50KCcjbW9iLW5hdi10cmlnZ2VyJyk7XHJcbiAgICBjb25zdCBtb2JOYXZCdG5DbG9zZSA9IGdldEVsZW1lbnQoJy5tb2ItbmF2X19jbG9zZS1idG4nKTtcclxuICAgIGNvbnN0IG1vYk5hdiA9IGdldEVsZW1lbnQoJy5tb2ItbmF2Jyk7XHJcbiAgICBsZXQgY29udGFpbmVyO1xyXG4gICAgbGV0IGJhY2tCdG47XHJcblxyXG4gICAgZnVuY3Rpb24gb2ZmU2Nyb2xsKCkge1xyXG4gICAgICAgIGxldCBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpO1xyXG4gICAgICAgIGxldCBvdmVyZmxvdyA9IHN0eWxlcy5vdmVyZmxvdztcclxuICAgICAgICBpZiAob3ZlcmZsb3cgIT09IFwiaGlkZGVuXCIpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCJcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBuYXZBY3Rpb24oZSkge1xyXG4gICAgICAgIGxldCBtb2JOYXZMaW5rcyA9IG1vYk5hdi5xdWVyeVNlbGVjdG9yQWxsKCdhJyk7XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gbW9iTmF2QnRuU2hvdyB8fCBlLnRhcmdldCA9PT0gbW9iTmF2QnRuQ2xvc2UpIHtcclxuICAgICAgICAgICAgdG9nZ2xlQWN0aXZlKG1vYk5hdik7XHJcbiAgICAgICAgICAgIG9mZlNjcm9sbCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQXJyYXkuZnJvbShtb2JOYXZMaW5rcykuZm9yRWFjaChsaW5rID0+IHtcclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBsaW5rKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGluay5uZXh0RWxlbWVudFNpYmxpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIgPSBsaW5rLm5leHRFbGVtZW50U2libGluZztcclxuICAgICAgICAgICAgICAgICAgICBiYWNrQnRuID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5tb2ItbmF2X19iYWNrLWJ0bicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmsubmV4dEVsZW1lbnRTaWJsaW5nLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gYmFja0J0bikge1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IGNvbnRhaW5lci5jbG9zZXN0KCd1bCcpO1xyXG4gICAgICAgICAgICB0b2dnbGVBY3RpdmUoY29udGFpbmVyKTtcclxuICAgICAgICAgICAgY29udGFpbmVyID0gbGlzdC5jbG9zZXN0KCdkaXYnKTtcclxuICAgICAgICAgICAgaWYgKGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgICAgICAgYmFja0J0biA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcubW9iLW5hdl9fYmFjay1idG4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b2dnbGVBY3RpdmUoZWxlbSkge1xyXG4gICAgICAgIGlmIChlbGVtLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXRcclxuICAgIH1cclxufSkoKTtcclxubW9iTmF2LmluaXQoKTtcclxuIiwiY29uc3QgbW9kYWxDb21tb24gPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgIGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYobW9kYWwpIHtcclxuICAgICAgICAgICAgX3NldFVwTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBfc2V0VXBMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2xvc2VCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHN3aXRjaERpc3BsYXkudG9nZ2xlRGlzcGxheSgnLm1vZGFsLWNvbW1vbicpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG1vZGFsID0gZ2V0RWxlbWVudCgnLm1vZGFsLWNvbW1vbicpO1xyXG4gICAgY29uc3QgY2xvc2VCdG4gPSBnZXRFbGVtZW50KCcjY2xvc2UtbW9kYWwtY29tbW9uJyk7XHJcblxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdFxyXG4gICAgfVxyXG59KSgpO1xyXG5tb2RhbENvbW1vbi5pbml0KCk7IiwiY29uc3QgbW9kYWxXaW5kb3cgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuXHRjb25zdCBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0Y29uc3QgYmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtYWluLmNhcmQtcHJvZHVjdCcpO1xyXG5cdFx0aWYoYmxvY2spIHtcclxuXHRcdFx0X3NldFVwTGlzdG5lcnMoKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cdGNvbnN0IF9zZXRVcExpc3RuZXJzID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0Y2xvc2VNb2RhbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTW9kYWwpO1xyXG5cdFx0c2hvd01vZGFsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2hvd01vZGFsKTtcclxuICAgICAgICBzbGlkZURpc3BsYXkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzaG93TW9kYWwpO1xyXG5cdH07XHJcblxyXG5cdGNvbnN0IG1vZGFsID0gZ2V0RWxlbWVudCgnI2pzLW1vZGFsJyksXHJcblx0XHRjbG9zZU1vZGFsQnRuID0gbW9kYWwucXVlcnlTZWxlY3RvcignI2pzLWNsb3NlLWJ0bicpLFxyXG5cdFx0bW9kYWxJbWcgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcjanMtbW9kYWwtaW1nJyksXHJcblx0XHRzaG93TW9kYWxCdG4gPSBnZXRFbGVtZW50KCcjanMtc2hvdy1idG4nKSxcclxuXHRcdHNsaWRlRGlzcGxheSA9IGdldEVsZW1lbnQoJyNqcy1zbGlkZXNob3ctZGlzcGxheScpO1xyXG5cclxuICAgIGZ1bmN0aW9uIG9mZlNjcm9sbCgpIHtcclxuICAgICAgICBsZXQgc3R5bGVzID0gZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5ib2R5KTtcclxuICAgICAgICBsZXQgb3ZlcmZsb3cgPSBzdHlsZXMub3ZlcmZsb3c7XHJcbiAgICAgICAgaWYgKG92ZXJmbG93ICE9PSBcImhpZGRlblwiKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiXHJcblx0XHRcdHJldHVybjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJcIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblx0ZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcclxuXHRcdG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgb2ZmU2Nyb2xsKCk7XHJcblx0fTtcclxuXHJcblx0ZnVuY3Rpb24gc2hvd01vZGFsKCkge1xyXG5cdFx0bGV0IHNsaWRlRGlzcGxheUltZyA9IHNsaWRlRGlzcGxheS5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcclxuXHRcdGxldCBpbWdTcmMgPSBzbGlkZURpc3BsYXlJbWcuYXR0cmlidXRlcy5zcmMudmFsdWU7XHJcblx0XHRtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHRcdG1vZGFsSW1nLnNyYyA9IGltZ1NyYztcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIlxyXG5cdH07XHJcblxyXG5cdFx0XHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXRcclxuXHR9XHJcblxyXG59KSgpO1xyXG4gbW9kYWxXaW5kb3cuaW5pdCgpOyIsImNvbnN0IG9yZGVyQ291bnQgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGNvbnN0IGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKG9yZGVyTGlzdCkge1xyXG4gICAgICAgICAgICBfc2V0VXBMaXN0ZW5lcnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IF9zZXRVcExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGNvdW50T3JkZXIpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBvcmRlckxpc3QgPSBnZXRFbGVtZW50KCcub3JkZXJfX2xpc3QnKTtcclxuICAgIGxldCB0b3RhbEhlaWdodE9mSXRlbXMgPSAwO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvdW50T3JkZXIoKSB7XHJcbiAgICAgICAgbGV0IHN0eWxlc09mT3JkZXJMaXN0ID0gZ2V0Q29tcHV0ZWRTdHlsZShvcmRlckxpc3QpO1xyXG4gICAgICAgIGxldCBoZWlnaHRPZk9yZGVyTGlzdCA9IHBhcnNlRmxvYXQoc3R5bGVzT2ZPcmRlckxpc3QuaGVpZ2h0KTtcclxuICAgICAgICBsZXQgaXRlbXMgPSBvcmRlckxpc3QucXVlcnlTZWxlY3RvckFsbCgnLm9yZGVyX19pdGVtJyk7XHJcblxyXG4gICAgICAgIEFycmF5LmZyb20oaXRlbXMpLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtSGVpZ2h0ID0gcGFyc2VGbG9hdChpdGVtLm9mZnNldEhlaWdodCk7XHJcbiAgICAgICAgICAgIHRvdGFsSGVpZ2h0T2ZJdGVtcyArPSBpdGVtSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgaWYodG90YWxIZWlnaHRPZkl0ZW1zID4gaGVpZ2h0T2ZPcmRlckxpc3QpIHtcclxuICAgICAgICAgICAgICAgIG9yZGVyTGlzdC5jbGFzc0xpc3QuYWRkKCdvcmRlcl9fbGlzdF9vdmVyZmxvdy15Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXRcclxuICAgIH1cclxufSkoKTtcclxuLy8gb3JkZXJDb3VudC5pbml0KCk7XHJcbiIsImNvbnN0IG93bFNsaWRlciA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBfc2V0VXBMaXN0ZW5lcnMoKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAkKFwiI2pzLWZvb3Rlci1zbGlkZXJcIikub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICAgICAgbG9vcDp0cnVlLFxyXG4gICAgICAgICAgICAgICAgbmF2OnRydWUsXHJcbiAgICAgICAgICAgICAgICBpdGVtczo2LFxyXG4gICAgICAgICAgICAgICAgbWFyZ2luOiAxMCxcclxuICAgICAgICAgICAgICAgIGF1dG9wbGF5OnRydWUsXHJcbiAgICAgICAgICAgICAgICBhdXRvcGxheVRpbWVvdXQ6MjAwMCxcclxuICAgICAgICAgICAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZTp0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTp7XHJcbiAgICAgICAgICAgICAgICAgICAgMDp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOjNcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIDYwMDp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOjRcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIDEwMjQ6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtczo2XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJChcIi5wcm9maWxlLW9yZGVyX19saXN0XCIpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgICAgIGxvb3A6ZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBuYXY6dHJ1ZSxcclxuICAgICAgICAgICAgICAgIGl0ZW1zOjYsXHJcbiAgICAgICAgICAgICAgICBtYXJnaW46IDEwLFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2l2ZTp7XHJcbiAgICAgICAgICAgICAgICAgICAgMDp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOjJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIDM1MDp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOjJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIDQ4MDp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOjVcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIDc2ODp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOjVcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIDEwMjQ6e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtczo2XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBpbml0XHJcbiAgICB9XHJcbn0pKCk7XHJcbm93bFNsaWRlci5pbml0KCk7IiwiY29uc3QgcHJvZHVjUGFyYW1zID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBjb25zdCBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChsaXN0ZW5lcikge1xyXG4gICAgICAgICAgICBfc2V0VXBMaXN0ZW5lcnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IF9zZXRVcExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsaXN0ZW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF90b2dnbGVQYXJhbXMpO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IGxpc3RlbmVyID0gZ2V0RWxlbWVudCgnI2Jhc2tldC1saXN0ZW5lcicpO1xyXG4gICAgY29uc3QgYnRucyA9IGdldEFsbEVsZW1lbnRzKCcuYmFza2V0X19wYXJhbXMnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBfdG9nZ2xlUGFyYW1zKGUpIHtcclxuICAgICAgICBBcnJheS5mcm9tKGJ0bnMpLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBidG4pIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGxldCB3cmFwID0gYnRuLnBhcmVudE5vZGU7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFyYW1zTGlzdCA9IHdyYXAucXVlcnlTZWxlY3RvcignLmNhcmQtcHJvZHVjdF9faW5mbycpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhcmFtc0l0ZW1zID0gcGFyYW1zTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZC1wcm9kdWN0X19pbmZvLXJvdycpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3RIZWlnaHQgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgIEFycmF5LmZyb20ocGFyYW1zSXRlbXMpLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoaXRlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGl0ZW1IZWlnaHQgPSBwYXJzZUZsb2F0KHN0eWxlcy5oZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3RIZWlnaHQgKz0gaXRlbUhlaWdodDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChwYXJhbXNMaXN0LnN0eWxlLmhlaWdodCA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXNMaXN0LnN0eWxlLmhlaWdodCA9IGxpc3RIZWlnaHQgKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJhbXNMaXN0LnN0eWxlLmhlaWdodCA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXRcclxuICAgIH1cclxufSkoKTtcclxucHJvZHVjUGFyYW1zLmluaXQoKTtcclxuIiwiY29uc3QgcmVjYWxsTW9kYWwgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBfc2V0VXBMaXN0ZW5lcnMoKTtcclxuICAgIH07XHJcbiAgICBjb25zdCBfc2V0VXBMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2FsbEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgY29tbW9uTW9kYWwudG9nZ2xlTW9kYWwobW9kYWwsICc1MCUnLCAnLTMwMCUnLCBjbG9zZUJ0bik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdG9waWNJbnB1dFdyYXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjaG9pY2VPZlRvcGljKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgY2FsbEJ0biA9IGdldEVsZW1lbnQoJyNidG4tcmVjYWxsJyk7XHJcbiAgICBjb25zdCBjbG9zZUJ0biA9IGdldEVsZW1lbnQoJyNjbG9zZS1yZWNhbGwnKTtcclxuICAgIGNvbnN0IG1vZGFsID0gZ2V0RWxlbWVudCgnLnJlY2FsbCcpO1xyXG4gICAgY29uc3QgdG9waWNJbnB1dFdyYXAgPSBnZXRFbGVtZW50KCcjdG9waWMtaW5wdXQnKTtcclxuXHJcbiAgICBmdW5jdGlvbiBjaG9pY2VPZlRvcGljKGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgY29uc3QgdG9waWNJbnB1dCA9IHRvcGljSW5wdXRXcmFwLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9dGV4dF0nKTtcclxuICAgICAgICBjb25zdCBoaWRkZW5JbnB1dCA9IHRvcGljSW5wdXRXcmFwLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9aGlkZGVuXScpO1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdCA9IHRvcGljSW5wdXRXcmFwLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3QtbGlzdCcpO1xyXG4gICAgICAgIGNvbnN0IHNlbGVjdEl0ZW1zID0gc2VsZWN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZWxlY3QtbGlzdF9fbGluaycpO1xyXG5cclxuICAgICAgICBBcnJheS5mcm9tKHNlbGVjdEl0ZW1zKS5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKGUudGFyZ2V0ID09PSBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICB0b3BpY0lucHV0LnZhbHVlID0gaXRlbS5pbm5lclRleHQ7XHJcbiAgICAgICAgICAgICAgICBoaWRkZW5JbnB1dC52YWx1ZSA9IGl0ZW0uZGF0YXNldC5pZDtcclxuICAgICAgICAgICAgICAgIHRvcGljSW5wdXRXcmFwLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcbiAgICAgICAgICAgICAgICB0b3BpY0lucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvcGljSW5wdXRXcmFwLnN0eWxlLm92ZXJmbG93ID0gJ3Zpc2libGUnO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXRcclxuICAgIH1cclxufSkoKTtcclxucmVjYWxsTW9kYWwuaW5pdCgpOyIsImNvbnN0IFJlZ2lzdHJhdGlvbiA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoY2FsbEJ0bikge1xyXG4gICAgICAgICAgICBfc2V0VXBMaXN0ZW5lcnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IF9zZXRVcExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjYWxsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb21tb25Nb2RhbC50b2dnbGVNb2RhbChyZWdpc3RyYXRpb24sICcwJywgJy0zMDAlJywgY2xvc2VCdG4pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb2dnb3RlblBhc0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhpZGVGb3JtKTtcclxuICAgICAgICBmb2dnb3RlblBhc0JhY2tCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoaWRlRm9ybSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGNhbGxCdG4gPSBnZXRFbGVtZW50KCcjcmVnaXN0cmF0aW9uJyk7XHJcbiAgICBjb25zdCBjbG9zZUJ0biA9IGdldEVsZW1lbnQoJyNjbG9zZS1yZWcnKTtcclxuICAgIGNvbnN0IHJlZ2lzdHJhdGlvbiA9IGdldEVsZW1lbnQoJy5yZWdpc3RyYXRpb24nKTtcclxuICAgIGNvbnN0IGZvZ2dvdGVuUGFzQnRuID0gZ2V0RWxlbWVudCgnLmZvcmdvdHRlbl9fcGFzc3dvcmQnKTtcclxuICAgIGNvbnN0IGZvZ2dvdGVuUGFzQmFja0J0biA9IGdldEVsZW1lbnQoJy5mb3Jnb3R0ZW5fX3Bhc3N3b3JkLWJhY2snKTtcclxuXHJcbiAgICBmdW5jdGlvbiBoaWRlRm9ybSgpIHtcclxuICAgICAgICBsZXQgZm9ybSA9IHRoaXMuY2xvc2VzdCgnLnJlZ2lzdHJhdGlvbl9fZm9ybScpO1xyXG5cclxuICAgICAgICBmb3JtLnN0eWxlLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIGZ1bmN0aW9uIHRyYW5zaXRpb25FbmQoKSB7XHJcbiAgICAgICAgICAgIGlmKGZvcm0ubmV4dEVsZW1lbnRTaWJsaW5nKSB7XHJcbiAgICAgICAgICAgICAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICBmb3JtLm5leHRFbGVtZW50U2libGluZy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChmb3JtLnByZXZpb3VzRWxlbWVudFNpYmxpbmcpIHtcclxuICAgICAgICAgICAgICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgIGZvcm0ucHJldmlvdXNFbGVtZW50U2libGluZy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3JtLnN0eWxlLm9wYWNpdHkgPSAxO1xyXG4gICAgICAgICAgICBmb3JtLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0cmFuc2l0aW9uRW5kKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXRcclxuICAgIH1cclxuXHJcbn0pKCk7XHJcblJlZ2lzdHJhdGlvbi5pbml0KCk7XHJcbiIsImpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcclxuICAgIGpRdWVyeSgnLnNlbGVjdC1saXN0X3Njcm9sbGVkJykuc2Nyb2xsYmFyKCk7XHJcbiAgICBqUXVlcnkoJy5vcmRlcl9fbGlzdCcpLnNjcm9sbGJhcigpO1xyXG59KTsiLCJjb25zdCBzaWRlYmFyID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKGFzaWRlKSB7XHJcbiAgICAgICAgICAgIF9zZXRVcExpc3RlbmVycygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZVNpZGViYXIpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBidG4gPSBnZXRFbGVtZW50KCcjZmlsdGVyLWJ0bicpO1xyXG4gICAgY29uc3QgYXNpZGUgPSBnZXRFbGVtZW50KCcucHJvZHVjdHNfX2FzaWRlJyk7XHJcbiAgICBjb25zdCBhc2lkZUlubmVyID0gZ2V0RWxlbWVudCgnLnByb2R1Y3RzX19hc2lkZS1pbm5lcicpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHRyYW5zaXRpb25FbmQoKSB7XHJcbiAgICAgICAgYXNpZGUuc3R5bGUuekluZGV4ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0b2dnbGVTaWRlYmFyKCkge1xyXG4gICAgICAgIGNvbnN0IGFzaWRlV2lkdGggPSBhc2lkZS5vZmZzZXRXaWR0aDtcclxuXHJcbiAgICAgICAgaWYgKGFzaWRlLmNsYXNzTGlzdC5jb250YWlucygnYWN0aXZlJykpIHtcclxuICAgICAgICAgICAgYXNpZGVJbm5lci5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgdHJhbnNpdGlvbkVuZCk7XHJcbiAgICAgICAgICAgIGJ0bi5zdHlsZS5sZWZ0ID0gMDtcclxuICAgICAgICAgICAgYXNpZGUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYXNpZGVJbm5lci5yZW1vdmVFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgdHJhbnNpdGlvbkVuZCk7XHJcbiAgICAgICAgICAgIGJ0bi5zdHlsZS5sZWZ0ID0gYXNpZGVXaWR0aCArICdweCc7XHJcbiAgICAgICAgICAgIGFzaWRlLnN0eWxlLnpJbmRleCA9IDI7XHJcbiAgICAgICAgICAgIGFzaWRlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXRcclxuICAgIH1cclxufSkoKTtcclxuc2lkZWJhci5pbml0KCk7XHJcbiIsImNvbnN0IGFkZENvdXRuSW5wdXQgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuXHRjb25zdCBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRfc2V0VXBMaXN0bmVycygpO1xyXG5cdH07XHJcblx0Y29uc3QgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRjb25zdCBibG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJkLXByb2R1Y3QnKTtcclxuXHJcblx0XHRpZihibG9jaykge1xyXG5cdFx0XHRpZihzbGlkZVNob3dJdG1zLmxlbmd0aCA9PT0gMSkge1xyXG5cdFx0XHRcdGdldEVsZW1lbnQoJy5zbGlkZXNob3dfX2xpc3Qtd3JhcCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblx0XHRcdH1cclxuXHRcdFx0c2xpZGVTaG93TGlzdC5pbnNlcnRCZWZvcmUoc2xpZGVTaG93TGlzdC5sYXN0RWxlbWVudENoaWxkLCBzbGlkZVNob3dMaXN0LmZpcnN0RWxlbWVudENoaWxkKTtcclxuXHJcblx0XHRcdGNvbnRyb3NsQnRucy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG1vdmVTbGlkZXMpO1xyXG5cdFx0XHRzbGlkZVNob3dMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2xpZGVUb0Rpc3BsYXkpO1xyXG5cdFx0fVxyXG5cdFx0XHRcclxuXHR9XHJcblxyXG5cdGNvbnN0IHNsaWRlc2hvd0Rpc3BsYXkgPSBnZXRFbGVtZW50KCcjanMtc2xpZGVzaG93LWRpc3BsYXknKSxcdFxyXG5cdFx0c2xpZGVTaG93TGlzdCA9IGdldEVsZW1lbnQoJyNqcy1zbGlkZXNob3ctbGlzdCcpLFxyXG5cdFx0c2xpZGVTaG93SXRtcyA9IGdldEFsbEVsZW1lbnRzKCcuc2xpZGVzaG93X19pdGVtJyksXHJcblx0XHRjb250cm9zbEJ0bnMgPSBnZXRFbGVtZW50KCcjanMtY29udHJvbC1idG5zJyk7XHJcblxyXG5cdGZ1bmN0aW9uIG1vdmVTbGlkZXMoZSkge1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdGNvbnN0IG5leHRCdG4gPSBjb250cm9zbEJ0bnMucXVlcnlTZWxlY3RvcignI2pzLW5leHQtLWJ0bicpLFxyXG5cdFx0XHRwcmV2QnRuID0gY29udHJvc2xCdG5zLnF1ZXJ5U2VsZWN0b3IoJyNqcy1wcmV2LS1idG4nKTtcclxuXHJcblx0XHRsZXQgZmlyc3RDaGlsZCA9IHNsaWRlU2hvd0xpc3QuZmlyc3RFbGVtZW50Q2hpbGQsXHJcblx0XHRcdGxhc3RDaGlsZCA9IHNsaWRlU2hvd0xpc3QubGFzdEVsZW1lbnRDaGlsZDtcdFx0XHJcblxyXG5cdFx0aWYgKGUudGFyZ2V0ID09PSBuZXh0QnRuKSB7XHRcclxuXHRcdFx0c2xpZGVTaG93TGlzdC5hcHBlbmRDaGlsZChmaXJzdENoaWxkKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoZS50YXJnZXQgPT09IHByZXZCdG4pIHtcclxuXHRcdFx0c2xpZGVTaG93TGlzdC5pbnNlcnRCZWZvcmUobGFzdENoaWxkLCBmaXJzdENoaWxkKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIHNsaWRlVG9EaXNwbGF5KGUpIHtcclxuXHRcdGNvbnN0IHNsaWRlc2hvd0Rpc3BsYXlJbWcgPSBzbGlkZXNob3dEaXNwbGF5LnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xyXG4gICAgICAgIGxldCBzbGlkZXNob3dEaXNwbGF5SW1nU3JjID0gc2xpZGVzaG93RGlzcGxheUltZy5hdHRyaWJ1dGVzLnNyYy52YWx1ZTtcclxuXHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBBcnJheS5mcm9tKHNsaWRlU2hvd0l0bXMpLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdGNvbnNvbGUuZGlyKHNsaWRlc2hvd0Rpc3BsYXlJbWdTcmMpO1xyXG5cdFx0XHRsZXQgaW1nID0gaXRlbS5xdWVyeVNlbGVjdG9yKCdpbWcnKTtcclxuXHRcdFx0aWYgKGUudGFyZ2V0ID09PSBpbWcpIHtcclxuXHRcdFx0XHRsZXQgaW1nU3JjID0gaW1nLmF0dHJpYnV0ZXMuc3JjLnZhbHVlO1xyXG5cclxuXHRcdFx0XHRzbGlkZXNob3dEaXNwbGF5SW1nLnNyYyA9IGltZ1NyYztcclxuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBzbGlkZXNob3dEaXNwbGF5SW1nU3JjO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH1cclxuXHRcdFxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBpbml0XHJcblx0fVxyXG5cclxufSkoKTtcclxuXHJcbmFkZENvdXRuSW5wdXQuaW5pdCgpOyIsImNvbnN0IHRhYnMgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuXHRjb25zdCBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRfc2V0VXBMaXN0bmVycygpO1xyXG5cdH07XHJcblx0Y29uc3QgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRjb25zdCBibG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jYXJkLXByb2R1Y3QnKTtcclxuXHJcblx0XHRpZihibG9jaykge1xyXG5cdFx0XHR0YWJDb250ZW50c1swXS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuXHRcdFx0dGFiQ29udHJvbGVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc3dpdGNoVGFicyk7XHJcblx0XHR9XHJcblx0XHRcdFxyXG5cdH1cclxuXHJcblx0Y29uc3QgdGFic0NvbnRhaW5lciA9IGdldEVsZW1lbnQoJy50YWJzJyksXHJcblx0XHR0YWJDb250cm9sZXIgPSBnZXRFbGVtZW50KCcudGFic19fY29udHJvbHMnKSxcclxuXHRcdHRhYkNvbnRlbnRzID0gZ2V0QWxsRWxlbWVudHMoJy50YWJzX19saXN0LWl0ZW0nKTtcclxuXHJcblx0XHRmdW5jdGlvbiBzd2l0Y2hUYWJzKGUpIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRjb25zdCB0YWJMaW5rcyA9IHRhYnNDb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLnRhYnNfX2NvbnRyb2xzLWxpbmsnKTtcclxuXHJcblx0XHRcdGxldCB0YXJnZXQgPSBlLnRhcmdldDtcclxuXHJcbiAgICAgICAgICAgIEFycmF5LmZyb20odGFiTGlua3MpLmZvckVhY2goKGxpbmssIGkpID0+IHtcclxuXHRcdFx0XHRsaW5rLnBhcmVudE5vZGUuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcblx0XHRcdFx0dGFiQ29udGVudHNbaV0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHRcdFx0XHRpZiAodGFyZ2V0ID09PSBsaW5rKSB7XHJcblx0XHRcdFx0XHR0YXJnZXQucGFyZW50Tm9kZS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuXHRcdFx0XHRcdHRhYkNvbnRlbnRzW2ldLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblxyXG5cdFx0XHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXRcclxuXHR9XHJcblxyXG59KSgpO1xyXG4gdGFicy5pbml0KCk7IiwiY29uc3QgdGFnSW5wdXQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiggaW5wdXRUYWcgKSB7XHJcbiAgICAgICAgICAgIF9zZXRVcExpc3RlbmVycygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbGV0IGlucHV0VGFnID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdHlwZV0nKTtcclxuICAgIGxldCBoaWRkZW5JbnB1dDtcclxuICAgIGNvbnN0IHRhZ0xpc3QgPSBgPHVsIGNsYXNzPVwidGFnLWxpc3RcIj48L3VsPmA7XHJcbiAgICBsZXQgaW5wdXRWYWx1ZSA9ICcnO1xyXG5cclxuICAgIGNvbnN0IF9zZXRVcExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsZXQgd3JhcCA9IGlucHV0VGFnLnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgaGlkZGVuSW5wdXQgPSB3cmFwLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJoaWRkZW5cIl0nKTtcclxuICAgICAgICB3cmFwLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlRW5kJywgdGFnTGlzdCk7XHJcblxyXG4gICAgICAgIHdyYXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBkZWxldGVJdGVtKTtcclxuICAgICAgICBpbnB1dFRhZy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgYWRkVGFnKTtcclxuICAgICAgICBpbnB1dFRhZy5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGFkZFRhZyk7XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGFkZFRhZyhlKSB7XHJcblxyXG4gICAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdmFsaWRhdGUoaW5wdXRUYWcudmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAoaW5wdXRUYWcudmFsdWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHRhZ0xpc3QgPSBnZXRFbGVtZW50KCcudGFnLWxpc3QnKTtcclxuICAgICAgICAgICAgaWYgKHZhbGlkYXRlKGlucHV0VGFnLnZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgaW5wdXRWYWx1ZSArPSBgJHtpbnB1dFRhZy52YWx1ZX0sIGA7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpbnB1dFZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGxldCB2YWx1ZU9mQXR0clZhbHVlID0gaW5wdXRWYWx1ZS5zbGljZSgwLCBpbnB1dFZhbHVlLmxlbmd0aCAtIDIpO1xyXG4gICAgICAgICAgICAgICAgaGlkZGVuSW5wdXQudmFsdWUgPSB2YWx1ZU9mQXR0clZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGFnTGlzdC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZUVuZCcsXHJcbiAgICAgICAgICAgICAgICBgPGxpIGNsYXNzPVwidGFnLWxpc3RfX2l0ZW1cIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRhZy1saXN0X19pdGVtLXRleHRcIj4ke2lucHV0VGFnLnZhbHVlfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImRlbGV0ZS1pdGVtXCI+eDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvbGk+YCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaW5wdXRUYWcudmFsdWUgPSAnJztcclxuICAgICAgICAgICAgaW5wdXRUYWcuYmx1cigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkZWxldGVJdGVtKGUpIHtcclxuICAgICAgICBsZXQgYnRucyA9IGdldEFsbEVsZW1lbnRzKCcuZGVsZXRlLWl0ZW0nKTtcclxuXHJcbiAgICAgICAgQXJyYXkuZnJvbShidG5zKS5mb3JFYWNoKGJ0biA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCA9PT0gYnRuKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbSA9IGJ0bi5wYXJlbnROb2RlO1xyXG4gICAgICAgICAgICAgICAgbGV0IGl0ZW1Db250ZW50ID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcudGFnLWxpc3RfX2l0ZW0tdGV4dCcpLmlubmVyVGV4dDtcclxuICAgICAgICAgICAgICAgIGxldCBsaXN0ID0gaXRlbS5jbG9zZXN0KCd1bCcpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRhZ0xpc3QgPSBoaWRkZW5JbnB1dC52YWx1ZS5zcGxpdCgvXFxzKixcXHMqLyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3RyID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgbGlzdC5yZW1vdmVDaGlsZChpdGVtKTtcclxuICAgICAgICAgICAgICAgIHRhZ0xpc3QuZm9yRWFjaCgodGFnLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YWcgPT09IGl0ZW1Db250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZ0xpc3Quc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmICh0YWdMaXN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhZ0xpc3QuZm9yRWFjaCh0YWcgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgKz0gdGFnICsgJywgJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IHN0cjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGlkZGVuSW5wdXQudmFsdWUgPSBpbnB1dFZhbHVlLnNsaWNlKDAsIHN0ci5sZW5ndGggLSAyKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgIGhpZGRlbklucHV0LnZhbHVlID0gaW5wdXRWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlICh2YWx1ZSkge1xyXG4gICAgICAgIGxldCBpdGVtcyA9IGdldEFsbEVsZW1lbnRzKCcudGFnLWxpc3RfX2l0ZW0nKTtcclxuICAgICAgICBsZXQgcmVnRXhwID0gbmV3IFJlZ0V4cChgXiR7dmFsdWV9JGAsICdnJyk7XHJcbiAgICAgICAgbGV0IHZhbGlkID0gdHJ1ZTtcclxuICAgICAgICBBcnJheS5mcm9tKGl0ZW1zKS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBsZXQgaXRlbVRleHQgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YWctbGlzdF9faXRlbS10ZXh0JykuaW5uZXJUZXh0O1xyXG4gICAgICAgICAgICBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YWctbGlzdF9faXRlbS10ZXh0Jykuc3R5bGUuY29sb3IgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICBpZiAoaXRlbVRleHQubWF0Y2gocmVnRXhwKSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5xdWVyeVNlbGVjdG9yKCcudGFnLWxpc3RfX2l0ZW0tdGV4dCcpLnN0eWxlLmNvbG9yID0gJ3JlZCc7XHJcbiAgICAgICAgICAgICAgICB2YWxpZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHZhbGlkO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdFxyXG4gICAgfVxyXG59KSgpO1xyXG50YWdJbnB1dC5pbml0KCk7XHJcbiIsImNvbnN0IHRvZ2dsZVBvZmlsZUxpc3QgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGNvbnN0IGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKHRyaWdnZXJzKSB7XHJcbiAgICAgICAgICAgIF9zZXRVcExpc3RlbmVycygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRyaWdnZXJzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTGlzdCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHRyaWdnZXJzID0gZ2V0RWxlbWVudCgnLnRyaWdnZXJzJyk7XHJcbiAgICBjb25zdCB0cmlnZ2VyR2FsbGVyeSA9IGdldEVsZW1lbnQoJy50cmlnZ2Vyc19fZ2FsbGVyeScpO1xyXG4gICAgY29uc3QgdHJpZ2dlckxpc3QgPSBnZXRFbGVtZW50KCcudHJpZ2dlcnNfX2xpc3QnKTtcclxuICAgIGZ1bmN0aW9uIHRvZ2dsZUxpc3QoZSkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGdldEVsZW1lbnQoJy5wcm9maWxlLW9yZGVyX19jb250ZW50Jyk7XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gdHJpZ2dlckdhbGxlcnkpIHtcclxuICAgICAgICAgICAgdHJpZ2dlckxpc3QuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHRyaWdnZXJHYWxsZXJ5LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnbW9kaWZpZWQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gdHJpZ2dlckxpc3QpIHtcclxuICAgICAgICAgICAgdHJpZ2dlckdhbGxlcnkuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIHRyaWdnZXJMaXN0LmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgnbW9kaWZpZWQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBpbml0XHJcbiAgICB9XHJcbn0pKCk7XHJcbnRvZ2dsZVBvZmlsZUxpc3QuaW5pdCgpO1xyXG4iLCJjb25zdCB0b1BkZiA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAocGRmQnRuKSB7XHJcbiAgICAgICAgICAgIF9zZXRVcExpc3RlbmVycygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHBkZkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX2NvbnZlcnRUb1BkZigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBwZGZCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9wZGYtYnRuJyk7XHJcblxyXG4gICAgZnVuY3Rpb24gX2NvbnZlcnRUb1BkZigpIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xyXG5cclxuICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3BhZ2UtdG8tcGRmJyk7XHJcbiAgICAgICAgaHRtbDJwZGYoZWxlbWVudCwge1xyXG4gICAgICAgICAgICBtYXJnaW46ICAgICAgIDAuMSxcclxuICAgICAgICAgICAgZmlsZW5hbWU6ICAgICAnbXlmaWxlLnBkZicsXHJcbiAgICAgICAgICAgIGltYWdlOiAgICAgICAgeyB0eXBlOiAnanBlZycsIHF1YWxpdHk6IDEgfSxcclxuICAgICAgICAgICAgaHRtbDJjYW52YXM6ICB7IGxldHRlclJlbmRlcmluZzogdHJ1ZSwgdGltZW91dDogMTAwLCB3aWR0aDogNzcwfSxcclxuICAgICAgICAgICAganNQREY6ICAgICAgICB7IHVuaXQ6ICdpbicsIGZvcm1hdDogJ2E0Jywgb3JpZW50YXRpb246ICdwb3J0cmFpdCcgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgncGFnZS10by1wZGYnKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXRcclxuICAgIH1cclxuXHJcbn0pKCk7XHJcbnRvUGRmLmluaXQoKTtcclxuIiwiY29uc3QgdG9QcmludCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IGJ0biA9IGdldEVsZW1lbnQoJy50b3ByaW50LWJ0bicpO1xyXG4gICAgICAgIGlmIChidG4pIHtcclxuICAgICAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5wcmludCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdFxyXG4gICAgfVxyXG59KSgpO1xyXG50b1ByaW50LmluaXQoKTtcclxuIiwiY29uc3QgdXNlckFjdGlvbnMgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuXHRjb25zdCBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRfc2V0VXBMaXN0bmVycygpO1xyXG5cdH07XHJcblx0Y29uc3QgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRibG9ja1VzZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kZGxlVXNlckFjdGlvbiwgZmFsc2UpO1xyXG5cdH07XHJcblxyXG5cdGNvbnN0IGJsb2NrVXNlciA9IGdldEVsZW1lbnQoJyN1c2VyLWJsb2NrJyk7XHJcblxyXG5cdGZ1bmN0aW9uIGhhbmRkbGVVc2VyQWN0aW9uKGUpIHtcclxuXHRcdGNvbnN0IHNlYXJjaEJ0biA9IGJsb2NrVXNlci5xdWVyeVNlbGVjdG9yKCcudXNlcl9fYnRuX3NlYXJjaCcpO1xyXG5cdFx0Y29uc3QgbGFuZ3VhZ2VMaXN0QnRuID0gYmxvY2tVc2VyLnF1ZXJ5U2VsZWN0b3IoJy51c2VyX19idG5fbGFuZ3VhZ2UnKTtcclxuXHRcdGNvbnN0IHByb2ZpbGVCdG4gPSBibG9ja1VzZXIucXVlcnlTZWxlY3RvcignI3Byb2ZpbGUnKTtcclxuXHJcblx0XHRsZXQgdGFyZ2V0ID0gZS50YXJnZXQ7XHJcblxyXG5cdFx0aWYgKHRhcmdldCA9PT0gc2VhcmNoQnRuKSB7XHJcblx0XHRcdG9wZW5TZXJjaCgpO1xyXG5cclxuXHRcdFx0Ly8gY2xvc2UgZWxlbWVudCBieSB0aGUgY2xpY2sgYXQgYW55IHBvaW50IG9mIHdpbmRvd1xyXG5cdFx0XHRsZXQgc3dpdGNoRWxlbSA9IG5ldyB0b2dnbGVFbGVtZW50QXRBbnlQb2ludCgnLnNlYXJjaCcsIG9wZW5TZXJjaCk7XHJcblx0XHRcdHN3aXRjaEVsZW0uYWRkV2luZG93RXZlbnRMaXN0ZW5lcigpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0YXJnZXQgPT09IGxhbmd1YWdlTGlzdEJ0biB8fCB0YXJnZXQucGFyZW50Tm9kZSA9PT0gbGFuZ3VhZ2VMaXN0QnRuKSB7XHJcblx0XHRcdG9wZW5MYW5ndWFnZUxpc3QoKTtcclxuXHJcblx0XHRcdC8vIGNsb3NlIGVsZW1lbnQgYnkgdGhlIGNsaWNrIGF0IGFueSBwb2ludCBvZiB3aW5kb3dcclxuXHRcdFx0bGV0IHN3aXRjaEVsZW0gPSBuZXcgdG9nZ2xlRWxlbWVudEF0QW55UG9pbnQoJy5sYW5ndWFnZScsIG9wZW5MYW5ndWFnZUxpc3QpO1xyXG5cdFx0XHRzd2l0Y2hFbGVtLmFkZFdpbmRvd0V2ZW50TGlzdGVuZXIoKTtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gcHJvZmlsZUJ0bikge1xyXG4gICAgICAgICAgICBvcGVuTG9nb3V0TGlzdCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gY2xvc2UgZWxlbWVudCBieSB0aGUgY2xpY2sgYXQgYW55IHBvaW50IG9mIHdpbmRvd1xyXG4gICAgICAgICAgICBsZXQgc3dpdGNoRWxlbSA9IG5ldyB0b2dnbGVFbGVtZW50QXRBbnlQb2ludCgnLmxvZ291dCcsIG9wZW5Mb2dvdXRMaXN0KTtcclxuICAgICAgICAgICAgc3dpdGNoRWxlbS5hZGRXaW5kb3dFdmVudExpc3RlbmVyKCk7XHJcbiAgICAgICAgfVxyXG5cdH1cclxuXHJcblx0Ly8gc2VhcmNoIGJsb2NrXHJcblx0ZnVuY3Rpb24gb3BlblNlcmNoKCkge1xyXG5cdFx0Y29uc3Qgc2VhcmNoQ29udGFpbmVyID0gYmxvY2tVc2VyLnF1ZXJ5U2VsZWN0b3IoJy5zZWFyY2hfX2lucHV0LXdyYXAnKTtcclxuXHRcdGxldCBzZWFyY2hDb250YWluZXJXaWR0aCA9IHBhcnNlRmxvYXQoc2VhcmNoQ29udGFpbmVyLnN0eWxlLndpZHRoKTtcclxuXHJcblx0XHRpZighc2VhcmNoQ29udGFpbmVyV2lkdGgpIHtcclxuXHRcdFx0aWYgKHdpbmRvdy5vdXRlcldpZHRoID4gMzgwKSB7XHJcbiAgICAgICAgICAgICAgICBzZWFyY2hDb250YWluZXIuc3R5bGUud2lkdGggPSAzNTUgKyAncHgnO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2VhcmNoQ29udGFpbmVyLnN0eWxlLndpZHRoID0gMzAwICsgJ3B4JztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3dpdGNoRGlzcGxheS50b2dnbGVEaXNwbGF5KCcuc2VhcmNoX19pbnB1dC1saXN0Jyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZWFyY2hDb250YWluZXIuc3R5bGUud2lkdGggPSAwO1xyXG5cdFx0XHRzd2l0Y2hEaXNwbGF5LnRvZ2dsZURpc3BsYXkoJy5zZWFyY2hfX2lucHV0LWxpc3QnKTtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuXHQvLyBsYW5ndWFnZSBibG9ja1xyXG5cdGZ1bmN0aW9uIG9wZW5MYW5ndWFnZUxpc3QoKSB7XHJcblx0XHRjb25zdCBsYW5ndWFnZSA9IGJsb2NrVXNlci5xdWVyeVNlbGVjdG9yKCcubGFuZ3VhZ2UnKSxcclxuXHRcdFx0bGFuZ3VhZ2VMaXN0ID0gbGFuZ3VhZ2UucXVlcnlTZWxlY3RvcignLmxhbmd1YWdlX19saXN0Jyk7XHJcblx0XHRsZXQgbGFuZ3VhZ2VIZWlnaHQgPSBsYW5ndWFnZS5jbGllbnRIZWlnaHQ7XHJcblxyXG5cdFx0aWYgKCFsYW5ndWFnZUhlaWdodCkge1xyXG5cdFx0XHRsYW5ndWFnZS5zdHlsZS5oZWlnaHQgPSBsYW5ndWFnZUxpc3QuY2xpZW50SGVpZ2h0ICsgJ3B4JztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGxhbmd1YWdlLnN0eWxlLmhlaWdodCA9IDA7XHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcbiAgICAvLyBwcm9maWxlIGJsb2NrXHJcbiAgICBmdW5jdGlvbiBvcGVuTG9nb3V0TGlzdCgpIHtcclxuICAgICAgICBjb25zdCBsb2dvdXQgPSBibG9ja1VzZXIucXVlcnlTZWxlY3RvcignLmxvZ291dCcpLFxyXG4gICAgICAgICAgICBsb2dvdXRMaXN0ID0gbG9nb3V0LnF1ZXJ5U2VsZWN0b3IoJy5sb2dvdXRfX2xpc3QnKTtcclxuICAgICAgICBsZXQgbG9nb3V0SGVpZ2h0ID0gbG9nb3V0LmNsaWVudEhlaWdodDtcclxuXHJcbiAgICAgICAgaWYgKCFsb2dvdXRIZWlnaHQpIHtcclxuICAgICAgICAgICAgbG9nb3V0LnN0eWxlLmhlaWdodCA9IGxvZ291dExpc3QuY2xpZW50SGVpZ2h0ICsgJ3B4JztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsb2dvdXQuc3R5bGUuaGVpZ2h0ID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHRcdFxyXG5cdHJldHVybiB7XHJcblx0XHRpbml0OiBpbml0XHJcblx0fVxyXG5cclxufSkoKTtcclxudXNlckFjdGlvbnMuaW5pdCgpOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
