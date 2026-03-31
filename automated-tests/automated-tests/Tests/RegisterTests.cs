using automated_tests.Helpers;
using automated_tests.Pages;

namespace automated_tests.Tests;

public class RegisterTests : TestBase
{
    private RegisterPage registerPage;

    private const string ValidName = "Test User";
    private const string ValidPassword = "Password123";
    private const string ExistingEmail = "milanoviclukaa23@gmail.com";

    [SetUp]
    public void Setup()
    {
        registerPage = new RegisterPage(driver);
        registerPage.NavigateTo();
    }

    private string GenerateUniqueEmail()
    {
        return $"test_{DateTime.Now.Ticks}@mailinator.com";
    }

    [Test]
    public void Register_WithValidData_ShouldRedirectToLogin()
    {
        string uniqueEmail = GenerateUniqueEmail();
        
        registerPage.Register(ValidName, uniqueEmail, ValidPassword);
        
        Assert.That(registerPage.IsRegisterSuccessful());
    }

    [Test]
    public void Register_WithEmptyName_ShouldNotRedirect()
    {
        string uniqueEmail = GenerateUniqueEmail();
        
        registerPage.Register("", uniqueEmail, ValidPassword);
        
        Assert.That(registerPage.IsRegisterSuccessful(), Is.Not.True, "Should not register with empty name");
    }

    [Test]
    public void Register_WithSpecialCharacters_ShouldRegister()
    {
        string uniqueEmail = GenerateUniqueEmail();
        
        registerPage.Register("Marko Ðorðević", uniqueEmail, ValidPassword);
        
        Assert.That(registerPage.IsRegisterSuccessful());
    }

    [Test]
    public void Register_WithVeryLongName_ShouldNotCrash()
    {
        string longName = new string('A', 200);
        string uniqueEmail = GenerateUniqueEmail();
        
        registerPage.Register(longName, uniqueEmail, ValidPassword);
        
        Assert.That(registerPage.IsRegisterSuccessful());
    }

    [Test]
    public void Register_WithExistingEmail_ShouldShowError()
    {
        registerPage.Register(ValidName, ExistingEmail, ValidPassword);
        
        Assert.That(registerPage.IsRegisterSuccessful(), Is.Not.True);
    }

    [Test]
    public void Register_WithEmptyEmail_ShouldShowError()
    {
        registerPage.Register(ValidName, "", ValidPassword);
        
        Assert.That(registerPage.IsRegisterSuccessful(), Is.Not.True);
    }

    [Test]
    public void Register_WithInvalicEmail()
    {
        registerPage.Register(ValidName, "milanoviclukaa23", ValidPassword);
        
        Assert.That(registerPage.IsRegisterSuccessful(), Is.Not.True);
    }
}