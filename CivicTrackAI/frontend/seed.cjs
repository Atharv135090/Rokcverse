const axios = require("axios");

const seed = async () => {
  for (let i = 0; i < 3; i++) {
    const fd = new FormData();
    // Fetch a dummy image buffer to send
    const imageRes = await axios.get("https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=100&q=50", { responseType: "arraybuffer" });
    const buffer = Buffer.from(imageRes.data, "utf-8");
    const blob = new Blob([buffer], { type: "image/jpeg" });
    
    fd.append("image", blob, `dummy${i}.jpg`);
    fd.append("latitude", (19.0760 + i * 0.01).toString());
    fd.append("longitude", (72.8777 + i * 0.01).toString());

    await fetch("https://rokcverse-production.up.railway.app/api/issues/report", {
      method: "POST",
      body: fd
    }).catch(e => console.log(e));
  }
  console.log("Seeded 3 reports.");
};
seed();
