Парсер-прокси для prom.ua
=========================
node prom/index.js 8080

```
http://localhost:8080/https://prom.ua/p562234686-vodonepronitsaemyj-chehol.html
http://localhost:8080/https://prom.ua/search?search_term=%D0%92%D0%BE%D0%B4%D0%BE&page=3
http://localhost:8080/https://prom.ua/Chehly-dlya-telefonov;3
```
Поддерживает JSONP
```
http://localhost:8080/https://prom.ua/search?search_term=%D0%92%D0%BE%D0%B4%D0%BE&page=3&callback=func1
```
Если домен prom.ua то ссылку можно сократить
```
http://localhost:8080/p562234686-vodonepronitsaemyj-chehol.html
```
Пример ответа
-------------
```json
{  
   "type": "product",
   "product_id": "562234686",
   "company_id": "2125844",
   "url": "https://prom.ua/p562234686-vodonepronitsaemyj-chehol.html",
   "product":{  
      "image":"https://images.ua.prom.st/854770952_w640_h640_cid2125844_pid562234686-0c39e1d6.jpg",
      "sku":"top-0046",
      "name":"Водонепроницаемый Чехол",
      "price":"100",
      "priceCurrency":"UAH",
      "description":"<h1><span style=\"font-size:18pt\"><strong>Водонепроницаемый Чехол&nbsp;</strong></span></h1> <p><span style=\"font-size:12pt\"><strong>Универсальная вещь, для людей водного плаванья и особенно, для тех, кто неприменно любит делать уникальные фото.&nbsp;</strong></span></p> <p><span style=\"font-size:12pt\"><strong>Надежная защита для вашего телефона от воды, пыли, снега. Выдерживают погружения в воду на глубину до двух метров на длительное время. Отлично подходит людям которые ведут активный образ жизни, можно использовать на пляже, в походе, на пикнике, у бассейна. Теперь вы сможете купаться, нырять и снимать на камеру &nbsp;морские пейзажи.</strong></span></p> <p><span style=\"font-size:12pt\"><strong><span style=\"\"><span style=\"font-size:14pt\">Внимание</span></span>!</strong></span></p> <ul> <li><span style=\"font-size:12pt\">При покупке рекомендуем проверить чехол, БЕЗ телефона, окунув его в воду.</span></li> </ul>"
   },
   "contact":{  
      "url":null,
      "phones":[  
         {  
            "number":"+380 (68) 288-88-26",
            "description":""
         },
         {  
            "number":"+380 (50) 856-19-68",
            "description":""
         },
         {  
            "number":"+380 (63) 545-12-57",
            "description":""
         },
         {  
            "number":"+380 (93) 433-99-44",
            "description":""
         },
         {  
            "number":"+380 (68) 288-88-23",
            "description":""
         }
      ],
      "main_phone":"+380 (68) 288-88-26"
   }
}
```
