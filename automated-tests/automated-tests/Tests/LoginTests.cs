using automated_tests.Helpers;
using automated_tests.Pages;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

namespace automated_tests.Tests;

public class LoginTests : TestBase
{
    private LoginPage loginPage;

    [SetUp]
    public void SetUpLoginPage()
    {
        loginPage = new LoginPage(driver);
        loginPage.NavigateTo();
    }

    [Test]
    public void Login_WithValidCredentials()
    {
        string email = "agent@supportai.dev";
        string password = "TestPassword123!";

        loginPage.Login(email, password);

        Assert.That(loginPage.IsLoginSuccessful());
    }

    [Test]
    public void Login_WithWrongPassword()
    {
        string email = "existing@supportai.dev";
        string wrongPassword = "WrongPassword999!";

        loginPage.Login(email, wrongPassword);

        string error = loginPage.GetErrorMessage();
        Assert.That(error, Is.Not.Empty, "Expected error message for wrong password");
    }

    [Test]
    public void Login_WithNonExistantEmail()
    {
        string wrongEmail = "nonexistent@supportai.dev";
        string password = "TestPassword123!";

        loginPage.Login(wrongEmail, password);

        string error = loginPage.GetErrorMessage();
        Assert.That(error, Is.Not.Empty, "Expected error message for wrong email");
    }

    [Test]
    public void Login_WithEmptyPassword()
    {
        loginPage.Login("existing@supportai.dev", "");

        Assert.That(loginPage.IsLoginSuccessful(), Is.Not.True);
    }

    [Test]
    public void Login_WithEmptyEmail()
    {
        loginPage.Login("", "TestPassword123!");

        Assert.That(loginPage.IsLoginSuccessful(), Is.Not.True);
    }

    [Test]
    public void Login_WithInvalidEmailForm()
    {
        loginPage.Login("notanemail", "TestPassword123!");

        Assert.That(loginPage.IsLoginSuccessful(), Is.Not.True);
    }

    [Test]
    public void Login_PageHeading_IsVisible()
    {
        Assert.That("Welcome back", Is.EqualTo(loginPage.GetPageHeading()), "Page heading should be Welcome back");
    }

    [Test]
    public void Login_ForgotPassword_ShouldBeVisible()
    {
        Assert.That(loginPage.IsForgotPasswordLinkVisible(), "Forgot password is visible");
    }

    [Test]
    public void Login_SignupLink_ShouldRedirectTo_Register()
    {
        loginPage.ClickSignUpLink();

        var wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
        wait.Until(ExpectedConditions.UrlContains("/auth/register"));
        Assert.That(driver.Url.Contains("/auth/register"));
    }  
}