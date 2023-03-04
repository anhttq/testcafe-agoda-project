import { ClientFunction } from "testcafe";

class GetScreenSize {

    async getScreenSize() {
        const fn = ClientFunction(() => {
            return {
                width: $(window).width(),
                height: $(window).height()
            };
        });
        return fn();
    }

    async getCurrentScreenSize() {
        let browserSize = await this.getScreenSize();
        let height;
        let width;
        if (process.env.BROWSER_HEIGHT != null && process.env.BROWSER_WIDTH != null) {
            height = process.env.BROWSER_HEIGHT
            width = process.env.BROWSER_WIDTH
        } else if (process.env.BROWSER_HEIGHT != null) {
            height = process.env.BROWSER_HEIGHT
            width = browserSize.width
        }
        else if (process.env.BROWSER_WIDTH != null) {
            height = browserSize.height
            width = process.env.BROWSER_WIDTH
        }
        else {
            height = browserSize.height
            width = browserSize.width
        }
        return {height: height, width: width}
    }

}

export default new GetScreenSize();