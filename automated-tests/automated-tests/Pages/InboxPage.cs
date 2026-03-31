using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

namespace automated_tests.Pages;

public class InboxPage
{
    private IWebDriver driver;
    private WebDriverWait wait;

    private By searchInput = By.CssSelector("input[placeholder='Search by message or email...']");
    private By clearButton = By.CssSelector("[data-testid='search-clear']");
    private By ticketRows = By.CssSelector("[data-testid='inbox-row']");
    private By emptyTitle = By.CssSelector("[data-testid='empty-title']");

    public InboxPage(IWebDriver driver)
    {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
    }

    // Navigira direktno na inbox — korisnik već mora biti ulogovan
    public void NavigateTo()
    {
        driver.Navigate().GoToUrl("http://localhost:3000/dashboard/inbox");
        wait.Until(ExpectedConditions.ElementIsVisible(searchInput));
    }

    // Prijavljuje se i tek onda otvara inbox
    public void LoginAndNavigate(string email, string password)
    {
        var loginPage = new LoginPage(driver);
        loginPage.NavigateTo();
        loginPage.Login(email, password);

        wait.Until(ExpectedConditions.UrlContains("/dashboard"));
        NavigateTo();
    }

    public void EnterSearch(string query)
    {
        var input = wait.Until(ExpectedConditions.ElementIsVisible(searchInput));
        input.Clear();
        input.SendKeys(query);
    }

    public void ClearSearch()
    {
        var btn = wait.Until(ExpectedConditions.ElementToBeClickable(clearButton));
        btn.Click();
    }

    public int GetVisibleTicketCount()
    {
        try
        {
            // Kratko čekanje da se DOM ažurira nakon unosa u search
            wait.Until(d => d.FindElements(ticketRows).Count >= 0);
            return driver.FindElements(ticketRows).Count;
        }
        catch
        {
            return 0;
        }
    }

    public string GetEmptyStateTitle()
    {
        var el = wait.Until(ExpectedConditions.ElementIsVisible(emptyTitle));
        return el.Text;
    }

    public bool IsSearchInputVisible()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(searchInput)).Displayed;
        }
        catch
        {
            return false;
        }
    }

    public bool IsClearButtonVisible()
    {
        try
        {
            return driver.FindElement(clearButton).Displayed;
        }
        catch (NoSuchElementException)
        {
            return false;
        }
    }

    public string GetSearchInputValue()
    {
        return driver.FindElement(searchInput).GetAttribute("value");
    }

    public void ClickFilterTab(string tabLabel)
    {
        var tab = wait.Until(ExpectedConditions.ElementToBeClickable(
            By.XPath($"//button[contains(., '{tabLabel}')]")));
        tab.Click();
    }
}
