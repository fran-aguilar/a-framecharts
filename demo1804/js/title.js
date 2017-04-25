AFRAME.registerComponent('title', {
    schema: {
        caption: { default: "", type: "string" },
        width: { default: 6, type: "number" },
    },
    update: function (oldData) {
        var data = this.data;
        var texto;

        texto = this.el;

        var TEXT_WIDTH = data.width;
        texto.setAttribute("text", {
            color: "#000000",
            side: "double",
            value: data.caption,
            align:"center",
            width: TEXT_WIDTH,
            wrapCount: 30
        });
        //var labelpos = { x: 0, y:  1, z: 0 };
        ////texto.setAttribute('geometry',{primitive: 'plane', width: 'auto', height: 'auto'});
        //texto.setAttribute('position', labelpos);
    },
    remove: function () {
        //this.el.removeAttribute("text");
    }
});