from db import db
from .room_photo import RoomPhotoModel
from enum import Enum

class RoomLocations(Enum):
    ALUSHTA = 'Алушта'
    PHEODOSIJA = 'Феодосия'
    JALTA = 'Ялта'
    SEVASTOPOL = 'Севастополь'
    SIMPHEROPOL = 'Симферополь'
    ABAKAN = 'Абакан'
    ADLER = 'Адлер'
    ANAPA = 'Анапа'
    ANGARSK = 'Ангарск'
    ARHANGELSK = 'Архангельск'
    ASTRAHAN = 'Астрахань'
    BARNAUL = 'Барнаул'
    BELGOROD = 'Белгород'
    BLAGOVESHENSK = 'Благовещенск'
    CHEBOKSARI = 'Чебоксары'
    CHELJABINSK = 'Челябинск'
    CHEREPOVEC = 'Череповец'
    CHERNJAHOVSK = 'Черняховск'
    CHITA = 'Чита'
    EKATERINBURG = 'Екатеринбург'
    GELENDZHIK = 'Геленджик'
    IRKUTSK = 'Иркутск'
    IZHEVSK = 'Ижевск'
    KABARDINKA = 'Кабардинка'
    KALININGRAD = 'Калининград'
    KAZAN = 'Казань'
    KEMEROVO = 'Кемерово'
    HABAROVSK = 'Хабаровск'
    HANTI_MANSIYSK = 'Ханты-Мансийск'
    KISLOVODSK = 'Кисловодск'
    KOMSOMOLSK_NA_AMURE = 'Комсомольск-на-Амуре'
    KOSTROMA = 'Кострома'
    KRASNODAR = 'Краснодар'
    KRASNOJARSK = 'Красноярск'
    KURGAN = 'Курган'
    KURSK = 'Курск'
    LIPECK = 'Липецк'
    LISTVJANKA = 'Листвянка'
    MAGADAN = 'Магадан'
    MAGNITOGORSK = 'Магнитогорск'
    MAHACHKALA = 'Махачкала'
    MINERALNIE_VODI = 'Минеральные-Воды'
    MOSKVA = 'Москва'
    MURMANSK = 'Мурманск'
    NAHODKA = 'Находка'
    NALCHIK = 'Нальчик'
    NIZHNEVARTOVSK = 'Нижневартовск'
    NIZHNIY_NOVGOROD = 'Нижний-Новгород'
    NOJABRSK = 'Ноябрьск'
    NORILSK = 'Норильск'
    NOVOKUZNECK = 'Новокузнецк'
    NOVOROSSIYSK = 'Новороссийск'
    NOVOSIBIRSK = 'Новосибирск'
    NOVIY_URENGOY = 'Новый-Уренгой'
    OMSK = 'Омск'
    ORENBURG = 'Оренбург'
    PENZA = 'Пенза'
    PERM = 'Пермь'
    PETROPAVLOVSK_KAMCHATSKIY = 'Петропавловск-Камчатский'
    PETROZAVODSK = 'Петрозаводск'
    PSKOV = 'Псков'
    PJATIGORSK = 'Пятигорск'
    ROSTOV_NA_DONU = 'Ростов-на-Дону'
    RJAZAN = 'Рязань'
    SALEHARD = 'Салехард'
    SAMARA = 'Самара'
    SARANSK = 'Саранск'
    SARATOV = 'Саратов'
    SAJANOGORSK = 'Саяногорск'
    SOCHI = 'Сочи'
    SANKT_PETERBURG = 'Санкт-Петербург'
    STAVROPOL = 'Ставрополь'
    SURGUT = 'Сургут'
    SUZDAL = 'Суздаль'
    SVETLOGORSK = 'Светлогорск'
    SIKTIVKAR = 'Сыктывкар'
    TAGANROG = 'Таганрог'
    TOLJATTI = 'Тольятти'
    TOMSK = 'Томск'
    TULA = 'Тула'
    TVER = 'Тверь'
    TYUMEN = 'Тюмень'
    UPHA = 'Уфа'
    UGLICH = 'Углич'
    UHTA = 'Ухта'
    ULAN_UDE = 'Улан-Удэ'
    ULJANOVSK = 'Ульяновск'
    VELIKIY_NOVGOROD = 'Великий-Новгород'
    VLADIKAVKAZ = 'Владикавказ'
    VLADIMIR = 'Владимир'
    VLADIVOSTOK = 'Владивосток'
    VOLGOGRAD = 'Волгоград'
    VORKUTA = 'Воркута'
    VORONEZH = 'Воронеж'
    VIBORG = 'Выборг'
    JAKUTSK = 'Якутск'
    JAROSLAVL = 'Ярославль'
    YOSHKAR_OLA = 'Йошкар-Ола'
    YUZHNO_SAHALINSK = 'Южно-Сахалинск'
    HIMKI = 'Химки'
    KALUGA = 'Калуга'
    ELABUGA = 'Елабуга'
    AZOV = 'Азов'
    ALEKSANDROV = 'Александров'
    BRJANSK = 'Брянск'
    VOLOGDA = 'Вологда'
    VIKSA = 'Выкса'
    GROZNIY = 'Грозный'
    IVANOVO = 'Иваново'
    KIROV = 'Киров'
    MUROM = 'Муром'
    NABEREZHNIE_CHELNI = 'Набережные-Челны'
    NIZHNEKAMSK = 'Нижнекамск'
    PERESLAVL_ZALESSKIY = 'Переславль-Залесский'
    ROSTOV_VELIKIY = 'Ростов-Великий'
    SERGIEV_POSAD = 'Сергиев-Посад'
    SMOLENSK = 'Смоленск'
    STARAJA_RUSSA = 'Старая-Русса'
    TAMBOV = 'Тамбов'
    TOBOLSK = 'Тобольск'
    SHAHTI = 'Шахты'
    STRELNA = 'Стрельна'
    PETERGOPH = 'Петергоф'
    PUSHKIN = 'Пушкин'
    OBNINSK = 'Обнинск'
    ARMAVIR = 'Армавир'
    GATCHINA = 'Гатчина'
    ZELENOGORSK = 'Зеленогорск'
    REPINO = 'Репино'
    SOLNECHNOE = 'Солнечное'
    SHLISSELBURG = 'Шлиссельбург'
    VOSKRESENSKOE = 'Воскресенское'
    KOLOMNA = 'Коломна'
    ROZHDESTVENO = 'Рождествено'
    OKTJABRSKIY = 'Октябрьский'
    VSEVOLOZHSK = 'Всеволожск'
    BUZULUK = 'Бузулук'
    ESSENTUKI = 'Ессентуки'
    KIROVSK = 'Кировск'
    NOVOKUYBISHEVSK = 'Новокуйбышевск'
    PRIOZERSK = 'Приозерск'
    RIBINSK = 'Рыбинск'
    SERPUHOV = 'Серпухов'
    STERLITAMAK = 'Стерлитамак'
    STUPINO = 'Ступино'
    TUAPSE = 'Туапсе'
    CHAYKOVSKIY = 'Чайковский'
    ENGELS = 'Энгельс'
    SHUJA = 'Шуя'
    SOROCHINSK = 'Сорочинск'
    TERSKOL = 'Терскол'
    KROPOTKIN = 'Кропоткин'
    DZERZHINSK = 'Дзержинск'
    TIHVIN = 'Тихвин'
    SHATURA = 'Шатура'
    ZLATOUST = 'Златоуст'
    GORNO_ALTAYSK = 'Горно-Алтайск'
    VELIKIE_LUKI = 'Великие-Луки'
    BIROBIDZHAN = 'Биробиджан'
    VOLGODONSK = 'Волгодонск'
    VOLZHSKIY = 'Волжский'
    EYSK = 'Ейск'
    BELOKURIHA = 'Белокуриха'
    KIROVO_CHEPECK = 'Кирово-Чепецк'
    MAYKOP = 'Майкоп'
    NJAGAN = 'Нягань'
    SAROV = 'Саров'
    SEVERODVINSK = 'Северодвинск'
    STARIY_OSKOL = 'Старый-Оскол'
    TROICK = 'Троицк'
    SHADRINSK = 'Шадринск'
    PODOLSK = 'Подольск'
    DMITROV = 'Дмитров'
    DAGOMIS = 'Дагомыс'
    KRASNAJA_POLJANA = 'Красная-Поляна'
    LAZAREVSKOE = 'Лазаревское'
    LOO = 'Лоо'
    HOSTA = 'Хоста'
    ZELENOGRADSK = 'Зеленоградск'
    BALASHIHA = 'Балашиха'
    LISKOVO = 'Лысково'
    VITJAZEVO = 'Витязево'
    VELSK = 'Вельск'
    VELIKIY_USTYUG = 'Великий-Устюг'
    KINGISEPP = 'Кингисепп'
    ZVENIGOROD = 'Звенигород'
    SEVEROBAYKALSK = 'Северобайкальск'
    PERVOURALSK = 'Первоуральск'
    NOGINSK = 'Ногинск'
    ELEKTROSTAL = 'Электросталь'
    TIHORECK = 'Тихорецк'
    LOMONOSOV = 'Ломоносов'
    DUBNA = 'Дубна'
    BREYTOVO = 'Брейтово'
    ZHELEZNOVODSK = 'Железноводск'
    GOLUBICKAJA = 'Голубицкая'
    GRJAZI = 'Грязи'
    ESTO_SADOK = 'Эсто-Садок'
    ANGELOVO = 'Ангелово'
    ZNAMENSKIY = 'Знаменский'
    ARHIPO_OSIPOVKA = 'Архипо-Осиповка'
    GORJACHIY_KLYUCH = 'Горячий-Ключ'
    DOMBAY = 'Домбай'
    ZHIVOTINO = 'Животино'
    KOROLEV = 'Королёв'
    KUROVO = 'Курово'
    MISHKIN = 'Мышкин'
    NEBUG = 'Небуг'
    NIKOLA = 'Никола'
    SUKKO = 'Сукко'
    SHEREGESH = 'Шерегеш'
    JANTARNIY = 'Янтарный'
    MORSKOE = 'Морское'
    GURZUPH = 'Гурзуф'
    EVPATORIJA = 'Евпатория'
    KERCH = 'Керчь'
    KOKTEBEL = 'Коктебель'
    KURPATI = 'Курпаты'
    KRIM = 'Крым'
    ODINCOVO = 'Одинцово'
    ZHUKOVSKIY = 'Жуковский'
    KONAKOVO = 'Конаково'
    PETROVO_DALNEE = 'Петрово-Дальнее'
    GORODEC = 'Городец'
    INOZEMCEVO = 'Иноземцево'
    TURGOJAK = 'Тургояк'


class RoomTypes(Enum):
    HOUSE = "Дом"
    FLAT = "Квартира"
    VILLA = "Вилла"
    HOTEL = "Отель"


class RoomModel(db.Model):
    __tablename__ = 'Room'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    subtitle = db.Column(db.String(30), nullable=False)
    description = db.Column(db.String(50), nullable=False)
    locate = db.Column(db.Enum(RoomLocations), nullable=False)
    type = db.Column(db.Enum(RoomTypes), nullable=False)
    rate = db.Column(db.Float, nullable=False)

    def json(self):
        return {
            'id': self.id,
            'title': self.title,
            'subtitle': self.subtitle,
            'description': self.description,
            'locate': self.locate.value,
            'type': self.type.value,
            'price': self.price,
            'rate': self.rate,
            'primary-image': RoomPhotoModel.get_one_by_room_id(self.id)
        }

    def update(self, title, subtitle, description, price, locate, _type):
        self.title = title
        self.subtitle = subtitle
        self.description = description
        self.price = price
        self.locate = locate
        self.type = _type
    
    @classmethod
    def find_all(cls):
        return cls.query.all()

    @classmethod
    def find_with_params(cls, /,
                         offset: int = None,
                         size: int = None,
                         place: RoomLocations = None,
                         type: RoomTypes = None,
                         max_cost: int = None,
                         sort_by_cost: bool = False) -> list:
        result = cls.query
        if offset: result = result.offset(offset)
        if size: result = result.limit(size)
        if place: result = result.filter(cls.locate == place)
        if type: result = result.filter(cls.type == type)
        if max_cost: result = result.filter(cls.price <= max_cost)
        if sort_by_cost: result = result.order_by(cls.price.asc())

        return result.all()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
