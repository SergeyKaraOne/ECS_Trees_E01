//! создание узла (карточки) 🐰

function ECSNode(data) {
    this.data = data; // содержит данные, связанные с узлом
    this.parent = null; // указывает на один отцовский узел
    this.children = []; // указывает на множество дочерних узлов
    this.tier = null; // указывает на ярус дерева на котором находится узел
    this.id = null; // айди узла
}

//! создание корня дерева 🐢

function ECSTree(data) {
    var node = new ECSNode(data);
    this._root = node; // назначает node как корень дерева
}


//todo --------------------🍌----------------------------------------🍌------


//! обход дерева с поиском в глубину

ECSTree.prototype.walkDepthFirst = function (callback) {
    (function recurse(currentNode) {
        for (let i = 0, length = currentNode.children.length; i < length; i++) {
            recurse(currentNode.children[i]);
        }
        callback(currentNode);
    })(this._root);
};

//! обход дерева с поиском в ширину 🐣

ECSTree.prototype.walkBreadthFirst = function (callback) {
    class Queue {
        constructor() {
            this.records = [];
        }
        enqueue(record) {
            this.records.unshift(record); // добавляет элемент в начало массива
        }
        dequeue() {
            return this.records.pop(); // удаляет последний элемент из массива и возвращает его
        }
    }
    var queue = new Queue();
    queue.enqueue(this._root);
    currentNode = queue.dequeue();
    while (currentNode) {
        for (let i = 0, length = currentNode.children.length; i < length; i++) {
            queue.enqueue(currentNode.children[i]);
        }
        callback(currentNode);
        currentNode = queue.dequeue();
    }
};

//! поиск конкретного значения в нашем дереве

ECSTree.prototype.search = function (callback, walkMethod) {
    walkMethod.call(this, callback);
};

//! добавление новой карточки к определенному узлу дерева

ECSTree.prototype.add = function (toId, walkMethod, id, data) {
    var child = new ECSNode(data),
        parent = null,
        callback = function (node) {
            if (node.id === toId) {
                parent = node;
            }
        };
    this.search(callback, walkMethod);
    if (parent) {
        parent.children.push(child);
        child.parent = parent;
        child.tier = parent.tier + 1;
        child.id = id + 1;
    } else {
        throw new Error('Cannot add node to a non-existent parent 💔');
    }
};

//! удаление узла и всех его дочерних элементов

ECSTree.prototype.remove = function (id, fromId, walkMethod) {
    var tree = this, //todo ? tree не используется
        parent = null,
        childToRemove = null,
        index;
    var callback = function (node) {
        if (node.id === fromId) {
            parent = node;
        }
    };
    this.search(callback, walkMethod);
    if (parent) {
        index = findIndex(parent.children, id);
        if (index === undefined) {
            throw new Error('Node to remove does not exist 💔');
        } else {
            childToRemove = parent.children.splice(index, 1);
        }
    } else {
        throw new Error('Parent does not exist 💔');
    }
    return childToRemove;
};

function findIndex(arr, id) {
    var index;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === id) {
            index = i;
        }
    }
    return index;
}


//todo --------------------🍌----------------------------------------🍌------


//! количество всех узлов 🐣

function allNodes(tree) {
    let i = 0;
    tree.walkBreadthFirst(function (node) {
        i++;
    });
    return i;
}

//! количество ярусов дерева 🐣

function allTiers(tree) {
    let i = 0;
    tree.walkBreadthFirst(function (node) {
        if (i < node.tier) {
            i = node.tier;
        }
    });
    return i;
}

//! количество "хвостов" у дерева 🐣

function allTails(tree) {
    let i = 0;
    tree.walkBreadthFirst(function (node) {
        if (node.children.length === 0) {
            i++;
        }
    });
    return i;
}

//! массив количества дочерних узлов у всех карточек 🐣

function arrChildrens(tree) {
    let arr = [];
    tree.walkBreadthFirst(function (node) {
        arr.push(node.children.length);
    });
    return arr;
}

//! массив айди всех карточек (🍌)

function arrIDs(tree) {
    let arr = [];
    tree.walkBreadthFirst(function (node) {
        arr.push(node.id);
    });
    return arr;
}

//! поиск "предыдущего" айди (🍌)

function searchPreviousId(arr) {
    arr.sort((a, b) => (a - b));
    for (let i = 0; i < arr.length; i++) {
        if (arr[i + 1] - arr[i] !== 1) {
            return arr[i];
        }
    }
    return arr.length;
}


//todo --------------------🍌----------------------------------------🍌------


//! вывод сегодняшних даты и времени 🕗

function addTodayDate() {
    const dateElement = document.querySelector('#todaydate');
    const options = { weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const today = new Date();
    dateElement.innerHTML = today.toLocaleDateString('en-US', options);
}

//! создание списка из объекта 👕

function createList(tree) {

    tree.walkBreadthFirst(function (node) {

        let treeroot = document.querySelector('#treeroot');
        if (node.parent !== null) {
            if (node.parent.id < 10) {
                treeroot = document.querySelector('#\\3' + node.parent.id + ' > .parent');
            }
            else if (node.parent.id < 100) {
                treeroot = document.querySelector('#\\3' + (node.parent.id - node.parent.id % 10) / 10 + '\\3' + node.parent.id % 10 + ' > .parent');
            }
            else {
                treeroot = document.querySelector('#treebox');
            }
        }
        //
        let li = document.createElement('li');
        li.className = "node";
        li.id = node.id;

        let div_form = document.createElement('div');
        div_form.className = "node-form";

        let span_del = document.createElement('span');
        if (node.parent !== null) {
            span_del.className = "node-del";
            span_del.innerHTML = '-';
        }
        let div_data = document.createElement('div');
        div_data.className = "node-form-data";
        div_data.innerHTML = node.data;

        let span_add = document.createElement('span');
        span_add.className = "node-add";
        span_add.innerHTML = '+';

        let ol = document.createElement('ol');
        ol.className = "parent";

        div_form.append(span_del);
        div_form.append(div_data);
        div_form.append(span_add);

        li.append(div_form);
        li.append(ol);

        treeroot.append(li);

        // let liAdd = `
        // <li class="node" id="${node.id}">
        //     <div class="node-form">
        //         <span class="node-del">-</span><div class="node-form-data">${node.data}</div><span class="node-add">+</span>
        //     </div><ol class="parent"></ol>
        // </li>
        // `;

        // treeroot.innerHTML += liAdd;

    });

    //? console.log(arrIDs(tree));

}

//! создание обработчика для кнопки "+"

function buttonAdd(tree) {

    tree.walkBreadthFirst(function (node) {

        let btnAdd;
        if (node.id < 10) {
            btnAdd = document.querySelector('#\\3' + node.id + ' > .node-form > .node-add');
        }
        else if (node.id < 100) {
            btnAdd = document.querySelector('#\\3' + (node.id - node.id % 10) / 10 + '\\3' + node.id % 10 + ' > .node-form > .node-add');
        }
        else {
            btnAdd = document.querySelector('#\\3' + (node.id - node.id % 100) / 100 + '\\3' + (node.id % 100 - node.id % 10) / 10 + '\\3' + node.id % 10 + ' > .node-form > .node-add');
        }

        let node_id = node.id;

        btnAdd.addEventListener("click", () => listAdd(tree, node_id));

    });
}

function listAdd(tree, node_id) {

    let new_data = prompt('what do you need?', '');

    if (new_data === null || new_data.trim() === '') {
        return;
    }

    let new_id = searchPreviousId(arrIDs(tree));
    tree.add(node_id, tree.walkBreadthFirst, new_id, new_data);

    let treeroot;
    if (node_id < 10) {
        treeroot = document.querySelector('#\\3' + node_id + ' > .parent');
    }
    else if (node_id < 100) {
        treeroot = document.querySelector('#\\3' + (node_id - node_id % 10) / 10 + '\\3' + node_id % 10 + ' > .parent');
    }
    else {
        treeroot = document.querySelector('#\\3' + (node_id - node_id % 100) / 100 + '\\3' + (node_id % 100 - node_id % 10) / 10 + '\\3' + node_id % 10 + ' > .parent');
    }

    let li = document.createElement('li');
    li.className = "node";
    li.id = new_id + 1;

    let div_form = document.createElement('div');
    div_form.className = "node-form";

    let span_del = document.createElement('span');
    span_del.className = "node-del";
    span_del.innerHTML = '-';

    let div_data = document.createElement('div');
    div_data.className = "node-form-data";
    div_data.innerHTML = new_data;

    let span_add = document.createElement('span');
    span_add.className = "node-add";
    span_add.innerHTML = '+';

    let ol = document.createElement('ol');
    ol.className = "parent";

    div_form.append(span_del);
    div_form.append(div_data);
    div_form.append(span_add);

    li.append(div_form);
    li.append(ol);

    treeroot.append(li);

    // let liAdd = `
    //     <li class="node" id="${searchPreviousId(arrIDs(tree))}">
    //         <div class="node-form">
    //             <span class="node-del">-</span><div class="node-form-data">${new_data}</div><span class="node-add">+</span>
    //         </div><ol class="parent"></ol>
    //     </li>
    //     `;

    //     treeroot.innerHTML += liAdd;

    span_add.addEventListener("click", () => listAdd(tree, new_id + 1));

    span_del.addEventListener("click", () => listDel(tree, new_id + 1, node_id));

    div_data.addEventListener('dblclick', () => listEdit(tree, new_id + 1, new_data, div_data));

    drawSvg(tree);

    //? console.log(arrIDs(tree));

}

//! создание обработчика для кнопки "-"

function buttonDel(tree) {

    tree.walkBreadthFirst(function (node) {

        if (node.parent !== null) {
            let btnDel;
            if (node.id < 10) {
                btnDel = document.querySelector('#\\3' + node.id + ' > .node-form > .node-del');
            }
            else if (node.id < 100) {
                btnDel = document.querySelector('#\\3' + (node.id - node.id % 10) / 10 + '\\3' + node.id % 10 + ' > .node-form > .node-del');
            }
            else {
                btnDel = document.querySelector('#\\3' + (node.id - node.id % 100) / 100 + '\\3' + (node.id % 100 - node.id % 10) / 10 + '\\3' + node.id % 10 + ' > .node-form > .node-del');
            }

            btnDel.addEventListener("click", () => listDel(tree, node.id, node.parent.id));

        }
    });
}

function listDel(tree, node_id, parent_id) {

    tree.remove(node_id, parent_id, tree.walkBreadthFirst);

    let delElement;

    if (node_id < 10) {
        delElement = document.querySelector('#\\3' + node_id);
    }
    else if (node_id < 100) {
        delElement = document.querySelector('#\\3' + (node_id - node_id % 10) / 10 + '\\3' + node_id % 10);
    }
    else {
        delElement = document.querySelector('#\\3' + (node_id - node_id % 100) / 100 + '\\3' + (node_id % 100 - node_id % 10) / 10 + '\\3' + node_id % 10);
    }

    delElement.parentNode.removeChild(delElement);

    drawSvg(tree);

    //? console.log(arrIDs(tree));

}

//! создание обработчика для редактирования существующих "карточек"

function buttonEdit(tree) {

    tree.walkBreadthFirst(function (node) {

        let editNode;
        if (node.id < 10) {
            editNode = document.querySelector('#\\3' + node.id + ' > .node-form > .node-form-data');
        }
        else if (node.id < 100) {
            editNode = document.querySelector('#\\3' + (node.id - node.id % 10) / 10 + '\\3' + node.id % 10 + ' > .node-form > .node-form-data');
        }
        else {
            editNode = document.querySelector('#\\3' + (node.id - node.id % 100) / 100 + '\\3' + (node.id % 100 - node.id % 10) / 10 + '\\3' + node.id % 10 + ' > .node-form > .node-form-data');
        }

        editNode.addEventListener('dblclick', () => listEdit(tree, node.id, node.data, editNode));

    });
}

function listEdit(tree, node_id, node_data, edit_Node) {

    let new_data = prompt('make corrections ...', node_data);

    if (new_data === null || new_data.trim() === '' || new_data === node_data) {
        return;
    }

    tree.walkBreadthFirst(function (node) {

        if (node.id == node_id) {
            node.data = new_data;
            edit_Node.innerHTML = new_data;
        }

    });

    drawSvg(tree);

    //? console.log(tree);

}


//todo --------------------🍌----------------------------------------🍌------


//! координаты "блочного" элемента

function getCoords(element) {
    let blockElement = element.getBoundingClientRect();
    return {
        left: blockElement.left + pageXOffset,
        top: blockElement.top + pageYOffset
    };
}

//! рисование svg-точек и svg-линий

function drawSvg(tree) {

    let ECSTreesvg = document.querySelector('#ECSTreesvg');
    ECSTreesvg.style.width = document.querySelector('#container').clientWidth + 'px';
    ECSTreesvg.style.height = document.querySelector('#container').clientHeight + 'px';
    let form_width = 50 + document.querySelector('.node-form-data').clientWidth;
    let form_height = 15;

    ECSTreesvg.innerHTML = '';

    tree.walkBreadthFirst(function (node) {

        let element_form;
        let form_xy;
        let element_parent;
        let parent_xy;

        if (node.id < 10) {
            element_form = document.querySelector('#\\3' + node.id + ' > .node-form');
        }
        else if (node.id < 100) {
            element_form = document.querySelector('#\\3' + (node.id - node.id % 10) / 10 + '\\3' + node.id % 10 + ' > .node-form');
        }
        else {
            element_form = document.querySelector('#\\3' + (node.id - node.id % 100) / 100 + '\\3' + (node.id % 100 - node.id % 10) / 10 + '\\3' + node.id % 10 + ' > .node-form');
        }
        form_xy = getCoords(element_form);

        if (node.parent !== null) {

            if (node.parent.id < 10) {
                element_parent = document.querySelector('#\\3' + node.parent.id + ' > .node-form');
            }
            else if (node.parent.id < 100) {
                element_parent = document.querySelector('#\\3' + (node.parent.id - node.parent.id % 10) / 10 + '\\3' + node.parent.id % 10 + ' > .node-form');
            }
            else {
                element_parent = document.querySelector('#\\3' + (node.parent.id - node.parent.id % 100) / 100 + '\\3' + (node.parent.id % 100 - node.parent.id % 10) / 10 + '\\3' + node.parent.id % 10 + ' > .node-form');
            }
            parent_xy = getCoords(element_parent);

            ECSTreesvg.innerHTML += `<circle id="left-circle-${node.id}" cx="${form_xy.left}" cy="${form_xy.top + form_height}" r="5" fill="white"></circle>`;
            if (node.parent.parent === null) {
                parent_xy.left -= 20;
            }
            ECSTreesvg.innerHTML += `<path id="connection-line-${node.id}" d="M${parent_xy.left + form_width},${parent_xy.top + form_height} C${0.4 * (parent_xy.left + form_width) + 0.6 * (form_xy.left)},${parent_xy.top + form_height} ${0.6 * (parent_xy.left + form_width) + 0.4 * (form_xy.left)},${form_xy.top + form_height} ${form_xy.left},${form_xy.top + form_height} " stroke="white" stroke-width="2" fill="rgba(0,0,0,0)"></path>`;
        } else {
            form_xy.left -= 20;
        }
        ECSTreesvg.innerHTML += `<circle id="right-circle-${node.id}" cx="${form_xy.left + form_width}" cy="${form_xy.top + form_height}" r="5" fill="white"></circle>`;

    });
}

//! END

