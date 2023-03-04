import moment from "moment/moment";

class DateHelper {

  formatDate(date) {
    return moment(date).format("ddd MMM DD YYYY")
  }

  getNextWeekday(weekday) {
    const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    for (let i = 0; i < dayOfWeek.length; i++) {
      if (dayOfWeek[i] == weekday) {
        var dayINeed = i
        break
      }
    }

    const today = moment().isoWeekday();
    let resultDate;

    // if we haven't yet passed the day of the week that I need:
    if (today < dayINeed) {
      // then just give me this week's instance of that day
      resultDate = moment().isoWeekday(dayINeed);
    } else {
      // otherwise, give me *next week's* instance of that same day
      resultDate = moment().add(1, 'weeks').isoWeekday(dayINeed);
    }
    return this.formatDate(resultDate)
  }

  getXDaysFrNextWeekday(weekday, numberX) {
    const dayINeed = moment(this.getNextWeekday(weekday)).add(numberX, 'days')
    return this.formatDate(dayINeed)
  }

}

export default new DateHelper();