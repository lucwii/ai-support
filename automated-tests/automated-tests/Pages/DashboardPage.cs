using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

namespace automated_tests.Pages;

public class DashboardPage
{
    private IWebDriver driver;
    private WebDriverWait wait;
    
    // Stat cards
    private By statsRow = By.CssSelector("[data-testid='stats-row']");
    
    private By ticketsTodayCard = By.CssSelector("[data-testid='stat-tickets-today']");    
    private By ticketsTodayValue = By.CssSelector("[data-testid='stat-tickets-today-value']");                                    
   
    private By autoResolvedCard = By.CssSelector("[data-testid='stat-auto-resolved']");    
    private By autoResolvedValue = By.CssSelector("[data-testid='stat-auto-resolved-value']");                                    
   
    private By pendingReviewCard = By.CssSelector("[data-testid='stat-pending-review']");   
    private By pendingReviewValue = By.CssSelector("[data-testid='stat-pending-review-value']");                                   
   
    private By avgResponseCard = By.CssSelector("[data-testid='stat-avg-response']");     
    private By avgResponseValue = By.CssSelector("[data-testid='stat-avg-response-value']");
    
    // Chart
    private By ticketsChart = By.CssSelector("[data-testid='tickets-chart']");            
    private By chartPeriod7d = By.CssSelector("[data-testid='chart-period-7d']");          
    private By chartPeriod14d = By.CssSelector("[data-testid='chart-period-14d']");         
    private By chartPeriod30d = By.CssSelector("[data-testid='chart-period-30d']");         
                                                                                                 
    // Recent tickets tabela
    private By recentTicketsTable = By.CssSelector("[data-testid='recent-tickets-table']");     
    private By ticketsTable = By.CssSelector("[data-testid='tickets-table']");            
    private By ticketRows = By.CssSelector("[data-testid='ticket-row']");
    private By viewAllTicketsLink = By.CssSelector("[data-testid='view-all-tickets-link']");    
                                                                                                 
    // Dashboard page wrapper                                                                      
    private By dashboardPage = By.CssSelector("[data-testid='dashboard-page']");

    public DashboardPage(IWebDriver driver)
    {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, TimeSpan.FromSeconds(20));
    }

    public void NavigateTo()
    {
        driver.Navigate().GoToUrl("http://localhost:3000/dashboard");
        wait.Until(ExpectedConditions.ElementIsVisible(dashboardPage));
    }

    public void LoginAndNavigate(string email, string password)
    {
        var loginPage = new LoginPage(driver);
        loginPage.NavigateTo();
        loginPage.Login(email, password);

        wait.Until(ExpectedConditions.UrlContains("/dashboard"));
        NavigateTo();
    }

    public bool DashboardPage_IsVisible()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(dashboardPage)).Displayed;
        }
        catch (NoSuchElementException)
        {
            return false;
        }
    }

    public bool StatRows_IsVisible()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(statsRow)).Displayed;
        }
        catch (NoSuchElementException)
        {
            return false;
        }
    }

    public bool TicketsTable_IsVisible()
    {
        try
        {
            return wait.Until(ExpectedConditions.ElementIsVisible(ticketsTable)).Displayed;
        }
        catch (NoSuchElementException)
        {
            return false;
        }
    }

    public int RecentTickets_Count()
    {
        return driver.FindElements(ticketRows).Count;
    }
}
