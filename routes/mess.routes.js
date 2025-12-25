const express = require("express");
const router = express.Router();
const {MessModel} = require("../model/mess.model");

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      about,
      year,
      owner,
      address,
      state,
      city,
      area,
      image
    } = req.body;


    const newOwner = new MessModel({
      name,
      email,
      password,
      about,
      year,
      owner,
      address,
      state,
      city,
      area,
      image,
    });

    await newOwner.save();
    res.status(200).json({ message: "Mess Owner Registered", data: newOwner });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/profile", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email required" });

    const owner = await MessModel.findOne({ email });
    if (!owner) return res.status(404).json({ message: "No profile found" });

    res.status(200).json({ owner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/find",async(req,res)=>{
  const data=await MessModel.find()
  console.log(data);
  
  res.send(data)
})


router.patch('/subscribe/:id', async (req, res) => {
    const userId = req.body.name; // You must send this from frontend

    try {
        const mess = await MessModel.findById(req.params.id);
        if (!mess) return res.status(404).json({ message: "Mess not found" });

        // ✅ Check if user already subscribed
        if (mess.subscribers.includes(userId)) {
            return res.status(400).json({ message: "User already subscribed" });
        }

        // ✅ Add user to subscriber list and increment count
        mess.subscribers.push(userId);
        mess.users = (mess.users || 0) + 1;

        await mess.save();
        res.json({ message: "Subscribed", users: mess.users });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.patch('/unsubscribe/:id', async (req, res) => {
    const userId = req.body.name;

    try {
        const mess = await MessModel.findById(req.params.id);
        if (!mess) return res.status(404).json({ message: "Mess not found" });

        // ✅ Check if user is already subscribed
        const index = mess.subscribers.indexOf(userId);
        if (index === -1) {
            return res.status(400).json({ message: "User not subscribed" });
        }

        // ✅ Remove user and decrement count
        mess.subscribers.splice(index, 1);
        mess.users = Math.max((mess.users || 1) - 1, 0);

        await mess.save();
        res.json({ message: "Unsubscribed", users: mess.users });

    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});



module.exports = router;
