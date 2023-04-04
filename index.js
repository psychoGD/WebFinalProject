$(document).ready(function () {

  // Set up variables
  var player1Lives = 100;
  var player2Lives = 100;
  var obstacleSpeed = 5;
  var obstacleInterval = 1000;
  var obstacleTimer;
  var currentLineP1 = 1;
  var currentLineP2 = 5;
  CheckBothHealth()
  // Set up key events
  $(document).keydown(function (event) {
    switch (event.which) {
      case 65: // A key
        moveCar($('.car2'), -1);
        break;
      case 68: // D key
        moveCar($('.car2'), 1);
        break;
      case 37: // Left arrow key
        moveCar($('.car1'), -1);
        break;
      case 39: // Right arrow key
        moveCar($('.car1'), 1);
        break;
    }
  });
  let pos1 = $(".barrier").position();
  let pos2 = $(".car1").position();
  let pos3 = $(".car2").position();
  console.log(pos1.top + " "+ pos1.left)
  console.log(pos2.top + " "+ pos2.left)
  console.log(pos3.top + " "+ pos3.left)

  // Move the car 
  // Car - Image
  // Direction - left Or Right
  // p - player 1 or 2 
  function moveCar(car, direction) {
    //direction -1 - Left
    //direction 1 - Right
    var position = parseInt(car.css('left'));
    var newPosition = position + direction * 100;

    if (newPosition >= -20 && newPosition <= 475) {
      car.css('left', newPosition + 'px');
      if ((car.attr("class")[7])) {

      }
    }
  }
  function CheckBothHealth() {
    checkHealth(".player1-lives")
    checkHealth(".player2-lives")
  }
  function checkHealth(player) {
    let text = $(player).text()
    if (text > 70) {
      $(player).css("color", "green")
    }
    else if (text < 70 && text > 40) {
      $(player).css("color", "yellow")
    }
    else {
      $(player).css("color", "red")
    }
  }
  function GetRandom(){
    return Math.floor((Math.random() * 4)+1);
  }

  // setInterval(function(){
  //   console.log(Math.round(GetRandom()));
  // },500)
})