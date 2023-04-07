var carId = 0;
class Car {
  constructor(className, health, currentLine, position) {
    carId++;
    this.id = carId;
    this.carClass = $(className);
    this.health = health;
    this.currentLine = currentLine;
    this.position = position;
  }
  /**
   * Decrease Car Health. If You Want Increase Health Send Negative Number
   * @param {*} Damage Damage value To Car
   */
  _takeDamage(Damage) {
    this.health -= Damage;
  }
  /**
   *
   * @returns Car Class Name
   */
  GetClassName() {
    return this.carClass.attr("class");
  }
  // ShowBorder() {
  //   console.log(
  //     this.carClass.position().top +
  //       " " +
  //       this.carClass.position().left +
  //       " " +
  //       this.carClass.height() +
  //       " " +
  //       this.carClass.width()
  //   );
  // }
}

class Barrier {
  constructor(currentLine, id, BarrierIndex) {
    this.id = id;
    this.barrierObject = $(`#${id}`);
    this.currentLine = currentLine;
    this.BarrierIndex = BarrierIndex;
  }
  destruction() {
    this.barrierObject.remove();
  }
}

$(document).ready(function () {
  // [Variables] ---------------------------------------------------
  var car_1;
  var car_2;
  var flashAnimation = "animate__animated animate__flash";
  var barriers = [];
  // const road1 = "|| || | | | | | | | | | | | | | | | |";
  // const road2 = "| || | | | | | | | | | | | | | | | | | ";
  const road1 = `|| || | | | | | | | | | | | | | | | |`;
  const road2 = "| || | | | | | | | | | | | | | | | | | ";
  var currentRoads = 1;
  var BarriersId = 0;
  let intervalsId = [];
  let racingSound;

  // let MenuMusic = new Audio("Musics/MenuMusic/synthwave-outrun-139501.mp3")
  // MenuMusic.play();
  // -------------------------------------------------------------
  onclick = (event) => {
    MenuMusic.play();
  };

  $(".game-container").hide();
  // $(".OptionsMenu").hide();
  $(".GameOverMenu").hide();
  $(".Menu").hide();

  Options();
  // [Click Events] ---------------------------------------------------
  $(".MenuButtons").click(function () {
    let clicksound = new Audio("sounds/btnClick.wav");

    clicksound.play();
  });
  $("#StartButton").click(function () {
    $(".Menu").hide();

    StartFunction();
  });
  $("#MenuButton").click(function () {
    $(".GameOverMenu").hide();
    $(".Menu").show();
  });

  $("#RestartButton").click(function () {
    $(".GameOverMenu").hide();
    StartFunction();
  });

  $("#OptionsButton").click(function () {
    $(".Menu").hide();
    Options();
  });
  // -------------------------------------------------------------

  // [Controls] ---------------------------------------------------
  $(document).keydown(function (event) {
    // working with class
    switch (event.which) {
      case 65: // A key
        moveCarClass(car_1, -1);
        break;
      case 68: // D key
        moveCarClass(car_1, 1);
        break;
      case 37: // Left arrow key
        moveCarClass(car_2, -1);
        break;
      case 39: // Right arrow key
        moveCarClass(car_2, 1);
        break;
    }
  });
  // -------------------------------------------------------------
  function Options() {
    $(".OptionsMenu").show();
    $("body").css("background-image", "url(images/optionsbg.jpg)");
  }
  function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
      return ele != value;
    });
  }
  function RemoveBarrier(barrier) {
    barrier.destruction();
    barriers = arrayRemove(barriers, barrier);
  }
  /**
   * This Function Remove All Barriers
   */
  function DestroyAllBarriers() {
    barriers.forEach((barrier) => {
      RemoveBarrier(barrier);
    });
  }
  /**
   *
   * @param {Car} car
   * @param {Barrier} barrier
   * @returns {Boolean} return true if collision have else return false
   */
  function CheckCollision(car, barrier, barrierTop) {
    // Bura Static Deyerler Ile Isledim 500px Ve 600px kimi bu her defesinde gedib tapmaqdan yaxsidi oyunda cunku
    // masinin top hissesi hemise 500 px de olur ve alt hissesi 600 px de olur cunku 100 px sekilin uzunlugudu
    if (
      car.currentLine == barrier.currentLine &&
      barrierTop >= 500 &&
      barrierTop <= 600
    ) {
      return true;
    }
    return false;
  }

  function BarrierCollision(car, barrier, barrierTop) {
    if (CheckCollision(car, barrier, barrierTop)) {
      RemoveBarrier(barrier);
      takeDamage(car);
    }
  }

  /**
   *
   * @param {*} car Which Car Moved
   * @param {*} otherCar Other Car
   * @param {*} direction Which Direction Move
   */
  //direction -1 - Left
  //direction 1 - Right
  function CarCollision(car, otherCar, direction) {
    let WayToGo = car.currentLine + direction;
    if (WayToGo == otherCar.currentLine) {
      moveCarClass(otherCar, direction);
    }
  }
  /**
   * [AZ] Bu Funksiyanin Isi Eger Kuncde Masin Olub Olmadigini Yoxlayir. Eger Hemin Yolda Masin Varsa True Yoxdursa False Qaytarir
   * [EN] The purpose of this function is to check if there is a car in the corner. Returns True if there is a car on the road, False if not
   * @param {*} car Which Car Moved
   * @param {*} otherCar Other Car
   * @param {*} direction Which Direction Move
   */
  //direction -1 - Left
  //direction 1 - Right
  function CheckCarCollision(car, otherCar, direction) {
    let WayToGo = car.currentLine + direction;
    let result =
      WayToGo == otherCar.currentLine &&
      (otherCar.currentLine == 1 || otherCar.currentLine == 5);
    return result;
  }
  function Road() {
    SpawnBarrierAlgorithm();

    let intervalId2 = setInterval(function () {
      moveBarriers();
    }, 50);
    intervalsId.push(intervalId2);

    ChangeRoad();
  }
  function moveBarriers() {
    //Test With Class Test succesfull Work Original code In The Bottom
    barriers.forEach((barrier) => {
      // let object = $(`#${barrier.id}`);
      let top = barrier.barrierObject.position().top;
      barrier.barrierObject.css("top", `${top + 5}px`);
      BarrierCollision(car_1, barrier, top);
      BarrierCollision(car_2, barrier, top);
      if (top > 640) {
        RemoveBarrier(barrier);
      }
    });
  }
  /**
   * This Function Spawn Barriers every [second] Default Second - 2 (2000 millisecond)
   * @param {*} second  when will there be a spawn
   */
  function SpawnBarrierAlgorithm(second = 2000) {
    let intervalId = setInterval(() => {
      // With Class Test Succesfull Work Original Code in the bottom
      let RoadIndex = Math.floor(Math.random() * 5) + 1;
      let BarrierIndex = Math.floor(Math.random() * 2) + 1;

      let barrier = `<img class="barrier" id="${BarriersId}" src="images/barrier${BarrierIndex}.png"></img>`;
      $(`.road${RoadIndex}`).prepend(barrier);

      let barrierObject = new Barrier(RoadIndex, BarriersId, BarrierIndex);

      barriers.push(barrierObject);
      console.log(barriers);
      BarriersId++;
    }, second);
    intervalsId.push(intervalId);
  }
  /**
   * This Function Change Road Every 130 millisecond. This creates a mobility effect on these roads
   */
  function ChangeRoad() {
    let intervalId = setInterval(function () {
      if (currentRoads == 1) {
        $(".roadLines").html(road2);
        currentRoads = 2;
      } else {
        $(".roadLines").html(road1);
        currentRoads = 1;
      }
      // if(changer==true){

      //   $(".roadLines").text(road2);
      // }
    }, 130);
    intervalsId.push(intervalId);
  }

  /**
   * Show Seconds Before The Game Car Create
   */
  function ShowSeconds() {
    $(".game-container").css("filter", "blur(5px)");
    let count = 1;
    $("body").prepend(
      `<div class="counter"><h1 class="counter">${count}</h1></div>`
    );
    count++;
    let id = setInterval(() => {
      if (count < 4) {
        $(".counter").remove();
        $("body").prepend(
          `<div class="counter"><h1 class="counter">${count}</h1></div>`
        );
        count++;
      } else {
        $(".counter").remove();
        clearInterval(id);
        $(".game-container").css("filter", "blur(0px)");
      }
    }, 1000);
  }
  /**
   * Function Work When User Press To Start Button.
   * Every Start Code And Functions Change Bg,Create Cars, Play Sound And Etc.
   */
  function StartFunction() {
    $(".game-container").show();
    $("body").css("background-image", "url(images/island.jpg)");
    DefaultHealthUI();
    setTimeout(function () {
      car_1 = new Car(".car1", 100, 1, 25);
      car_2 = new Car(".car2", 100, 5, 425);
      racingSound = new Audio("sounds/racing.mp3");
      racingSound.volume = 0.2;
      racingSound.play();
      Road();
    }, 4000);

    setTimeout(function () {
      ShowSeconds();
      let startSound = new Audio("sounds/startSound.mp3");
      startSound.volume = 0.1;
      startSound.play();
    }, 1000);
  }

  /**
   * Move The Car Left Position 100px or -100px
   * @param {Car} car which object will move
   * @param {Int16Array} direction which direction did it go
   */
  function moveCarClass(car, direction) {
    //direction -1 - Left
    //direction 1 - Right
    var newPosition = car.position + direction * 100;
    let result;
    if (car.id == 1) {
      result = CheckCarCollision(car_1, car_2, direction);
    } else {
      result = CheckCarCollision(car_2, car_1, direction);
    }
    if (newPosition >= -20 && newPosition <= 475 && !result) {
      if (car.id == 1) {
        CarCollision(car_1, car_2, direction);
      } else {
        CarCollision(car_2, car_1, direction);
      }
      car.position = newPosition;
      //original
      car.carClass.css("left", newPosition + "px");
      car.currentLine += direction;
    }
  }
  /**
   * This Function Add Car To Flash Animation And Decrease Health of Car
   * @param car The Car Class
   */
  function takeDamage(car) {
    car.carClass.removeClass(flashAnimation);
    car.carClass.addClass(flashAnimation);
    setTimeout(function () {
      car.carClass.removeClass(flashAnimation);
    }, 500);
    ChangeHealtUI(car);
    let audio = new Audio("sounds/crash.mp3");
    audio.volume = 0.4;
    audio.play();
  }
  /**
   * This Function Change Health UI Color,Text And Decrease Car Health
   * @param  car Car class
   */
  function ChangeHealtUI(car) {
    car._takeDamage(50);
    let healthUI = $(`.player${car.id}-lives`);
    healthUI.text(car.health);
    if (car.health > 70) {
      healthUI.css("color", "green");
    } else if (car.health <= 70 && car.health > 40) {
      healthUI.css("color", "rgb(255, 157, 0)");
    } else if (car.health >= 0) {
      GameOver(car);
    } else {
      healthUI.css("color", "red");
    }
  }
  function DefaultHealthUI() {
    let healthUI1 = $(`.player1-lives`);
    let healthUI2 = $(`.player2-lives`);
    healthUI1.text("100");
    healthUI1.css("color", "green");
    healthUI2.text("100");
    healthUI2.css("color", "green");
  }
  /**
   * makes everything default value
   */
  function RestartAll() {
    // Clear Old Barriers
    DestroyAllBarriers();
    car_1.carClass.css("left", "25px");
    car_2.carClass.css("left", "425px");
    DefaultHealthUI();
    car_1 = null;
    car_2 = null;
    carId = 0;
  }

  /**
   * Game Over Function Is To Finish The Game
   * @param car Who Lost The Game
   */
  function GameOver(car) {
    racingSound.pause();
    racingSound = null;
    $("body").css("background-image", 'url("images/testbg.jpg")');
    $(".game-container").hide();
    let sound = new Audio("sounds/gameover_BEST.mp3");
    sound.play();
    intervalsId.forEach((id) => {
      clearInterval(id);
      intervalsId = arrayRemove(intervalsId, id);
    });
    $(".GameOverMenu").show();
    RestartAll();
  }
});

// Original Work Without Class
// barriers.forEach((element) => {
//   let barrier = $(`#${element}`);
//   let top = barrier.position().top;
//   barrier.css("top", `${top + 5}px`);
//   if (top > 550) {
//     barriers = arrayRemove(barriers, element);
//     barrier.remove();
//   }
// });

//Original Work WithOut Class
// let RoadIndex = Math.floor(Math.random() * 5) + 1;
// let BarrierIndex = Math.floor(Math.random() * 2) + 1;

// let barrier = `<img class="barrier" id="${BarriersId}" src="images/barrier${BarrierIndex}.png"></img>`;
// barriers.push(BarriersId);

// BarriersId++;

// $(`.road${RoadIndex}`).prepend(barrier);

// function CheckBothHealth() {
//   checkHealth(".player1-lives");
//   checkHealth(".player2-lives");
// }
// function checkHealth(player) {
//   let text = $(player).text();
//   if (text > 70) {
//     $(player).css("color", "green");
//   } else if (text < 70 && text > 40) {
//     $(player).css("color", "yellow");
//   } else {
//     $(player).css("color", "red");
//   }
// }
// function GetRandom() {
//   return Math.floor(Math.random() * 4 + 1);
// }

// let pos1 = $(".barrier").position();
// let pos2 = $(".car1").position();
// let pos3 = $(".car2").position();
// console.log(pos1.top + " "+ pos1.left)
// console.log(pos2.top + " "+ pos2.left)
// console.log(pos3.top + " "+ pos3.left)

// setInterval(function(){
//   if($("#line").width()<1900){
//     $("#line").css("width",`${$("#line").width()+10}px`)

//   }
//   else{
//     $("#line").css("border-radius","0 0 240px 50%/60px;")

//   }
// },10)

// test
// transition elave edende bug yaranir hansiki transition yarida tamamlanmamis eger yene saga gederse masin xetden cixir
// ve ortada bir yerde qalir buna gore eger transition elave eder isem onda masinin gedisini bloklamaq lazim olacaqki
// masin ortada oldugu halda yenede getmesin bu halda helelik dusunuremki bug hell olunacaq
// let which = event.which
// if(event.which==65 && false){
//   moveCar($('.car2'), -1);

// }
// else if(event.which==68){
//   moveCar($('.car2'), 1);
// }

// // Set up variables
// var player1Lives = 100;
// var player2Lives = 100;
// var obstacleSpeed = 5;
// var obstacleInterval = 1000;
// var obstacleTimer;
// var currentLineP1 = 5;
// var currentLineP2 = 1;

// Move the car
// // Car - Image
// // Direction - left Or Right
// // p - player 1 or 2
// function moveCar(car, direction, carNumber) {
//   //direction -1 - Left
//   //direction 1 - Right
//   var position = parseInt(car.css('left'));
//   var newPosition = position + direction * 100;

//   if (newPosition >= -20 && newPosition <= 475) {
//     //original
//     car.css('left', newPosition + 'px');
//     if (carNumber == 1) {
//       currentLineP1 += direction
//       console.log(currentLineP1)
//     }
//     else {
//       currentLineP2 += direction
//       console.log(currentLineP2)
//     }

//   }
// }

//working without class
// switch (event.which) {
//   case 65: // A key
//     moveCar($('.car1'), -1, 2);
//     break;
//   case 68: // D key
//     moveCar($('.car1'), 1, 2);
//     break;
//   case 37: // Left arrow key
//     moveCar($('.car2'), -1, 1);
//     break;
//   case 39: // Right arrow key
//     moveCar($('.car2'), 1, 1);
//     break;
// }

// takeDamage(car)

//hansi masin oldugunu almaq ucun kod bunu isletmirem yerine funksiyaya hansi masin oldugunu yolluyuruq
// let key = car.attr("class")[7]

//test
// car.stop()
// car.animate({left: newPosition + 'px'},'fast');

// setInterval(function(){
//   console.log(Math.round(GetRandom()));
// },500)
