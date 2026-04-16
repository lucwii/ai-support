using automated_tests.Helpers;
using automated_tests.Pages;

namespace automated_tests.Tests;

public class DashboardTests : TestBase
{
    private DashboardPage dashboardPage;
    
    private const string AgentEmail = "test@gmail.com";
    private const string AgentPassword = "Luka1310";

    [SetUp]
    public void SetUp()
    {
        dashboardPage = new DashboardPage(driver);
        dashboardPage.LoginAndNavigate(AgentEmail, AgentPassword);
    }

    [Test]
    public void DashboardPage_IsVisible()
    {
        Assert.That(dashboardPage.DashboardPage_IsVisible());
    }

    [Test]
    public void StatsRow_IsVisible()
    {
        Assert.That(dashboardPage.StatRows_IsVisible());
    }

    [Test]
    public void TicketsTable_IsVisible()
    {
        Assert.That(dashboardPage.TicketsTable_IsVisible());
    }

    [Test]
    public void RecentTickets_MaxTen()
    {
        Assert.That(dashboardPage.RecentTickets_Count(), Is.LessThanOrEqualTo(10));
    }

    // Stat cards
    [Test]
    public void TicketsTodayCard_IsVisible()
    {
        Assert.That(dashboardPage.TicketsTodayCard_IsVisible());
    }

    [Test]
    public void AutoResolvedCard_IsVisible()
    {
        Assert.That(dashboardPage.AutoResolvedCard_IsVisible());
    }

    [Test]
    public void PendingReviewCard_IsVisible()
    {
        Assert.That(dashboardPage.PendingReviewCard_IsVisible());
    }

    [Test]
    public void AvgResponseCard_IsVisible()
    {
        Assert.That(dashboardPage.AvgResponseCard_IsVisible());
    }

    [Test]
    public void AvgResponse_ValueIsAlways2s()
    {
        Assert.That(dashboardPage.GetAvgResponseValue(), Is.EqualTo("< 2s"));
    }

    // Chart
    [Test]
    public void TicketsChart_IsVisible()
    {
        Assert.That(dashboardPage.TicketsChart_IsVisible());
    }

    [Test]
    public void ChartPeriod_SwitchTo7d()
    {
        dashboardPage.ClickChartPeriod7d();
        Assert.That(dashboardPage.IsChartPeriodActive("7d"));
    }

    [Test]
    public void ChartPeriod_SwitchTo14d()
    {
        dashboardPage.ClickChartPeriod14d();
        Assert.That(dashboardPage.IsChartPeriodActive("14d"));
    }

    [Test]
    public void ChartPeriod_DefaultIs30d()
    {
        Assert.That(dashboardPage.IsChartPeriodActive("30d"));
    }

    // Recent tickets
    [Test]
    public void RecentTicketsTable_IsVisible()
    {
        Assert.That(dashboardPage.RecentTicketsTable_IsVisible());
    }

    [Test]
    public void ViewAllTicketsLink_IsVisible()
    {
        Assert.That(dashboardPage.ViewAllTicketsLink_IsVisible());
    }

    [Test]
    public void TicketRow_Click_NavigatesToDetail()
    {
        dashboardPage.ClickFirstTicketRow();
        Assert.That(driver.Url, Does.Contain("/dashboard/tickets/"));
    }
}