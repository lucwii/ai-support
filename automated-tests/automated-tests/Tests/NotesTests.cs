using automated_tests.Helpers;
using automated_tests.Pages;

namespace automated_tests.Tests;

public class NotesTests : TestBase
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
    }

    [Test]
    public void NotesCard_ShouldBeVisible()
    {
        Assert.That(ticketDetailPage.IsNotesCardVisible());
    }
    
    [Test]
    public void EmptyState_ShouldBeVisible()
    {
        Assert.That(ticketDetailPage.IsEmptyStateVisible());
    }

    [Test]
    public void AddNoteClick_ShouldOpenModal()
    {
        ticketDetailPage.ClickAddNote();
        
        Assert.That(ticketDetailPage.IsModalOpened());
    }

    [Test]
    public void CancelButtonClick_ShouldCloseModal()
    {
        ticketDetailPage.ClickAddNote();
        ticketDetailPage.ClickCancelButton();
        
        Assert.That(ticketDetailPage.IsModalOpened(), Is.Not.True);
    }

    [Test]
    public void CreateNote_ShouldNotShowError()
    {
        int countBefore = ticketDetailPage.GetNoteItemsCount();
        
        ticketDetailPage.ClickAddNote();

        string content = "Novi note iz testa";
        
        ticketDetailPage.EnterContent(content);
        ticketDetailPage.ClickSubmit();
        
        Assert.That(ticketDetailPage.GetNoteItemsCount(), Is.EqualTo(countBefore + 1), "There should be exactly 1 note after creating one");
        Assert.That(ticketDetailPage.IsModalOpened(), Is.Not.True);
    }

    [Test]
    public void CreateMultipleNotes_AllShouldBeVisible()
    {
        string firstNote = "First test note";
        string secondNote = "Second test note";
    
        int countBefore = ticketDetailPage.GetNoteItemsCount();
        
        ticketDetailPage.CreateNote(firstNote);
        
        Assert.That(ticketDetailPage.GetNoteItemsCount(), Is.EqualTo(countBefore + 1));
        
        ticketDetailPage.CreateNote(secondNote);
        
        Assert.That(ticketDetailPage.GetNoteItemsCount(), Is.EqualTo(countBefore + 2));
    }
}