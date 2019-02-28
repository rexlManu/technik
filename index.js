const gpio = require('rpi-gpio');
const animation = require('animation');
const gpiop = gpio.promise;
const HIGH = true;
const LOW = false;
const pins = [
    /* Circuit pins */
    {id: 7, pin: 4, state: LOW},
    {id: 29, pin: 5, state: LOW},
    {id: 31, pin: 6, state: LOW},

    /* Normal pins */

    /* Subchild pins */
    {id: 1, pin: 1, child: true, state: LOW},
    {id: 2, pin: 2, child: true, state: LOW},
    {id: 3, pin: 3, child: true, state: LOW},
    {id: 4, pin: 4, child: true, state: LOW},
    {id: 5, pin: 5, child: true, state: LOW},
    {id: 6, pin: 6, child: true, state: LOW},
    {id: 7, pin: 7, child: true, state: LOW},
    {id: 8, pin: 8, child: true, state: LOW},
];

const controlPins = [

    {id: 1,},
    {id: 2,},
    {id: 3,},
    {id: 4,},
    {id: 5,},
    {id: 6,},
    {id: 7,},
    {id: 8,},

];

registerPins(pins).then(async value => {
    console.log('Alle GPIO Pins wurden erfolgreich registiert!');
    await updateStatesFromCircuit().then(value1 => {
    });
    console.log('Circuit Pins wurden aktualisiert!');
}).catch(reason => {
    console.log(reason);
});


async function updateStatesFromCircuit() {
    const dataPin = pins[0];
    const storageRegister = pins[1];
    const shiftRegister = pins[2];
    for (let filterElement of pins.filter(value => value.child === true)) {
        await gpiop.write(dataPin.id, filterElement.state);
        await sleep(10);
        await gpiop.write(storageRegister.id, true);
        await sleep(10);
        await gpiop.write(storageRegister.id, false);
        await gpiop.write(dataPin.id, false);
        await gpiop.write(shiftRegister.id, true);
        await sleep(10);
        await gpiop.write(shiftRegister.id, false);
    }
}

function write(id, state) {
    var pin = getPinById(id);
    if (!pin) return;

    pin.state = state;

    if (pin.child) {
        updateStatesFromCircuit();
    } else {
        gpio.write(pin.id, pin.state);
    }
}

function getPinById(id) {
    return pins.filter(value => value.id === id)[0];
}

async function init() {
    await sleep(5000);
    console.log('Beginn');
    //while (true) {
    for (let i = 0; i < 8; i++) {
        gpiop.write(pin4, false);
        await sleep(10);
        gpiop.write(pin5, true);
        await sleep(10);
        gpiop.write(pin5, false);
        gpiop.write(pin4, false);
        gpiop.write(pin6, true);
        await sleep(10);
        gpiop.write(pin6, false);
    }
    console.log('Wait begin');
}


function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

function registerPins(pins) {
    const promises = [];
    pins.forEach(pin => {
        if (!pin.child) promises.push(registerPin(pin))
    });
    return Promise.all(promises);
}

function registerPin(pin) {
    return gpiop.setup(pin.id, gpio.DIR_OUT);
}
