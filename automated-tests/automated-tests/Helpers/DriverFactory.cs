using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;

namespace automated_tests.Helpers;

public class DriverFactory
{
    public static IWebDriver CreateDriver()
    {
        var options = new ChromeOptions();
        var driver = new ChromeDriver(options);
        driver.Manage().Window.Maximize();
        return driver;
    }
}