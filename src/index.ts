import { Actions, Builder, By, WebElement } from "selenium-webdriver";
import { generateRandom } from "./utils/helpers";


const base_url = "https://www.kayseriolay.com/"

const driver = new Builder()
    .forBrowser("chrome")
    // Kullanılacak tarayıcıyı belirtin (örneğin, chrome, firefox, vb.).
    .build();


async function openPage() {
    driver.manage().window().maximize();
    // Tarayıcıyı aç ve pencereyi genişlet.
    await driver.get(base_url);
    // Haber sayfasına yönlendir.
}

async function goToSonDakika() {
    const sonDakika = await driver.findElement(
        By.xpath("//a[@href='/haberler/son-dakika/']")
    );
    // Son dakika yönlendiricisini bul ve tıkla.
    await sonDakika.click();
}

async function hideGoogleAds() {
    await driver.navigate().refresh();
    await goToSonDakika();
    // Google reklamlarını geçmek için sayfayı yenile.
}

async function scrollIntoView(element: WebElement) {
    await driver.executeScript("arguments[0].scrollIntoView();", element);
    // Seçilen element görünümüne geç.
}

async function tripToPage() {
    try {
        const newsCards: WebElement[] = await driver.findElements(
            By.className(
                "group bg-white shadow-sm overflow-hidden focus:outline-none brd"
            )
        );
        const newsCard = newsCards[generateRandom(0, newsCards.length)];
        // Random bir şekilde haber kartını seç.
        await scrollIntoView(newsCard);
        // Seçilen haber kartına görüntüle.
        await driver.sleep(1000)
        await newsCard.click();
    } catch (error) {
        tripToPage()
    }

    // Habere tıkla.
}



async function spendTimeInThePage(duration: number = generateRandom(10000, 60000)) {
    const startTime = Date.now();
    const endTime = startTime + duration;
    const documentHeight = await driver.executeScript<number>("return document.documentElement.scrollHeight");
    const scrollStep = documentHeight / (duration / 1000);

    while (Date.now() < endTime && driver.executeScript<boolean>("return window.scrollY + window.innerHeight < document.documentElement.scrollHeight")) {
        await driver.executeScript(`window.scrollBy(0, ${scrollStep})`);
        await driver.sleep(1000);
    }
    await driver.sleep(200);
    await driver.executeScript("window.scrollTo(0, 0)")
    await driver.get(base_url + 'haberler/son-dakika/');
    // Sayfa içinde 30 ve 60 saniye aralığında random bir süre ile vakit geçir.
}

async function checkInternetConnection() {
    const isOnline = await driver.executeScript<boolean>("return navigator.onLine");
    return isOnline
}

async function startBrowsing() {
    try {
        let isOnline: boolean = true;
        while (isOnline) {
            try {
                await tripToPage();
                await spendTimeInThePage();
            } catch (error) {
                console.error("Bir hata oluştu:", error);
                isOnline = await checkInternetConnection();
                if (isOnline) {
                    console.error("Hata, internet bağlantısı sorunundan kaynaklanmıyor. Döngü yeniden başlatılıyor...");
                } else {
                    console.error("Hata, internet bağlantısı sorunundan kaynaklanıyor. Döngü sonlandırılıyor.");
                }
            }
        }
    } catch (error) {
        console.error("Bir hata oluştu:", error);
        while (true) {
            await checkInternetConnection()
        }
    }
    // Site içerisinde internet bağlantısını kontrol ederek sonsuz bir döngüde fonksiyonları çalıştır.
}

async function runTest() {
    await openPage();
    await goToSonDakika();
    await hideGoogleAds();
    await startBrowsing()
}

runTest();
