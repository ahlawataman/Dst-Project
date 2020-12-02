class TrieNode {
    constructor(val){
        this.val = val;  // LETTER STORED IN NODE
        this.children = {};  // DICTIONARY OF NODE'S CHILDREN
        this.endshere = false; // BOOL VALUE TO CHECK WORD'S END
    }
}

    
class Trie {
    constructor(){
        this.root = new TrieNode(null);
    }  // CONSTRUCTOR TO INITIALIZE OUR TREE
    insert(word){
        var main = this.root;
        for(var i=0; i<word.length; i++)
        {
            if(Object.keys(main.children).indexOf(word[i])==-1)
            {
                main.children[word[i]] = new TrieNode(word[i]);
            }
            main = main.children[word[i]];
        }
        main.endshere = true;
    } // FUNCTION TO BUILD OUR TRIE(TREE)      
}

var boardOrigin = [
    ['H', 'T', 'A',	'O', 'E', 'X' ,'M'],
    ['D', 'D', 'S', 'L', 'Y', 'Y', 'K'],
    ['U', 'Y', 'E', 'E', 'A', 'X', 'O'],
    ['R', 'A', 'D', 'Z', 'T', 'C', 'N'],
    ['P', 'I', 'M', 'W', 'Q', 'D', 'Y'],
    ['V', 'N', 'X', 'A', 'E', 'P', 'R'],
    ['W', 'C', 'L', 'B', 'G', 'T', 'O']
];


var words = ["OATH", "PEA", "EAT", "RAIN"];

var resultCoordinates = findWords(boardOrigin, words);

function dfs(board, node, i, j, path, res, mydict, listCoordinate){
    if(node.endshere) {
        res.push(path)  // APPENDS THE WORD IF IT ENDS HERE
        mydict[path] = [];
        mydict[path].push.apply(mydict[path],listCoordinate);
        node.endshere = false;
    }  // CHECKS IF WORD ENDS HERE OR NOT

    // BASE CONDITIONS FOR RECURSION
    if(i < 0 || i >= board.length || j < 0 || j >= board[0].length) return ;

    var tmp = board[i][j];  // PICKING UP A LETTER
    if(Object.keys(node.children).indexOf(tmp)==-1) return;  // CHECKING CHILDREN TO ADVANCE THE SEARCH
    node = node.children[tmp];  // MOVING THE POINTER TO CHILD NODE
    board[i][j] = '#'  // HASHING THE VISITED NODE
    listCoordinate.push([i, j]);
    dfs(board, node, i+1, j, path+tmp, res,
        mydict, listCoordinate);  // SEARCH BOTTOM
    dfs(board, node, i-1, j, path+tmp, res,
        mydict, listCoordinate);  // SEARCH TOP
    dfs(board, node, i, j+1, path+tmp, res,
        mydict, listCoordinate);  // SEARCH RIGHT
    dfs(board, node, i, j-1, path+tmp, res,
        mydict, listCoordinate);  // SEARCH LEFT
    listCoordinate.pop();
    board[i][j] = tmp;  // UNHASHING THE VISITED NODE
}


function findWords(boardOrigin, words){
    var res = [];
    var trie = new Trie();
    var node = trie.root;
    var mydict = {};
    var listCoordinate = [];        
    for(var i=0; i<words.length; i++) {
        trie.insert(words[i]);
    }
    for(var i=0; i<boardOrigin.length; i++){
        for(var j=0; j<boardOrigin[0].length; j++)
        dfs(boardOrigin, node, i, j, "", res, mydict, listCoordinate);
    }
    return mydict;
}

function myFunction() {
    var data = document.getElementById('table2').getElementsByTagName('td');
    for (var key in resultCoordinates) {
        for (var i = 0; i < resultCoordinates[key].length; i++) {
            var x = resultCoordinates[key][i][0];
            var y = resultCoordinates[key][i][1];
            data[7 * x + y].style.color = 'red';
        }   
    }
    console.log(resultCoordinates);
}