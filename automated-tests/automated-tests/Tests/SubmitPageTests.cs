using automated_tests.Helpers;
using automated_tests.Pages;

namespace automated_tests.Tests;

public class SubmitPageTests : TestBase
{
    private SubmitPage submitPage;

    private const string ValidSlug = "cluely";

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
}
