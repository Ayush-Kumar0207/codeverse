const { supabase } = require("../config/db");
const asyncHandler = require("../middlewares/asyncHandler");

const testUser = asyncHandler(async (req, res) => {
  const { data: savedUser, error } = await supabase
    .from("users")
    .insert([{
      username: "testuser_" + Date.now(),
      password: "hashedpassword123",
    }])
    .select()
    .single();

  if (error) throw error;

  res.json({ message: "✅ User saved successfully!", savedUser });
});

module.exports = {
  testUser,
};

