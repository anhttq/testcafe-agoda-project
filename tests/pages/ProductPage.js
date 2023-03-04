import { Selector, t } from "testcafe";
import BasePage from '../commons/BasePage';
import XPathSelector from "../helper/XPathSelector";

class ProductPage extends BasePage {
    constructor() {
        super()
        this.hotelName = Selector(".HeaderCerebrum__Name")
        this.hotelAddress = Selector('[data-selenium="hotel-address-map"]')
        this.nonSmokingProperty = XPathSelector("//div[@data-element-name='property-feature']/span[text()='Non-smoking rooms']")

        //popup
        this.closePopupButton = Selector('.Box-sc-kv6pi1-0.fMRRsF')

        //Review
        this.reviewPage = XPathSelector("(//span[@class='NavBar__menulink'])[10]")
        this.agodaReview = XPathSelector("(//span[@class='Review-tab '])[1]")
        this.reviewPoints = "(//span[@class='Review-travelerGradeScore Review-travelerGradeScore--highlight'])[number]"
    }

    async verifyFilteredPropertyIsAvailable(element) {
        //if property is unavailable, text decoration is line-through
        //if property is available, text decoration is none
        const textDecoration = await element.getStyleProperty('text-decoration')
        let styleArray = textDecoration.split(" ")
        console.log(`Style: ${styleArray}`)
        if (styleArray.includes('line-through')) {
            return false
        } else {
            return true
        }
    }

    async goToAgodaReviewPoint() {
        await t.wait(5000)
        if (await this.closePopupButton.exists) {
            await this.clickButton(this.closePopupButton)
            await t
            .click(this.reviewPage)
            //.click(this.agodaReview)
        } else {
            await t
            .click(this.reviewPage)
            //.click(this.agodaReview)
        }
    }

    async getReviewPoints() {
        let reviewPointsArr = []
        for (let i = 1; i <= 5; i++) {
            let path = this.reviewPoints.replace("number", i)
            let point = await XPathSelector(path).innerText
            reviewPointsArr[i-1] = point
        }
        console.log(`Product review Points: ${reviewPointsArr}`)
        return reviewPointsArr
    }

}

export default ProductPage;