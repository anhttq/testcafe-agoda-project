import { takeSnapshot } from "testcafe-blink-diff";
import HomePage from "../pages/HomePage";
import SearchResultPage from "../pages/SearchResultPage";

const homePage = new HomePage();
const searchResultPage = new SearchResultPage();
const dataSet = require('../data/searchHotelData.json');

fixture("Search And Sort Test")

dataSet.forEach(data => {
    test("Search and sort", async t => {
        await homePage.search(data.keyword)
        //await homePage.selectXDaysFrNextWeekday(data.startNextWeekday, data.stayDays)
        await homePage.selectFutureDate(data.checkinDate, data.checkoutDate)
        await homePage.selectRoomAndPeople(data.numberOfRoom, data.numberOfAdults)
        await homePage.searchHotel()
        await searchResultPage.verifyAreaOfXFirstXHotelsContainKeyword(data.numberOfHotel, data.keyword)
        await searchResultPage.sortHotelsByLowestPrice()
        await t.expect(await searchResultPage.verifyOrderOfXFirstHotelsPrice(data.numberOfHotel)).ok()
        await searchResultPage.verifyAreaOfXFirstXHotelsContainKeyword(data.numberOfHotel, data.keyword)
    })
})