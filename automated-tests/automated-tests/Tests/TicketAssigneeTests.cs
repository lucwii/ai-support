using automated_tests.Helpers;
using automated_tests.Pages;

namespace automated_tests.Tests;

public class TicketAssigneeTests : TestBase
{
    private TicketDetailPage ticketDetailPage;

    private const string AgentEmail = "test@gmail.com";
    private const string AgentPassword = "Luka1310";
    private const string ticketId = "b48a8608-c4a5-48e6-a660-f0f57566eaf8";

    [SetUp]
    public void SetUp()
    {
        ticketDetailPage = new TicketDetailPage(driver);
        ticketDetailPage.LoginAndNavigate(AgentEmail, AgentPassword, ticketId);
    }

    [Test]
    public void AssigneeDroppedDown_IsVisible()
    {
        ticketDetailPage.DropDownClick();
        Assert.That(ticketDetailPage.IsDropDownOpen(), "When dropdown clicked, it should be open");
    }

    [Test]
    public void AssignFirstOption_TextShouldNotBeUnassigned()
    {
        ticketDetailPage.DropDownClick();
        ticketDetailPage.SelectFirstAgent();

        string text = ticketDetailPage.GetAssigneeDisplayText();
        Assert.That(text, Is.Not.EqualTo("Unassigned"), "Display should not show unassigned");
    }

    [Test]
    public void Assignment_PersistsAfterRefresh()
    {
        // Reset to clean state first
        ticketDetailPage.DropDownClick();
        ticketDetailPage.SelectUnassigned();

        ticketDetailPage.DropDownClick();
        ticketDetailPage.SelectFirstAgent();
        string nameBefore = ticketDetailPage.GetAssigneeDisplayText();

        ticketDetailPage.RefreshPage();
        string nameAfter = ticketDetailPage.GetAssigneeDisplayText();

        Assert.That(nameBefore, Is.EqualTo(nameAfter));
    }

    [Test]
    public void UnassignTicket_ShouldShowUnassigned()
    {
        ticketDetailPage.DropDownClick();
        ticketDetailPage.SelectFirstAgent();
        
        ticketDetailPage.DropDownClick();
        ticketDetailPage.SelectUnassigned();
        
        Assert.That(ticketDetailPage.GetAssigneeDisplayText(), Is.EqualTo("Unassigned"));
    }
    
    [Test]
    public void Unassignment_PersistsAfterRefresh()
    {
        ticketDetailPage.DropDownClick();
        ticketDetailPage.SelectFirstAgent();
        ticketDetailPage.DropDownClick();
        ticketDetailPage.SelectUnassigned();

        ticketDetailPage.RefreshPage();
        string nameAfterRefresh = ticketDetailPage.GetAssigneeDisplayText();

        Assert.That(nameAfterRefresh, Is.EqualTo("Unassigned"),
            "Unassignment should persist after page refresh");
    }
}
