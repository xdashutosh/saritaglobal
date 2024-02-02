import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";

export const ProfileUpdate = async (req, res) => {
  const { name,accessToken } = req.body;
  // const { accessToken } = req.cookie;
  console.log(name,accessToken);
  try {
    const payload = jwt.verify(accessToken,process.env.SECRET);
    if(!payload)
    {
      return res.status(400).json({nameUpdated:false,tokenValid:false})
    }

    const uid = payload.uid;
    await User.updateOne({_id:uid},{name:name});
    // const currentUser = await User.findByIdAndUpdate(id, { name: name }, { new: true });
    // if (!currentUser) {
    //   return res.status(404).json({ nameUpdated:false });
    // }

    res.json({ nameUpdated: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({nameUpdated:false})
  }
}