//! пример создания дерева из 6-ти карточек

let sample_tree = new ECSTree('FirstCard'); // {data: 'FirstCard', parent: null, children: [],
sample_tree._root.tier = 0; // tier: 0,
sample_tree._root.id = 1; // id: 1}

sample_tree._root.children.push(new ECSNode('two'));
sample_tree._root.children[0].parent = sample_tree._root;
sample_tree._root.children[0].tier = 1;
sample_tree._root.children[0].id = 2;

sample_tree._root.children.push(new ECSNode('three'));
sample_tree._root.children[1].parent = sample_tree._root;
sample_tree._root.children[1].tier = 1;
sample_tree._root.children[1].id = 3;

sample_tree._root.children[0].children.push(new ECSNode('four'));
sample_tree._root.children[0].children[0].parent = sample_tree._root.children[0];
sample_tree._root.children[0].children[0].tier = 2;
sample_tree._root.children[0].children[0].id = 4;

sample_tree._root.children[1].children.push(new ECSNode('five'));
sample_tree._root.children[1].children[0].parent = sample_tree._root.children[1];
sample_tree._root.children[1].children[0].tier = 2;
sample_tree._root.children[1].children[0].id = 5;

sample_tree._root.children[0].children[0].children.push(new ECSNode('six'));
sample_tree._root.children[0].children[0].children[0].parent = sample_tree._root.children[0].children[0];
sample_tree._root.children[0].children[0].children[0].tier = 3;
sample_tree._root.children[0].children[0].children[0].id = 6;

//! sample_tree граф

/*

'FirstCard'
    ├────'two'
    │       └────'four'
    │              ├────'six'
    │              └────'seven'
    └────'three'
            └────'five'

*/

//! примеры использования функций ECSTree.prototype

// console.log('обход дерева с поиском в глубину');
// sample_tree.walkDepthFirst(function (node) {
//     console.log(node.data);
// });


// console.log('обход дерева с поиском в ширину');
// sample_tree.walkBreadthFirst(function (node) {
//     console.log(node.data);
// });


// console.log('поиск конкретного значения в нашем дереве');
// sample_tree.search(function (node) {
//     if (node.data === 'four') {
//         console.log(node);
//     }
// }, sample_tree.walkBreadthFirst);

// console.log('добавление новой карточки к определенному узлу дерева');
sample_tree.add(4, sample_tree.walkBreadthFirst, searchPreviousId(arrIDs(sample_tree)), 'seven');
// console.log(sample_tree);

// console.log('удаление узла и всех его дочерних элементов');
// sample_tree.remove(4, 2, sample_tree.walkBreadthFirst);
// console.log(sample_tree);

// sample_tree.add(1, sample_tree.walkBreadthFirst, searchPreviousId(arrIDs(sample_tree))); //todo ----

//! примеры использования "моих" функций

// console.log('количество всех узлов');
// console.log(allNodes(sample_tree));

// console.log('количество ярусов дерева');
// console.log(allTiers(sample_tree));

// console.log('количество "хвостов" у дерева');
// console.log(allTails(sample_tree));

// console.log('массив количества дочерних узлов у всех карточек');
// console.log(arrChildrens(sample_tree));

// console.log('массив айди всех карточек');
// console.log(arrIDs(sample_tree));

//! вывод данных на страницу

addTodayDate();

createList(sample_tree);

buttonAdd(sample_tree);

buttonDel(sample_tree);

buttonEdit(sample_tree);

drawSvg(sample_tree);

//! END




//? ----------------------------------------------

// console.log(sample_tree);
// let sample_tree_save = JSON.stringify(JSON.decycle(sample_tree));
// console.log(sample_tree_save);
// let sample_tree_load = JSON.retrocycle(JSON.parse(sample_tree_save));
// console.log(sample_tree_load);


// localStorage.first_save = JSON.stringify(JSON.decycle(sample_tree));
// sample_tree = JSON.retrocycle(JSON.parse(localStorage.first_save));
