using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

namespace automated_tests.Pages;

public class TicketDetailPage
{
    private IWebDriver driver;
    private WebDriverWait wait;
    
    private By notesCard = By.CssSelector("[data-testid='notes-card']");
    private By emptyState = By.CssSelector("[data-testid='notes-empty-state']");
    private By addNoteButton = By.CssSelector("[data-testid='add-note-button']");
    private By addNoteModal = By.CssSelector("[data-testid='add-note-modal']");
    private By cancelModalButton = By.CssSelector("[data-testid='note-cancel-button']");
    private By textArea = By.CssSelector("[data-testid='note-textarea']");
    private By submitButton = By.CssSelector("[data-testid='note-submit-button']");
    private By ticketNoteItem = By.CssSelector("[data-testid='note-item']");
    

    public TicketDetailPage(IWebDriver driver)
    {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
    }

    public void NavigateTo(string ticketId)
    {
        driver.Navigate().GoToUrl($"http://localhost:3000/dashboard/inbox/{ticketId}");
        wait.Until(ExpectedConditions.ElementIsVisible(notesCard));
    }

    public void LoginAndNavigate(string email, string password, string ticketId)
    {
        var loginPage = new LoginPage(driver);
        loginPage.NavigateTo();
        loginPage.Login(email, password);

        wait.Until(ExpectedConditions.UrlContains("/dashboard"));
        NavigateTo(ticketId);
    }

    public bool IsNotesCardVisible()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(notesCard)).Displayed;
        }
        catch
        {
            return false;
        }
    }
    
    public bool IsEmptyStateVisible()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(emptyState)).Displayed;
        }
        catch
        {
            return false;
        }
    }

    public void ClickAddNote()
    {
        var button = wait.Until(ExpectedConditions.ElementIsVisible(addNoteButton));
        button.Click();
    }

    public bool IsModalOpened()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(addNoteModal)).Displayed;
        }
        catch
        {
            return false;
        }
    }

    public int GetNoteItemsCount()
    {
        try
        {
            wait.Until(d => d.FindElements(ticketNoteItem).Count >= 0);
            Thread.Sleep(1000);
            return driver.FindElements(ticketNoteItem).Count;
        }
        catch
        {
            return 0;
        }
    }

    public void ClickCancelButton()
    {
        var button = wait.Until(ExpectedConditions.ElementIsVisible(cancelModalButton));
        button.Click();
    }

    public void EnterContent(string content)
    {
        var input = wait.Until(ExpectedConditions.ElementIsVisible(textArea));
        input.SendKeys(content);
    }

    public void ClickSubmit()
    {
        var button = wait.Until(ExpectedConditions.ElementIsVisible(submitButton));
        button.Click();
    }

    public void EnterNoteText(string text)
    {
        wait.Until(ExpectedConditions.ElementIsVisible(textArea));
        driver.FindElement(textArea).Clear();
        driver.FindElement(textArea).SendKeys(text);
    }

    public void CreateNote(string text)
    {
        ClickAddNote();
        EnterContent(text);
        ClickSubmit();
    }
}