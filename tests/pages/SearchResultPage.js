import { Selector, t } from "testcafe";
import BasePage from '../commons/BasePage';
import XPathSelector from "../helper/XPathSelector";

class SearchResultPage extends BasePage {
    constructor() {
        super()
        this.area= "(//*[@data-selenium='area-city'])[number]"
        this.sortByLowestPriceButton = Selector("[data-element-name='search-sort-price'] > span")
        this.price = "(//*[@data-selenium='display-price'])[number]"
        this.starArea = "(//div[@class='sc-bdfBwQ sc-gsTCUz  jZvduX'])[number]/div/*"
        this.firstHotel = XPathSelector('(//ol[@class="hotel-list-container"]/li)[1]/div/a')
        this.firstHotelName = XPathSelector('(//h3[@data-selenium="hotel-name"])[1]')
        
        //review points
        this.reviewPopup = XPathSelector("(//div[@class='Box-sc-kv6pi1-0 hRUYUu PropertyCard__PricingHeadliner'])[1]")
        this.reviewPoints = "(//strong[@class='review-bar__point'])[number]"
    }

    async verifyAreaOfXFirstXHotelsContainKeyword(numberHotels, keyword) {
        let cityElements

        for (let i = 1; i < numberHotels + 1; i++) {
            let path = this.area.replace("number", i)
            cityElements = XPathSelector(path)
            await this.verifyContainText(cityElements, keyword)
        }
    }

    async sortHotelsByLowestPrice() {
        await t.click(this.sortByLowestPriceButton)
    }

    async getPriceOfXFirstHotelsByOrder(numberHotels) {
        let arr = []
        let priceElements

        for (let i = 1; i < numberHotels + 1; i++) {
            let path = this.price.replace("number", i)
            priceElements = XPathSelector(path)
            await t.scroll(priceElements, "bottomRight")
            arr[i-1] = (await priceElements.innerText).replace(/,/g, "")
        }
        console.log(`Price of X First Hotels: ${arr}`)
        return arr;
    }

    async verifyOrderOfXFirstHotelsPrice(numberHotels) {
        let arr = await this.getPriceOfXFirstHotelsByOrder(numberHotels)
        let flag = true
        for (let i = 0; i < arr.length; i++) {
            if (parseInt(arr[i+1]) < parseInt(arr[i])) {
                flag = false
                break
            } 
        }
        return flag
    }

    async verifyPricesAreInRange(min, max, numberHotels) {
        let minPrice = parseInt(min)
        let maxPrice = parseInt(max)
        let arr = await this.getPriceOfXFirstHotelsByOrder(numberHotels)
        let flag = true
        for (let i = 0; i < arr.length; i++) {
            if (minPrice > parseInt(arr[i]) | parseInt(arr[i]) > maxPrice) {
                flag = false
                break
            } 
        }
        return flag
    }

    async verifyStarDisplayedCorrectly(arrStar, numberHotels) {
        let flag = false
        for (let i = 1; i < numberHotels + 1; i++) {
            let star = this.starArea.replace("number", i)

            for (let j = 0; j < arrStar.length; j++ ) {
                let halfStarPath = `${star}/*[@href="#StarHalfSymbolFillIcon"]`
                let numberOfStar = await XPathSelector(star).count
                //filter 3 star can display hotels with 3.5 star 
                if (await XPathSelector(halfStarPath).exists) {
                    let number = numberOfStar - 1
                    if (number == arrStar[j]) {
                        flag = true
                    }
                } else {
                    if (numberOfStar == arrStar[j]) {
                        flag = true
                    }
                }            
            }
        }
        return flag
    }

    async chooseFirstHotel() {
        await t.click(this.firstHotelName)
    }

    async getHotelName(element) {
        return await element.innerText
    }

    async moveMouseToReviewPoints() {
        await t.wait(3000)
        await t.hover(this.reviewPopup)
        await t.wait(3000)
    }

    async verifyAllReviewPointsDisplayed() {
        for (let i = 1; i <=5; i++) {
            let path = this.reviewPoints.replace("number", i)
            var flag = await XPathSelector(path).exists
        }
        return flag
    }

    async getReviewPoints() {
        let reviewPointsArr = []
        for (let i = 1; i <= 5; i++) {
            let path = this.reviewPoints.replace("number", i)
            let point = await XPathSelector(path).innerText
            reviewPointsArr[i-1] = point
        }

        console.log(`Popup Review Point: ${reviewPointsArr}`)
        return reviewPointsArr
    }
}

export default SearchResultPage;