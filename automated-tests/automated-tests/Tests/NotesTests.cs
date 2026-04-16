using automated_tests.Helpers;
using automated_tests.Pages;

namespace automated_tests.Tests;

public class NotesTests : TestBase
{
    private TicketDetailPage ticketDetailPage;
    
    private const string AgentEmail = "agent@supportai.dev";
    private const string AgentPassword = "TestPassword123!";
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
    
    // ZAKOMENTARISANO: zahtijeva da tiket b48a8608... nema note u bazi
    // Obriši note iz Supabase pa ukloni komentar
    // [Test]
    // public void EmptyState_ShouldBeVisible()
    // {
    //     Assert.That(ticketDetailPage.IsEmptyStateVisible());
    // }

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

    [Test]
    public void DeleteNote_ShouldReduceCount()
    {
        ticketDetailPage.CreateNote("Note za brisanje");
        int countBefore = ticketDetailPage.GetNoteItemsCount();
        
        ticketDetailPage.ClickDeleteNote();
        ticketDetailPage.ClickConfirmDelete();
        
        Assert.That(ticketDetailPage.GetNoteItemsCount(), Is.EqualTo(countBefore - 1));
    }

    [Test]
    public void CancelNote_ShouldNotAddNote()
    {
        ticketDetailPage.CreateNote("Note za cancel delete");
        int countBefore = ticketDetailPage.GetNoteItemsCount();

        ticketDetailPage.ClickDeleteNote();
        ticketDetailPage.CancelButtonClick();
        
        Assert.That(ticketDetailPage.GetNoteItemsCount(), Is.EqualTo(countBefore));
    }

    [Test]
    public void EditNote_ShouldSave()
    {
        ticketDetailPage.CreateNote("Note za editovanje");
        string editedText = "Promenjen note";

        ticketDetailPage.ClickEditNote();
        ticketDetailPage.EnterEditedText(editedText);
        ticketDetailPage.ClickConfirmEdit();
        
        Assert.That(ticketDetailPage.NoteContainsText(editedText));
    }

    [Test]
    public void CancelEdit_ShouldCancel()
    {
        ticketDetailPage.CreateNote("Note za cancel edit");
        string editedText = "Novi note";

        ticketDetailPage.ClickEditNote();
        ticketDetailPage.EnterEditedText(editedText);
        ticketDetailPage.ClickCancelEdit();
        
        Assert.That(ticketDetailPage.NoteContainsText(editedText), Is.Not.True);
    }
}