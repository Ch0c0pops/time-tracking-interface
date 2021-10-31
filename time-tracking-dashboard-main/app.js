async function getData() {
    try {
        let response = await fetch('data.json')
        let data = await response.json()
        return data
    } catch (e) {
        console.log(e)
    }
}

const periodSelector = {
    daily: 'day',
    weekly: 'week',
    monthly: 'month'
}

class Activity {

    constructor(data, period = 'daily', periodSelector) {
        this.data = data
        this.period = period
        this.periodSelector = periodSelector
        this.container = document.querySelector('.dashboard');
        this._render()
    }

    _render() {
        const { title, timeframes } = this.data
        const timeframe = timeframes[this.period]
        const activityType = title.toLowerCase().replace(/ /g, '-')
        let currentTime = timeframe.current
        let previousTime = timeframe.previous

        this.container.insertAdjacentHTML('beforeend', `
        <div class="infocard infocard--${activityType}">
            <img src="./images/icon-${activityType}.svg" alt="${activityType}">
            <div class="infocard__statistics">
                <header class="infocard__header">
                    ${title}
                    <img src="./images/icon-ellipsis.svg" alt="itemMenu">
                </header>
                <div class="infocard__activity">
                <h3 class="currentPeriod-${activityType}"> ${currentTime} hrs</h3>
                <p class="prevPeriod-${activityType}">Last ${periodSelector[this.period]} - ${previousTime} hrs</p>
              
            </div>
            </div>
        </div> 
        `)
    }

    changeView(period) {
        this.period = period
        const activityType = this.data.title.toLowerCase().replace(/ /g, '-')
        this.timeframe = this.data.timeframes[this.period]
        this.container.querySelector(`.currentPeriod-${activityType}`).innerText = `${this.timeframe.current}hrs`
        this.container.querySelector(`.prevPeriod-${activityType}`).innerText = `Last ${periodSelector[this.period]} - ${this.timeframe.previous}hrs`
    }

}

document.addEventListener('DOMContentLoaded', () => {
    getData().then(data => {
        const activities = data.map(activity => new Activity(activity))

        const selectors = document.querySelectorAll('.dashboard__activityPeriod-time')
        selectors.forEach(selector => {
            const period = selector.innerText.toLowerCase()

            selector.addEventListener('click', function () {
                selectors.forEach(s => s.classList.remove('dashboard__activityPeriod-active'))
                selector.classList.add('dashboard__activityPeriod-active')

                activities.forEach(activity => activity.changeView(period));

            })
        })
    })
})