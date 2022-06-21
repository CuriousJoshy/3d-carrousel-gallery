var gallery = document.querySelector(".gallery"), CS = getComputedStyle(gallery);

var images = [], total = 0, loaded = 0, failed = 0;

function createPanel(img, angle, x, z)
{
    let panel = document.createElement("div");
    panel.className = "panel";
    
    panel.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${angle}deg)`;
    
    panel.appendChild(img);
    
    gallery.appendChild(panel);
}

var rotation = 0, startTime = 0;

function createGallery()
{
    let width = gallery.clientWidth + 16;
    
    let deg = 360 / total, rad = deg * Math.PI / 180;
    let perimeter = width * total;
    let apothem = width / (2 * Math.tan(Math.PI / total));
    
    let x, z;
        
    for(var i = 0; i < total; i++)
    {
        x = Math.sin(rad * i) * apothem;
        z = Math.cos(rad * i) * apothem;
        
        createPanel(images[i], deg * i, x, z);
    }
    
    gallery.classList.remove("loading");
}

function rotateGallery(deg)
{    
    gallery.style.setProperty("--rotation", `${deg}deg`);
}

function loadImage(e)
{
    if(e.type == "error")
        failed++;
    else if(e.type == "load")
    {
        images.push(e.target);
        
        loaded++;
    }
    
    if(loaded + failed >= total)
        createGallery();
}

function loadImages(sources)
{
    total = sources.length;
    
    sources.forEach((src) => {
        let img = new Image()

        img.onload = loadImage;
        img.onerror = loadImage;

        img.src = src;
    });
}

document.querySelector(".previous").addEventListener("click", (e) => {
    if(gallery.classList.contains("auto-spin") || gallery.classList.contains("loading"))
        return;
    
    rotation += -(360 / total);
    
    rotateGallery(rotation);
});

document.querySelector(".next").addEventListener("click", (e) => {
    if(gallery.classList.contains("auto-spin") || gallery.classList.contains("loading"))
        return;
    
    rotation += (360 / total);
    
    rotateGallery(rotation);
});

document.querySelector(".play-state").addEventListener("click", (e) => {
    if(gallery.classList.contains("loading"))
        return;
    
    e.currentTarget.classList.toggle("paused");
    
    // Snap to the panel closest to the front based on animation duration
    if(gallery.classList.contains("auto-spin"))
    {        
        let endTime = performance.now();
        
        let spinDuration = (endTime - startTime) / 1000;
        
        let panelDuration = parseInt(CS.getPropertyValue("animation-duration")) / total;
        
        let angleDelta = 360 / total;
        
        let oldPanel = rotation / angleDelta, change = Math.round(spinDuration / panelDuration);
        
        rotation += angleDelta * change * (rotation < 0 ? -1 : 1);
        
        rotateGallery(rotation);
    }
    else
        startTime = performance.now();
    
    gallery.classList.toggle("auto-spin");
    
    let deg = parseInt(CS.getPropertyValue("--rotation"));
    
    if(deg < 0)
        gallery.style.animationDirection = "backwards";    
});

// DISCLAIMER: All images were found on the internet and I have no claim to them whatsoever

addEventListener("load", () => {
    loadImages(["https://images.pexels.com/photos/257360/pexels-photo-257360.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://images.pexels.com/photos/355296/pexels-photo-355296.jpeg?cs=srgb&dl=blur-branches-daylight-355296.jpg&fm=jpg",
    "https://cdn.pixabay.com/photo/2017/10/25/12/13/landscapes-2887796_960_720.jpg", 
    "https://images.all-free-download.com/images/graphiclarge/beautiful_nature_landscape_05_hd_picture_166223.jpg", 
    "https://www.iucn.org/sites/dev/files/content/images/2020/shutterstock_1458128810.jpg", 
    "https://images2.alphacoders.com/689/689529.jpg"]);    
});
