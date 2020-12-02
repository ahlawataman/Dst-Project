var word;
var map;
var renderer;

// Selecting word to visualize and highlighting it by clicking on it
  for(var i=0; i<document.querySelectorAll(".item").length; i++)
{
    document.querySelectorAll(".item")[i].addEventListener("click", function () 
    {
        // Updating our word variable
        word = this.innerHTML.toUpperCase();
        // de-highlighting others
        for(var i=0; i<document.querySelectorAll(".item").length; i++)
        {
          document.querySelectorAll(".item")[i].classList.remove("highlight");
        }
        this.classList.add("highlight");
    });
}
// Remove highlights to when clicking on reset button
$('#reset').on('click', () => {
  for(var i=0; i<document.querySelectorAll(".item").length; i++)
        {
          document.querySelectorAll(".item")[i].classList.remove("highlight");
        }
});

// Run on DOM load
document.addEventListener('DOMContentLoaded', () => {

  // FILLING UP TABLE 1 (SECTION 1)
    for(var i=0; i<7; i++) {
        for(var j=0; j<7; j++) {
            document.querySelector(".table1 .t" + (i*7 + j + 1) + "").innerHTML = mazeOne[i][j];
            console.log(".table1 .t" + (i*7 + j + 1) + "");
        }
    }
    
  // FILLING UP TABLE 2 (SECTION 2)
    for(var i=0; i<7; i++) {
        for(var j=0; j<7; j++) {
            document.querySelector(".table2 .t" + (i*7 + j + 1) + "").innerHTML = mazeOne[i][j];
        }

}

  let maze = mazeOne;
  setUpMap(mazeOne); // GIVING DATA TO SECTION 3 TABLE AND DEFINING ITS PROPERTIES SUCH AS CELL WIDTH
  let resetButton = document.getElementById('reset');
  // RESETTING MAZE BY CLICKING ON RESET
  resetButton.addEventListener('click', () => {
    reset(maze);
  });

  $('#play').on('click', () => {
    var pathDFS = makePath(map, renderer); // RUNS DFS
    $('#play').attr('disabled', true);
    $('#reset').attr('disabled', true);
    runPath(200, pathDFS[0], pathDFS[1], renderer, map); // Colors and Decolor our map
  });

});

const reset = (maze) => {
  setUpMap(maze);
  $('#play').attr('disabled', false);
};

const setUpMap = (maze) => {
  map = makeMap(maze, 25, 25);
  // MAKING RENDERER OBJECT OF OUR CANVAS HTML TAG
  renderer = makeRenderer(map, 'dfs-graph');
  drawMap(renderer, map);
};

const makeMap = (mazeData, width, height) => ({
  data: mazeData,
  width: mazeData[0].length,
  height: mazeData.length,
  cellWidth: width,
  cellHeight: height,
});

const makeRenderer = (map, id) => {
  const canvasEl = document.getElementById(id); // CANVAS HTML ELEMENT STORED
  canvasEl.width = map.cellWidth * map.width; // SETTING ITS WIDTH
  canvasEl.height = map.cellHeight * map.height; // SETTING ITS HEIGHT
  // RETURNING OUR CANVAS OBJECT
  return {
    canvasEl: canvasEl,
    ctx: canvasEl.getContext('2d'),
  };
};

const drawMap = (renderer, map) => {
  let ctx = renderer.ctx;
  let canvas = renderer.canvasEl;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // FILLING OUT DATA IN TABLE
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      let cellChar = map.data[y][x];
      // DEFINING WHOLE TABLE PROPERTY
      ctx.textAlign = 'center';
      ctx.font = '15px Arial';
      ctx.textBaseline = 'middle';
      // FILLING CHARACTERS
      ctx.fillText(
        cellChar,
        (x + 0.5) * map.cellWidth,
        (y + 0.5) * map.cellHeight
      );
      ctx.strokeStyle = 'black';
      ctx.strokeRect(
        x * map.cellWidth,
        y * map.cellHeight,
        map.cellWidth,
        map.cellHeight
      );
    }
  }
};

const drawPath = (renderer, point, width, height, map, color) => {
  // IF POINT[2] == 0 THEN DECOLOUR OUR CELL
  if (point[2] === 0) {
    renderer.ctx.clearRect(point[1] * width, point[0] * height, width, height);
    renderer.ctx.fillStyle = 'black';
    renderer.ctx.textAlign = 'center';
    renderer.ctx.font = '15px Arial';
    renderer.ctx.textBaseline = 'middle';
    renderer.ctx.fillText(
      map.data[point[0]][point[1]],
      (point[1] + 0.5) * width,
      (point[0] + 0.5) * height
    );
    renderer.ctx.strokeStyle = 'black';
    renderer.ctx.strokeRect(point[1] * width, point[0] * height, width, height);
  } else { // ELSE COLOUR OUR CELL
    renderer.ctx.strokeStyle = color;
    renderer.ctx.beginPath();
    renderer.ctx.arc(
      12.5 + point[1] * width,
      12.5 + point[0] * height,
      10,
      0,
      Math.PI * 2,
      true
    );
    renderer.ctx.stroke(); // DRAWS THE PATH
  }
};

const runPath = (num, path, found, renderer, map) => {
  let pos = 0;
  function render() {
    if (pos < path.length) {
      drawPath(renderer, path[pos], map.cellWidth, map.cellHeight, map, 'red');
    } else {
      found.forEach((posi) => {
        drawPath(renderer, posi, map.cellWidth, map.cellHeight, map, 'blue');
        $('#reset').attr('disabled', false);
      });
      return;
    }
    pos += 1;
    setTimeout(render, num);
  }
  return render();
};

const makePath = (map, renderer) => {
  path = []; // PATH ACCOUNTS FOR ALL COORDINATES THAT WE HAVE TRAVERSED
  foundPath = []; // FOUND PATH IS FINAL PATH
  // OUR MAIN DFS FUNCTION
  function dfs(map, i, j, curr, vis) {
    // 'curr' ITERATOR OVER OUR WORD
    if (curr == word.length - 1 && map.data[i][j] == word[curr] && !vis[i][j]) {
      foundPath.push([i, j, 2]);
      path.push([i, j, 1]);
      return true;
    }
    path.push([i, j, 1]);
    foundPath.push([i, j, 2]);
    vis[i][j] = true;
    if (map.data[i][j] == word[curr]) {
      if (i > 0 && !vis[i - 1][j] && dfs(map, i - 1, j, curr + 1, vis))
        return true;
      if (
        i < map.height - 1 &&
        !vis[i + 1][j] &&
        dfs(map, i + 1, j, curr + 1, vis)
      )
        return true;
      if (j > 0 && !vis[i][j - 1] && dfs(map, i, j - 1, curr + 1, vis))
        return true;
      if (
        j < map.width - 1 &&
        !vis[i][j + 1] &&
        dfs(map, i, j + 1, curr + 1, vis)
      )
        return true;
    }
    foundPath.pop();
    vis[i][j] = false;
    path.push([i, j, 0]);
    return false;
  }

  // MAKING 2D VISITED ARRAY FOR OUR MAP AND INITILIZING EVERY CELL AS 'false'
  vis = [];
  for (var i = 0; i < map.height; i++) {
    visrow = [];
    for (var j = 0; j < map.width; j++) {
      visrow.push(false);
    }
    vis.push(visrow);
  }

  // ENTRY POINT FOR OUR DFS FUNCTION
  for (var i = 0; i < map.height; i++) {
    // FLAG WILL TELL WHEN TO STOP DFS
    var flag = false;
    for (var j = 0; j < map.width; j++) {
      if (dfs(map, i, j, 0, vis)) {
        flag = true;
        break;
      }
    }
    if (flag) break;
  }
  return [path, foundPath];
};

let mazeOne = [
  ['H', 'T', 'A',	'O', 'E', 'X' ,'M'],
  ['D', 'D', 'S', 'L', 'Y', 'Y', 'K'],
  ['U', 'Y', 'E', 'E', 'A', 'X', 'O'],
  ['R', 'A', 'D', 'Z', 'T', 'C', 'N'],
  ['P', 'I', 'M', 'W', 'Q', 'D', 'Y'],
  ['V', 'N', 'X', 'A', 'E', 'P', 'R'],
  ['W', 'C', 'L', 'B', 'G', 'T', 'O'],
  ['A', 'B', 'C', 'D', 'E', 'F', 'G']
];