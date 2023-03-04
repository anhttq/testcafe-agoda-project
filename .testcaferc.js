module.exports = {
    hooks: {
        test: {
            before: async t => {
                await t
                    .maximizeWindow();
          }
        }
    },
    baseUrl: "https://www.agoda.com",
    browsers: "chrome",
    src: "tests/specs",
    reporter: "list",
    skipJsErrors: true,
    screenshots: {
        path: "src/images/screenshots",
        takeOnFails: true,
        pathPattern: "Failed_Screenshots/${DATE}_${TIME}/test-${TEST_INDEX}.png",
        fullPage: true
    },
    videoPath: "src/videos",
        videoOptions: {
        singleFile: true,
        failedOnly: true,
        pathPattern: "${TEST_INDEX}/${USERAGENT}/${FILE_INDEX}.mp4",
        },
    concurrency: 1,
    selectorTimeout: 30000,
    assertionTimeout: 30000,
    pageLoadTimeout: 120000,
    speed: 1
};