package www.airbnb.ru;

import org.junit.Test;
import static com.codeborne.selenide.Selenide.*;
import static com.codeborne.selenide.WebDriverRunner.url;
import static org.junit.Assert.fail;


public class OpenCard {
    public final String HOME_URL = "https://rusbnb.netlify.app/";
    @Test
    public void userCanOpenCard(){
        //открываем сайт
        open(HOME_URL);
        
        //ждем подгрузки карточек
        sleep(10000);
        
        //кликаем по первой карточке
        $("[src=\"http://rusbnb-1.exp-of-betrayal.repl.co/server/room-images/6.png\"]").click();
        
        //получаем url2 открытой странице
        String currentUrl = url();

        //если url не изменился, то тест не пройден
        if (currentUrl.equals(HOME_URL)){
            fail("Ссылка не изменилась");
        }

    }


}
