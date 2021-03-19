const setEvents = (btn, input, elem) => {
    const event = new Event('change');
    input.addEventListener('change', () => {
        elem.querySelector('.custom-number-show').innerHTML = input.value
    })

    btn.addEventListener('click', (e) => {
        if (btn.getAttribute('data-target') === '+') {
            input.value = parseInt(input.value) + 1
            checkMinMax('+', btn, input)
        } else {
            input.value = parseInt(input.value) - 1
            checkMinMax('-', btn, input)
        }
        input.dispatchEvent(event)
    })
}

const setButton = (elem, input, value) => {
    const btn = document.createElement('button')
    btn.setAttribute('data-target', value)
    btn.classList.add('custom-number-btn')
    btn.appendChild(document.createTextNode(value))
    elem.appendChild(btn)

    setEvents(btn, input, elem)
}

const checkMinMax = (target, btn, input) => {
    if (target === '+') {
        if (parseInt(input.value) === parseInt(input.getAttribute('max'))) {
            btn.classList.add('disabled')
        }
    } else {
        if (parseInt(input.value) === parseInt(input.getAttribute('min'))) {
            btn.classList.add('disabled')
        }
    }
}

const inputs = document.querySelectorAll('.custom-number-input')
inputs.forEach((elem) => {
    const input = elem.querySelector('input')
    input.style.display = 'none'

    setButton(elem, input, '-')

    const showNumber = document.createElement('span')
    showNumber.classList.add('custom-number-show')
    showNumber.appendChild(document.createTextNode(input.value))
    elem.appendChild(showNumber)

    setButton(elem, input, '+')

})
