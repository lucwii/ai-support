using automated_tests.Helpers;
using automated_tests.Pages;

namespace automated_tests.Tests;

// ASSUMPTION: The test organization for the configured agent account has at least
// one knowledge chunk in the database (required for StatsCount and ChunkCount tests).
// Tests that create a chunk clean up after themselves (delete what they added).

public class KnowledgeTests : TestBase
{
    private KnowledgePage knowledgePage;

    private const string AgentEmail    = "test@gmail.com";
    private const string AgentPassword = "Luka1310";

    // Long enough to pass validation (>= 10 characters)
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

    // --- Page visibility ---

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

    // --- Upload form: button validation ---

    [Test]
    public void UploadButton_DisabledOnLoad()
    {
        Assert.That(knowledgePage.IsUploadButtonDisabled(),
            "Upload button should be disabled when the textarea is empty");
    }

    [Test]
    public void UploadButton_DisabledWhenContentTooShort()
    {
        knowledgePage.EnterContent("short"); // 5 characters
        Assert.That(knowledgePage.IsUploadButtonDisabled(),
            "Upload button should be disabled when content is fewer than 10 characters");
    }

    [Test]
    public void UploadButton_EnabledWhenContentValid()
    {
        knowledgePage.EnterContent("1234567890"); // exactly 10 characters
        Assert.That(knowledgePage.IsUploadButtonEnabled(),
            "Upload button should be enabled when content has >= 10 characters");
    }

    // --- Char count ---

    [Test]
    public void CharCount_ShowsMinimumMessage_WhenEmpty()
    {
        Assert.That(knowledgePage.GetCharCountText(), Is.EqualTo("Minimum 10 characters"),
            "Should display the minimum message when the textarea is empty");
    }

    [Test]
    public void CharCount_UpdatesOnInput()
    {
        knowledgePage.EnterContent("Hello");
        Assert.That(knowledgePage.GetCharCountText(), Is.EqualTo("5 characters"),
            "Char count should display the exact number of characters entered");
    }

    // --- Upload flow ---

    [Test]
    public void Upload_ShowsLoadingState()
    {
        knowledgePage.EnterContent(ValidContent);
        knowledgePage.ClickUpload();
        // Text changes immediately — verify before the AI returns a response
        Assert.That(knowledgePage.GetUploadButtonText(), Does.Contain("Uploading"),
            "Button should display loading text while the upload is in progress");
    }

    [Test]
    public void Upload_ShowsSuccessMessage()
    {
        knowledgePage.UploadAndWait(ValidContent);
        Assert.That(knowledgePage.IsSuccessMessageVisible(),
            "Success message should be visible after a successful upload");
    }

    [Test]
    public void Upload_SuccessMessage_ContainsChunkInfo()
    {
        knowledgePage.UploadAndWait(ValidContent);
        string msg = knowledgePage.GetSuccessMessageText();
        Assert.That(msg, Does.Contain("chunk"),
            "Success message should mention the number of chunks created");
    }

    [Test]
    public void Upload_ClearsTextareaAfterSuccess()
    {
        knowledgePage.UploadAndWait(ValidContent);
        Assert.That(knowledgePage.GetTextareaValue(), Is.Empty,
            "Textarea should be empty after a successful upload");
    }

    [Test]
    public void Upload_IncreasesChunkCount()
    {
        int countBefore = knowledgePage.GetChunkRowCount();
        knowledgePage.UploadAndWait(ValidContent);
        int countAfter = knowledgePage.GetChunkRowCount();
        Assert.That(countAfter, Is.GreaterThan(countBefore),
            "The number of rows in the list should increase after an upload");
    }

    [Test]
    public void Upload_SuccessMessageDisappears_WhenTextareaEdited()
    {
        knowledgePage.UploadAndWait(ValidContent);
        knowledgePage.EnterContent("x"); // any input resets the result state
        Assert.That(knowledgePage.IsSuccessMessageVisible(), Is.False,
            "Success message should disappear as soon as the user starts typing new content");
    }

    // --- Delete flow ---

    [Test]
    public void Delete_ClickTrash_ShowsConfirmUI()
    {
        knowledgePage.UploadAndWait(ValidContent);
        knowledgePage.ClickDeleteIconButton();
        Assert.That(knowledgePage.IsConfirmDeleteVisible(),
            "Confirm UI should be visible after clicking the trash button");
    }

    [Test]
    public void Delete_ClickCancel_HidesConfirmUI()
    {
        knowledgePage.UploadAndWait(ValidContent);
        knowledgePage.ClickDeleteIconButton();
        knowledgePage.ClickCancelDelete();
        Assert.That(knowledgePage.IsConfirmDeleteVisible(), Is.False,
            "Confirm UI should disappear after clicking Cancel");
    }

    [Test]
    public void Delete_ClickCancel_ChunkStaysInList()
    {
        knowledgePage.UploadAndWait(ValidContent);
        int countBefore = knowledgePage.GetChunkRowCount();
        knowledgePage.ClickDeleteIconButton();
        knowledgePage.ClickCancelDelete();
        Assert.That(knowledgePage.GetChunkRowCount(), Is.EqualTo(countBefore),
            "The chunk count should not change after clicking Cancel");
    }

    [Test]
    public void Delete_Confirm_RemovesChunk()
    {
        knowledgePage.UploadAndWait(ValidContent);
        int countBefore = knowledgePage.GetChunkRowCount();
        knowledgePage.ClickDeleteIconButton();
        knowledgePage.ClickConfirmDelete();
        // Wait for the row to physically disappear from the DOM (API call + state update)
        knowledgePage.WaitForChunkCountToBe(countBefore - 1);
        Assert.That(knowledgePage.GetChunkRowCount(), Is.EqualTo(countBefore - 1),
            "The chunk count should decrease by 1 after confirming deletion");
    }

    // --- Stats card ---

    [Test]
    public void StatsCount_MatchesListCount()
    {
        int listCount = knowledgePage.GetChunkRowCount();
        int stats     = knowledgePage.GetStatsCount();
        Assert.That(stats, Is.EqualTo(listCount),
            "The stats count in the Tips card should match the number of rows in the table");
    }

    [Test]
    public void StatsCount_IncreasesAfterUpload()
    {
        int statsBefore = knowledgePage.GetStatsCount();
        knowledgePage.UploadAndWait(ValidContent);
        int statsAfter = knowledgePage.GetStatsCount();
        Assert.That(statsAfter, Is.GreaterThan(statsBefore),
            "The stats count should increase after a new chunk is added");
    }

    // COMMENTED OUT: requires the organization to have no knowledge chunks at all.
    // Delete all chunks from Supabase for the test account and then remove this comment.
    // [Test]
    // public void EmptyState_IsVisible_WhenNoKnowledge()
    // {
    //     Assert.That(knowledgePage.IsEmptyStateVisible());
    //     Assert.That(knowledgePage.GetEmptyStateTitle(), Is.EqualTo("No knowledge yet"));
    // }
}
