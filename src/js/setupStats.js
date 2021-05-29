import Stats from "stats.js";

export default function setupStats () {
    var stats1 = new Stats();
    stats1.showPanel(0); // Panel 0 = fps
    stats1.domElement.style.cssText = 'position:absolute;top:0px;left:0px;';
    document.body.appendChild(stats1.domElement);

    var stats2 = new Stats();
    stats2.showPanel(2); // Panel 1 = ms
    stats2.domElement.style.cssText = 'position:absolute;top:0px;left:80px;';
    document.body.appendChild(stats2.domElement);

    function animate() {

        stats1.update();
        stats2.update();

        requestAnimationFrame(animate);

    }

    requestAnimationFrame(animate);
}