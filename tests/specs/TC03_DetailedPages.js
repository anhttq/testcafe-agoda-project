import HomePage from "../pages/HomePage";
import SearchResultPage from "../pages/SearchResultPage";
import FilterPage from "../pages/FilterPage";
import ProductPage from "../pages/ProductPage";

const homePage = new HomePage();
const searchResultPage = new SearchResultPage();
const filterPage = new FilterPage();
const productPage = new ProductPage();
const dataSet = require('../data/searchHotelData.json');

fixture("Search And Check Detail Test")

dataSet.forEach(data => {
    test("Search and check detailed page", async t => {
        await homePage.search(data.keyword)
        //await homePage.selectXDaysFrNextWeekday(data.startNextWeekday, data.stayDays)
        await homePage.selectFutureDate(data.checkinDate, data.checkoutDate)
        await homePage.selectRoomAndPeople(data.numberOfRoom, data.numberOfAdults)
        await homePage.searchHotel()
        await searchResultPage.verifyAreaOfXFirstXHotelsContainKeyword(data.numberOfHotel, data.keyword)

        //filter the non smoking hotels
        await filterPage.filterByFacilities(filterPage.nonSmoking)

        //move mouse to show detailed review points and get review point at popup
        await searchResultPage.moveMouseToReviewPoints()
        let reviewPointsInPopup = await searchResultPage.getReviewPoints()
        await t.expect(await searchResultPage.verifyAllReviewPointsDisplayed()).ok()

        //get 1st hotel name at search result page
        const hotelNameAtSearchResult = await searchResultPage.getHotelName(searchResultPage.firstHotelName)

        //go to product detailed page => fix headless bug later, current: run headless cannot interact with new window, open new window return wrong hotel name
        const newWindowUri = data.baseUrl + (await searchResultPage.firstHotel.getAttribute("href")).toString()
        await t.openWindow(newWindowUri).maximizeWindow()
        //await searchResultPage.chooseFirstHotel()

        //verify page displayed with correct name destination non smoking hotel 
        await t.expect(await productPage.hotelName.innerText).eql(hotelNameAtSearchResult)
        await t.expect(await productPage.hotelAddress.innerText).contains(data.keyword)
        await t.expect(await productPage.verifyFilteredPropertyIsAvailable(productPage.nonSmokingProperty)).ok()

        //go to review
        await productPage.goToAgodaReviewPoint()
        //get review points
        let reviewPointsInDetailedPage = await productPage.getReviewPoints()

        //verify detailed review points are correct
        await t.expect(JSON.stringify(reviewPointsInPopup) === JSON.stringify(reviewPointsInDetailedPage)).ok() 
    })
})