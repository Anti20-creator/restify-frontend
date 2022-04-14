const openingTimesValidator = (openingTimes) => {
    const openingTimesClone = openingTimes.slice()
    for(let i = 0; i < openingTimesClone.length; ++i) {
        if(openingTimesClone[i].open.hours.length !== 2 || isNaN(openingTimesClone[i].open.hours)
            || openingTimesClone[i].open.minutes.length !== 2 || isNaN(openingTimesClone[i].open.minutes)
            || openingTimesClone[i].close.hours.length !== 2 || isNaN(openingTimesClone[i].close.hours)
            || openingTimesClone[i].close.minutes.length !== 2 || isNaN(openingTimesClone[i].close.minutes) 
            ) {
                console.log('anyád')
                return false
            }
    }
    openingTimesClone.push(openingTimesClone[0])
    for(let i = 1; i < openingTimesClone.length; ++i) {
        if( Number(openingTimesClone[i-1].open.hours) > Number(openingTimesClone[i-1].close.hours) || (
            Number(openingTimesClone[i-1].open.hours) === Number(openingTimesClone[i-1].close.hours) &&
            Number(openingTimesClone[i-1].open.minutes) > Number(openingTimesClone[i-1].close.minutes)
        ) ) {
            if( (Number(openingTimesClone[i].open.hours) < Number(openingTimesClone[i-1].close.hours) || (
                Number(openingTimesClone[i].open.hours) === Number(openingTimesClone[i-1].close.hours) && Number(openingTimesClone[i].open.minutes) < Number(openingTimesClone[i-1].close.minutes)
            )) && !((Number(openingTimesClone[i].open.hours) === Number(openingTimesClone[i].close.hours) && Number(openingTimesClone[i].open.minutes) === Number(openingTimesClone[i].close.minutes)) && Number(openingTimesClone[i].open.hours) === 0) ) {
                return false
            }
        }
    }

    return true
}

export default openingTimesValidator