using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

namespace automated_tests.Pages;

public class LoginPage
{
    private IWebDriver driver;
    private WebDriverWait wait;
    
    private By emailField = By.Id("email");
    private By passwordField = By.Id("password");
    private By submitButton = By.CssSelector("button[type='submit']");
    private By errorMessage = By.CssSelector("div[style*='rgba(239,68,68']");
    private By pageHeading = By.TagName("h1");
    private By forgotPasswordLink = By.CssSelector("a[href='/auth/forgot-password']");
    private By signUpLink = By.CssSelector("a[href='/auth/register']");

    public LoginPage(IWebDriver driver)
    {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
    }

    public void NavigateTo()
    {
        driver.Navigate().GoToUrl("http://localhost:3000/auth/login");
    }

    public void EnterEmail(string email)
    {
        wait.Until(ExpectedConditions.ElementIsVisible(emailField));
        driver.FindElement(emailField).Clear();
        driver.FindElement(emailField).SendKeys(email);
    }

    public void EnterPassword(string password)
    {
        driver.FindElement(passwordField);
        driver.FindElement(passwordField).SendKeys(password);
    }

    public void ClickSubmit()
    {
        driver.FindElement(submitButton).Click();
    }

    public void Login(string email, string password)
    {
        EnterEmail(email);
        EnterPassword(password);
        ClickSubmit();
    }

    public string GetErrorMessage()
    {
        wait.Until(ExpectedConditions.ElementIsVisible(errorMessage));
        return driver.FindElement(errorMessage).Text;
    }

    public bool IsLoginSuccessful()
    {
        try
        {
            wait.Until(ExpectedConditions.UrlContains("/dashboard"));
            return true;
        }
        catch
        {
            return false;
        }
    }

    public string GetSubmitButtonText()
    {
        return driver.FindElement(submitButton).Text;
    }

    public bool IsForgotPasswordLinkVisible()
    {
        return driver.FindElement(forgotPasswordLink).Displayed;
    }

    public void ClickSignUpLink()
    {
        driver.FindElement(signUpLink).Click();
    }

    public string GetPageHeading()
    {
        wait.Until(ExpectedConditions.ElementIsVisible(pageHeading));
        return driver.FindElement(pageHeading).Text;
    }
}