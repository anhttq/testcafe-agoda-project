import { Selector, t } from "testcafe";
import BasePage from '../commons/BasePage';
import XPathSelector from "../helper/XPathSelector";
import DateHelper from "../helper/DateHelper";


class HomePage extends BasePage {
    constructor() {
        super();
        this.searchTextBox = Selector('#textInput')
        this.closeAdsButton = XPathSelector("//button[@class='ab-message-button'][2]")
        this.searchButton = Selector("[data-element-name='search-button']")
        this.searchSuggestOption = "li[data-text='keyword']:nth-child(1)"

        //date picker
        this.dayPickerWrapper = Selector(".DayPicker-wrapper")
        this.chooseDateButton = Selector(".ficon-check-in")
        this.startDate = "[aria-label='startDate']"
        this.endDate = "[aria-label='endDate']"
        this.nextMonthButton = Selector("[aria-label='Next Month']")

        //room
        this.chooseRoomButton = Selector('.ficon-thin-arrow-down')
        this.addRoomButton = Selector("[data-element-name='occupancy-selector-panel-rooms'][data-selenium='plus']")
        this.subtractRoomButton = Selector("[data-element-name='occupancy-selector-panel-rooms'][data-selenium='minus']")
        this.addAdultsButton = Selector("[data-element-name='occupancy-selector-panel-adult'][data-selenium='plus']")
        this.subtractAdultsButton = Selector("[data-element-name='occupancy-selector-panel-adult'][data-selenium='plus']")
        this.numberOfRoom = Selector("[data-component='desktop-occ-room-value']")
        this.numberOfAdults = Selector("[data-component='desktop-occ-adult-value']")

        //room new UX
        this.updateUXDialog = Selector('.SegmentsOccupancy--updateUX')

        //room old UX
        this.familyTravelers = Selector('.TravellerSegment__row.TravellerSegment__title').withText('Family travelers')
    }

    async closeAds() {
        if (this.closeAdsButton.exists) {
            await this.clickButton(this.closeAdsButton)
        }
    }

    async search(keyword) {
        await this.closeAds()
        await this.inputValueToFieldTextBox(this.searchTextBox, keyword)
        let desOption = this.searchSuggestOption.replace("keyword", keyword)
        await t.click(desOption)
    }


    async selectXDaysFrNextWeekday(weekday, numberHotels) {
        //date picker
        if (await this.dayPickerWrapper.exists) {
            let startDate = this.startDate.replace("startDate", DateHelper.getNextWeekday(weekday))
            let endDate = this.endDate.replace("endDate", DateHelper.getXDaysFrNextWeekday(weekday, numberHotels))
            await t
                .click(startDate)
                .click(endDate)
        } else {
            await t.click(this.chooseDateButton)
            let startDate = this.startDate.replace("startDate", DateHelper.getNextWeekday(weekday))
            let endDate = this.endDate.replace("endDate", DateHelper.getXDaysFrNextWeekday(weekday, numberHotels))
            await t
                .click(startDate)
                .click(endDate)
        }
    }

    async selectFutureDate(checkinDate, checkoutDate) {
        if (await this.dayPickerWrapper.exists) {
            let startDate = this.startDate.replace("startDate", DateHelper.formatDate(checkinDate))
            let endDate = this.endDate.replace("endDate", DateHelper.formatDate(checkoutDate))
            await this.clickUntilExist(Selector(startDate), this.nextMonthButton)
            await this.clickUntilExist(Selector(endDate), this.nextMonthButton)
        }
    }

    async selectRoomAndPeople(numberOfRoom, numberOfAdults) {
        //add or subtract room and adults for new UX
        if (await this.updateUXDialog.exists) {
            const defaultRoom = await this.numberOfRoom.textContent
            let difference = numberOfRoom - defaultRoom
            if (difference > 0) {
                await this.clickUntilValueEqual(difference, this.addRoomButton)
            } else if (difference < 0) {
                await this.clickUntilValueEqual(difference, this.subtractRoomButton)
            }

            const defaultAdults = await this.numberOfAdults.textContent
            difference = numberOfAdults - defaultAdults
            if (difference > 0) {
                await this.clickUntilValueEqual(difference, this.addAdultsButton)
            } else if (difference < 0) {
                await this.clickUntilValueEqual(difference, this.subtractAdultsButton)
            }
        }
        //add or subtract room and adults for old UX
        else {
            await t.click(this.familyTravelers)

            const defaultAdults = await this.numberOfAdults.textContent
            let difference = numberOfAdults - defaultAdults
            if (difference > 0) {
                await this.clickUntilValueEqual(difference, this.addAdultsButton)
            } else if (difference < 0) {
                await this.clickUntilValueEqual(difference, this.subtractAdultsButton)
            }

            const defaultRoom = await this.numberOfRoom.textContent
            difference = numberOfRoom - defaultRoom
            if (difference > 0) {
                await this.clickUntilValueEqual(difference, this.addRoomButton)
            } else if (difference < 0) {
                await this.clickUntilValueEqual(difference, this.subtractRoomButton)
            }
        }
        //close room dialog
        await t.click(this.chooseRoomButton)
    }

    async searchHotel() {
        await t.click(this.searchButton)
    }

}

export default HomePage;