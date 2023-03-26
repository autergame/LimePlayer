function scroll() {
	for (element of document.querySelectorAll(".scroll_horizon")) {
		if (element.getAttribute("scroll") != "true") {
			let element_clone = element.cloneNode(true);
			element_clone.setAttribute("scroll", "true");

			let oldPagex = 0;
			let scrollLeft = 0;
			let should_move = false;

			element_clone.onmousedown = function (e) {
				should_move = true;
				oldPagex = e.pageX;
				scrollLeft = element_clone.scrollLeft;
			};

			element_clone.onmouseleave = function () {
				if (should_move) {
					toggleA(element_clone, true);
				}
				should_move = false;
			};

			element_clone.onmouseup = function () {
				if (should_move) {
					setTimeout(function () {
						toggleA(element_clone, true);
					}, 1000);
				}
				should_move = false;
			};

			element_clone.onmousemove = function (e) {
				if (should_move) {
					e.preventDefault();
					toggleA(element_clone, false);
					let diffOffset = (e.pageX - oldPagex) * 1.5;
					element_clone.scrollLeft = scrollLeft - diffOffset;
				}
			};

			element.parentNode.replaceChild(element_clone, element);
		}
	}
}

scroll();

let toggledA = false;
function toggleA(element_clone, enable) {
	if (enable) {
		toggledA = false;
	}
	if (!toggledA) {
		for (element of element_clone.querySelectorAll("a")) {
			element.style.pointerEvents = enable ? "" : "none";
		}
		toggledA = true;
	}
}
