// JudgeFeedbackTest.java
package com.theadjudicators.tests;

import static org.junit.jupiter.api.Assertions.*;
import com.gargoylesoftware.htmlunit.*;
import com.gargoylesoftware.htmlunit.html.*;
import org.junit.jupiter.api.*;

public class JudgeFeedbackTest {
    private static final String BASE = "http://localhost:3000";

    @BeforeEach
    public void loginAsJudge() throws Exception {
        try (WebClient client = new WebClient()) {
            // Perform judge login here if needed
        }
    }

    @Test
    public void req5_postFeedback() throws Exception {
        try (WebClient client = new WebClient(BrowserVersion.CHROME)) {
            client.getOptions().setJavaScriptEnabled(true);

            // 1. Load specific project page
            HtmlPage page = client.getPage(BASE + "/project.html?id=123");
            // 2. Locate feedback box
            HtmlTextArea feedbackBox = page.getFirstByXPath("//textarea[@id='feedbackText']");
            feedbackBox.setText("This project demonstrated excellent creativity and thorough research.");

            // 3. Submit
            HtmlButton postBtn = page.getFirstByXPath("//button[@id='postFeedback']");
            HtmlPage afterPost = postBtn.click();
            client.waitForBackgroundJavaScript(500);

            // 4. Confirmation
            DomElement confirm = afterPost.getFirstByXPath("//div[contains(@class,'alert-success')]");
            assertTrue(confirm.asText().contains("Feedback posted"));

            // 5. Verify visible on page
            DomElement latest = afterPost.getFirstByXPath(
                "//div[@id='feedbackList']/div[last()]/p");
            assertEquals(
                "This project demonstrated excellent creativity and thorough research.",
                latest.asText());
        }
    }
}
