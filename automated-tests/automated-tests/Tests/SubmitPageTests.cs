using automated_tests.Helpers;
using automated_tests.Pages;

namespace automated_tests.Tests;

public class SubmitPageTests : TestBase
{
    private SubmitPage submitPage;

    private const string ValidSlug = "cluely";
    private const string ValidEmail = "test@gmail.com";
    private const string ValidContent = "Can you tell me about your refund policy";

    [SetUp]
    public void SetUp()
    {
        submitPage = new SubmitPage(driver);
        submitPage.NavigateTo(ValidSlug);
    }

    [Test]
    public void Submit_SubmitButton_DisabledOnLoad()
    {
        Assert.That(submitPage.Is_Submit_Disabled(), "Submit button should be disabled on load");
    }

    [Test]
    public void Submit_SubmitButton_Disabled_WhenContentTooShort()
    {
        submitPage.EnterContent("abc");
        Assert.That(submitPage.Is_Submit_Disabled(), "Submit button should be disabled when content is less than 10 characters");
    }

    [Test]
    public void Submit_SubmitButton_Enabled_WhenContentValid()
    {
        submitPage.EnterContent("1234567890");
        Assert.That(submitPage.Is_Submit_Enabled(), "Submit should be enabled when content is valid");
    }

    [Test]
    public void Submit_CharCounter_UpdatesOnInput()
    {
        submitPage.EnterContent("Hello");
        Assert.That(submitPage.CharacterCount(), Is.EqualTo("5 / 2000"), "Character count should be 5 when entering Hello");
    }
    
    [Test]
    public void Submit_ValidTicket_ShowsSuccessRate()
    {
        submitPage.SendTicket("test@gmail.com", "Can you tell me something about your refund policy");
        Assert.That(submitPage.IsSuccessAutoVisible(), "When submitted with valid credentials success heading should be visible");
    }

    [Test]
    public void Submit_AskAnotherQuestion_ResetsForm()
    {
        submitPage.SendTicket("test@gmail.com", "Zanimaju me vase cene i planovi i takodje placanja");
        submitPage.Click_AskAnotherQuestion();
        Assert.That(submitPage.OrgName_IsVisible(), "Clicking the feedback no button should redirect to the form");
    }

    [Test]
    public void Submit_FeedbackYes_ShowsConfirmation()
    {
        submitPage.SendTicket("test@gmail.com", "Can you tell me something about your refund policy");
        submitPage.Click_FeedbackYes();
        Assert.That(submitPage.FeedbackYesConfirmation_IsVisible(), "Feedback yes confirmation should be visible when clicking feedback yes button");
    }

    [Test]
    public void Submit_FeedbackNo_ShowsConfirmation()
    {
        submitPage.SendTicket("test@gmail.com", "Can you tell me something about your refund policy");
        submitPage.Click_FeedbackNo();
        Assert.That(submitPage.FeedbackNoConfirmation_IsVisible(), "Feedback no confirmation should be visible when clicking the feedback no button");
    }

    [Test]
    public void Submit_LoadingState_ShowsSpinner()
    {
        submitPage.SendTicket("test@gmail.com", "Can you tell me something about your refund policy");
        Assert.That(submitPage.GetButtonText(), Is.EqualTo("Sending..."));
    }

    [Test]
    public void Submit_EmailNotValid_ShouldShowError()
    {
        submitPage.SendTicket("test", "Can you tell me something about your refund policy");
        Assert.That(submitPage.Is_ValidationError_Visible(), Is.True, "Validation error should show when the invalid email is entered");
    }

    [Test]
    public void Submit_ButtonShouldBeEnabled_WhenBothFieldsValid()
    {
        submitPage.EnterContent("Can you tell me something about your refund policy");
        submitPage.EnterEmail("test@gmail.com");
        Assert.That(submitPage.Is_Submit_Enabled, Is.True, "Submit button should be enabled when both field valid");
    }

    [Test]
    public void Submit_SubmitButton_ShouldBeDisabled_WhenContentExceedsLimit()
    {
        string longString = new string('a', 2001);
        submitPage.SendTicket("test@gmail.com", longString);
        Assert.That(submitPage.Is_Submit_Disabled, Is.True, "Submit button should be disabled when content characters exceed the limit (over 2000 characters)");
    }

    [Test]
    public void Submit_CharCounter_At2000_ShouldShowMax()
    {
        string maxString = new string('a', 2000);
        submitPage.SendTicket("test@gmail.com", maxString);
        Assert.That(submitPage.CharacterCount(), Is.EqualTo("2000 / 2000"), "When 2000 characters entered character count should show 2000 / 2000");
    }

    [Test]
    public void Submit_Form_ClearedAfter_AskAnotherQuestion()
    {
        submitPage.SendTicket(ValidEmail, ValidContent);
        submitPage.Click_AskAnotherQuestion();
        
        Assert.That(submitPage.Is_EmailField_Empty(), Is.True, "Email field should be empty when after ask another question button is clicked");
        
        Assert.That(submitPage.Is_ContentField_Empty(), Is.True, "Content field should be empty when clicking ask another question button");
    }

    [Test]
    public void Submit_NotFound_ShowsOnWrongSlug()
    {
        submitPage.NavigateError("123");
        Assert.That(submitPage.Is_NotFound_Visible(), Is.True, "Not found error should be visible when entering a wrong slug");
    }
    
    [TestCase("test@gmail.com", "short", false, TestName = "Content too short")]                 
    [TestCase("test@gmail.com", "Valid content here for test", true, TestName = "Both fields   valid")]
    public void Submit_ButtonState_BasedOnInputs(string email, string content, bool expectedEnabled)
    {
        if (!string.IsNullOrEmpty(email))
        {
            submitPage.EnterEmail(email);
        }

        if (!string.IsNullOrEmpty(content))
        {
            submitPage.EnterContent(content);
        }
        
        Assert.That(submitPage.Is_Submit_Enabled(), Is.EqualTo(expectedEnabled));
    }
}
