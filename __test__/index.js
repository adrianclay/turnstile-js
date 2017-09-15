const { turnstile } = require('../index.js')

function alarmSpy () {
    let wasSetOff = false
    return {
        setOff: () => {
            wasSetOff = true
        },
        wasSetOff: () => wasSetOff
    }
}

function thanksSpy () {
    let wasGiven = false
    return {
        give: () => { wasGiven = true },
        wasGiven: () => wasGiven
    }
}

function lightsSpy () {
    let poweredOn = false
    let poweredOff = false
    return {
        powerOn: () => { poweredOn = true },
        wasPoweredOn: () => poweredOn,
        powerOff: () => { poweredOff = true },
        wasPoweredOff: () => poweredOff,
    }
}

describe("Turnstile", () => {
    let alarm, thanks, lights, lockedTurnstile, unlockedTurnstile

    const newTurnstile = state => turnstile({alarm, thanks, lights}, state)

    beforeEach(() => {
        alarm = alarmSpy()
        thanks = thanksSpy()
        lights = lightsSpy()
        lockedTurnstile = newTurnstile('locked')
        unlockedTurnstile = newTurnstile('unlocked')
        noEntryTurnstile = newTurnstile('no entry')
    })

    test('Given a new turnstile, it is locked', () => {
        const defaultTurnstile = newTurnstile()
        expect(defaultTurnstile.getState).toBe('locked');
    })

    test('Given a locked turnstile, when trying to pass it, it sets off an alarm', () => {
        lockedTurnstile.pass()
        expect(alarm.wasSetOff()).toBeTruthy()
    })

    test('Given an unlocked turnstile, when trying to pass it, it does not set off an alarm', () => {
        unlockedTurnstile.pass()
        expect(alarm.wasSetOff()).toBeFalsy()
    })

    test('Given a locked turnstile, when feeding it a coin, it unlocks the turnstile', () => {
        expect(lockedTurnstile.coin().getState).toBe('unlocked')
    })

    test('Given an unlocked turnstile, when passing through, it locks the turnstile', () => {
        expect(unlockedTurnstile.pass().getState).toBe('locked')
    })

    test('Given an unlocked turnstile, when feeding it a coin, it says thanks', () => {
        unlockedTurnstile.coin()
        expect(thanks.wasGiven()).toBeTruthy()
    })

    test('Given a locked turnstile, when feeding it a coin, it does not say thanks', () => {
        lockedTurnstile.coin()
        expect(thanks.wasGiven()).toBeFalsy()
    })

    test('Given a locked turnstile, when hitting the power, the turnstile becomes no entry', () => {
        expect(lockedTurnstile.power().getState).toBe('no entry')
    })

    test('Given a unlocked turnstile, when hitting the power, the turnstile becomes no entry', () => {
        expect(unlockedTurnstile.power().getState).toBe('no entry')
    })

    test('Given a turnstile in no entry, when hitting the power, the turnstile becomes locked', () => {
        expect(noEntryTurnstile.power().getState).toBe('locked')
    })

    test('Given a turnstile in no entry, when passing the turnstile, it sets off the alarm', () => {
        noEntryTurnstile.pass()
        expect(alarm.wasSetOff()).toBeTruthy()
    })

    test('Given a locked turnstile, when hitting the power, the lights should go off', () => {
        lockedTurnstile.power()
        expect(lights.wasPoweredOff()).toBeTruthy()
    })

    test('Given a no entry turnstile, when hitting the power, the lights should come on', () => {
        noEntryTurnstile.power()
        expect(lights.wasPoweredOn()).toBeTruthy()
    })
})
