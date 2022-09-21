const boom = 'url(https://media.istockphoto.com/vectors/red-cross-mark-drawn-grunge-x-in-vector-vector-id1175729985?k=20&m=1175729985&s=612x612&w=0&h=EU-GGvapec1NzAncoH6GAN2Df2udxpk-z9Ch2aTCvSY=)';
const safe = 'url(https://media.istockphoto.com/vectors/checkmark-icon-check-mark-vector-isolated-illustration-vector-id1205148147?k=20&m=1205148147&s=612x612&w=0&h=6WoITHTxFwIBVnfODxsh7wAzU3-AZFkg0YZ5U_8COqw=)';

// large
// const maxX = 30;
// const maxY = 16;

// medium
const maxX = 16;
const maxY = 16;

function verifyLocationClosing(x,y,tracing){
  if(x >= 0 && x < maxX && y >= 0 && y < maxY) {
    if(document.getElementById(`cell_${x}_${y}`).className.includes('hd_closed')) {
      tracing.push({
        element: document.getElementById(`cell_${x}_${y}`),
        x:x,
        y:y
      });
      return 1;
    }
  }
  return 0;
}

function getCount(x,y,tracing){
  return verifyLocationClosing(x-1,y-1,tracing) + verifyLocationClosing(x,y-1,tracing) + verifyLocationClosing(x+1,y-1,tracing) + verifyLocationClosing(x-1,y,tracing) + verifyLocationClosing(x+1,y,tracing) + verifyLocationClosing(x-1,y+1,tracing) + verifyLocationClosing(x,y+1,tracing) + verifyLocationClosing(x+1,y+1,tracing);
}

function getCountSafe(x,y,resultSafes){
  return traceSafeExpand(x-1,y-1,resultSafes) + traceSafeExpand(x,y-1,resultSafes) + traceSafeExpand(x+1,y-1,resultSafes) + traceSafeExpand(x-1,y,resultSafes) + traceSafeExpand(x+1,y,resultSafes) + traceSafeExpand(x-1,y+1,resultSafes) + traceSafeExpand(x,y+1,resultSafes) + traceSafeExpand(x+1,y+1,resultSafes);
}

function traceSafeNearBoom(x,y){
  const element = document.getElementById(`cell_${x}_${y}`);

  const resultSafes = [];

  function checkCountOfBoom(type){
    if(element.className.includes(`hd_type${type}`)){
      const countSafe = getCountSafe(x,y,resultSafes);

      //console.log('?????',countSafe,element);

      if(countSafe === type) {
        resultSafes.forEach(itemSafe =>{
          itemSafe.element.style.backgroundImage = safe;
          itemSafe.element.addEventListener('click',()=>{
            if(itemSafe.element.style.backgroundImage) itemSafe.element.style.backgroundImage = '';
          });

          // itemSafe.element.click();
        });
      }
    }
  }
  if(x >= 0 && x < maxX && y >= 0 && y < maxY && element.className.includes('hd_opened')) {
    checkCountOfBoom(1);
    checkCountOfBoom(2);
    checkCountOfBoom(3);
    checkCountOfBoom(4);
    checkCountOfBoom(5);
    checkCountOfBoom(6);
    checkCountOfBoom(7);
    checkCountOfBoom(8);
  }
}

function traceSafeExpand(x,y,resultSafes){
  if(x >= 0 && x < maxX && y >= 0 && y < maxY && document.getElementById(`cell_${x}_${y}`).className.includes('hd_closed')) {
    if(document.getElementById(`cell_${x}_${y}`).className.includes('isBoom')) {
      return 1;
    }else {
      resultSafes.push({
        element: document.getElementById(`cell_${x}_${y}`),
        x:x,
        y:y
      });
    }
  }

  return 0;
}

function traceBoom(x,y){
  const element = document.getElementById(`cell_${x}_${y}`);

  const tracing = [];

  // console.log('Start tracing boom with location ',element, `x = ${x}`, `y = ${y}`);
  
  function checkTypeNumber(type){
    if(element.className.includes(`hd_type${type}`)){
      const count = getCount(x,y,tracing);
      
      if(count <= type) {
        tracing.forEach(item => {
          item.element.style.backgroundImage = boom;
          if(!item.element.className.includes('isBoom')) {
            item.element.className = item.element.className + 'isBoom';
          }

          traceSafeNearBoom(item.x - 1, item.y -1);
          traceSafeNearBoom(item.x, item.y -1 );
          traceSafeNearBoom(item.x + 1, item.y -1);
          traceSafeNearBoom(item.x-1, item.y);
          traceSafeNearBoom(item.x+1, item.y);
          traceSafeNearBoom(item.x-1, item.y+1);
          traceSafeNearBoom(item.x, item.y+1);
          traceSafeNearBoom(item.x+1, item.y+1);

          // console.log('This is Number ', item);
        });
      }
    }
  }

  checkTypeNumber(1);
  checkTypeNumber(2);
  checkTypeNumber(3);
  checkTypeNumber(4);
  checkTypeNumber(5);
  checkTypeNumber(6);
  checkTypeNumber(7);
  checkTypeNumber(8);

  // console.log('???',getCount(x,y,tracing),'-----',element,'----------',tracing);
}

function start(){
  for(let i = 0; i < maxX; i++){
    for(let j = 0; j < maxY; j++){
      traceBoom(i,j);
    }
  }

  console.log('----------DONE-----------');

  for(let i = 0; i < maxX; i++){
    for(let j = 0; j < maxY; j++){
      if(document.getElementById(`cell_${i}_${j}`).className.includes('hd_opened')) {
        document.getElementById(`cell_${i}_${j}`).style.backgroundImage = '';
      }
    }
  }
}

function setup(){
  for(let i = 0; i < maxX; i++){
    for(let j = 0; j < maxY; j++){
      document.getElementById(`cell_${i}_${j}`).addEventListener('click',start);
    }
  }

  start();
}

setup();