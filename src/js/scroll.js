function scroll() {
	const _0x2d3076 = document.querySelectorAll('.scroll-horizon')
	for (let _0x3bade9 = 0; _0x3bade9 < _0x2d3076.length; _0x3bade9++) {
		var _0x5a797b = _0x2d3076[_0x3bade9]
		if (_0x5a797b.getAttribute('scroll') != 'true') {
			const _0x3c43d4 = _0x5a797b.cloneNode(true)
			_0x3c43d4.setAttribute('scroll', 'true')
			let _0x2c4fff = false, _0x1d9ed9, _0x500197
			_0x3c43d4.addEventListener('mousedown', (_0x303f27) => {
				_0x2c4fff = true
				_0x3c43d4.classList.add('active')
				_0x1d9ed9 = _0x303f27.pageX - _0x3c43d4.offsetLeft
				_0x500197 = _0x3c43d4.scrollLeft
			})
			_0x3c43d4.addEventListener('mouseleave', () => {
				_0x2c4fff = false
				_0x3c43d4.classList.remove('active')
			})
			_0x3c43d4.addEventListener('mouseup', () => {
				_0x2c4fff = false
				_0x3c43d4.classList.remove('active')
			})
			_0x3c43d4.addEventListener('mousemove', (_0x43e237) => {
				if (!_0x2c4fff) {
					return
				}
				_0x43e237.preventDefault()
				const _0x3e0056 = _0x43e237.pageX - _0x3c43d4.offsetLeft
					, _0x4722c8 = (_0x3e0056 - _0x1d9ed9) * 3
				_0x3c43d4.scrollLeft = _0x500197 - _0x4722c8
			})
			_0x5a797b.parentNode.replaceChild(_0x3c43d4, _0x5a797b)
		}
	}
	const _0x5a10e5 = document.querySelectorAll('.scroll-vertical')
	for (let _0x3b6c33 = 0; _0x3b6c33 < _0x5a10e5.length; _0x3b6c33++) {
		var _0x5a797b = _0x5a10e5[_0x3b6c33]
		if (_0x5a797b.getAttribute('scroll') != 'true') {
			const _0xa2f41c = _0x5a797b.cloneNode(true)
			_0xa2f41c.setAttribute('scroll', 'true')
			let _0x3e8de8 = false, _0x1d7996, _0x205884
			_0xa2f41c.addEventListener('mousedown', (_0x19e191) => {
				_0x3e8de8 = true
				_0xa2f41c.classList.add('active')
				_0x1d7996 = _0x19e191.pageY - _0xa2f41c.offsetTop
				_0x205884 = _0xa2f41c.scrollTop
			})
			_0xa2f41c.addEventListener('mouseleave', () => {
				_0x3e8de8 = false
				_0xa2f41c.classList.remove('active')
			})
			_0xa2f41c.addEventListener('mouseup', (_0x504d28) => {
				_0x3e8de8 = false
				_0xa2f41c.classList.remove('active')
			})
			_0xa2f41c.addEventListener('mousemove', (_0x4c3796) => {
				if (!_0x3e8de8) {
					return
				}
				_0x4c3796.preventDefault()
				const _0x29f5df = _0x4c3796.pageY - _0xa2f41c.offsetTop
					, _0x2e1410 = (_0x29f5df - _0x1d7996) * 3
				_0xa2f41c.scrollTop = _0x205884 - _0x2e1410
			})
			_0x5a797b.parentNode.replaceChild(_0xa2f41c, _0x5a797b)
		}
	}
}
scroll()
