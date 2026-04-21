using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

namespace automated_tests.Pages;

public class SubmitPage
{
    private IWebDriver driver;
    private WebDriverWait wait;
    
    private By orgName = By.CssSelector("[data-testid='org-name']");
    private By emailInput = By.CssSelector("[data-testid='email-input']");
    private By contentInput = By.CssSelector("[data-testid='content-input']");
    private By submitButton = By.CssSelector("[data-testid='submit-button']");
    private By charCounter = By.CssSelector("[data-testid='char-counter']");
    
    private By validationError = By.CssSelector("[data-testid='validation-error']");
    private By apiError = By.CssSelector("[data-testid='api-error']");
    
    private By successHeading = By.CssSelector("[data-testid='success-auto-heading']");
    private By feedbackYes = By.CssSelector("[data-testid='feedback-yes']");
    private By feedbackNo = By.CssSelector("[data-testid='feedback-no']");
    private By askAnotherButton = By.CssSelector("[data-testid='ask-another-button']");
    private By feedbackYesConfirmation = By.CssSelector("[data-testid='feedback-confirmed-yes']");
    private By feedbackNoConfirmation = By.CssSelector("[data-testid='feedback-confirmed-no']");
    
    private By notFoundPage = By.CssSelector("[data-testid='not-found-page']");

    public SubmitPage(IWebDriver driver)
    {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, TimeSpan.FromSeconds(15));
    }

    public void NavigateTo(string slug)
    {
        driver.Navigate().GoToUrl($"http://localhost:3000/submit/{slug}");
        wait.Until(ExpectedConditions.ElementIsVisible(emailInput));
    }
    
    public void NavigateError(string slug)
    {
        driver.Navigate().GoToUrl($"http://localhost:3000/submit/{slug}");
    }

    public string OrgName_Text()
    {
        return wait.Until(ExpectedConditions.ElementIsVisible(orgName)).Text;
    }

    public bool OrgName_IsVisible()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(orgName)).Displayed;
        }
        catch
        {
            return false;
        }
    }

    public void EnterEmail(string email)
    {
        wait.Until(ExpectedConditions.ElementIsVisible(emailInput));
        driver.FindElement(emailInput).SendKeys(email);
    }

    public void EnterContent(string content)
    {
        wait.Until(ExpectedConditions.ElementIsVisible(contentInput));
        driver.FindElement(contentInput).SendKeys(content);
    }

    public void ClickSubmit()
    {
        var button = driver.FindElement(submitButton);
        button.Click();
    }

    public void SendTicket(string email, string content)
    {
        EnterEmail(email);
        EnterContent(content);
        ClickSubmit();
        // wait.Until(ExpectedConditions.ElementIsVisible(successHeading));
    }

    public bool Is_Submit_Disabled()
    {
        var button = wait.Until(ExpectedConditions.ElementIsVisible(submitButton));

        return !button.Enabled || button.GetAttribute("disabled") != null;
    }

    public bool Is_Submit_Enabled()
    {
        var button = wait.Until(ExpectedConditions.ElementIsVisible(submitButton));

        return button.Enabled;
    }

    public string CharacterCount()
    {
        return driver.FindElement(charCounter).Text;
    }

    public bool IsSuccessAutoVisible()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(successHeading)).Displayed;
        }
        catch (NoSuchElementException)
        {
            return false;
        }
    }

    public void Click_FeedbackYes()
    {
        var button = wait.Until(ExpectedConditions.ElementIsVisible(feedbackYes));
        button.Click();
    }

    public void Click_FeedbackNo()
    {
        var button = wait.Until(ExpectedConditions.ElementIsVisible(feedbackNo));
        button.Click();
    }

    public void Click_AskAnotherQuestion()
    {
        var button = wait.Until(ExpectedConditions.ElementIsVisible(askAnotherButton));
        button.Click();
    }

    public bool FeedbackYesConfirmation_IsVisible()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(feedbackYesConfirmation)).Displayed;
        }
        catch
        {
            return false;
        }
    }
    
    public bool FeedbackNoConfirmation_IsVisible()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(feedbackNoConfirmation)).Displayed;
        }
        catch
        {
            return false;
        }
    }

    public string GetButtonText()
    {
        return driver.FindElement(submitButton).Text;
    }

    public bool Is_ValidationError_Visible()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(validationError)).Displayed;
        }
        catch
        {
            return false;
        }
    }

    public bool Is_EmailField_Empty()
    {
        var input = wait.Until(ExpectedConditions.ElementIsVisible(emailInput));
        string value = input.GetAttribute("value");
        return string.IsNullOrEmpty(value);
    }

    public bool Is_ContentField_Empty()
    {
        var input = wait.Until(ExpectedConditions.ElementIsVisible(contentInput));
        string value = input.GetAttribute("value");
        return string.IsNullOrEmpty(value);
    }

    public bool Is_NotFound_Visible()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(notFoundPage)).Displayed;
        }
        catch
        {
            return false;
        }
    }
}