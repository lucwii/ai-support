using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace automated_tests.Helpers;

public class DriverFactory
{
    public static IWebDriver CreateDriver()
    {
        var options = new ChromeOptions();

        // U CI okruzenju (GitHub Actions) Chrome mora raditi u headless modu
        // jer nema graficki displej. CI environment varijabla je automatski
        // postavljena na "true" od strane GitHub Actions.
        bool isCI = Environment.GetEnvironmentVariable("CI") == "true";
        if (isCI)
        {
            options.AddArgument("--headless=new");      // novi headless mod (Chrome 112+)
            options.AddArgument("--no-sandbox");         // obavezno u Docker/Linux CI
            options.AddArgument("--disable-dev-shm-usage"); // izbjegava crash zbog malog /dev/shm
            options.AddArgument("--disable-gpu");        // nije potreban GPU u headless modu
            options.AddArgument("--window-size=1920,1080"); // fiksirani resolution umjesto Maximize()
        }

        var driver = new ChromeDriver(options);

        if (!isCI)
            driver.Manage().Window.Maximize();

        return driver;
    }
}