const setEvents = (btn, input, elem) => {
    const event = new Event('change');
    input.addEventListener('change', () => {
        elem.querySelector('.custom-number-show').innerHTML = input.value
        checkMinMax(elem, btn, input)
    })

    btn.addEventListener('click', (e) => {
        if (btn.getAttribute('data-target') === '+') {
            input.value = parseInt(input.value) + 1
        } else {
            input.value = parseInt(input.value) - 1
        }
        checkMinMax(elem, btn, input)
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

const checkMinMax = (elem, btn, input) => {
    elem.querySelectorAll('.custom-number-btn').forEach((btn) => {
        btn.classList.remove('disabled')
    })
    if (btn.getAttribute('data-target') === '+') {
        if (parseInt(input.value) === parseInt(input.getAttribute('max'))) {
            btn.classList.add('disabled')
        }
    } else {
        if (parseInt(input.value) === parseInt(input.getAttribute('min'))) {
            btn.classList.add('disabled')
        }
    }
}

const initCustomInputs = () => {
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
}

const clearCustomInputs = () => {
    document.querySelectorAll('.custom-number-show').forEach((elem) => {
        elem.innerHTML= '0';
    })
    document.querySelectorAll('.custom-number-btn').forEach((elem) => {
        elem.classList.remove('disabled');
    })

}

initCustomInputs()
document.addEventListener('reInitCube', clearCustomInputs)
