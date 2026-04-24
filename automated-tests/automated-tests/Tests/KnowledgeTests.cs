using automated_tests.Helpers;
using automated_tests.Pages;

namespace automated_tests.Tests;

// PRETPOSTAVKA: Testna organizacija za agent@supportai.dev ima makar
// jedan knowledge chunk u bazi (potrebno za StatsCount i ChunkCount testove).
// Testovi koji kreiraju chunk čiste se sami (brišu ono što su dodali).

public class  KnowledgeTests : TestBase
{
    private KnowledgePage knowledgePage;

    private const string AgentEmail    = "test@gmail.com";
    private const string AgentPassword = "Luka1310";

    // Dovoljno dugačak sadržaj da prođe validaciju (>= 10 karaktera)
    private const string ValidContent =
        "Our refund policy allows customers to request a full refund within 30 days of purchase. " +
        "To initiate a refund, please contact our support team with your order number and reason for the request. " +
        "Refunds are processed within 5–7 business days to the original payment method.";

    [SetUp]
    public void SetUp()
    {
        knowledgePage = new KnowledgePage(driver);
        knowledgePage.LoginAndNavigate(AgentEmail, AgentPassword);
    }

    // --- Vidljivost stranice ---

    [Test]
    public void KnowledgePage_IsVisible()
    {
        Assert.That(knowledgePage.IsPageVisible());
    }

    [Test]
    public void UploadForm_IsVisible()
    {
        Assert.That(knowledgePage.IsUploadFormVisible());
    }

    [Test]
    public void KnowledgeListCard_IsVisible()
    {
        Assert.That(knowledgePage.IsListCardVisible());
    }

    // --- Upload forma: validacija dugmeta ---

    [Test]
    public void UploadButton_DisabledOnLoad()
    {
        Assert.That(knowledgePage.IsUploadButtonDisabled(),
            "Upload dugme mora biti disabled kada je textarea prazna");
    }

    [Test]
    public void UploadButton_DisabledWhenContentTooShort()
    {
        knowledgePage.EnterContent("short"); // 5 karaktera
        Assert.That(knowledgePage.IsUploadButtonDisabled(),
            "Upload dugme mora biti disabled za sadržaj kraći od 10 karaktera");
    }

    [Test]
    public void UploadButton_EnabledWhenContentValid()
    {
        knowledgePage.EnterContent("1234567890"); // tačno 10 karaktera
        Assert.That(knowledgePage.IsUploadButtonEnabled(),
            "Upload dugme mora biti enabled kada ima >= 10 karaktera");
    }

    // --- Char count ---

    [Test]
    public void CharCount_ShowsMinimumMessage_WhenEmpty()
    {
        Assert.That(knowledgePage.GetCharCountText(), Is.EqualTo("Minimum 10 characters"),
            "Treba prikazati minimum poruku kada je textarea prazna");
    }

    [Test]
    public void CharCount_UpdatesOnInput()
    {
        knowledgePage.EnterContent("Hello");
        Assert.That(knowledgePage.GetCharCountText(), Is.EqualTo("5 characters"),
            "Char count mora prikazati tačan broj unesenih karaktera");
    }

    // --- Upload flow ---

    [Test]
    public void Upload_ShowsLoadingState()
    {
        knowledgePage.EnterContent(ValidContent);
        knowledgePage.ClickUpload();
        // Tekst se mijenja odmah — provjeri prije nego što AI vrati odgovor
        Assert.That(knowledgePage.GetUploadButtonText(), Does.Contain("Uploading"),
            "Dugme mora prikazati loading tekst tokom uploada");
    }

    [Test]
    public void Upload_ShowsSuccessMessage()
    {
        knowledgePage.UploadAndWait(ValidContent);
        Assert.That(knowledgePage.IsSuccessMessageVisible(),
            "Success poruka mora biti vidljiva nakon uspješnog uploada");
    }

    [Test]
    public void Upload_SuccessMessage_ContainsChunkInfo()
    {
        knowledgePage.UploadAndWait(ValidContent);
        string msg = knowledgePage.GetSuccessMessageText();
        Assert.That(msg, Does.Contain("chunk"),
            "Success poruka mora sadržavati broj kreirana chunkova");
    }

    [Test]
    public void Upload_ClearsTextareaAfterSuccess()
    {
        knowledgePage.UploadAndWait(ValidContent);
        Assert.That(knowledgePage.GetTextareaValue(), Is.Empty,
            "Textarea mora biti prazna nakon uspješnog uploada");
    }

    [Test]
    public void Upload_IncreasesChunkCount()
    {
        int countBefore = knowledgePage.GetChunkRowCount();
        knowledgePage.UploadAndWait(ValidContent);
        int countAfter = knowledgePage.GetChunkRowCount();
        Assert.That(countAfter, Is.GreaterThan(countBefore),
            "Broj redova u listi mora porasti nakon uploada");
    }

    [Test]
    public void Upload_SuccessMessageDisappears_WhenTextareaEdited()
    {
        knowledgePage.UploadAndWait(ValidContent);
        knowledgePage.EnterContent("x"); // bilo koji input resetuje result state
        Assert.That(knowledgePage.IsSuccessMessageVisible(), Is.False,
            "Success poruka mora nestati čim korisnik počne kucati novi sadržaj");
    }

    // --- Delete flow ---

    [Test]
    public void Delete_ClickTrash_ShowsConfirmUI()
    {
        knowledgePage.UploadAndWait(ValidContent);
        knowledgePage.ClickDeleteIconButton();
        Assert.That(knowledgePage.IsConfirmDeleteVisible(),
            "Confirm UI mora biti vidljiv nakon klika na trash dugme");
    }

    [Test]
    public void Delete_ClickCancel_HidesConfirmUI()
    {
        knowledgePage.UploadAndWait(ValidContent);
        knowledgePage.ClickDeleteIconButton();
        knowledgePage.ClickCancelDelete();
        Assert.That(knowledgePage.IsConfirmDeleteVisible(), Is.False,
            "Confirm UI mora nestati nakon klika na Cancel");
    }

    [Test]
    public void Delete_ClickCancel_ChunkStaysInList()
    {
        knowledgePage.UploadAndWait(ValidContent);
        int countBefore = knowledgePage.GetChunkRowCount();
        knowledgePage.ClickDeleteIconButton();
        knowledgePage.ClickCancelDelete();
        Assert.That(knowledgePage.GetChunkRowCount(), Is.EqualTo(countBefore),
            "Broj chunkova ne smije se promijeniti nakon Cancel-a");
    }

    [Test]
    public void Delete_Confirm_RemovesChunk()
    {
        knowledgePage.UploadAndWait(ValidContent);
        int countBefore = knowledgePage.GetChunkRowCount();
        knowledgePage.ClickDeleteIconButton();
        knowledgePage.ClickConfirmDelete();
        // Čekaj da red fizički nestane iz DOM-a (API call + state update)
        knowledgePage.WaitForChunkCountToBe(countBefore - 1);
        Assert.That(knowledgePage.GetChunkRowCount(), Is.EqualTo(countBefore - 1),
            "Broj chunkova mora se smanjiti za 1 nakon potvrde brisanja");
    }

    // --- Stats kartica ---

    [Test]
    public void StatsCount_MatchesListCount()
    {
        int listCount  = knowledgePage.GetChunkRowCount();
        int stats      = knowledgePage.GetStatsCount();
        Assert.That(stats, Is.EqualTo(listCount),
            "Stats count u Tips kartici mora odgovarati broju redova u tabeli");
    }

    [Test]
    public void StatsCount_IncreasesAfterUpload()
    {
        int statsBefore = knowledgePage.GetStatsCount();
        knowledgePage.UploadAndWait(ValidContent);
        int statsAfter = knowledgePage.GetStatsCount();
        Assert.That(statsAfter, Is.GreaterThan(statsBefore),
            "Stats count mora porasti nakon što se doda novi chunk");
    }

    // ZAKOMENTARISANO: zahtijeva da organizacija nema nijedan knowledge chunk
    // Obriši sve chunkove iz Supabase za testnog agenta pa ukloni komentar
    // [Test]
    // public void EmptyState_IsVisible_WhenNoKnowledge()
    // {
    //     Assert.That(knowledgePage.IsEmptyStateVisible());
    //     Assert.That(knowledgePage.GetEmptyStateTitle(), Is.EqualTo("No knowledge yet"));
    // }
}
