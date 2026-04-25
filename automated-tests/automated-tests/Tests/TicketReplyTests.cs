using automated_tests.Helpers;
using automated_tests.Pages;

namespace automated_tests.Tests;

// Tests that resolve the ticket always reopen it in TearDown so the next test
// starts with an open ticket (reply box visible).
public class TicketReplyTests : TestBase
{
    private TicketDetailPage ticketDetailPage;

    private const string AgentEmail = "test@gmail.com";
    private const string AgentPassword = "Luka1310";
    private const string TicketId = "b48a8608-c4a5-48e6-a660-f0f57566eaf8";

    [SetUp]
    public void SetUp()
    {
        ticketDetailPage = new TicketDetailPage(driver);
        ticketDetailPage.LoginAndNavigate(AgentEmail, AgentPassword, TicketId);

        // Ensure ticket is open before each test
        if (ticketDetailPage.IsResolvedBannerVisible())
            ticketDetailPage.ClickReopenTicket();
    }

    [TearDown]
    public void TearDown()
    {
        // Leave ticket in open state after each test
        if (ticketDetailPage.IsResolvedBannerVisible())
            ticketDetailPage.ClickReopenTicket();
    }

    // --- Visibility & initial state ---

    [Test]
    public void ReplyTextarea_IsVisible()
    {
        Assert.That(ticketDetailPage.IsReplyTextareaVisible(), "Reply textarea should be visible on an open ticket");
    }

    [Test]
    public void SendButton_DisabledOnLoad()
    {
        Assert.That(ticketDetailPage.IsSendReplyButtonDisabled(), "Send button should be disabled when textarea is empty");
    }

    [Test]
    public void SendButton_DisabledWhenOnlyWhitespace()
    {
        ticketDetailPage.EnterReply("   ");
        Assert.That(ticketDetailPage.IsSendReplyButtonDisabled(), "Send button should be disabled when textarea has only spaces");
    }

    [Test]
    public void SendButton_EnabledWhenTextEntered()
    {
        ticketDetailPage.EnterReply("Test reply");
        Assert.That(ticketDetailPage.IsSendReplyButtonDisabled(), Is.False, "Send button should be enabled after typing");
    }

    // --- Sending a reply ---

    [Test]
    public void SendReply_ShowsResolvedBanner()
    {
        ticketDetailPage.SendReply("Reply from automated test");
        Assert.That(ticketDetailPage.IsResolvedBannerVisible(), "Resolved banner should appear after sending a reply");
    }

    [Test]
    public void SendReply_HidesReplyBox()
    {
        ticketDetailPage.SendReply("Reply from automated test");
        Assert.That(ticketDetailPage.IsReplyTextareaVisible(), Is.False, "Reply textarea should not be visible after ticket is resolved");
    }

    [Test]
    public void SendReply_AppearsInConversationThread()
    {
        string replyText = "Unique reply text 9x7z";
        ticketDetailPage.SendReply(replyText);
        Assert.That(ticketDetailPage.IsAgentMessageBubbleVisible(), "Agent message bubble should appear after sending a reply");
        Assert.That(ticketDetailPage.GetAgentMessageText(), Does.Contain(replyText));
    }

    [Test]
    public void SendReply_PersistsAfterRefresh()
    {
        string replyText = "Persistent reply 4k2m";
        ticketDetailPage.SendReply(replyText);
        ticketDetailPage.RefreshPage();
        Assert.That(ticketDetailPage.GetAgentMessageText(), Does.Contain(replyText));
    }

    // --- Resolve with AI ---

    [Test]
    public void ResolveWithAI_ShowsResolvedBanner()
    {
        ticketDetailPage.ClickResolveWithAI();
        Assert.That(ticketDetailPage.IsResolvedBannerVisible(), "Resolved banner should appear after resolving with AI");
    }

    [Test]
    public void ResolveWithAI_HidesReplyBox()
    {
        ticketDetailPage.ClickResolveWithAI();
        Assert.That(ticketDetailPage.IsReplyTextareaVisible(), Is.False);
    }

    // --- Reopen ---

    [Test]
    public void ReopenTicket_ShowsReplyBox()
    {
        ticketDetailPage.ClickResolveWithAI();
        ticketDetailPage.ClickReopenTicket();
        Assert.That(ticketDetailPage.IsReplyTextareaVisible(), "Reply textarea should be visible after reopening the ticket");
    }

    [Test]
    public void ReopenTicket_HidesResolvedBanner()
    {
        ticketDetailPage.ClickResolveWithAI();
        ticketDetailPage.ClickReopenTicket();
        Assert.That(ticketDetailPage.IsResolvedBannerVisible(), Is.False);
    }
}
