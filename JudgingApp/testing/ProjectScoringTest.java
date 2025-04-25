// ProjectScoringTest.java
package com.theadjudicators.tests;

import static org.junit.jupiter.api.Assertions.*;
import com.gargoylesoftware.htmlunit.*;
import com.gargoylesoftware.htmlunit.html.*;
import org.junit.jupiter.api.*;

public class ProjectScoringTest {
    private static final String BASE = "http://localhost:3000";

    @BeforeEach
    public void loginAsAdmin() throws Exception {
        try (WebClient client = new WebClient()) {
            // perform login once per test if needed; else assume session cookie exists
            client.getCookieManager().clearCookies();
            HtmlPage login = client.getPage(BASE + "/judge-login.html");
            // ... fill credentials, click, etc.
        }
    }

    @Test
    public void req4_assignValidGrade() throws Exception {
        try (WebClient client = new WebClient(BrowserVersion.CHROME)) {
            client.getOptions().setJavaScriptEnabled(true);

            // 1. Navigate to grading interface
            HtmlPage page = client.getPage(BASE + "/admin/projects.html");
            // 2. Select project row by data-id
            HtmlAnchor projectLink = page.getFirstByXPath(
                "//tr[@data-project-id='123']//a[@class='grade-link']");
            HtmlPage gradePage = projectLink.click();

            // 3. Enter grade
            HtmlInput gradeInput = gradePage.getFirstByXPath("//input[@name='grade']");
            gradeInput.setValueAttribute("85");

            // 4. Submit
            HtmlButton saveBtn = gradePage.getFirstByXPath("//button[@id='saveGrade']");
            HtmlPage confirmation = saveBtn.click();

            // 5. Confirmation message
            DomElement msg = confirmation.getFirstByXPath("//div[contains(@class,'alert-success')]");
            assertTrue(msg.asText().contains("Grade recorded"));

            // 6. Verify grade displayed
            DomElement displayed = confirmation.getFirstByXPath(
                "//span[@id='project-grade']");
            assertEquals("85", displayed.asText());
        }
    }
}
