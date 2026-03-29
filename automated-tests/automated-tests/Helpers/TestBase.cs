using OpenQA.Selenium;

namespace automated_tests.Helpers;

public class TestBase
{
    protected IWebDriver driver;

    [SetUp]
    public void SetUp()
    {
        driver = DriverFactory.CreateDriver();
    }

    [TearDown]
    public void TearDown()
    {
        driver.Quit();
        driver.Dispose();
    }
}