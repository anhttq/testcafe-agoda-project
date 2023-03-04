import { Selector, t } from "testcafe";

class BasePage {
    constructor() {
        this.longTimeOut = 30000
    }

    async inputValueToFieldTextBox(field, value) {
        await t
            .selectText(field)
            .pressKey('delete')
            .typeText(field, value)
    }

    async searchKeyword(fieldSearch, keyword) {
        await this.verifyElementExisted(fieldSearch)
        await t
            .typeText(fieldSearch, keyword)
            .pressKey('enter')
    }

    async clickUntilExist(element, nextButton) {
        if (!await element.exists) {
            await t.click(nextButton)
            await this.clickUntilExist(element, nextButton)
        } else {
            await t.click(element)
        }
    }

    async clickUntilValueEqual(difference, element) {
        for (let i = 0; i < difference; i++) {
            await this.clickButton(element)
        }
    }

    async clickButton(button) {
        await this.verifyElementExisted(button)
        await t.click(button)
    }

    async clickHyperLink(link) {
        await this.verifyElementExisted(link)
        await t.click(link)
    }

    async checkCheckBoxOrRadio(element) {
        await this.verifyElementExisted(element)
        await t.click(element)
    }

    async verifyContainText(element, expect) {
        await t
            .scroll(element)
            .expect(element.textContent).contains(expect, { timeout: this.longTimeOut })
    }

    async verifyElementExisted(element) {
        await t.expect(element.exists).ok({ timeout: this.longTimeOut })
    }

    async verifyElementNotExisted(element) {
        await t.expect(element.exists).notOk({ timeout: this.longTimeOut })
    }

}

export default BasePage;