using OpenQA.Selenium;
using OpenQA.Selenium.Interactions;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

namespace automated_tests.Pages;

public class TicketDetailPage
{
    private IWebDriver driver;
    private WebDriverWait wait;
    
    private By notesCard = By.CssSelector("[data-testid='notes-card']");
    private By emptyState = By.CssSelector("[data-testid='notes-empty-state']");
    private By addNoteButton = By.CssSelector("[data-testid='add-note-button']");
    private By addNoteModal = By.CssSelector("[data-testid='add-note-modal']");
    private By cancelModalButton = By.CssSelector("[data-testid='note-cancel-button']");
    private By textArea = By.CssSelector("[data-testid='note-textarea']");
    private By submitButton = By.CssSelector("[data-testid='note-submit-button']");
    private By ticketNoteItem = By.CssSelector("[data-testid='note-item']");
    
    private By deleteNoteButton = By.CssSelector("[data-testid='delete-note-button']");
    private By confirmDeleteButton = By.CssSelector("[data-testid='confirm-delete-yes']");
    private By cancelDeleteButton = By.CssSelector("[data-testid='confirm-delete-no']");
    
    private By editNoteButton = By.CssSelector("[data-testid='edit-note-button']");
    private By cancelEditButton = By.CssSelector("[data-testid='cancel-edit-button']");
    private By saveNoteButton = By.CssSelector("[data-testid='save-note-button']");
    private By editTextarea = By.CssSelector("[data-testid='edit-note-textarea']");
    
    private By assigneeDropDown = By.CssSelector("[data-testid='assignee-dropdown']");
    private By assigneeDisplay = By.CssSelector("[data-testid='assignee-display']");
    private By assigneeDropDownUnassigned = By.CssSelector("[data-testid='assignee-option-unassigned']");
    private By assigneeDropDownOption = By.CssSelector("[data-testid='assignee-option']");

    public TicketDetailPage(IWebDriver driver)
    {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, TimeSpan.FromSeconds(10));
    }

    public void NavigateTo(string ticketId)
    {
        driver.Navigate().GoToUrl($"http://localhost:3000/dashboard/inbox/{ticketId}");
        wait.Until(ExpectedConditions.ElementIsVisible(notesCard));
    }

    public void RefreshPage()
    {
        driver.Navigate().Refresh();
        wait.Until(ExpectedConditions.ElementIsVisible(notesCard));
    }

    public void LoginAndNavigate(string email, string password, string ticketId)
    {
        var loginPage = new LoginPage(driver);
        loginPage.NavigateTo();
        loginPage.Login(email, password);

        wait.Until(ExpectedConditions.UrlContains("/dashboard"));
        NavigateTo(ticketId);
    }

    public bool IsNotesCardVisible()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(notesCard)).Displayed;
        }
        catch
        {
            return false;
        }
    }
    
    public bool IsEmptyStateVisible()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(emptyState)).Displayed;
        }
        catch
        {
            return false;
        }
    }

    public void ClickAddNote()
    {
        var button = wait.Until(ExpectedConditions.ElementIsVisible(addNoteButton));
        button.Click();
    }

    public bool IsModalOpened()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(addNoteModal)).Displayed;
        }
        catch
        {
            return false;
        }
    }

    public int GetNoteItemsCount()
    {
        try
        {
            // Poll until count stabilizes (two consecutive reads agree) so we don't
            // read a stale value while the DOM is still updating after an API call.
            int prev = -1;
            for (int i = 0; i < 10; i++)
            {
                int curr = driver.FindElements(ticketNoteItem).Count;
                if (curr == prev) return curr;
                prev = curr;
                Thread.Sleep(400);
            }
            return driver.FindElements(ticketNoteItem).Count;
        }
        catch
        {
            return 0;
        }
    }

    public void ClickCancelButton()
    {
        var button = wait.Until(ExpectedConditions.ElementIsVisible(cancelModalButton));
        button.Click();
    }

    public void EnterContent(string content)
    {
        var input = wait.Until(ExpectedConditions.ElementIsVisible(textArea));
        input.SendKeys(content);
    }

    public void ClickSubmit()
    {
        var button = wait.Until(ExpectedConditions.ElementIsVisible(submitButton));
        button.Click();
        // Wait for the modal to close so callers can immediately read updated note count
        wait.Until(ExpectedConditions.InvisibilityOfElementLocated(addNoteModal));
    }

    public void EnterNoteText(string text)
    {
        wait.Until(ExpectedConditions.ElementIsVisible(textArea));
        driver.FindElement(textArea).Clear();
        driver.FindElement(textArea).SendKeys(text);
    }

    public void CreateNote(string text)
    {
        ClickAddNote();
        EnterContent(text);
        ClickSubmit();
    }
    
    public void HoverOverNote(int index = 0)
    {
        var notes = wait.Until(d => {
            var els = d.FindElements(ticketNoteItem);
            return els.Count > index ? els : null;
        });
        var actions = new Actions(driver);
        actions.MoveToElement(notes![index]).Perform();
        ((IJavaScriptExecutor)driver).ExecuteScript(
            "arguments[0].dispatchEvent(new MouseEvent('mouseover', {bubbles: true}))",
            notes[index]);
    }

    public void ClickDeleteNote(int index = 0)
    {
        wait.Until(d => {
            var els = d.FindElements(ticketNoteItem);
            return els.Count > index ? els : null;
        });
        var notes = driver.FindElements(ticketNoteItem);
        var deleteBtn = notes[index].FindElement(By.CssSelector("[data-testid='delete-note-button']"));
        ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].click()", deleteBtn);
    }

    public void ClickConfirmDelete()
    {
        // confirm-delete-yes lives inside opacity-0 group-hover container, so
        // ElementIsVisible returns false even after the element is in the DOM.
        // Wait for DOM presence only, then click via JS.
        var button = wait.Until(d => {
            var els = d.FindElements(confirmDeleteButton);
            return els.Count > 0 ? els[0] : null;
        });
        ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].click()", button);
    }

    public void CancelButtonClick()
    {
        // confirm-delete-no lives inside opacity-0 group-hover container, same issue.
        var button = wait.Until(d => {
            var els = d.FindElements(cancelDeleteButton);
            return els.Count > 0 ? els[0] : null;
        });
        ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].click()", button);
    }

    public void WaitForAssigneeDisplayToBe(string expected)
    {
        // After a page refresh, useMembers() re-fetches asynchronously. While it's
        // loading, currentMember is null and the display shows "Unassigned" even when
        // assigned_to is set in the DB. Wait until the display reflects the true value.
        wait.Until(d => {
            var el = d.FindElements(assigneeDisplay);
            return el.Count > 0 && el[0].Text == expected ? el[0] : null;
        });
    }

    public void ClickEditNote(int index = 0)
    {
        wait.Until(d => {
            var els = d.FindElements(ticketNoteItem);
            return els.Count > index ? els : null;
        });
        var notes = driver.FindElements(ticketNoteItem);
        var editBtn = notes[index].FindElement(By.CssSelector("[data-testid='edit-note-button']"));
        ((IJavaScriptExecutor)driver).ExecuteScript("arguments[0].click()", editBtn);
    }

    public void ClickConfirmEdit()
    {
        var button = wait.Until(ExpectedConditions.ElementIsVisible(saveNoteButton));
        button.Click();
    }

    public void ClickCancelEdit()
    {
        var button = wait.Until(ExpectedConditions.ElementIsVisible(cancelEditButton));
        button.Click();
    }

    public void EnterEditedText(string text)
    {
        wait.Until(ExpectedConditions.ElementIsVisible(editTextarea));
        driver.FindElement(editTextarea).Clear();
        driver.FindElement(editTextarea).SendKeys(text);
    }

    public bool NoteContainsText(string text, int index = 0)
    {
        var notes = driver.FindElements(ticketNoteItem);
        return notes[index].Text.Contains(text);
    }

    public bool IsDropDownOpen()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(assigneeDisplay)).Displayed;
        }
        catch
        {
            return false;
        }
    }

    public void DropDownClick()
    {
        var button = wait.Until(ExpectedConditions.ElementToBeClickable(assigneeDropDown));
        button.Click();
        System.Threading.Thread.Sleep(300);
    }

    public void SelectFirstAgent()
    {
        var options = wait.Until(d =>
        {
            var elements = d.FindElements(assigneeDropDownOption);
            return elements.Count > 0 ? elements : null;
        });
        options![0].Click();
        // Wait for dropdown to close, then wait for the display to reflect the new assignment
        wait.Until(d => d.FindElements(assigneeDropDownOption).Count == 0 ? (object)true : null);
        wait.Until(d => {
            var el = d.FindElements(assigneeDisplay);
            return el.Count > 0 && el[0].Text != "Unassigned" && el[0].Text != "" ? el[0] : null;
        });
    }

    public void SelectUnassigned()
    {
        var button = wait.Until(ExpectedConditions.ElementToBeClickable(assigneeDropDownUnassigned));
        button.Click();
        wait.Until(d => {
            var el = d.FindElements(assigneeDisplay);
            return el.Count > 0 && el[0].Text == "Unassigned" ? el[0] : null;
        });
    }

    public string GetAssigneeDisplayText()
    {
        return wait.Until(ExpectedConditions.ElementIsVisible(assigneeDisplay)).Text;
    }
}