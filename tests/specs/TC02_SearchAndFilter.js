import { takeSnapshot } from "testcafe-blink-diff";
import HomePage from "../pages/HomePage";
import SearchResultPage from "../pages/SearchResultPage";
import FilterPage from "../pages/FilterPage";

const homePage = new HomePage();
const searchResultPage = new SearchResultPage();
const filterPage = new FilterPage();
const dataSet = require('../data/searchHotelData.json');

fixture("Search And Filter Test")

dataSet.forEach(data => {
    test("Search and filter", async t => {
        await homePage.search(data.keyword)
        //await homePage.selectFutureDate(data.checkinDate, data.checkoutDate)
        await homePage.selectXDaysFrNextWeekday(data.startNextWeekday, data.stayDays)
        await homePage.selectRoomAndPeople(data.numberOfRoom, data.numberOfAdults)
        await homePage.searchHotel()

        //get default price and slice width before filter price
        const defaultMinPrice = await filterPage.getDefaultPrice(filterPage.minPriceTextBox)
        const defaultMaxPrice = await filterPage.getDefaultPrice(filterPage.maxPriceTextBox)
        const defaultSliceWidth = await filterPage.getWidthOfSlider()

        //filter price and star
        await filterPage.setPriceInRange(data.minPrice, data.maxPrice)
        await filterPage.filterByStar(3)
        await filterPage.filterByStar(4)
        await searchResultPage.verifyAreaOfXFirstXHotelsContainKeyword(5, data.keyword)
        await t.expect(await searchResultPage.verifyPricesAreInRange(data.minPrice, data.maxPrice, 5)).ok()
        await t.expect(await searchResultPage.verifyStarDisplayedCorrectly([3, 4], 5)).ok()

        //reset price filter by fill in default price
        await filterPage.setPriceInRange(defaultMinPrice, defaultMaxPrice)

        //verify slice is reset with width = default
        await t.expect(await filterPage.getWidthOfSlider()).eql(defaultSliceWidth)
    })
})