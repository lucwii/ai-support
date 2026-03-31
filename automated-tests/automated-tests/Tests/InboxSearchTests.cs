using automated_tests.Helpers;
using automated_tests.Pages;

namespace automated_tests.Tests;

// PRETPOSTAVKA: U testnoj bazi postoje tiketi za organizaciju test@gmail.com koji sadrže:
// - Makar jedan tiket čiji sadržaj sadrži riječ "problem"
// - Makar jedan tiket s customer emailom koji sadrži "mailinator.com"
// - Makar jedan tiket sa statusom "pending_agent"
// Bez ovih podataka testovi TC-01, TC-02, TC-11 neće proći.

public class InboxSearchTests : TestBase
{
    private InboxPage inboxPage;

    private const string AgentEmail = "test@gmail.com";
    private const string AgentPassword = "Luka1310";

    // Poznate vrijednosti koje postoje u testnim podacima
    private const string KnownContentWord = "gmail";
    private const string KnownCustomerEmail = "mailinator.com";
    private const string NonExistentQuery = "xqz99nonexistent";

    [SetUp]
    public void Setup()
    {
        inboxPage = new InboxPage(driver);
        inboxPage.LoginAndNavigate(AgentEmail, AgentPassword);
    }

    // TC-01: Pretraga po dijelu sadržaja tiketa
    // Zašto: osnovna happy-path provjera da search uopšte radi
    [Test]
    public void Search_ByContentKeyword_ShouldFilterResults()
    {
        int totalBefore = inboxPage.GetVisibleTicketCount();

        inboxPage.EnterSearch(KnownContentWord);

        int totalAfter = inboxPage.GetVisibleTicketCount();

        Assert.That(totalAfter, Is.GreaterThan(0), "Treba biti makar jedan rezultat za poznatu riječ");
        Assert.That(totalAfter, Is.LessThanOrEqualTo(totalBefore), "Ne smije biti više rezultata nego ukupno");
    }

    // TC-02: Pretraga po dijelu emaila kupca
    // Zašto: search mora raditi i po customer_email polju, ne samo po sadržaju
    [Test]
    public void Search_ByCustomerEmailDomain_ShouldFilterResults()
    {
        inboxPage.EnterSearch(KnownCustomerEmail);

        int count = inboxPage.GetVisibleTicketCount();

        Assert.That(count, Is.GreaterThan(0), "Treba biti makar jedan tiket s tim emailom");
    }

    // TC-04: Klik na X dugme čisti search i vraća sve tikete
    // Zašto: korisnik mora moći brzo resetovati pretragu
    [Test]
    public void Search_ClickClearButton_ShouldResetSearch()
    {
        int totalBefore = inboxPage.GetVisibleTicketCount();

        inboxPage.EnterSearch(KnownContentWord);
        inboxPage.ClearSearch();

        int totalAfter = inboxPage.GetVisibleTicketCount();

        Assert.That(inboxPage.GetSearchInputValue(), Is.Empty, "Input mora biti prazan nakon clear-a");
        Assert.That(totalAfter, Is.EqualTo(totalBefore), "Broj tiketa mora biti isti kao na početku");
    }

    // TC-05: Samo razmaci ne smiju filtrirati ništa
    // Zašto: .trim() logika — bez toga bi whitespace vratio 0 rezultata
    [Test]
    public void Search_WithOnlySpaces_ShouldNotFilter()
    {
        int totalBefore = inboxPage.GetVisibleTicketCount();

        inboxPage.EnterSearch("   ");

        int totalAfter = inboxPage.GetVisibleTicketCount();

        Assert.That(totalAfter, Is.EqualTo(totalBefore), "Razmaci ne smiju pokrenuti filtriranje");
    }

    // TC-06: Pretraga je case-insensitive
    // Zašto: agent ne treba misliti o velikim/malim slovima
    [Test]
    public void Search_WithUppercaseQuery_ShouldMatchLowercaseContent()
    {
        inboxPage.EnterSearch(KnownContentWord.ToUpper());
        int countUpper = inboxPage.GetVisibleTicketCount();

        inboxPage.EnterSearch(KnownContentWord.ToLower());
        int countLower = inboxPage.GetVisibleTicketCount();

        Assert.That(countUpper, Is.EqualTo(countLower), "Rezultati moraju biti isti bez obzira na velika/mala slova");
    }

    // TC-11: Pretraga unutar filtriranog statusa
    // Zašto: ovo testira da status filter i search rade zajedno ispravno —
    //        status mora biti prva faza, search druga
    [Test]
    public void Search_WithStatusFilterActive_ShouldSearchOnlyWithinFilter()
    {
        inboxPage.ClickFilterTab("Pending");
        int pendingCount = inboxPage.GetVisibleTicketCount();

        inboxPage.EnterSearch(KnownContentWord);
        int pendingSearchCount = inboxPage.GetVisibleTicketCount();

        Assert.That(pendingSearchCount, Is.LessThanOrEqualTo(pendingCount),
            "Search unutar Pending taba ne smije vratiti više od ukupnog broja pending tiketa");
    }

    // TC-12: Search query ostaje aktivan kad se mijenja status tab
    // Zašto: dva state-a su neovisna — promjena taba ne smije resetovati search
    [Test]
    public void Search_RemainsActiveWhenSwitchingFilterTabs()
    {
        inboxPage.EnterSearch(KnownContentWord);

        inboxPage.ClickFilterTab("Resolved");
        string queryAfterSwitch = inboxPage.GetSearchInputValue();

        Assert.That(queryAfterSwitch, Is.EqualTo(KnownContentWord),
            "Search query mora ostati isti nakon promjene taba");
    }

    // TC-15: Kad pretraga nema rezultata — prikazuje se kontekstualna poruka
    // Zašto: generička "No tickets here" poruka bi zbunila agenta koji aktivno pretražuje
    [Test]
    public void Search_WithNoResults_ShouldShowSearchSpecificEmptyMessage()
    {
        inboxPage.EnterSearch(NonExistentQuery);

        string title = inboxPage.GetEmptyStateTitle();

        Assert.That(title, Is.EqualTo("No tickets match your search"),
            "Poruka mora biti specifična za search, ne generička");
    }

    // TC-17: X dugme nije vidljivo kad je input prazan
    // Zašto: prikazuje se samo kad ima teksta — ne smije biti tu od početka
    [Test]
    public void Search_ClearButton_NotVisibleWhenInputIsEmpty()
    {
        Assert.That(inboxPage.IsClearButtonVisible(), Is.False,
            "X dugme ne smije biti vidljivo dok input nije popunjen");
    }

    // TC-18: X dugme postaje vidljivo kad se unese tekst, a nestaje nakon clear-a
    // Zašto: provjera cijelog lifecycle-a clear dugmeta
    [Test]
    public void Search_ClearButton_AppearsWithTextAndDisappearsAfterClear()
    {
        inboxPage.EnterSearch("test");
        Assert.That(inboxPage.IsClearButtonVisible(), Is.True,
            "X dugme mora biti vidljivo nakon unosa teksta");

        inboxPage.ClearSearch();
        Assert.That(inboxPage.IsClearButtonVisible(), Is.False,
            "X dugme mora nestati nakon clear-a");
    }
}
