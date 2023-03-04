import { Selector, t } from "testcafe";
import BasePage from '../commons/BasePage';
import XPathSelector from "../helper/XPathSelector";

class FilterPage extends BasePage {
    constructor() {
        super()
        //price filter
        this.minPriceTextBox = "#price_box_0"
        this.maxPriceTextBox = "#price_box_1"
        this.slider = XPathSelector("(//div[@class='rc-slider-track rc-slider-track-1'])[1]")

        //star filter 
        this.starFilterCheckBox = "[aria-labelledby='filter-menu-StarRating'] > ul > li > .StarRating-number"

        //facilities filter
        this.nonSmoking = ".Facilities-15"
        this.showMoreFacilitites = 'a[data-value="Facilities"]'
        this.showMoreFacilitites2 = 'div[data-value="Facilities"]'

    }

    async getDefaultPrice(locator) {
        let stringValue = await Selector(locator).getAttribute('value')
        console.log(`Default price: ${stringValue}`)
        return stringValue.replace(/,/g, "")
    }

    async setPriceInRange(minPrice, maxPrice) {
        await this.inputValueToFieldTextBox(this.minPriceTextBox, minPrice)
        await this.inputValueToFieldTextBox(this.maxPriceTextBox, maxPrice)
        await t.pressKey('enter')
    }

    async filterByStar(numberOfStar) {
        let checkBox = Selector(this.starFilterCheckBox.replace("number", numberOfStar))
        await this.checkCheckBoxOrRadio(checkBox)
    }

    async getWidthOfSlider() {
        const width = await this.slider.getStyleProperty('width')
        console.log(`Width of Price Slider: ${width}`)
        return width
    }

    async filterByFacilities(locator) {
        if (await Selector(locator).exists) {
            await t.click(locator)
        } else {
            if (await Selector(this.showMoreFacilitites).exists) {
                var showMoreButton = Selector(this.showMoreFacilitites)
            } else {
                showMoreButton = Selector(this.showMoreFacilitites2).find('[role="heading"]')
            }
            await t.click(showMoreButton)
            await t.click(locator)
        }
    }

}

export default FilterPage;