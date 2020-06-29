//! первая карточка

let alfa_tree = new ECSTree('Begin Point'); // {data: 'Begin Point', parent: null, children: [],
alfa_tree._root.tier = 0; // tier: 0,
alfa_tree._root.id = 1; // id: 1}


//! вывод данных на страницу

addTodayDate();

createList(alfa_tree);

buttonAdd(alfa_tree);

buttonDel(alfa_tree);

buttonEdit(alfa_tree)

drawSvg(alfa_tree);

//! END

