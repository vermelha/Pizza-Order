$(function() {  

    
  function supports_html5_storage() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;

    } catch (e) {

        return false;
      }
  }
  supports_html5_storage();

  var users = []; 
  var activeUser = {}; 
  var orders =[];

  //база юзеров
 
  try {
    var data = localStorage.getItem('usersKey');
     // заберем актуальные данные с локального хранилища, или запишем дефолтные
    users = JSON.parse(data) || [
                  { username:'User1', password: '123456', id: 001},
                  { username:'User2', password: '1234567', id: 002},
                  { username:'User3', password: '12345678', id: 003}
    ];          
      console.log(data);  

      if( !data) {
        save(); 
      } 

  } catch (error) {
    console.log('Err', error);
  }
   // запись списка юзеров в ls
    function save () {
        localStorage.setItem('usersKey', JSON.stringify(users));
    }
   
  //список ингридиентов
    var ingridients = {
        big: 0,
        medium: 0,
        small: 0,
        mushrooms: 0,
        tomatoes: 0,
        parmesan: 0,
        olives: 0,
        pineapple: 0,
        chicken: 0,
        ham: 0,
        bacon: 0
    };

    // выбор ингридиентов по изменения поля количества
    $('.quantity input').on('change', function(event) {
      var type = $(event.target).attr('data-type');
      ingridients[type] = $(event.target).val();
    });

  // клик по кнопке заказа
  $('.checkout').on('click', function() {
    if ($('.number0').val() != 0 || $('.number1').val() != 0 || $('.number2').val() != 0)  {
          $('#thanks').removeAttr('style');   
          //выбираем какие данные записать в локальное хранилище   
          
          var result = "";

            for(var key in ingridients){
              if(ingridients[key] != 0){
              result += [key] +' - '+ ingridients[key]+ ';';
              }
            }

            var d = new Date();
            //время заказа в удобный формат
            var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
            d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
      

    } else{        
          $('#modal').removeAttr('style');
      };

        try {
          var orders = JSON.parse(localStorage.getItem(activeUser.id)) || [];
          var pizza = {
                        'date': datestring,
                        'pizza': result    
                      }; 

              orders.push( pizza);
              console.log('activeUser.id 00' + activeUser.id)
              console.log(localStorage);
              localStorage.setItem( activeUser.id, JSON.stringify(orders));

        } catch (error) {
          console.log('Err', error);
        }
  });

     //по клику отображение таблицы с заказами
    $('#orders').on('click', function(){               
     $('#order-list').css('display', '');  
   
      var obj,  myObj, x, txt = "";;
      myObj = JSON.parse(localStorage.getItem( activeUser.id))
        txt += "<table border='1'>"

        for (x in myObj) {
        txt += '<tr>'+ '<td> Date: '+ ' ' + myObj[x].date + '</td>'+ '<br>' + '<td>Pizza: '+ ' ' + myObj[x].pizza + '</td>' + '</tr>';
        }
        txt += "</table>" 

        $('table').html(txt);                
    });         

   //проверяем валидацию полей по мере заполнения 
    var errors = 0;

    $('#username').blur(function() {    
      if ( !$(this).val().match('^[a-zA-Z0-9]{4,16}$') ) {
        var errorMessage  = $(".errorMessage");
          errorMessage.html("<p>*Username must contain at least 4 characters</p>");
          errorMessage.slideDown(700);
          errors++;      
      } else {      
          $(".errorMessage").css('display', 'none');
          errors = 0;         
      }                 
    });

    $('#password').blur(function() {
      if ( !$(this).val().match('^[a-zA-Z0-9]{6,16}$') ) {
        var errorMessage  = $(".errorMessage1");
          errorMessage.html("<p>*Password must contain at least 6 characters</p>");
          errorMessage.slideDown(700);
          errors++;                    
      } else {   
          $(".errorMessage1").css('display', 'none');
          errors = 0;                        
      }
    });

    // проверка существует ли пользователь и соответствие паролей
    $('#login').on('click', function(){ 
      var username = $('#username').val();
      var password = $('#password').val(); 
      var isnewUser = true;

        if( !username || !password || errors != 0 )  {
          var errorWindow = $('.errorWindow');
          errorWindow.html('<p>*please fill all required fields</p>');
          errorWindow.slideDown(700);
          errors++;
          isnewUser = false;         

            setTimeout(function(){
                    $('.errorWindow').css('display', 'none')
                  }, 1200);
        }   

        for (var i = 0; i < users.length; i++ ) {
          if ( users[i].username == username && users[i].password != password ) { 
            var errorMessage  = $(".errorMessage1");
             errorMessage.html("<p>*Please check password</p>");
             errorMessage.slideDown(700);
             errors++;
             isnewUser = false;

          } else  if ( users[i].username == username && users[i].password == password && errors == 0) { 
            $(".errorMessage1").css('display', 'none'); 
            activeUser = users[i]; 
            activeUser.id = users[i].id;

             $("#active_user").html(username ); 
             $('#welcome').css('display', ''); 
             $('#wrapper').css('display', 'none'); 
             isnewUser = false;
          }
        }  

    // добавляем нового пользователя если его нет в базе
        for (var i = 0; i < users.length; i++ ) {        
          if( users[i].username != username && errors == 0)  {
             $("#active_user").html(username);
             $('#welcome').css('display', ''); 
             $('#wrapper').css('display', 'none');
                        
          } isNewUser = false;

        }

     //записываем нового пользователя в ls, добавляю в базу с юзерами
          if( isnewUser && errors == 0){ 
            var newUser = {
              'username': username,
              'password': password,
              'id': users.length + 1
            };                      
            users.push(newUser);    
            activeUser.id = newUser.id;              
            save(); 
          }      
    });  


  //добавляем к стоимости ингридиентов $
      $('.product .price').append('$')

  //max & min возможность ввода в поле количество
        $('.quantity input').on('change', function() {
           var max = parseInt($(this).attr('max'));
              if ($(this).val() > max){
                  $(this).val(max);
              }     
              quantity(this);
        });

  // подсчет  общей суммы заказа  
  function calculate() {
    var total = 0;  
      $('.product').each(function () {
          total += parseFloat($(this).children('.line-price').text());
      });
      
      $('#total').html(total + '$');     
  }

  // подсчет суммы отдельно каждого ингридиента
  function quantity(quantityInput) {
    var product = $(quantityInput).parents();
    var price = parseFloat(product.children('.price').text());
    var quantity = $(quantityInput).val();
    var linePrice = price * quantity;
      
      product.children('.line-price').each(function () {
       $(this).text(linePrice + '$');
          calculate();                  
      });  
  }
   
  // закрытие на всех модальных окнах по крестику
  $('.close').on('click', function (){
      $('#modal').css('display', 'none');
      $('#thanks').css('display', 'none');
  }); 

  //закрытие на всех модальных окнах по тенюшке    
  $('.overlay').on('click', function (){
      $('#modal').css('display', 'none');
      $('#thanks').css('display', 'none');
  }); 


  //выход
  $('#logout').on('click' , function() {
      $(location).attr('href','pizza.html');
  });

});
    





