// SearchCompetitionTest.java
package com.theadjudicators.tests;

import static org.junit.jupiter.api.Assertions.*;
import com.gargoylesoftware.htmlunit.*;
import com.gargoylesoftware.htmlunit.html.*;
import org.junit.jupiter.api.*;

public class SearchCompetitionTest {
    private static final String BASE = "http://localhost:3000";

    @Test
    public void req3_searchAndSelectEvent() throws Exception {
        try (WebClient client = new WebClient(BrowserVersion.CHROME)) {
            // ensure JS off unless your search uses AJAX
            client.getOptions().setCssEnabled(false);
            client.getOptions().setJavaScriptEnabled(true);

            // 1. Load page with search bar
            HtmlPage page = client.getPage(BASE + "/events.html");
            HtmlInput searchBox = page.getFirstByXPath("//input[@id='searchInput']");
            HtmlButton searchBtn = page.getFirstByXPath("//button[@id='searchBtn']");

            // 2. Enter “Science Fair 2025” and submit
            searchBox.setValueAttribute("Science Fair 2025");
            HtmlPage results = searchBtn.click();
            client.waitForBackgroundJavaScript(1000);

            // 3. Verify result appears
            HtmlAnchor eventLink = results.getFirstByXPath(
                "//ul[@id='resultsList']//a[contains(text(), 'Science Fair 2025')]");
            assertNotNull(eventLink, "Expected to see Science Fair 2025 in results");

            // 4. Click event
            HtmlPage eventPage = eventLink.click();

            // 5. Verify navigation
            assertTrue(eventPage.getUrl().toString().endsWith("/event.html?id=science-fair-2025"));

            // 6. Check details section
            DomElement title = eventPage.getFirstByXPath("//h1[@class='event-title']");
            assertEquals("Science Fair 2025", title.asText());

            // 7. If scores exist, they appear in table
            DomNodeList<?> rows = eventPage.getByXPath("//table[@id='scoresTable']/tbody/tr");
            // It’s OK if 0 rows, but if >0, each should have score & rank columns
            if (rows.size() > 0) {
                DomNode firstScore = rows.get(0).getFirstChild().getNextSibling();
                assertTrue(firstScore.asText().matches("\\d+(\\.\\d+)?"), "Score should be numeric");
            }
        }
    }
}

