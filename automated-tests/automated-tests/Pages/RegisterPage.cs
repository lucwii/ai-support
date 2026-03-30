using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

namespace automated_tests.Pages;

public class RegisterPage
{
    private IWebDriver driver;
    private WebDriverWait wait;
    
    private By nameInput = By.Id("fullName");
    private By emailInput = By.Id("email");
    private By passwordInput = By.Id("password");
    private By submitButton = By.CssSelector("button[type='submit']");
    private By errorMessage = By.CssSelector("div[style*='rgba(239,68,68']");
    
    public RegisterPage(IWebDriver driver)
    {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
    }

    public void NavigateTo()
    {
        driver.Navigate().GoToUrl("http://localhost:3000/auth/register");
    }

    public void EnterName(string name)
    {
        wait.Until(ExpectedConditions.ElementIsVisible(nameInput));
        driver.FindElement(nameInput).SendKeys(name);
    }

    public void EnterEmail(string email)
    {
        wait.Until(ExpectedConditions.ElementIsVisible(emailInput));
        driver.FindElement(emailInput).SendKeys(email);
    }

    public void EnterPassword(string password)
    {
        wait.Until(ExpectedConditions.ElementIsVisible(passwordInput));
        driver.FindElement(passwordInput).SendKeys(password);
    }

    public void ClickSubmit()
    {
        driver.FindElement(submitButton).Click();
    }

    public void Register(string name, string email, string password)
    {
        EnterName(name);
        EnterEmail(email);
        EnterPassword(password);
        ClickSubmit();
    }

    public string GetErrorMessage()
    {
        wait.Until(ExpectedConditions.ElementIsVisible(errorMessage));
        return driver.FindElement(errorMessage).Text;
    }

    public bool IsRegisterSuccessful()
    {
        try
        {
            wait.Until(ExpectedConditions.UrlContains("/auth/login"));
            return true;
        }
        catch
        {
            return false;
        }
    }
}