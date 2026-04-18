module.exports.config = {
 name: "islamick",
 version: "2.0.0",
 hasPermssion: 0,
 credits: "RAZIM",
 description: "Random Islamic video (Animated)",
 commandCategory: "Random video",
 usages: "",
 cooldowns: 3
};

module.exports.run = async ({ api, event }) => {

 const request = global.nodemodule["request"];
 const fs = global.nodemodule["fs-extra"];

 const videos = [
"https://i.imgur.com/FbnZI40.mp4",
"https://i.imgur.com/8k6OOZg.mp4",
"https://i.imgur.com/lgQghHX.mp4",
"https://i.imgur.com/D7HZFSg.mp4",
"https://i.imgur.com/vUe9Zlv.mp4",
"https://i.imgur.com/oxFuJYw.mp4",
"https://i.imgur.com/OKKlDBN.mp4",
"https://i.imgur.com/6wWebFc.mp4",
"https://i.imgur.com/K2LTmaA.mp4",
"https://i.imgur.com/i9vKvTd.mp4"
 ];

 const path = __dirname + "/cache/islamic.mp4";

 // 🔥 STEP 1: typing effect
 api.sendTypingIndicator(event.threadID, true);

 setTimeout(() => {

   // 🔥 STEP 2: loading animation
   api.sendMessage("⏳ Preparing Islamic video...", event.threadID, (err, info) => {

     let dots = 1;

     const loading = setInterval(() => {
       dots = (dots % 3) + 1;
       api.editMessage("⏳ Loading" + ".".repeat(dots), info.messageID);
     }, 500);

     const video = videos[Math.floor(Math.random() * videos.length)];

     // 🔥 STEP 3: download video
     request(video)
       .pipe(fs.createWriteStream(path))
       .on("close", () => {

         clearInterval(loading);

         // 🔥 STEP 4: final message + video
         api.editMessage("📥 Uploading video...", info.messageID);

         api.sendMessage({
           body: `🌙 𝗜𝘀𝗹𝗮𝗺𝗶𝗰 𝗥𝗲𝗺𝗶𝗻𝗱𝗲𝗿

🌻 মানুষ হারাম ছাড়ে না অথচ সুখ খোঁজে 😔
আল্লাহ আমাদের সবাইকে হারাম থেকে দূরে থাকার তৌফিক দান করুন 🤲❤️`,
           attachment: fs.createReadStream(path)
         }, event.threadID, () => {
           try { fs.unlinkSync(path); } catch(e) {}
         });

       })

       .on("error", () => {
         clearInterval(loading);
         api.editMessage("❌ Video load failed!", info.messageID);
       });

   });

 }, 1000);
};
