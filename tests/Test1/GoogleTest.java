package www.airbnb.ru;

import com.codeborne.selenide.ElementsCollection;
import org.junit.Test;
import org.openqa.selenium.By;

import static com.codeborne.selenide.CollectionCondition.*;
import static com.codeborne.selenide.Condition.text;
import static com.codeborne.selenide.Selenide.*;
import static org.openqa.selenium.support.ui.ExpectedConditions.titleIs;

public class GoogleTest {
    @Test
    public void userCanSearchGoogleSite() {
        //открывает страницу google.com
        open("http://google.com");

        //вводит запрос "Airbnb" в поисковую строку и нажимает кнопку Enter
        element(By.name("q")).setValue("Airbnb").pressEnter();

        //находит список результатов поиска и сохраняет их в коллекцию
        ElementsCollection results = elements("#search .g");

        // проверяет, что количество результатов больше или равно 10
        results.shouldHave(sizeGreaterThanOrEqual(10))
                //проверяет, что первый результат содержит текст "Аренда квартир и отпускного жилья"
                .first().shouldHave(text("Аренда квартир и отпускного жилья"));

        //кликает на первый результат поиска
        results.first().find(By.tagName("a")).click();

        //проверяеет, что title откртой вкладки содержит текст:
        Wait().until(titleIs("Аренда квартир и отпускного жилья — Airbnb - Airbnb"));
    }
}
