const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

// const { instagram } = require('./config');

async function saveInstagramSession(username, password) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // set User-Agent
    // await page.setUserAgent(instagram.user_agent);

    // Go to the Instagram login page
    await page.goto('https://www.instagram.com/accounts/login/', {
        waitUntil: 'networkidle0',
    });

    // Fill in the username and password
    await page.type('input[name="username"]', username);
    await page.type('input[name="password"]', password);

    // Click the login button
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    // Check if login was successful
    const loginErrorElement = await page.$('p[id="slfErrorAlert"]');
    if (loginErrorElement) {
        console.error('Login failed. Please check your username and password.');
        await browser.close();
        return 0;
    }

    // Save the session cookies
    const cookies = await page.cookies();
    fs.writeFileSync('./cookies.json', JSON.stringify(cookies));
    console.log('Session saved successfully:', cookies);

    // You can do further actions on Instagram with the logged-in session here

    // Close the browser
    await browser.close();

    return 1;
}

async function getApi2() {
    const cookiesString = fs.readFileSync('./cookies.json');
    const parsedCookies = JSON.parse(cookiesString);

    // search for the cookie
    const response = await axios.get('https://www.instagram.com/api/v1/users/web_profile_info/?username=my.love.2.you', {
        headers: {
            'cookie': `sessionid=${searchCookie('sessionid')}; csrftoken=${searchCookie('csrftoken')};`,
            'origin': 'https://www.instagram.com',
            'referer': `https://www.instagram.com/my.love.2.you/`,
            'x-csrftoken': searchCookie('csrftoken'),
        }
    });

    console.log('response');

    return response.data;
}


function searchCookie(key) {
    const cookiesString = fs.readFileSync('./cookies.json');
    const parsedCookies = JSON.parse(cookiesString);
    var value = null;
    parsedCookies.forEach(element => {
        if (element.name == key) {
            value = element.value;
        }
    }
    );
    return value;
}

module.exports = saveInstagramSession;
module.exports = getApi2;
// module.exports = getApi;
