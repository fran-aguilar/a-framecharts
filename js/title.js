AFRAME.registerComponent('title', {
    schema: {
        caption: { default: "", type: "string" },
        width: { default: 6, type: "number" },
        up: { default: 5, type: "number" },
        left: { default: 5, type: "number" },
    },
    update: function (oldData) {
        var data = this.data;
        this.parentEl = this.el;
        this.addedElement;
        var texto;

        texto = document.createElement("a-entity");

        var TEXT_WIDTH = data.width;
        texto.setAttribute("text", {
            color: "#000000",
            side: "double",
            value: data.caption,
            align:"center",
            width: TEXT_WIDTH,
            wrapCount: 30
        });
        var labelpos = { x: data.left, y: data.up  + 1, z: 0 };
        //texto.setAttribute('geometry',{primitive: 'plane', width: 'auto', height: 'auto'});
        texto.setAttribute('position', labelpos);
        this.parentEl.appendChild(texto);
        this.addedElement = texto;
    },
    remove: function () {
        if (this.addedElement) {
            this.parentEl.removeChild(this.addedElement);
        }
        this.addedElement.innerHTML = "";

    }
});