input.onButtonPressed(Button.A, function () {
    heat_notice = 20
})
// when receiving a radio signal, check what the signal is and respond accordingly
// 
radio.onReceivedString(function (receivedString) {
    if (receivedString == "fire") {
        basic.clearScreen()
        basic.showString("FIRE")
    }
    if (receivedString == "heat") {
        basic.clearScreen()
        basic.showString("HEAT")
    }
    if (receivedString == "earthquake") {
        basic.clearScreen()
        basic.showString("EARTHQUAKE")
    }
    if (receivedString == "enable") {
        if (enabled == 0) {
            enabled = 1
        } else if (enabled == 1) {
            enabled = 0
        } else {
            enabled = 0
        }
    }
})
input.onButtonPressed(Button.B, function () {
    heat_notice = 40
    fire_temperature = 20
})
// When the program starts, set the level needed to trigger fire detection and heat detection.
// 
let current_temperature = 0
let enabled = 0
let heat_notice = 0
let fire_temperature = 0
fire_temperature = 49
heat_notice = 24
let earthquake = 0
let landslide = 0
radio.setGroup(1)
enabled = 1
// loop through checking the possible warning conditions
// 
basic.forever(function () {
    if (enabled == 1) {
        current_temperature = input.temperature()
        if (current_temperature > fire_temperature) {
            music.play(music.stringPlayable("F G C5 B F G C5 B ", 800), music.PlaybackMode.LoopingInBackground)
            basic.showLeds(`
                . # # # .
                . # . . .
                . # # # .
                . # . . .
                . # . . .
                `)
            radio.sendString("fire")
        } else if (current_temperature > heat_notice) {
            music.play(music.stringPlayable("- - - G C5 G C5 - ", 800), music.PlaybackMode.LoopingInBackground)
            basic.showLeds(`
                . # . # .
                . # . # .
                . # # # .
                . # . # .
                . # . # .
                `)
            radio.sendString("heat")
        } else if (input.acceleration(Dimension.X) >= 50 || input.acceleration(Dimension.Z) >= 50) {
            earthquake = 1
            basic.showLeds(`
                . . # . .
                . # . # .
                . . . . .
                . # . # .
                . . # . .
                `)
            radio.sendValue("earthquake", 1)
        } else if (earthquake == 1) {
            for (let index = 0; index < 2; index++) {
                basic.pause(5000)
            }
        } else if (input.acceleration(Dimension.X) >= 30 || input.acceleration(Dimension.Y) >= 30) {
            landslide = 1
            basic.showLeds(`
                . . . . .
                . # . # .
                # . . . #
                . # . # .
                . . . . .
                `)
        } else {
            radio.sendValue("landslide", 1)
            basic.clearScreen()
        }
    }
})
