function turnstile (devices, state = 'locked') {
    const { alarm, thanks, lights} = devices
    const changeState = newState => turnstile(devices, newState)
    return {
        getState: state,
        pass: () => {
            if (state !== 'unlocked') {
                alarm.setOff()
            }
            return changeState('locked')
        },
        coin: () => {
            if (state === 'unlocked') {
                thanks.give()
            }
            return changeState('unlocked')
        },
        power: () => {
            if (state === 'no entry') {
                lights.powerOn()
                return changeState('locked')
            }
            lights.powerOff()
            return changeState('no entry')
        }
    }
}

module.exports.turnstile = turnstile