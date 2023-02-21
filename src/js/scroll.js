function scroll_work(elements) {
	for (let i = 0; i < elements.length; i++) {
		let element = elements[i];

		if (element.getAttribute("scroll") != "true") {
			let element_clone = element.cloneNode(true);
			element_clone.setAttribute("scroll", "true");

			let top = 0;
			let offset = 0;
			let should_move = false;

			element_clone.addEventListener("mousedown", (e) => {
				should_move = true;
				top = element_clone.scrollLeft;
				offset = e.pageX - element_clone.scrollTop;
				element_clone.classList.add("active");
			});

			element_clone.addEventListener("mouseleave", () => {
				should_move = false;
				element_clone.classList.remove("active");
			});

			element_clone.addEventListener("mouseup", () => {
				should_move = false;
				element_clone.classList.remove("active");
			});

			element_clone.addEventListener("mousemove", (e) => {
				if (!should_move) {
					return;
				}
				e.preventDefault();

				let diffTop = e.pageX - element_clone.offsetLeft;
				let diffOffset = (diffTop - offset) * 3;
				element_clone.scrollLeft = top - diffOffset;
			});

			element.parentNode.replaceChild(element_clone, element);
		}
	}
}

function scroll() {
	scroll_work(document.querySelectorAll(".scroll-horizon"));
	scroll_work(document.querySelectorAll(".scroll-vertical"));
}

scroll();
