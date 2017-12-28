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
            var promise = new Promise(function (resolve, reject) {
                _convertToPdf();
            });
            promise.then(function () {
                console.log('all is allright');
            }, function () {
                alert('something is wrong');
            });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImludGxUZWxSZXF1aXJlLmpzIiwiX2FkZC1jb3VudC1pbnB1dC5qcyIsIl9hZGQtbWVzc2FnZS5qcyIsIl9jaGF0LmpzIiwiX2RhdGVwaWNrZXIuanMiLCJfZmlsaXVwbG9hZC5qcyIsIl9tb2ItbmF2LmpzIiwiX21vZGFsLWNvbW1vbi5qcyIsIl9tb2RhbC13aW5kb3cuanMiLCJfb3JkZXItY291bnQuanMiLCJfb3dsLWNhcm91c2VsLmpzIiwiX3JlY2FsbC1tb2RhbC5qcyIsIl9yZWdpc3RyYXRpb24uanMiLCJfc2Nyb2xsYmFyLmpzIiwiX3NpZGViYXIuanMiLCJfc2xpZGVzaG93LmpzIiwiX3RhYnMuanMiLCJfdGFnLWlucHV0LmpzIiwiX3RvZ2dsZS1wcm9maWxlLW9yZGVyLmpzIiwiX3RvUGRmLmpzIiwiX3RvUHJpbnQuanMiLCJfdXNlci1hY3Rpb24uanMiXSwibmFtZXMiOlsiZSIsIm1hdGNoZXMiLCJtYXRjaGVzU2VsZWN0b3IiLCJzZWxlY3RvciIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsInRoIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzb21lIiwiY2FsbCIsImNsb3Nlc3QiLCJjc3MiLCJub2RlIiwicGFyZW50RWxlbWVudCIsImZyb20iLCJ0b1N0ciIsIk9iamVjdCIsInRvU3RyaW5nIiwiaXNDYWxsYWJsZSIsImZuIiwidG9JbnRlZ2VyIiwidmFsdWUiLCJudW1iZXIiLCJOdW1iZXIiLCJpc05hTiIsImlzRmluaXRlIiwiTWF0aCIsImZsb29yIiwiYWJzIiwibWF4U2FmZUludGVnZXIiLCJwb3ciLCJ0b0xlbmd0aCIsImxlbiIsIm1pbiIsIm1heCIsImFycmF5TGlrZSIsIkMiLCJpdGVtcyIsIlR5cGVFcnJvciIsIm1hcEZuIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwiVCIsIkEiLCJrIiwia1ZhbHVlIiwiRWxlbWVudCIsImdldEVsZW1lbnQiLCJlbGVtIiwicXVlcnlTZWxlY3RvciIsImdldEFsbEVsZW1lbnRzIiwic3dpdGNoRGlzcGxheSIsInRvZ2dsZURpc3BsYXkiLCJpIiwic3R5bGVzIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImRpc3BsYXkiLCJzdHlsZSIsInRvZ2dsZUVsZW1lbnRBdEFueVBvaW50IiwiZnVuYyIsInRoYXQiLCJzZXRUaW1lb3V0Iiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZUNsb3NlIiwidGFyZ2V0IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNvbW1vbk1vZGFsIiwiY3VydGFpbiIsInRvZ2dsZU1vZGFsIiwicGx1cyIsIm1pbnVzIiwiYnRuIiwidG9wUG9zIiwidG9wIiwicG9zaXRpb25PZk1vZGFsIiwib2ZmU2Nyb2xsIiwiYm9keSIsIm92ZXJmbG93IiwiaW50bFRlbFJlcXVpcmUiLCJpbml0IiwiX3NldFVwTGlzdGVuZXJzIiwiJCIsImludGxUZWxJbnB1dCIsImluaXRpYWxDb3VudHJ5IiwiZ2VvSXBMb29rdXAiLCJjYWxsYmFjayIsImdldCIsImFsd2F5cyIsInJlc3AiLCJjb3VudHJ5Q29kZSIsImNvdW50cnkiLCJwaG9uZTEiLCJwaG9uZTIiLCJvcmRlclBob25lIiwicmVwbGFjZUxhYmVsQW5kVmFsaWRhdGUiLCJzZXBhcmF0ZURpYWxDb2RlIiwiaWQiLCJ3cmFwIiwiaW5wdXRXcmFwIiwid3JhcHBlciIsImludGxUZWxJbnB1dFdyYXAiLCJpbnB1dFdyYXBwZXIiLCJoaWRkZW5JbnB1dCIsImxhYmVsIiwiYXBwZW5kQ2hpbGQiLCJ0ZWxJbnB1dCIsIm9uIiwibmV3VmFsdWUiLCJwbGFjZWhvbGRlciIsInJlcGxhY2UiLCJ2YWwiLCJzdWJzdHJpbmciLCJpbnRsTnVtYmVyIiwiYWRkQ291dG5JbnB1dCIsIndyYXBJbnB1dCIsIl9zZXRVcExpc3RuZXJzIiwiYWRkQ291bnQiLCJiYXNrZXRJbnB1dCIsImNvdW50SW5wdXQiLCJiYXNrZXRUb3RhbENvdW50IiwiZm9yRWFjaCIsImlucHV0IiwiaXRlbSIsImNvdW50IiwicGFyc2VGbG9hdCIsImlucHV0QnRuVXAiLCJpbnB1dEJ0bkRvd24iLCJzdGFydFByaWNlIiwidG90YWxQcmljZSIsInN0YXJ0UHJpY2VWYWx1ZSIsInRvdGFsUHJpY2VWYWx1ZSIsImJhc2tldFRvdGFsQ291bnRWYWx1ZSIsImJhc2tldERlbGV0ZUJ0biIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiaW5uZXJUZXh0IiwiaW5wdXRzIiwiZ2V0RWxlbWVudHNCeU5hbWUiLCJjb25zb2xlIiwibG9nIiwidG9GaXhlZCIsImlucHV0VmFsdWUiLCJhZGRNZXNzYWdlIiwibWVzIiwiY29udHJvbGxlciIsImFkZCIsIm1vZGVsIiwidmlzaWJsZSIsImFkZGVkRWxlbSIsInZpc2libGVFbGVtIiwib3BhY2l0eSIsImRlbGV0aW5nIiwicmVtb3ZlQ2hpbGQiLCJjbGVhclRpbWVvdXQiLCJ2aWV3IiwiY3JlYXRlIiwibWVzc2FnZSIsIm1zZyIsImluc2VydEFkamFjZW50SFRNTCIsImNoYXQiLCJjaGF0SXRlbSIsInNob3dBbGxMaXN0Qm50VGV4dCIsInNob3dBbGxMaXN0Qm50Iiwic2V0SGVpZ2h0b2ZDaGF0TGlzdCIsInNob3dBbGxMaXN0IiwiY2hhdExpc3QiLCJjaGF0TGlzdEhlaWdodCIsIm1hcmdpbkJvdHRvbSIsIm9mZnNldEhlaWdodCIsImhlaWdodCIsImRhdGFzZXQiLCJsYW5nIiwiaHRtbCIsImRhdGVwaWNrZXIiLCJsYW5ndWFnZSIsImZvcm1hdCIsImF1dG9IaWRlIiwiZmlsZVVwTG9hZCIsImZpbGV1cGxvYWQiLCJzaW5nbGVGaWxlVXBsb2FkcyIsImxpbWl0TXVsdGlGaWxlVXBsb2FkU2l6ZU92ZXJoZWFkIiwiZGF0YSIsImRvbmUiLCJiaW5kIiwicHJvZ3Jlc3NhbGwiLCJwcm9ncmVzcyIsInBhcnNlSW50IiwibG9hZGVkIiwidG90YWwiLCJmaWxlc0xpc3QiLCJmaWxlcyIsImZpbGUiLCJuYW1lIiwibW9iTmF2IiwibW9iTmF2QnRuU2hvdyIsInRvZ2dsZUFjdGl2ZSIsIm5hdkFjdGlvbiIsIm1vYk5hdkJ0bkNsb3NlIiwiY29udGFpbmVyIiwiYmFja0J0biIsIm1vYk5hdkxpbmtzIiwibGluayIsIm5leHRFbGVtZW50U2libGluZyIsImxpc3QiLCJyZW1vdmUiLCJtb2RhbENvbW1vbiIsIm1vZGFsIiwiY2xvc2VCdG4iLCJtb2RhbFdpbmRvdyIsImJsb2NrIiwiY2xvc2VNb2RhbEJ0biIsImNsb3NlTW9kYWwiLCJzaG93TW9kYWxCdG4iLCJzaG93TW9kYWwiLCJzbGlkZURpc3BsYXkiLCJtb2RhbEltZyIsInNsaWRlRGlzcGxheUltZyIsImltZ1NyYyIsImF0dHJpYnV0ZXMiLCJzcmMiLCJvcmRlckNvdW50Iiwib3JkZXJMaXN0IiwiY291bnRPcmRlciIsInRvdGFsSGVpZ2h0T2ZJdGVtcyIsInN0eWxlc09mT3JkZXJMaXN0IiwiaGVpZ2h0T2ZPcmRlckxpc3QiLCJpdGVtSGVpZ2h0Iiwib3dsU2xpZGVyIiwib3dsQ2Fyb3VzZWwiLCJsb29wIiwibmF2IiwibWFyZ2luIiwiYXV0b3BsYXkiLCJhdXRvcGxheVRpbWVvdXQiLCJhdXRvcGxheUhvdmVyUGF1c2UiLCJyZXNwb25zaXZlIiwicmVjYWxsTW9kYWwiLCJjYWxsQnRuIiwidG9waWNJbnB1dFdyYXAiLCJjaG9pY2VPZlRvcGljIiwicHJldmVudERlZmF1bHQiLCJ0b3BpY0lucHV0Iiwic2VsZWN0Iiwic2VsZWN0SXRlbXMiLCJSZWdpc3RyYXRpb24iLCJyZWdpc3RyYXRpb24iLCJmb2dnb3RlblBhc0J0biIsImhpZGVGb3JtIiwiZm9nZ290ZW5QYXNCYWNrQnRuIiwiZm9ybSIsInRyYW5zaXRpb25FbmQiLCJwcmV2aW91c0VsZW1lbnRTaWJsaW5nIiwialF1ZXJ5IiwicmVhZHkiLCJzY3JvbGxiYXIiLCJzaWRlYmFyIiwiYXNpZGUiLCJ0b2dnbGVTaWRlYmFyIiwiYXNpZGVJbm5lciIsInpJbmRleCIsImFzaWRlV2lkdGgiLCJvZmZzZXRXaWR0aCIsImxlZnQiLCJzbGlkZVNob3dJdG1zIiwic2xpZGVTaG93TGlzdCIsImluc2VydEJlZm9yZSIsImxhc3RFbGVtZW50Q2hpbGQiLCJmaXJzdEVsZW1lbnRDaGlsZCIsImNvbnRyb3NsQnRucyIsIm1vdmVTbGlkZXMiLCJzbGlkZVRvRGlzcGxheSIsInNsaWRlc2hvd0Rpc3BsYXkiLCJuZXh0QnRuIiwicHJldkJ0biIsImZpcnN0Q2hpbGQiLCJsYXN0Q2hpbGQiLCJzbGlkZXNob3dEaXNwbGF5SW1nIiwic2xpZGVzaG93RGlzcGxheUltZ1NyYyIsImRpciIsImltZyIsInRhYnMiLCJ0YWJDb250ZW50cyIsInRhYkNvbnRyb2xlciIsInN3aXRjaFRhYnMiLCJ0YWJzQ29udGFpbmVyIiwidGFiTGlua3MiLCJwYXJlbnROb2RlIiwidGFnSW5wdXQiLCJpbnB1dFRhZyIsInRhZ0xpc3QiLCJkZWxldGVJdGVtIiwiYWRkVGFnIiwia2V5Q29kZSIsInZhbGlkYXRlIiwidmFsdWVPZkF0dHJWYWx1ZSIsInNsaWNlIiwiYmx1ciIsImJ0bnMiLCJpdGVtQ29udGVudCIsInNwbGl0Iiwic3RyIiwidGFnIiwiaW5kZXgiLCJzcGxpY2UiLCJyZWdFeHAiLCJSZWdFeHAiLCJ2YWxpZCIsIml0ZW1UZXh0IiwiY29sb3IiLCJtYXRjaCIsInRvZ2dsZVBvZmlsZUxpc3QiLCJ0cmlnZ2VycyIsInRvZ2dsZUxpc3QiLCJ0cmlnZ2VyR2FsbGVyeSIsInRyaWdnZXJMaXN0IiwidG9QZGYiLCJwZGZCdG4iLCJwcm9taXNlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJfY29udmVydFRvUGRmIiwidGhlbiIsImFsZXJ0IiwiZWxlbWVudCIsImh0bWwycGRmIiwiZmlsZW5hbWUiLCJpbWFnZSIsInR5cGUiLCJxdWFsaXR5IiwiaHRtbDJjYW52YXMiLCJsZXR0ZXJSZW5kZXJpbmciLCJ0aW1lb3V0Iiwid2lkdGgiLCJqc1BERiIsInVuaXQiLCJvcmllbnRhdGlvbiIsInRvUHJpbnQiLCJwcmludCIsInVzZXJBY3Rpb25zIiwiYmxvY2tVc2VyIiwiaGFuZGRsZVVzZXJBY3Rpb24iLCJzZWFyY2hCdG4iLCJsYW5ndWFnZUxpc3RCdG4iLCJwcm9maWxlQnRuIiwib3BlblNlcmNoIiwic3dpdGNoRWxlbSIsImFkZFdpbmRvd0V2ZW50TGlzdGVuZXIiLCJvcGVuTGFuZ3VhZ2VMaXN0Iiwib3BlbkxvZ291dExpc3QiLCJzZWFyY2hDb250YWluZXIiLCJzZWFyY2hDb250YWluZXJXaWR0aCIsIm91dGVyV2lkdGgiLCJsYW5ndWFnZUxpc3QiLCJsYW5ndWFnZUhlaWdodCIsImNsaWVudEhlaWdodCIsImxvZ291dCIsImxvZ291dExpc3QiLCJsb2dvdXRIZWlnaHQiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLENBQUMsWUFBVztBQUNWO0FBQ0Q7O0FBRUEsRUFBQyxVQUFTQSxDQUFULEVBQVc7QUFDWEEsSUFBRUMsT0FBRixLQUFjRCxFQUFFQyxPQUFGLEdBQVVELEVBQUVFLGVBQUYsSUFBbUIsVUFBU0MsUUFBVCxFQUFrQjtBQUM1RCxPQUFJRixVQUFVRyxTQUFTQyxnQkFBVCxDQUEwQkYsUUFBMUIsQ0FBZDtBQUFBLE9BQW1ERyxLQUFLLElBQXhEO0FBQ0EsVUFBT0MsTUFBTUMsU0FBTixDQUFnQkMsSUFBaEIsQ0FBcUJDLElBQXJCLENBQTBCVCxPQUExQixFQUFtQyxVQUFTRCxDQUFULEVBQVc7QUFDcEQsV0FBT0EsTUFBTU0sRUFBYjtBQUNBLElBRk0sQ0FBUDtBQUdBLEdBTEQ7QUFNQU4sSUFBRVcsT0FBRixHQUFZWCxFQUFFVyxPQUFGLElBQWEsVUFBU0MsR0FBVCxFQUFhO0FBQ3JDLE9BQUlDLE9BQU8sSUFBWDs7QUFFQSxVQUFPQSxJQUFQLEVBQWE7QUFDWixRQUFJQSxLQUFLWixPQUFMLENBQWFXLEdBQWIsQ0FBSixFQUF1QixPQUFPQyxJQUFQLENBQXZCLEtBQ0tBLE9BQU9BLEtBQUtDLGFBQVo7QUFDTDtBQUNELFVBQU8sSUFBUDtBQUNBLEdBUkQ7QUFTTSxNQUFJLENBQUNQLE1BQU1RLElBQVgsRUFBaUI7QUFDYlIsU0FBTVEsSUFBTixHQUFjLFlBQVc7QUFDckIsUUFBSUMsUUFBUUMsT0FBT1QsU0FBUCxDQUFpQlUsUUFB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WCxHQUEwQixJQUFoRDtBQUNILEdBRkQsTUFFTztBQUNIQyxVQUFPNVMsS0FBUCxDQUFhaUgsTUFBYixHQUFzQixDQUF0QjtBQUNIO0FBRUo7O0FBR0osUUFBTztBQUNOMUYsUUFBTUE7QUFEQSxFQUFQO0FBSUEsQ0FoR21CLEVBQXBCO0FBaUdBb1EsWUFBWXBRLElBQVoiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCkge1xyXG4gICd1c2Ugc3RyaWN0JztcclxuXHQvLyBwb2x5ZmlsbCBmb3IgSUVcclxuXHJcblx0KGZ1bmN0aW9uKGUpe1xyXG5cdFx0ZS5tYXRjaGVzIHx8IChlLm1hdGNoZXM9ZS5tYXRjaGVzU2VsZWN0b3J8fGZ1bmN0aW9uKHNlbGVjdG9yKXtcclxuXHRcdFx0dmFyIG1hdGNoZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSwgdGggPSB0aGlzO1xyXG5cdFx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLnNvbWUuY2FsbChtYXRjaGVzLCBmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRyZXR1cm4gZSA9PT0gdGg7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0XHRlLmNsb3Nlc3QgPSBlLmNsb3Nlc3QgfHwgZnVuY3Rpb24oY3NzKXtcclxuXHRcdFx0dmFyIG5vZGUgPSB0aGlzO1xyXG5cclxuXHRcdFx0d2hpbGUgKG5vZGUpIHtcclxuXHRcdFx0XHRpZiAobm9kZS5tYXRjaGVzKGNzcykpIHJldHVybiBub2RlO1xyXG5cdFx0XHRcdGVsc2Ugbm9kZSA9IG5vZGUucGFyZW50RWxlbWVudDtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH07XHJcbiAgICAgICAgaWYgKCFBcnJheS5mcm9tKSB7XHJcbiAgICAgICAgICAgIEFycmF5LmZyb20gPSAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG9TdHIgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgdmFyIGlzQ2FsbGFibGUgPSBmdW5jdGlvbihmbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicgfHwgdG9TdHIuY2FsbChmbikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdmFyIHRvSW50ZWdlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBudW1iZXIgPSBOdW1iZXIodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc05hTihudW1iZXIpKSB7IHJldHVybiAwOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bWJlciA9PT0gMCB8fCAhaXNGaW5pdGUobnVtYmVyKSkgeyByZXR1cm4gbnVtYmVyOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChudW1iZXIgPiAwID8gMSA6IC0xKSAqIE1hdGguZmxvb3IoTWF0aC5hYnMobnVtYmVyKSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdmFyIG1heFNhZmVJbnRlZ2VyID0gTWF0aC5wb3coMiwgNTMpIC0gMTtcclxuICAgICAgICAgICAgICAgIHZhciB0b0xlbmd0aCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsZW4gPSB0b0ludGVnZXIodmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChsZW4sIDApLCBtYXhTYWZlSW50ZWdlcik7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBDID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSBPYmplY3QoYXJyYXlMaWtlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5TGlrZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LmZyb20gcmVxdWlyZXMgYW4gYXJyYXktbGlrZSBvYmplY3QgLSBub3QgbnVsbCBvciB1bmRlZmluZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hcEZuID0gYXJndW1lbnRzWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbWFwRm4gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcEZuID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB2b2lkIHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNDYWxsYWJsZShtYXBGbikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LmZyb206IHdoZW4gcHJvdmlkZWQsIHRoZSBzZWNvbmQgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFQgPSBhcmd1bWVudHNbMl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsZW4gPSB0b0xlbmd0aChpdGVtcy5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgQSA9IGlzQ2FsbGFibGUoQykgPyBPYmplY3QobmV3IEMobGVuKSkgOiBuZXcgQXJyYXkobGVuKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGsgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBrVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGsgPCBsZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga1ZhbHVlID0gaXRlbXNba107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXBGbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQVtrXSA9IHR5cGVvZiBUID09PSAndW5kZWZpbmVkJyA/IG1hcEZuKGtWYWx1ZSwgaykgOiBtYXBGbi5jYWxsKFQsIGtWYWx1ZSwgayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBW2tdID0ga1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGsgKz0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgQS5sZW5ndGggPSBsZW47XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEE7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KCkpO1xyXG4gICAgICAgIH1cclxuXHR9KShFbGVtZW50LnByb3RvdHlwZSk7XHJcbn0pKCk7XHJcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuJ3VzZSBzdHJpY3QnO1xyXG5mdW5jdGlvbiBnZXRFbGVtZW50KGVsZW0pIHtcclxuXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlbGVtKTtcclxufTtcclxuXHJcbmZ1bmN0aW9uIGdldEFsbEVsZW1lbnRzKGVsZW0pIHtcclxuXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbGVtKTtcclxufTtcclxuXHJcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuY29uc3Qgc3dpdGNoRGlzcGxheSA9IChmdW5jdGlvbiAoKSB7XHJcblx0Ly8gYWRkIGFzIGFyZ3VtZW50IGNzcy1zZWxlY3RvciBvZiBET00gZWxlbWVudCB0aGF0IHlvdSBuZWVkIHRvIHRvZ2dsZSBkaXNwbGF5XHJcblx0Ly8gZXhhbXBsZSBzd2l0Y2hEaXNwbGF5LnRvZ2dsZURpc3BsYXkoJy5jc3Mtc2VsY3RvcicpXHJcblx0bGV0IGVsZW0gPSBudWxsO1xyXG5cdGZ1bmN0aW9uIHRvZ2dsZURpc3BsYXkgKCkge1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0ZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYXJndW1lbnRzW2ldKTtcclxuXHRcdFx0bGV0IHN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoZWxlbSk7XHJcblx0XHRcdGlmIChzdHlsZXMuZGlzcGxheSA9PT0gJ2Jsb2NrJykge1xyXG5cdFx0XHRcdGVsZW0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRlbGVtLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0cmV0dXJuIHtcclxuXHRcdHRvZ2dsZURpc3BsYXk6IHRvZ2dsZURpc3BsYXlcclxuXHR9XHJcblxyXG59KSgpO1xyXG5cclxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5jbGFzcyB0b2dnbGVFbGVtZW50QXRBbnlQb2ludCB7XHJcblx0Y29uc3RydWN0b3IgKHNlbGVjdG9yLCBmdW5jKSB7XHJcblx0XHR0aGlzLmVsZW0gPSBzZWxlY3RvcjtcclxuXHRcdHRoaXMuZnVuYyA9IGZ1bmM7XHJcblx0fTtcclxuXHJcblx0YWRkV2luZG93RXZlbnRMaXN0ZW5lciAoKSB7XHJcblx0XHRjb25zdCB0aGF0ID0gdGhpcztcclxuXHRcdHNldFRpbWVvdXQoKCkgPT4ge1xyXG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiBoYW5kbGVDbG9zZSAoZSkge1xyXG5cdFx0XHRcdGlmKCFlLnRhcmdldC5jbG9zZXN0KHRoYXQuZWxlbSkpIHtcclxuXHRcdFx0XHRcdHRoYXQuZnVuYygpO1xyXG5cdFx0XHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlQ2xvc2UpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHR9O1xyXG59XHJcblxyXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbmNvbnN0IGNvbW1vbk1vZGFsID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0Y29uc3QgY3VydGFpbiA9IGdldEVsZW1lbnQoJy5jdXJ0YWluJyk7XHJcblxyXG5cdC8vIGV4YW1wbGUgb2YgcGFyYW1ldHJzIChlbGVtZW50LCAnNTAlJywgJy0xMDAlJywgY2xvc2VCdG4pXHJcblx0ZnVuY3Rpb24gdG9nZ2xlTW9kYWwoZWxlbSwgcGx1cywgbWludXMsIGJ0bikge1xyXG5cdFx0bGV0IHRvcFBvcyA9IGVsZW0uc3R5bGUudG9wO1xyXG5cdFx0bGV0IHBvc2l0aW9uT2ZNb2RhbCA9IHRvcFBvcztcclxuXHJcblx0XHRpZihwb3NpdGlvbk9mTW9kYWwgPCBwbHVzKSB7XHJcblx0XHRcdGVsZW0uc3R5bGUudG9wID0gcGx1cztcclxuXHRcdFx0b2ZmU2Nyb2xsKCk7XHJcblx0XHRcdC8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBvZmZTY3JvbGwpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZWxlbS5zdHlsZS50b3AgPSBtaW51cztcclxuXHRcdFx0b2ZmU2Nyb2xsKCk7XHJcblx0XHRcdC8vIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBvZmZTY3JvbGwpO1xyXG5cdFx0fVxyXG5cdFx0c3dpdGNoRGlzcGxheS50b2dnbGVEaXNwbGF5KCcuY3VydGFpbicpO1xyXG5cdFx0YnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG5cdFx0XHR0b2dnbGVNb2RhbChlbGVtLCBwbHVzLCBtaW51cywgYnRuKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gb2ZmU2Nyb2xsKCkge1xyXG5cdFx0bGV0IHN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSk7XHJcblx0XHRsZXQgb3ZlcmZsb3cgPSBzdHlsZXMub3ZlcmZsb3c7XHJcblx0XHRpZiAob3ZlcmZsb3cgIT09IFwiaGlkZGVuXCIpIHtcclxuXHRcdFx0ZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCJcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcIlwiXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0dG9nZ2xlTW9kYWw6IHRvZ2dsZU1vZGFsXHJcblx0fVxyXG59KSgpO1xyXG5cclxuXHJcbiIsImNvbnN0IGludGxUZWxSZXF1aXJlID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBjb25zdCBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfc2V0VXBMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBfc2V0VXBMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChcIiNwaG9uZVwiKS5pbnRsVGVsSW5wdXQoe1xyXG4gICAgICAgICAgICBpbml0aWFsQ291bnRyeTogXCJhdXRvXCIsXHJcbiAgICAgICAgICAgIGdlb0lwTG9va3VwOiBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgJC5nZXQoXCJodHRwczovL2lwaW5mby5pb1wiLCBmdW5jdGlvbigpIHt9LCBcImpzb25wXCIpLmFsd2F5cyhmdW5jdGlvbihyZXNwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvdW50cnlDb2RlID0gKHJlc3AgJiYgcmVzcC5jb3VudHJ5KSA/IHJlc3AuY291bnRyeSA6IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soY291bnRyeUNvZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwaG9uZTEgPSBnZXRFbGVtZW50KCcjcGhvbmUnKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGhvbmUyID0gZ2V0RWxlbWVudCgnI3Bob25lLTInKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgb3JkZXJQaG9uZSA9IGdldEVsZW1lbnQoJyNvcmRlci1waG9uZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHBob25lMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXBsYWNlTGFiZWxBbmRWYWxpZGF0ZSgnI3Bob25lJywgJy5yZWNhbGxfX2Zvcm0nLCAnLnJlY2FsbF9faW5wdXQtd3JhcCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZihwaG9uZTIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGFjZUxhYmVsQW5kVmFsaWRhdGUoJyNwaG9uZS0yJywgJy5zZXJ2aWNlc19fZm9ybScsICcuZm9ybV9faW5wdXQtd3JhcCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZihvcmRlclBob25lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcGxhY2VMYWJlbEFuZFZhbGlkYXRlKCcjb3JkZXItcGhvbmUnLCAnLm9yZGVyX19mb3JtJywgJy5mb3JtX19pbnB1dC13cmFwJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcGFyYXRlRGlhbENvZGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKFwiI3Bob25lLTJcIikuaW50bFRlbElucHV0KHtcclxuICAgICAgICAgICAgaW5pdGlhbENvdW50cnk6IFwiYXV0b1wiLFxyXG4gICAgICAgICAgICBzZXBhcmF0ZURpYWxDb2RlOiB0cnVlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgJChcIiNvcmRlci1waG9uZVwiKS5pbnRsVGVsSW5wdXQoe1xyXG4gICAgICAgICAgICBpbml0aWFsQ291bnRyeTogXCJhdXRvXCIsXHJcbiAgICAgICAgICAgIHNlcGFyYXRlRGlhbENvZGU6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZXBsYWNlTGFiZWxBbmRWYWxpZGF0ZSAoaWQsIHdyYXAsIGlucHV0V3JhcCkge1xyXG4gICAgICAgIGxldCB3cmFwcGVyID0gZ2V0RWxlbWVudCh3cmFwKTtcclxuICAgICAgICBsZXQgaW50bFRlbElucHV0V3JhcCA9IHdyYXBwZXIucXVlcnlTZWxlY3RvcignLmludGwtdGVsLWlucHV0Jyk7XHJcbiAgICAgICAgbGV0IGlucHV0V3JhcHBlciA9IGludGxUZWxJbnB1dFdyYXAuY2xvc2VzdChpbnB1dFdyYXApO1xyXG4gICAgICAgIGxldCBoaWRkZW5JbnB1dCA9IGlucHV0V3JhcHBlci5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwiaGlkZGVuXCJdJylcclxuICAgICAgICBsZXQgbGFiZWwgPSBpbnB1dFdyYXBwZXIucXVlcnlTZWxlY3RvcignbGFiZWwnKTtcclxuICAgICAgICBpbnRsVGVsSW5wdXRXcmFwLmFwcGVuZENoaWxkKGxhYmVsKTtcclxuXHJcbiAgICAgICAgdmFyIHRlbElucHV0ID0gJChpZCk7XHJcbiAgICAgICAgdGVsSW5wdXQub24oXCJpbnB1dFwiLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IGUudGFyZ2V0LnBsYWNlaG9sZGVyLnJlcGxhY2UoL1teMC05XFwuXS9nLCcnKS5sZW5ndGg7XHJcbiAgICAgICAgICAgICQodGhpcykub24oJ2tleXVwJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnZhbCgkKHRoaXMpLnZhbCgpLnJlcGxhY2UoL1xcRC9nLCcnKSk7XHJcbiAgICAgICAgICAgICAgICBpZigkKHRoaXMpLnZhbCgpLnJlcGxhY2UoL1xcRC9nLCcnKS5sZW5ndGg+bmV3VmFsdWUpe1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykudmFsKCQodGhpcykudmFsKCkuc3Vic3RyaW5nKDAsbmV3VmFsdWUpKSA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB2YXIgaW50bE51bWJlciA9ICQoXCIjb3JkZXItcGhvbmVcIikuaW50bFRlbElucHV0KFwiZ2V0TnVtYmVyXCIpO1xyXG4gICAgICAgICAgICBoaWRkZW5JbnB1dC52YWx1ZSA9IGludGxOdW1iZXI7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBpbml0XHJcbiAgICB9XHJcbn0pKCk7XHJcbmludGxUZWxSZXF1aXJlLmluaXQoKTtcclxuIiwiY29uc3QgYWRkQ291dG5JbnB1dCA9IChmdW5jdGlvbiAoKSB7XHJcblx0Y29uc3QgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmKHdyYXBJbnB1dC5sZW5ndGgpIHtcclxuXHRcdFx0X3NldFVwTGlzdG5lcnMoKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cdGNvbnN0IF9zZXRVcExpc3RuZXJzID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGFkZENvdW50KTtcclxuXHR9O1xyXG5cclxuXHRjb25zdCBiYXNrZXRJbnB1dCA9IGdldEFsbEVsZW1lbnRzKCcuYmFza2V0X19pdGVtLWNvbnRlbnQnKTtcclxuXHRjb25zdCBjb3VudElucHV0ID0gZ2V0QWxsRWxlbWVudHMoJy5qcy1hZGQtY291bnQnKTtcclxuXHRjb25zdCB3cmFwSW5wdXQgPSBiYXNrZXRJbnB1dC5sZW5ndGggPT09IDAgPyBjb3VudElucHV0IDogYmFza2V0SW5wdXQ7XHJcblx0Y29uc3QgYmFza2V0VG90YWxDb3VudCA9IGdldEVsZW1lbnQoJy5iYXNrZXRfX3RvdGFsLWNvdW50Jyk7XHJcblx0ZnVuY3Rpb24gYWRkQ291bnQoZSkge1xyXG5cclxuICAgICAgICBBcnJheS5mcm9tKHdyYXBJbnB1dCkuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0bGV0IGlucHV0ID0gaXRlbS5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLFxyXG5cdFx0XHRcdGNvdW50ID0gcGFyc2VGbG9hdChpbnB1dC52YWx1ZSksXHJcblx0XHRcdFx0aW5wdXRCdG5VcCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLmFkZC1pbnB1dF9fYnRuX3VwJyksXHJcblx0XHRcdFx0aW5wdXRCdG5Eb3duID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuYWRkLWlucHV0X19idG5fZG93bicpLFxyXG4gICAgICAgICAgICAgICAgc3RhcnRQcmljZSxcclxuXHRcdFx0XHR0b3RhbFByaWNlLFxyXG4gICAgICAgICAgICAgICAgc3RhcnRQcmljZVZhbHVlLFxyXG5cdFx0XHRcdHRvdGFsUHJpY2VWYWx1ZSxcclxuXHRcdFx0XHRiYXNrZXRUb3RhbENvdW50VmFsdWUsXHJcblx0XHRcdFx0YmFza2V0RGVsZXRlQnRuO1xyXG5cclxuXHRcdFx0aWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdiYXNrZXRfX2l0ZW0tY29udGVudCcpKSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydFByaWNlID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcucHJpY2Utc3RhcnQtanMgLnByaWNlX19udW1iZXJzJyk7XHJcblx0XHRcdFx0dG90YWxQcmljZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLnByaWNlLXRvdGFsLWpzIC5wcmljZV9fbnVtYmVycycpO1xyXG4gICAgICAgICAgICAgICAgYmFza2V0RGVsZXRlQnRuID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuc3F1YXJlLWJ0bicpO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRQcmljZVZhbHVlID0gcGFyc2VGbG9hdChzdGFydFByaWNlLmlubmVyVGV4dCk7XHJcblx0XHRcdFx0dG90YWxQcmljZVZhbHVlID0gcGFyc2VGbG9hdCh0b3RhbFByaWNlLmlubmVyVGV4dCk7XHJcbiAgICAgICAgICAgICAgICBiYXNrZXRUb3RhbENvdW50VmFsdWUgPSBwYXJzZUZsb2F0KGJhc2tldFRvdGFsQ291bnQuaW5uZXJUZXh0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGUudGFyZ2V0ID09PSBiYXNrZXREZWxldGVCdG4pIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbnB1dHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnY291bnQnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY291bnQgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGlucHV0cykuZm9yRWFjaChpbnB1dCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ICs9IHBhcnNlRmxvYXQoaW5wdXQudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJhc2tldFRvdGFsQ291bnQuaW5uZXJUZXh0ID0gY291bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coY291bnQpO1xyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpc05hTihpbnB1dC52YWx1ZSkgfHwgaW5wdXQudmFsdWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9IDE7XHJcbiAgICAgICAgICAgICAgICBiYXNrZXRUb3RhbENvdW50LmlubmVyVGV4dCA9ICsrYmFza2V0VG90YWxDb3VudFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IGlucHV0QnRuVXApIHtcclxuICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9IGNvdW50O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKHRvdGFsUHJpY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBiYXNrZXRUb3RhbENvdW50LmlubmVyVGV4dCA9ICsrYmFza2V0VG90YWxDb3VudFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsUHJpY2UuaW5uZXJUZXh0ID0gKHRvdGFsUHJpY2VWYWx1ZSArIHN0YXJ0UHJpY2VWYWx1ZSkudG9GaXhlZCgyKTtcclxuXHRcdFx0XHR9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCA9PT0gaW5wdXRCdG5Eb3duKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgPT09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgaW5wdXQudmFsdWUgPSBjb3VudDtcclxuICAgICAgICAgICAgICAgIGlmKHRvdGFsUHJpY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBiYXNrZXRUb3RhbENvdW50LmlubmVyVGV4dCA9IC0tYmFza2V0VG90YWxDb3VudFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdGFsUHJpY2UuaW5uZXJUZXh0ID0gKHRvdGFsUHJpY2VWYWx1ZSAtIHN0YXJ0UHJpY2VWYWx1ZSkudG9GaXhlZCgyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblx0XHRcdGlmKHRvdGFsUHJpY2UpIHtcclxuXHRcdFx0XHRpbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcclxuXHRcdFx0XHRcdGxldCBpbnB1dHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnY291bnQnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IHBhcnNlRmxvYXQoaW5wdXQudmFsdWUpO1xyXG5cdFx0XHRcdFx0bGV0IGNvdW50ID0gMDtcclxuXHJcblx0XHRcdFx0XHRBcnJheS5mcm9tKGlucHV0cykuZm9yRWFjaChpbnB1dCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc05hTihpbnB1dC52YWx1ZSkgfHwgaW5wdXQudmFsdWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudCArPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5wdXRWYWx1ZSA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcblx0XHRcdFx0XHRcdGNvdW50ICs9IHBhcnNlRmxvYXQoaW5wdXQudmFsdWUpO1xyXG5cdFx0XHRcdFx0fSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQcmljZS5pbm5lclRleHQgPSAoc3RhcnRQcmljZVZhbHVlICogaW5wdXRWYWx1ZSkudG9GaXhlZCgyKTtcclxuXHRcdFx0XHRcdGJhc2tldFRvdGFsQ291bnQuaW5uZXJUZXh0ID0gY291bnQ7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHR9IFxyXG5cdFx0XHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXRcclxuXHR9XHJcblxyXG59KSgpO1xyXG5cclxuYWRkQ291dG5JbnB1dC5pbml0KCk7IiwiY29uc3QgYWRkTWVzc2FnZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBpbml0ID0gZnVuY3Rpb24gKG1lcykge1xyXG4gICAgICAgIF9zZXRVcExpc3RlbmVycyhtZXMpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBfc2V0VXBMaXN0ZW5lcnMgPSBmdW5jdGlvbiAobWVzKSB7XHJcbiAgICAgICAgY29udHJvbGxlci5hZGQobWVzKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgbW9kZWwgPSB7XHJcbiAgICAgICAgdmlzaWJsZSAoYWRkZWRFbGVtLCB2aXNpYmxlRWxlbSkge1xyXG4gICAgICAgICAgICBsZXQgdmlzaWJsZSA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZ2V0RWxlbWVudCh2aXNpYmxlRWxlbSkuc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICAgICAgICAgICAgICBsZXQgZGVsZXRpbmcgPSBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBlbGVtID0gZ2V0RWxlbWVudChhZGRlZEVsZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGRlbGV0aW5nKTtcclxuICAgICAgICAgICAgICAgIH0sIDUwMDApO1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHZpc2libGUpO1xyXG4gICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHZpZXcgPSB7XHJcbiAgICAgICAgY3JlYXRlKG1lcykge1xyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYDxkaXYgY2xhc3M9XCJtZXNzYWdlLWFib3V0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1lc3NhZ2UtYWJvdXRfX2NvbnRlbnRcIj4ke21lc308L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXNzYWdlO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgY29udHJvbGxlciA9IHtcclxuICAgICAgICBhZGQobXNnKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlckJlZ2luJywgdmlldy5jcmVhdGUobXNnKSk7XHJcbiAgICAgICAgICAgIG1vZGVsLnZpc2libGUoJy5tZXNzYWdlLWFib3V0JywgJy5tZXNzYWdlLWFib3V0X19jb250ZW50Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXRcclxuICAgIH1cclxufSkoKTtcclxuIiwiY29uc3QgY2hhdCA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZihjaGF0SXRlbS5sZW5ndGggPiAzKSB7XHJcbiAgICAgICAgICAgIHNob3dBbGxMaXN0Qm50VGV4dCA9IHNob3dBbGxMaXN0Qm50LmlubmVyVGV4dDtcclxuICAgICAgICAgICAgX3NldFVwTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBfc2V0VXBMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgc2V0SGVpZ2h0b2ZDaGF0TGlzdCgpO1xyXG4gICAgICAgIHNob3dBbGxMaXN0Qm50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2hvd0FsbExpc3QpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBjaGF0ID0gZ2V0RWxlbWVudCgnLmNoYXQnKTtcclxuICAgIGNvbnN0IGNoYXRMaXN0ID0gZ2V0RWxlbWVudCgnLmNoYXRfX2xpc3QnKTtcclxuICAgIGNvbnN0IGNoYXRJdGVtID0gZ2V0QWxsRWxlbWVudHMoJy5jaGF0X19pdGVtJyk7XHJcbiAgICBjb25zdCBzaG93QWxsTGlzdEJudCA9IGdldEVsZW1lbnQoJyNzaG93LWFsbC1saXN0Jyk7XHJcbiAgICBsZXQgc2hvd0FsbExpc3RCbnRUZXh0O1xyXG4gICAgbGV0IGNoYXRMaXN0SGVpZ2h0ID0gMDtcclxuXHJcbiAgICBmdW5jdGlvbiBzZXRIZWlnaHRvZkNoYXRMaXN0KCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKGNoYXRJdGVtW2ldKTtcclxuICAgICAgICAgICAgbGV0IG1hcmdpbkJvdHRvbSA9IHBhcnNlRmxvYXQoc3R5bGVzLm1hcmdpbkJvdHRvbSk7XHJcbiAgICAgICAgICAgIGNoYXRMaXN0SGVpZ2h0ICs9IGNoYXRJdGVtW2ldLm9mZnNldEhlaWdodCArIG1hcmdpbkJvdHRvbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2hhdExpc3Quc3R5bGUuaGVpZ2h0ID0gY2hhdExpc3RIZWlnaHQgKyAncHgnO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHNob3dBbGxMaXN0KCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHNob3dBbGxMaXN0Qm50VGV4dCk7XHJcbiAgICAgICAgaWYgKCBjaGF0TGlzdC5zdHlsZS5oZWlnaHQgPT09ICcxMDAlJykge1xyXG4gICAgICAgICAgICBjaGF0TGlzdC5zdHlsZS5oZWlnaHQgPSBjaGF0TGlzdEhlaWdodCArICdweCc7XHJcbiAgICAgICAgICAgIHNob3dBbGxMaXN0Qm50LmlubmVyVGV4dCA9IHNob3dBbGxMaXN0Qm50VGV4dDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzaG93QWxsTGlzdEJudC5pbm5lclRleHQgPSBzaG93QWxsTGlzdEJudC5kYXRhc2V0Lmxhbmc7XHJcbiAgICAgICAgICAgIGNoYXRMaXN0LnN0eWxlLmhlaWdodCA9ICcxMDAlJztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBpbml0XHJcbiAgICB9XHJcbn0pKCk7XHJcbmNoYXQuaW5pdCgpO1xyXG4iLCJpZiAoJCgnW2RhdGEtdG9nZ2xlPVwiZGF0ZXBpY2tlclwiXScpKSB7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgICAgICBjb25zdCBodG1sID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaHRtbCcpO1xyXG4gICAgICAgIGxldCBsYW5nID0gaHRtbC5sYW5nO1xyXG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cImRhdGVwaWNrZXJcIl0nKS5kYXRlcGlja2VyKHtcclxuICAgICAgICAgICAgbGFuZ3VhZ2U6IGxhbmcsXHJcbiAgICAgICAgICAgIGZvcm1hdDogJ2RkLm1tLnl5eXknLFxyXG4gICAgICAgICAgICBhdXRvSGlkZTogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn0iLCJjb25zdCBmaWxlVXBMb2FkID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBjb25zdCBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnN0IGlucHV0V3JhcCA9IGdldEVsZW1lbnQoJyNmaWxldXBsb2FkLXdyYXAnKTtcclxuICAgICAgICBpZiAoaW5wdXRXcmFwKSB7XHJcbiAgICAgICAgICAgIGlucHV0V3JhcC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyRW5kJywgYDx1bCBjbGFzcz1cImZpbGVzLWxpc3RcIj48L3VsPmApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJCgnI2ZpbGV1cGxvYWQnKS5maWxldXBsb2FkKHtcclxuICAgICAgICAgICAgc2luZ2xlRmlsZVVwbG9hZHM6IGZhbHNlLFxyXG4gICAgICAgICAgICBsaW1pdE11bHRpRmlsZVVwbG9hZFNpemVPdmVyaGVhZDogMixcclxuICAgICAgICAgICAgYWRkOiBmdW5jdGlvbiAoZSwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkb25lOiBmdW5jdGlvbiAoZSwgZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgJCgnI2ZpbGV1cGxvYWQnKS5iaW5kKCdmaWxldXBsb2FkZG9uZScsIGZ1bmN0aW9uIChlLCBkYXRhKSB7Y29uc29sZS5sb2coJ0RPTkUnKX0pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwcm9ncmVzc2FsbDogZnVuY3Rpb24gKGUsIGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9ncmVzcyA9IHBhcnNlSW50KGRhdGEubG9hZGVkIC8gZGF0YS50b3RhbCAqIDEwMCwgMTApO1xyXG4gICAgICAgICAgICAgICAgJCgnI3Byb2dyZXNzIC5iYXInKS5jc3MoXHJcbiAgICAgICAgICAgICAgICAgICAgJ3dpZHRoJyxcclxuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzcyArICclJ1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQoJyNmaWxldXBsb2FkJykuYmluZCgnZmlsZXVwbG9hZGFkZCcsIGZ1bmN0aW9uIChlLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGVzTGlzdCA9IGdldEVsZW1lbnQoJy5maWxlcy1saXN0Jyk7XHJcbiAgICAgICAgICAgIGRhdGEuZmlsZXMuZm9yRWFjaChmaWxlID0+IHtcclxuICAgICAgICAgICAgICAgIGZpbGVzTGlzdC5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZUVuZCcsIGA8bGkgY2xhc3M9XCJmaWxlcy1saXN0X19pdGVtXCI+JHtmaWxlLm5hbWV9PC9saT5gKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdFxyXG4gICAgfVxyXG59KSgpO1xyXG5maWxlVXBMb2FkLmluaXQoKTsiLCJjb25zdCBtb2JOYXYgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGNvbnN0IGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgX3NldFVwTGlzdGVuZXJzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IF9zZXRVcExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBtb2JOYXZCdG5TaG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0b2dnbGVBY3RpdmUobW9iTmF2KTtcclxuICAgICAgICAgICAgb2ZmU2Nyb2xsKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbW9iTmF2LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbmF2QWN0aW9uKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgbW9iTmF2QnRuU2hvdyA9IGdldEVsZW1lbnQoJyNtb2ItbmF2LXRyaWdnZXInKTtcclxuICAgIGNvbnN0IG1vYk5hdkJ0bkNsb3NlID0gZ2V0RWxlbWVudCgnLm1vYi1uYXZfX2Nsb3NlLWJ0bicpO1xyXG4gICAgY29uc3QgbW9iTmF2ID0gZ2V0RWxlbWVudCgnLm1vYi1uYXYnKTtcclxuICAgIGxldCBjb250YWluZXI7XHJcbiAgICBsZXQgYmFja0J0bjtcclxuXHJcbiAgICBmdW5jdGlvbiBvZmZTY3JvbGwoKSB7XHJcbiAgICAgICAgbGV0IHN0eWxlcyA9IGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuYm9keSk7XHJcbiAgICAgICAgbGV0IG92ZXJmbG93ID0gc3R5bGVzLm92ZXJmbG93O1xyXG4gICAgICAgIGlmIChvdmVyZmxvdyAhPT0gXCJoaWRkZW5cIikge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIlxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcIlwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG5hdkFjdGlvbihlKSB7XHJcbiAgICAgICAgbGV0IG1vYk5hdkxpbmtzID0gbW9iTmF2LnF1ZXJ5U2VsZWN0b3JBbGwoJ2EnKTtcclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBtb2JOYXZCdG5TaG93IHx8IGUudGFyZ2V0ID09PSBtb2JOYXZCdG5DbG9zZSkge1xyXG4gICAgICAgICAgICB0b2dnbGVBY3RpdmUobW9iTmF2KTtcclxuICAgICAgICAgICAgb2ZmU2Nyb2xsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBBcnJheS5mcm9tKG1vYk5hdkxpbmtzKS5mb3JFYWNoKGxpbmsgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IGxpbmspIHtcclxuICAgICAgICAgICAgICAgIGlmIChsaW5rLm5leHRFbGVtZW50U2libGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lciA9IGxpbmsubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tCdG4gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLm1vYi1uYXZfX2JhY2stYnRuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluay5uZXh0RWxlbWVudFNpYmxpbmcuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBiYWNrQnRuKSB7XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gY29udGFpbmVyLmNsb3Nlc3QoJ3VsJyk7XHJcbiAgICAgICAgICAgIHRvZ2dsZUFjdGl2ZShjb250YWluZXIpO1xyXG4gICAgICAgICAgICBjb250YWluZXIgPSBsaXN0LmNsb3Nlc3QoJ2RpdicpO1xyXG4gICAgICAgICAgICBpZiAoY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgICAgICBiYWNrQnRuID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5tb2ItbmF2X19iYWNrLWJ0bicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvZ2dsZUFjdGl2ZShlbGVtKSB7XHJcbiAgICAgICAgaWYgKGVsZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdFxyXG4gICAgfVxyXG59KSgpO1xyXG5tb2JOYXYuaW5pdCgpO1xyXG4iLCJjb25zdCBtb2RhbENvbW1vbiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCAgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZihtb2RhbCkge1xyXG4gICAgICAgICAgICBfc2V0VXBMaXN0ZW5lcnMoKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IF9zZXRVcExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjbG9zZUJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgc3dpdGNoRGlzcGxheS50b2dnbGVEaXNwbGF5KCcubW9kYWwtY29tbW9uJyk7XHJcbiAgICAgICAgfSlcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgbW9kYWwgPSBnZXRFbGVtZW50KCcubW9kYWwtY29tbW9uJyk7XHJcbiAgICBjb25zdCBjbG9zZUJ0biA9IGdldEVsZW1lbnQoJyNjbG9zZS1tb2RhbC1jb21tb24nKTtcclxuXHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBpbml0XHJcbiAgICB9XHJcbn0pKCk7XHJcbm1vZGFsQ29tbW9uLmluaXQoKTsiLCJjb25zdCBtb2RhbFdpbmRvdyA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGNvbnN0IGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRjb25zdCBibG9jayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21haW4uY2FyZC1wcm9kdWN0Jyk7XHJcblx0XHRpZihibG9jaykge1xyXG5cdFx0XHRfc2V0VXBMaXN0bmVycygpO1xyXG5cdFx0fVxyXG5cdH07XHJcblx0Y29uc3QgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRjbG9zZU1vZGFsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xvc2VNb2RhbCk7XHJcblx0XHRzaG93TW9kYWxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzaG93TW9kYWwpO1xyXG4gICAgICAgIHNsaWRlRGlzcGxheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNob3dNb2RhbCk7XHJcblx0fTtcclxuXHJcblx0Y29uc3QgbW9kYWwgPSBnZXRFbGVtZW50KCcjanMtbW9kYWwnKSxcclxuXHRcdGNsb3NlTW9kYWxCdG4gPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcjanMtY2xvc2UtYnRuJyksXHJcblx0XHRtb2RhbEltZyA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJyNqcy1tb2RhbC1pbWcnKSxcclxuXHRcdHNob3dNb2RhbEJ0biA9IGdldEVsZW1lbnQoJyNqcy1zaG93LWJ0bicpLFxyXG5cdFx0c2xpZGVEaXNwbGF5ID0gZ2V0RWxlbWVudCgnI2pzLXNsaWRlc2hvdy1kaXNwbGF5Jyk7XHJcblxyXG4gICAgZnVuY3Rpb24gb2ZmU2Nyb2xsKCkge1xyXG4gICAgICAgIGxldCBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmJvZHkpO1xyXG4gICAgICAgIGxldCBvdmVyZmxvdyA9IHN0eWxlcy5vdmVyZmxvdztcclxuICAgICAgICBpZiAob3ZlcmZsb3cgIT09IFwiaGlkZGVuXCIpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zdHlsZS5vdmVyZmxvdyA9IFwiaGlkZGVuXCJcclxuXHRcdFx0cmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcIlwiXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHRmdW5jdGlvbiBjbG9zZU1vZGFsKCkge1xyXG5cdFx0bW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICBvZmZTY3JvbGwoKTtcclxuXHR9O1xyXG5cclxuXHRmdW5jdGlvbiBzaG93TW9kYWwoKSB7XHJcblx0XHRsZXQgc2xpZGVEaXNwbGF5SW1nID0gc2xpZGVEaXNwbGF5LnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xyXG5cdFx0bGV0IGltZ1NyYyA9IHNsaWRlRGlzcGxheUltZy5hdHRyaWJ1dGVzLnNyYy52YWx1ZTtcclxuXHRcdG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdFx0bW9kYWxJbWcuc3JjID0gaW1nU3JjO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSBcImhpZGRlblwiXHJcblx0fTtcclxuXHJcblx0XHRcclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogaW5pdFxyXG5cdH1cclxuXHJcbn0pKCk7XHJcbiBtb2RhbFdpbmRvdy5pbml0KCk7IiwiY29uc3Qgb3JkZXJDb3VudCA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAob3JkZXJMaXN0KSB7XHJcbiAgICAgICAgICAgIF9zZXRVcExpc3RlbmVycygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgY291bnRPcmRlcik7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG9yZGVyTGlzdCA9IGdldEVsZW1lbnQoJy5vcmRlcl9fbGlzdCcpO1xyXG4gICAgbGV0IHRvdGFsSGVpZ2h0T2ZJdGVtcyA9IDA7XHJcblxyXG4gICAgZnVuY3Rpb24gY291bnRPcmRlcigpIHtcclxuICAgICAgICBsZXQgc3R5bGVzT2ZPcmRlckxpc3QgPSBnZXRDb21wdXRlZFN0eWxlKG9yZGVyTGlzdCk7XHJcbiAgICAgICAgbGV0IGhlaWdodE9mT3JkZXJMaXN0ID0gcGFyc2VGbG9hdChzdHlsZXNPZk9yZGVyTGlzdC5oZWlnaHQpO1xyXG4gICAgICAgIGxldCBpdGVtcyA9IG9yZGVyTGlzdC5xdWVyeVNlbGVjdG9yQWxsKCcub3JkZXJfX2l0ZW0nKTtcclxuXHJcbiAgICAgICAgQXJyYXkuZnJvbShpdGVtcykuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICAgICAgbGV0IGl0ZW1IZWlnaHQgPSBwYXJzZUZsb2F0KGl0ZW0ub2Zmc2V0SGVpZ2h0KTtcclxuICAgICAgICAgICAgdG90YWxIZWlnaHRPZkl0ZW1zICs9IGl0ZW1IZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBpZih0b3RhbEhlaWdodE9mSXRlbXMgPiBoZWlnaHRPZk9yZGVyTGlzdCkge1xyXG4gICAgICAgICAgICAgICAgb3JkZXJMaXN0LmNsYXNzTGlzdC5hZGQoJ29yZGVyX19saXN0X292ZXJmbG93LXknKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdFxyXG4gICAgfVxyXG59KSgpO1xyXG4vLyBvcmRlckNvdW50LmluaXQoKTtcclxuIiwiY29uc3Qgb3dsU2xpZGVyID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBjb25zdCBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9zZXRVcExpc3RlbmVycygpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBfc2V0VXBMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICQoXCIjanMtZm9vdGVyLXNsaWRlclwiKS5vd2xDYXJvdXNlbCh7XHJcbiAgICAgICAgICAgICAgICBsb29wOnRydWUsXHJcbiAgICAgICAgICAgICAgICBuYXY6dHJ1ZSxcclxuICAgICAgICAgICAgICAgIGl0ZW1zOjYsXHJcbiAgICAgICAgICAgICAgICBtYXJnaW46IDEwLFxyXG4gICAgICAgICAgICAgICAgYXV0b3BsYXk6dHJ1ZSxcclxuICAgICAgICAgICAgICAgIGF1dG9wbGF5VGltZW91dDoyMDAwLFxyXG4gICAgICAgICAgICAgICAgYXV0b3BsYXlIb3ZlclBhdXNlOnRydWUsXHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOntcclxuICAgICAgICAgICAgICAgICAgICAwOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6M1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgNjAwOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6NFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgMTAyNDp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOjZcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKFwiLnByb2ZpbGUtb3JkZXJfX2xpc3RcIikub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICAgICAgbG9vcDpmYWxzZSxcclxuICAgICAgICAgICAgICAgIG5hdjp0cnVlLFxyXG4gICAgICAgICAgICAgICAgaXRlbXM6NixcclxuICAgICAgICAgICAgICAgIG1hcmdpbjogMTAsXHJcbiAgICAgICAgICAgICAgICByZXNwb25zaXZlOntcclxuICAgICAgICAgICAgICAgICAgICAwOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6MlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgMzUwOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6MlxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgNDgwOntcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6NVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgNzY4OntcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXM6NVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgMTAyNDp7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zOjZcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXRcclxuICAgIH1cclxufSkoKTtcclxub3dsU2xpZGVyLmluaXQoKTsiLCJjb25zdCByZWNhbGxNb2RhbCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIF9zZXRVcExpc3RlbmVycygpO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IF9zZXRVcExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjYWxsQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb21tb25Nb2RhbC50b2dnbGVNb2RhbChtb2RhbCwgJzUwJScsICctMzAwJScsIGNsb3NlQnRuKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0b3BpY0lucHV0V3JhcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNob2ljZU9mVG9waWMpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBjYWxsQnRuID0gZ2V0RWxlbWVudCgnI2J0bi1yZWNhbGwnKTtcclxuICAgIGNvbnN0IGNsb3NlQnRuID0gZ2V0RWxlbWVudCgnI2Nsb3NlLXJlY2FsbCcpO1xyXG4gICAgY29uc3QgbW9kYWwgPSBnZXRFbGVtZW50KCcucmVjYWxsJyk7XHJcbiAgICBjb25zdCB0b3BpY0lucHV0V3JhcCA9IGdldEVsZW1lbnQoJyN0b3BpYy1pbnB1dCcpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNob2ljZU9mVG9waWMoZSkge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICBjb25zdCB0b3BpY0lucHV0ID0gdG9waWNJbnB1dFdyYXAucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT10ZXh0XScpO1xyXG4gICAgICAgIGNvbnN0IGhpZGRlbklucHV0ID0gdG9waWNJbnB1dFdyYXAucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1oaWRkZW5dJyk7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ID0gdG9waWNJbnB1dFdyYXAucXVlcnlTZWxlY3RvcignLnNlbGVjdC1saXN0Jyk7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0SXRlbXMgPSBzZWxlY3QucXVlcnlTZWxlY3RvckFsbCgnLnNlbGVjdC1saXN0X19saW5rJyk7XHJcblxyXG4gICAgICAgIEFycmF5LmZyb20oc2VsZWN0SXRlbXMpLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaWYoZS50YXJnZXQgPT09IGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHRvcGljSW5wdXQudmFsdWUgPSBpdGVtLmlubmVyVGV4dDtcclxuICAgICAgICAgICAgICAgIGhpZGRlbklucHV0LnZhbHVlID0gaXRlbS5kYXRhc2V0LmlkO1xyXG4gICAgICAgICAgICAgICAgdG9waWNJbnB1dFdyYXAuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuICAgICAgICAgICAgICAgIHRvcGljSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9waWNJbnB1dFdyYXAuc3R5bGUub3ZlcmZsb3cgPSAndmlzaWJsZSc7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdFxyXG4gICAgfVxyXG59KSgpO1xyXG5yZWNhbGxNb2RhbC5pbml0KCk7IiwiY29uc3QgUmVnaXN0cmF0aW9uID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBjb25zdCBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChjYWxsQnRuKSB7XHJcbiAgICAgICAgICAgIF9zZXRVcExpc3RlbmVycygpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNhbGxCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbW1vbk1vZGFsLnRvZ2dsZU1vZGFsKHJlZ2lzdHJhdGlvbiwgJzAnLCAnLTMwMCUnLCBjbG9zZUJ0bik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvZ2dvdGVuUGFzQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGlkZUZvcm0pO1xyXG4gICAgICAgIGZvZ2dvdGVuUGFzQmFja0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhpZGVGb3JtKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgY2FsbEJ0biA9IGdldEVsZW1lbnQoJyNyZWdpc3RyYXRpb24nKTtcclxuICAgIGNvbnN0IGNsb3NlQnRuID0gZ2V0RWxlbWVudCgnI2Nsb3NlLXJlZycpO1xyXG4gICAgY29uc3QgcmVnaXN0cmF0aW9uID0gZ2V0RWxlbWVudCgnLnJlZ2lzdHJhdGlvbicpO1xyXG4gICAgY29uc3QgZm9nZ290ZW5QYXNCdG4gPSBnZXRFbGVtZW50KCcuZm9yZ290dGVuX19wYXNzd29yZCcpO1xyXG4gICAgY29uc3QgZm9nZ290ZW5QYXNCYWNrQnRuID0gZ2V0RWxlbWVudCgnLmZvcmdvdHRlbl9fcGFzc3dvcmQtYmFjaycpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGhpZGVGb3JtKCkge1xyXG4gICAgICAgIGxldCBmb3JtID0gdGhpcy5jbG9zZXN0KCcucmVnaXN0cmF0aW9uX19mb3JtJyk7XHJcblxyXG4gICAgICAgIGZvcm0uc3R5bGUub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgZm9ybS5hZGRFdmVudExpc3RlbmVyKCd0cmFuc2l0aW9uZW5kJywgZnVuY3Rpb24gdHJhbnNpdGlvbkVuZCgpIHtcclxuICAgICAgICAgICAgaWYoZm9ybS5uZXh0RWxlbWVudFNpYmxpbmcpIHtcclxuICAgICAgICAgICAgICAgIGZvcm0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgIGZvcm0ubmV4dEVsZW1lbnRTaWJsaW5nLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZvcm0ucHJldmlvdXNFbGVtZW50U2libGluZykge1xyXG4gICAgICAgICAgICAgICAgZm9ybS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgZm9ybS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvcm0uc3R5bGUub3BhY2l0eSA9IDE7XHJcbiAgICAgICAgICAgIGZvcm0ucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHRyYW5zaXRpb25FbmQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdFxyXG4gICAgfVxyXG5cclxufSkoKTtcclxuUmVnaXN0cmF0aW9uLmluaXQoKTtcclxuIiwialF1ZXJ5KGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG4gICAgalF1ZXJ5KCcuc2VsZWN0LWxpc3Rfc2Nyb2xsZWQnKS5zY3JvbGxiYXIoKTtcclxuICAgIGpRdWVyeSgnLm9yZGVyX19saXN0Jykuc2Nyb2xsYmFyKCk7XHJcbn0pOyIsImNvbnN0IHNpZGViYXIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoYXNpZGUpIHtcclxuICAgICAgICAgICAgX3NldFVwTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBfc2V0VXBMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlU2lkZWJhcik7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGJ0biA9IGdldEVsZW1lbnQoJyNmaWx0ZXItYnRuJyk7XHJcbiAgICBjb25zdCBhc2lkZSA9IGdldEVsZW1lbnQoJy5wcm9kdWN0c19fYXNpZGUnKTtcclxuICAgIGNvbnN0IGFzaWRlSW5uZXIgPSBnZXRFbGVtZW50KCcucHJvZHVjdHNfX2FzaWRlLWlubmVyJyk7XHJcblxyXG4gICAgZnVuY3Rpb24gdHJhbnNpdGlvbkVuZCgpIHtcclxuICAgICAgICBhc2lkZS5zdHlsZS56SW5kZXggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRvZ2dsZVNpZGViYXIoKSB7XHJcbiAgICAgICAgY29uc3QgYXNpZGVXaWR0aCA9IGFzaWRlLm9mZnNldFdpZHRoO1xyXG5cclxuICAgICAgICBpZiAoYXNpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKSkge1xyXG4gICAgICAgICAgICBhc2lkZUlubmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0cmFuc2l0aW9uRW5kKTtcclxuICAgICAgICAgICAgYnRuLnN0eWxlLmxlZnQgPSAwO1xyXG4gICAgICAgICAgICBhc2lkZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhc2lkZUlubmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0cmFuc2l0aW9uRW5kKTtcclxuICAgICAgICAgICAgYnRuLnN0eWxlLmxlZnQgPSBhc2lkZVdpZHRoICsgJ3B4JztcclxuICAgICAgICAgICAgYXNpZGUuc3R5bGUuekluZGV4ID0gMjtcclxuICAgICAgICAgICAgYXNpZGUuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdFxyXG4gICAgfVxyXG59KSgpO1xyXG5zaWRlYmFyLmluaXQoKTtcclxuIiwiY29uc3QgYWRkQ291dG5JbnB1dCA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGNvbnN0IGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdF9zZXRVcExpc3RuZXJzKCk7XHJcblx0fTtcclxuXHRjb25zdCBfc2V0VXBMaXN0bmVycyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGNvbnN0IGJsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcmQtcHJvZHVjdCcpO1xyXG5cclxuXHRcdGlmKGJsb2NrKSB7XHJcblx0XHRcdGlmKHNsaWRlU2hvd0l0bXMubGVuZ3RoID09PSAxKSB7XHJcblx0XHRcdFx0Z2V0RWxlbWVudCgnLnNsaWRlc2hvd19fbGlzdC13cmFwJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHRcdFx0fVxyXG5cdFx0XHRzbGlkZVNob3dMaXN0Lmluc2VydEJlZm9yZShzbGlkZVNob3dMaXN0Lmxhc3RFbGVtZW50Q2hpbGQsIHNsaWRlU2hvd0xpc3QuZmlyc3RFbGVtZW50Q2hpbGQpO1xyXG5cclxuXHRcdFx0Y29udHJvc2xCdG5zLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbW92ZVNsaWRlcyk7XHJcblx0XHRcdHNsaWRlU2hvd0xpc3QuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzbGlkZVRvRGlzcGxheSk7XHJcblx0XHR9XHJcblx0XHRcdFxyXG5cdH1cclxuXHJcblx0Y29uc3Qgc2xpZGVzaG93RGlzcGxheSA9IGdldEVsZW1lbnQoJyNqcy1zbGlkZXNob3ctZGlzcGxheScpLFx0XHJcblx0XHRzbGlkZVNob3dMaXN0ID0gZ2V0RWxlbWVudCgnI2pzLXNsaWRlc2hvdy1saXN0JyksXHJcblx0XHRzbGlkZVNob3dJdG1zID0gZ2V0QWxsRWxlbWVudHMoJy5zbGlkZXNob3dfX2l0ZW0nKSxcclxuXHRcdGNvbnRyb3NsQnRucyA9IGdldEVsZW1lbnQoJyNqcy1jb250cm9sLWJ0bnMnKTtcclxuXHJcblx0ZnVuY3Rpb24gbW92ZVNsaWRlcyhlKSB7XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0Y29uc3QgbmV4dEJ0biA9IGNvbnRyb3NsQnRucy5xdWVyeVNlbGVjdG9yKCcjanMtbmV4dC0tYnRuJyksXHJcblx0XHRcdHByZXZCdG4gPSBjb250cm9zbEJ0bnMucXVlcnlTZWxlY3RvcignI2pzLXByZXYtLWJ0bicpO1xyXG5cclxuXHRcdGxldCBmaXJzdENoaWxkID0gc2xpZGVTaG93TGlzdC5maXJzdEVsZW1lbnRDaGlsZCxcclxuXHRcdFx0bGFzdENoaWxkID0gc2xpZGVTaG93TGlzdC5sYXN0RWxlbWVudENoaWxkO1x0XHRcclxuXHJcblx0XHRpZiAoZS50YXJnZXQgPT09IG5leHRCdG4pIHtcdFxyXG5cdFx0XHRzbGlkZVNob3dMaXN0LmFwcGVuZENoaWxkKGZpcnN0Q2hpbGQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChlLnRhcmdldCA9PT0gcHJldkJ0bikge1xyXG5cdFx0XHRzbGlkZVNob3dMaXN0Lmluc2VydEJlZm9yZShsYXN0Q2hpbGQsIGZpcnN0Q2hpbGQpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2xpZGVUb0Rpc3BsYXkoZSkge1xyXG5cdFx0Y29uc3Qgc2xpZGVzaG93RGlzcGxheUltZyA9IHNsaWRlc2hvd0Rpc3BsYXkucXVlcnlTZWxlY3RvcignaW1nJyk7XHJcbiAgICAgICAgbGV0IHNsaWRlc2hvd0Rpc3BsYXlJbWdTcmMgPSBzbGlkZXNob3dEaXNwbGF5SW1nLmF0dHJpYnV0ZXMuc3JjLnZhbHVlO1xyXG5cdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIEFycmF5LmZyb20oc2xpZGVTaG93SXRtcykuZm9yRWFjaChpdGVtID0+IHtcclxuXHRcdFx0Y29uc29sZS5kaXIoc2xpZGVzaG93RGlzcGxheUltZ1NyYyk7XHJcblx0XHRcdGxldCBpbWcgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJ2ltZycpO1xyXG5cdFx0XHRpZiAoZS50YXJnZXQgPT09IGltZykge1xyXG5cdFx0XHRcdGxldCBpbWdTcmMgPSBpbWcuYXR0cmlidXRlcy5zcmMudmFsdWU7XHJcblxyXG5cdFx0XHRcdHNsaWRlc2hvd0Rpc3BsYXlJbWcuc3JjID0gaW1nU3JjO1xyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IHNsaWRlc2hvd0Rpc3BsYXlJbWdTcmM7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fVxyXG5cdFx0XHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXRcclxuXHR9XHJcblxyXG59KSgpO1xyXG5cclxuYWRkQ291dG5JbnB1dC5pbml0KCk7IiwiY29uc3QgdGFicyA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGNvbnN0IGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdF9zZXRVcExpc3RuZXJzKCk7XHJcblx0fTtcclxuXHRjb25zdCBfc2V0VXBMaXN0bmVycyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGNvbnN0IGJsb2NrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNhcmQtcHJvZHVjdCcpO1xyXG5cclxuXHRcdGlmKGJsb2NrKSB7XHJcblx0XHRcdHRhYkNvbnRlbnRzWzBdLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xyXG5cdFx0XHR0YWJDb250cm9sZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzd2l0Y2hUYWJzKTtcclxuXHRcdH1cclxuXHRcdFx0XHJcblx0fVxyXG5cclxuXHRjb25zdCB0YWJzQ29udGFpbmVyID0gZ2V0RWxlbWVudCgnLnRhYnMnKSxcclxuXHRcdHRhYkNvbnRyb2xlciA9IGdldEVsZW1lbnQoJy50YWJzX19jb250cm9scycpLFxyXG5cdFx0dGFiQ29udGVudHMgPSBnZXRBbGxFbGVtZW50cygnLnRhYnNfX2xpc3QtaXRlbScpO1xyXG5cclxuXHRcdGZ1bmN0aW9uIHN3aXRjaFRhYnMoZSkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdGNvbnN0IHRhYkxpbmtzID0gdGFic0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcudGFic19fY29udHJvbHMtbGluaycpO1xyXG5cclxuXHRcdFx0bGV0IHRhcmdldCA9IGUudGFyZ2V0O1xyXG5cclxuICAgICAgICAgICAgQXJyYXkuZnJvbSh0YWJMaW5rcykuZm9yRWFjaCgobGluaywgaSkgPT4ge1xyXG5cdFx0XHRcdGxpbmsucGFyZW50Tm9kZS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuXHRcdFx0XHR0YWJDb250ZW50c1tpXS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdFx0XHRcdGlmICh0YXJnZXQgPT09IGxpbmspIHtcclxuXHRcdFx0XHRcdHRhcmdldC5wYXJlbnROb2RlLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG5cdFx0XHRcdFx0dGFiQ29udGVudHNbaV0uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0XHRcclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogaW5pdFxyXG5cdH1cclxuXHJcbn0pKCk7XHJcbiB0YWJzLmluaXQoKTsiLCJjb25zdCB0YWdJbnB1dCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmKCBpbnB1dFRhZyApIHtcclxuICAgICAgICAgICAgX3NldFVwTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgaW5wdXRUYWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS10eXBlXScpO1xyXG4gICAgbGV0IGhpZGRlbklucHV0O1xyXG4gICAgY29uc3QgdGFnTGlzdCA9IGA8dWwgY2xhc3M9XCJ0YWctbGlzdFwiPjwvdWw+YDtcclxuICAgIGxldCBpbnB1dFZhbHVlID0gJyc7XHJcblxyXG4gICAgY29uc3QgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxldCB3cmFwID0gaW5wdXRUYWcucGFyZW50RWxlbWVudDtcclxuICAgICAgICBoaWRkZW5JbnB1dCA9IHdyYXAucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImhpZGRlblwiXScpO1xyXG4gICAgICAgIHdyYXAuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVFbmQnLCB0YWdMaXN0KTtcclxuXHJcbiAgICAgICAgd3JhcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGRlbGV0ZUl0ZW0pO1xyXG4gICAgICAgIGlucHV0VGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBhZGRUYWcpO1xyXG4gICAgICAgIGlucHV0VGFnLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgYWRkVGFnKTtcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkVGFnKGUpIHtcclxuXHJcbiAgICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB2YWxpZGF0ZShpbnB1dFRhZy52YWx1ZSk7XHJcbiAgICAgICAgICAgIGlmIChpbnB1dFRhZy52YWx1ZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgdGFnTGlzdCA9IGdldEVsZW1lbnQoJy50YWctbGlzdCcpO1xyXG4gICAgICAgICAgICBpZiAodmFsaWRhdGUoaW5wdXRUYWcudmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICBpbnB1dFZhbHVlICs9IGAke2lucHV0VGFnLnZhbHVlfSwgYDtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGlucHV0VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlT2ZBdHRyVmFsdWUgPSBpbnB1dFZhbHVlLnNsaWNlKDAsIGlucHV0VmFsdWUubGVuZ3RoIC0gMik7XHJcbiAgICAgICAgICAgICAgICBoaWRkZW5JbnB1dC52YWx1ZSA9IHZhbHVlT2ZBdHRyVmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0YWdMaXN0Lmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlRW5kJyxcclxuICAgICAgICAgICAgICAgIGA8bGkgY2xhc3M9XCJ0YWctbGlzdF9faXRlbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGFnLWxpc3RfX2l0ZW0tdGV4dFwiPiR7aW5wdXRUYWcudmFsdWV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZGVsZXRlLWl0ZW1cIj54PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9saT5gKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpbnB1dFRhZy52YWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICBpbnB1dFRhZy5ibHVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRlbGV0ZUl0ZW0oZSkge1xyXG4gICAgICAgIGxldCBidG5zID0gZ2V0QWxsRWxlbWVudHMoJy5kZWxldGUtaXRlbScpO1xyXG5cclxuICAgICAgICBBcnJheS5mcm9tKGJ0bnMpLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBidG4pIHtcclxuICAgICAgICAgICAgICAgIGxldCBpdGVtID0gYnRuLnBhcmVudE5vZGU7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXRlbUNvbnRlbnQgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YWctbGlzdF9faXRlbS10ZXh0JykuaW5uZXJUZXh0O1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpc3QgPSBpdGVtLmNsb3Nlc3QoJ3VsJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGFnTGlzdCA9IGhpZGRlbklucHV0LnZhbHVlLnNwbGl0KC9cXHMqLFxccyovKTtcclxuICAgICAgICAgICAgICAgIGxldCBzdHIgPSAnJztcclxuXHJcbiAgICAgICAgICAgICAgICBsaXN0LnJlbW92ZUNoaWxkKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgdGFnTGlzdC5mb3JFYWNoKCh0YWcsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhZyA9PT0gaXRlbUNvbnRlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhZ0xpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFnTGlzdC5mb3JFYWNoKHRhZyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciArPSB0YWcgKyAnLCAnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dFZhbHVlID0gc3RyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWRkZW5JbnB1dC52YWx1ZSA9IGlucHV0VmFsdWUuc2xpY2UoMCwgc3RyLmxlbmd0aCAtIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnB1dFZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgICAgICAgaGlkZGVuSW5wdXQudmFsdWUgPSBpbnB1dFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdmFsaWRhdGUgKHZhbHVlKSB7XHJcbiAgICAgICAgbGV0IGl0ZW1zID0gZ2V0QWxsRWxlbWVudHMoJy50YWctbGlzdF9faXRlbScpO1xyXG4gICAgICAgIGxldCByZWdFeHAgPSBuZXcgUmVnRXhwKGBeJHt2YWx1ZX0kYCwgJ2cnKTtcclxuICAgICAgICBsZXQgdmFsaWQgPSB0cnVlO1xyXG4gICAgICAgIEFycmF5LmZyb20oaXRlbXMpLmZvckVhY2goaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpdGVtVGV4dCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLnRhZy1saXN0X19pdGVtLXRleHQnKS5pbm5lclRleHQ7XHJcbiAgICAgICAgICAgIGl0ZW0ucXVlcnlTZWxlY3RvcignLnRhZy1saXN0X19pdGVtLXRleHQnKS5zdHlsZS5jb2xvciA9ICd3aGl0ZSc7XHJcbiAgICAgICAgICAgIGlmIChpdGVtVGV4dC5tYXRjaChyZWdFeHApKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy50YWctbGlzdF9faXRlbS10ZXh0Jykuc3R5bGUuY29sb3IgPSAncmVkJztcclxuICAgICAgICAgICAgICAgIHZhbGlkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdmFsaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBpbml0XHJcbiAgICB9XHJcbn0pKCk7XHJcbnRhZ0lucHV0LmluaXQoKTtcclxuIiwiY29uc3QgdG9nZ2xlUG9maWxlTGlzdCA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodHJpZ2dlcnMpIHtcclxuICAgICAgICAgICAgX3NldFVwTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBfc2V0VXBMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdHJpZ2dlcnMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0b2dnbGVMaXN0KTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgdHJpZ2dlcnMgPSBnZXRFbGVtZW50KCcudHJpZ2dlcnMnKTtcclxuICAgIGNvbnN0IHRyaWdnZXJHYWxsZXJ5ID0gZ2V0RWxlbWVudCgnLnRyaWdnZXJzX19nYWxsZXJ5Jyk7XHJcbiAgICBjb25zdCB0cmlnZ2VyTGlzdCA9IGdldEVsZW1lbnQoJy50cmlnZ2Vyc19fbGlzdCcpO1xyXG4gICAgZnVuY3Rpb24gdG9nZ2xlTGlzdChlKSB7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZ2V0RWxlbWVudCgnLnByb2ZpbGUtb3JkZXJfX2NvbnRlbnQnKTtcclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0cmlnZ2VyR2FsbGVyeSkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyTGlzdC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgdHJpZ2dlckdhbGxlcnkuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdtb2RpZmllZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0cmlnZ2VyTGlzdCkge1xyXG4gICAgICAgICAgICB0cmlnZ2VyR2FsbGVyeS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgdHJpZ2dlckxpc3QuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdtb2RpZmllZCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXRcclxuICAgIH1cclxufSkoKTtcclxudG9nZ2xlUG9maWxlTGlzdC5pbml0KCk7XHJcbiIsImNvbnN0IHRvUGRmID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBjb25zdCBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmIChwZGZCdG4pIHtcclxuICAgICAgICAgICAgX3NldFVwTGlzdGVuZXJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBfc2V0VXBMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcGRmQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgIF9jb252ZXJ0VG9QZGYoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYWxsIGlzIGFsbHJpZ2h0Jyk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KCdzb21ldGhpbmcgaXMgd3JvbmcnKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHBkZkJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b3BkZi1idG4nKTtcclxuXHJcbiAgICBmdW5jdGlvbiBfY29udmVydFRvUGRmKCkge1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdib2R5Jyk7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgncGFnZS10by1wZGYnKTtcclxuICAgICAgICBodG1sMnBkZihlbGVtZW50LCB7XHJcbiAgICAgICAgICAgIG1hcmdpbjogICAgICAgMC4xLFxyXG4gICAgICAgICAgICBmaWxlbmFtZTogICAgICdteWZpbGUucGRmJyxcclxuICAgICAgICAgICAgaW1hZ2U6ICAgICAgICB7IHR5cGU6ICdqcGVnJywgcXVhbGl0eTogMSB9LFxyXG4gICAgICAgICAgICBodG1sMmNhbnZhczogIHsgbGV0dGVyUmVuZGVyaW5nOiB0cnVlLCB0aW1lb3V0OiAxMDAsIHdpZHRoOiA3NzB9LFxyXG4gICAgICAgICAgICBqc1BERjogICAgICAgIHsgdW5pdDogJ2luJywgZm9ybWF0OiAnYTQnLCBvcmllbnRhdGlvbjogJ3BvcnRyYWl0JyB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdwYWdlLXRvLXBkZicpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdFxyXG4gICAgfVxyXG5cclxufSkoKTtcclxudG9QZGYuaW5pdCgpO1xyXG4iLCJjb25zdCB0b1ByaW50ID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgYnRuID0gZ2V0RWxlbWVudCgnLnRvcHJpbnQtYnRuJyk7XHJcbiAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB3aW5kb3cucHJpbnQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBpbml0XHJcbiAgICB9XHJcbn0pKCk7XHJcbnRvUHJpbnQuaW5pdCgpO1xyXG4iLCJjb25zdCB1c2VyQWN0aW9ucyA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGNvbnN0IGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdF9zZXRVcExpc3RuZXJzKCk7XHJcblx0fTtcclxuXHRjb25zdCBfc2V0VXBMaXN0bmVycyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGJsb2NrVXNlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGhhbmRkbGVVc2VyQWN0aW9uLCBmYWxzZSk7XHJcblx0fTtcclxuXHJcblx0Y29uc3QgYmxvY2tVc2VyID0gZ2V0RWxlbWVudCgnI3VzZXItYmxvY2snKTtcclxuXHJcblx0ZnVuY3Rpb24gaGFuZGRsZVVzZXJBY3Rpb24oZSkge1xyXG5cdFx0Y29uc3Qgc2VhcmNoQnRuID0gYmxvY2tVc2VyLnF1ZXJ5U2VsZWN0b3IoJy51c2VyX19idG5fc2VhcmNoJyk7XHJcblx0XHRjb25zdCBsYW5ndWFnZUxpc3RCdG4gPSBibG9ja1VzZXIucXVlcnlTZWxlY3RvcignLnVzZXJfX2J0bl9sYW5ndWFnZScpO1xyXG5cdFx0Y29uc3QgcHJvZmlsZUJ0biA9IGJsb2NrVXNlci5xdWVyeVNlbGVjdG9yKCcjcHJvZmlsZScpO1xyXG5cclxuXHRcdGxldCB0YXJnZXQgPSBlLnRhcmdldDtcclxuXHJcblx0XHRpZiAodGFyZ2V0ID09PSBzZWFyY2hCdG4pIHtcclxuXHRcdFx0b3BlblNlcmNoKCk7XHJcblxyXG5cdFx0XHQvLyBjbG9zZSBlbGVtZW50IGJ5IHRoZSBjbGljayBhdCBhbnkgcG9pbnQgb2Ygd2luZG93XHJcblx0XHRcdGxldCBzd2l0Y2hFbGVtID0gbmV3IHRvZ2dsZUVsZW1lbnRBdEFueVBvaW50KCcuc2VhcmNoJywgb3BlblNlcmNoKTtcclxuXHRcdFx0c3dpdGNoRWxlbS5hZGRXaW5kb3dFdmVudExpc3RlbmVyKCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRhcmdldCA9PT0gbGFuZ3VhZ2VMaXN0QnRuIHx8IHRhcmdldC5wYXJlbnROb2RlID09PSBsYW5ndWFnZUxpc3RCdG4pIHtcclxuXHRcdFx0b3Blbkxhbmd1YWdlTGlzdCgpO1xyXG5cclxuXHRcdFx0Ly8gY2xvc2UgZWxlbWVudCBieSB0aGUgY2xpY2sgYXQgYW55IHBvaW50IG9mIHdpbmRvd1xyXG5cdFx0XHRsZXQgc3dpdGNoRWxlbSA9IG5ldyB0b2dnbGVFbGVtZW50QXRBbnlQb2ludCgnLmxhbmd1YWdlJywgb3Blbkxhbmd1YWdlTGlzdCk7XHJcblx0XHRcdHN3aXRjaEVsZW0uYWRkV2luZG93RXZlbnRMaXN0ZW5lcigpO1xyXG5cdFx0fVxyXG5cclxuICAgICAgICBpZiAodGFyZ2V0ID09PSBwcm9maWxlQnRuKSB7XHJcbiAgICAgICAgICAgIG9wZW5Mb2dvdXRMaXN0KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBjbG9zZSBlbGVtZW50IGJ5IHRoZSBjbGljayBhdCBhbnkgcG9pbnQgb2Ygd2luZG93XHJcbiAgICAgICAgICAgIGxldCBzd2l0Y2hFbGVtID0gbmV3IHRvZ2dsZUVsZW1lbnRBdEFueVBvaW50KCcubG9nb3V0Jywgb3BlbkxvZ291dExpc3QpO1xyXG4gICAgICAgICAgICBzd2l0Y2hFbGVtLmFkZFdpbmRvd0V2ZW50TGlzdGVuZXIoKTtcclxuICAgICAgICB9XHJcblx0fVxyXG5cclxuXHQvLyBzZWFyY2ggYmxvY2tcclxuXHRmdW5jdGlvbiBvcGVuU2VyY2goKSB7XHJcblx0XHRjb25zdCBzZWFyY2hDb250YWluZXIgPSBibG9ja1VzZXIucXVlcnlTZWxlY3RvcignLnNlYXJjaF9faW5wdXQtd3JhcCcpO1xyXG5cdFx0bGV0IHNlYXJjaENvbnRhaW5lcldpZHRoID0gcGFyc2VGbG9hdChzZWFyY2hDb250YWluZXIuc3R5bGUud2lkdGgpO1xyXG5cclxuXHRcdGlmKCFzZWFyY2hDb250YWluZXJXaWR0aCkge1xyXG5cdFx0XHRpZiAod2luZG93Lm91dGVyV2lkdGggPiAzODApIHtcclxuICAgICAgICAgICAgICAgIHNlYXJjaENvbnRhaW5lci5zdHlsZS53aWR0aCA9IDM1NSArICdweCc7XHJcblx0XHRcdH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzZWFyY2hDb250YWluZXIuc3R5bGUud2lkdGggPSAzMDAgKyAncHgnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzd2l0Y2hEaXNwbGF5LnRvZ2dsZURpc3BsYXkoJy5zZWFyY2hfX2lucHV0LWxpc3QnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHNlYXJjaENvbnRhaW5lci5zdHlsZS53aWR0aCA9IDA7XHJcblx0XHRcdHN3aXRjaERpc3BsYXkudG9nZ2xlRGlzcGxheSgnLnNlYXJjaF9faW5wdXQtbGlzdCcpO1xyXG5cdFx0fVxyXG5cclxuXHR9XHJcblxyXG5cdC8vIGxhbmd1YWdlIGJsb2NrXHJcblx0ZnVuY3Rpb24gb3Blbkxhbmd1YWdlTGlzdCgpIHtcclxuXHRcdGNvbnN0IGxhbmd1YWdlID0gYmxvY2tVc2VyLnF1ZXJ5U2VsZWN0b3IoJy5sYW5ndWFnZScpLFxyXG5cdFx0XHRsYW5ndWFnZUxpc3QgPSBsYW5ndWFnZS5xdWVyeVNlbGVjdG9yKCcubGFuZ3VhZ2VfX2xpc3QnKTtcclxuXHRcdGxldCBsYW5ndWFnZUhlaWdodCA9IGxhbmd1YWdlLmNsaWVudEhlaWdodDtcclxuXHJcblx0XHRpZiAoIWxhbmd1YWdlSGVpZ2h0KSB7XHJcblx0XHRcdGxhbmd1YWdlLnN0eWxlLmhlaWdodCA9IGxhbmd1YWdlTGlzdC5jbGllbnRIZWlnaHQgKyAncHgnO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bGFuZ3VhZ2Uuc3R5bGUuaGVpZ2h0ID0gMDtcclxuXHRcdH1cclxuXHJcblx0fVxyXG5cclxuICAgIC8vIHByb2ZpbGUgYmxvY2tcclxuICAgIGZ1bmN0aW9uIG9wZW5Mb2dvdXRMaXN0KCkge1xyXG4gICAgICAgIGNvbnN0IGxvZ291dCA9IGJsb2NrVXNlci5xdWVyeVNlbGVjdG9yKCcubG9nb3V0JyksXHJcbiAgICAgICAgICAgIGxvZ291dExpc3QgPSBsb2dvdXQucXVlcnlTZWxlY3RvcignLmxvZ291dF9fbGlzdCcpO1xyXG4gICAgICAgIGxldCBsb2dvdXRIZWlnaHQgPSBsb2dvdXQuY2xpZW50SGVpZ2h0O1xyXG5cclxuICAgICAgICBpZiAoIWxvZ291dEhlaWdodCkge1xyXG4gICAgICAgICAgICBsb2dvdXQuc3R5bGUuaGVpZ2h0ID0gbG9nb3V0TGlzdC5jbGllbnRIZWlnaHQgKyAncHgnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxvZ291dC5zdHlsZS5oZWlnaHQgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cdFx0XHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXRcclxuXHR9XHJcblxyXG59KSgpO1xyXG51c2VyQWN0aW9ucy5pbml0KCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
