//ensure window loaded
window.onload = function () {
    //inyecting data to an existing chart..
    var test2 = document.querySelector('#testpie');
    test2._data = [{ key: 'bla', value: 85 }, { key: 'bla2', value: 21 }, { key: 'bla2', value: 10 }, { key: 'bla2', value: 5 }, { key: 'bla2', value: 38 }, { key: 'bla2', value: 200 }];
    test2.emit('data-loaded');
}