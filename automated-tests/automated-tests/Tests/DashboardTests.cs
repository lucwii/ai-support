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
        Assert.That(dashboardPage.StatRows_IsVisible);
    }

    [Test]
    public void TicketsTable_IsVisible()
    {
        Assert.That(dashboardPage.TicketsTable_IsVisible());
    }

    [Test]
    public void RecentTickets_MaxTen()
    {
        Assert.That(dashboardPage.RecentTickets_Count(), Is.LessThan(10));
    }
}