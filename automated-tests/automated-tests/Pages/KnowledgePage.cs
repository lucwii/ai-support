using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

namespace automated_tests.Pages;

public class KnowledgePage
{
    private IWebDriver driver;
    private WebDriverWait wait;

    private By pageWrapper      = By.CssSelector("[data-testid='knowledge-page']");
    private By textarea         = By.CssSelector("[data-testid='knowledge-textarea']");
    private By charCount        = By.CssSelector("[data-testid='knowledge-char-count']");
    private By uploadButton     = By.CssSelector("[data-testid='knowledge-upload-button']");
    private By successMessage   = By.CssSelector("[data-testid='knowledge-success-message']");
    private By errorMessage     = By.CssSelector("[data-testid='knowledge-error-message']");
    private By listCard         = By.CssSelector("[data-testid='knowledge-list-card']");
    private By chunkCountBadge  = By.CssSelector("[data-testid='knowledge-chunk-count']");
    private By chunkRows        = By.CssSelector("[data-testid='knowledge-chunk-row']");
    private By deleteIconButton = By.CssSelector("[data-testid='knowledge-delete-icon-button']");
    private By cancelDelete     = By.CssSelector("[data-testid='knowledge-cancel-delete']");
    private By confirmDelete    = By.CssSelector("[data-testid='knowledge-confirm-delete']");
    private By deletingSpinner  = By.CssSelector("[data-testid='knowledge-deleting-spinner']");
    private By statsCount       = By.CssSelector("[data-testid='knowledge-stats-count']");
    private By emptyTitle       = By.CssSelector("[data-testid='empty-title']");

    public KnowledgePage(IWebDriver driver)
    {
        this.driver = driver;
        this.wait   = new WebDriverWait(driver, TimeSpan.FromSeconds(20));
    }

    public void NavigateTo()
    {
        driver.Navigate().GoToUrl("http://localhost:3000/dashboard/knowledge");
        wait.Until(ExpectedConditions.ElementIsVisible(pageWrapper));
    }

    public void LoginAndNavigate(string email, string password)
    {
        var loginPage = new LoginPage(driver);
        loginPage.NavigateTo();
        loginPage.Login(email, password);
        wait.Until(ExpectedConditions.UrlContains("/dashboard"));
        NavigateTo();
    }

    private bool IsVisible(By selector)
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(selector)).Displayed;
        }
        catch (WebDriverTimeoutException)
        {
            return false;
        }
    }

    // --- Visibility ---

    public bool IsPageVisible()       => IsVisible(pageWrapper);
    public bool IsUploadFormVisible() => IsVisible(textarea);
    public bool IsListCardVisible()   => IsVisible(listCard);

    // --- Textarea ---

    public void EnterContent(string content)
    {
        var input = wait.Until(ExpectedConditions.ElementIsVisible(textarea));
        input.Clear();
        input.SendKeys(content);
    }

    public string GetTextareaValue()
    {
        return wait.Until(ExpectedConditions.ElementIsVisible(textarea)).GetAttribute("value");
    }

    // --- Char count ---

    public string GetCharCountText()
    {
        return wait.Until(ExpectedConditions.ElementIsVisible(charCount)).Text;
    }

    // --- Upload button ---

    public bool IsUploadButtonDisabled()
    {
        var button = wait.Until(ExpectedConditions.ElementIsVisible(uploadButton));
        return !button.Enabled || button.GetAttribute("disabled") != null;
    }

    public bool IsUploadButtonEnabled()
    {
        var button = wait.Until(ExpectedConditions.ElementIsVisible(uploadButton));
        return button.Enabled && button.GetAttribute("disabled") == null;
    }

    public string GetUploadButtonText()
    {
        return wait.Until(ExpectedConditions.ElementIsVisible(uploadButton)).Text;
    }

    public void ClickUpload()
    {
        var button = wait.Until(ExpectedConditions.ElementToBeClickable(uploadButton));
        button.Click();
    }

    // --- Messages ---

    public bool IsSuccessMessageVisible() => IsVisible(successMessage);
    public bool IsErrorMessageVisible()   => IsVisible(errorMessage);

    public string GetSuccessMessageText()
    {
        return wait.Until(ExpectedConditions.ElementIsVisible(successMessage)).Text;
    }

    // --- Upload and wait (AI embedding creation can take a while) ---

    public void UploadAndWait(string content)
    {
        EnterContent(content);
        ClickUpload();
        var longWait = new WebDriverWait(driver, TimeSpan.FromSeconds(60));
        longWait.Until(ExpectedConditions.ElementIsVisible(successMessage));
    }

    // --- Chunk list ---

    public int GetChunkRowCount()
    {
        // Wait until the list stabilizes — either rows or the empty state appear
        wait.Until(d =>
        {
            var rows  = d.FindElements(chunkRows);
            var empty = d.FindElements(emptyTitle);
            return rows.Count > 0 || empty.Count > 0 ? (object)true : null;
        });
        return driver.FindElements(chunkRows).Count;
    }

    public void WaitForChunkCountToBe(int expected)
    {
        // Used after deletion to wait for the row to be removed from the DOM
        var longWait = new WebDriverWait(driver, TimeSpan.FromSeconds(30));
        longWait.Until(d => d.FindElements(chunkRows).Count == expected ? (object)true : null);
    }

    public bool IsChunkCountBadgeVisible() => IsVisible(chunkCountBadge);

    public string GetChunkCountBadgeText()
    {
        return wait.Until(ExpectedConditions.ElementIsVisible(chunkCountBadge)).Text;
    }

    // --- Stats card ---

    public int GetStatsCount()
    {
        var text = wait.Until(ExpectedConditions.ElementIsVisible(statsCount)).Text;
        return int.Parse(text.Trim());
    }

    // --- Empty state ---

    public bool IsEmptyStateVisible() => IsVisible(emptyTitle);

    public string GetEmptyStateTitle()
    {
        return wait.Until(ExpectedConditions.ElementIsVisible(emptyTitle)).Text;
    }

    // --- Delete flow ---

    public void ClickDeleteIconButton(int index = 0)
    {
        var rows = wait.Until(d =>
        {
            var els = d.FindElements(chunkRows);
            return els.Count > index ? els : null;
        });
        var deleteBtn = rows![index].FindElement(By.CssSelector("[data-testid='knowledge-delete-icon-button']"));
        deleteBtn.Click();
    }

    public bool IsConfirmDeleteVisible()
    {
        return driver.FindElements(confirmDelete).Count > 0;
    }

    public void ClickConfirmDelete()
    {
        var button = wait.Until(d =>
        {
            var els = d.FindElements(confirmDelete);
            return els.Count > 0 ? els[0] : null;
        });
        button!.Click();
        // Wait for the confirm UI to disappear before returning
        wait.Until(d => d.FindElements(confirmDelete).Count == 0 ? (object)true : null);
    }

    public void ClickCancelDelete()
    {
        var button = wait.Until(d =>
        {
            var els = d.FindElements(cancelDelete);
            return els.Count > 0 ? els[0] : null;
        });
        button!.Click();
        wait.Until(d => d.FindElements(cancelDelete).Count == 0 ? (object)true : null);
    }
}
