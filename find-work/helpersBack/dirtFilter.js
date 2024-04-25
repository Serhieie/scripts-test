const { User } = require("../models/user");
const { Message } = require("../models/message");

const validateMessage = async (message, sender) => {
  try {
    if (!message || typeof message !== "string") {
      throw new Error("Invalid message");
    }

    const dirtyWords = [
      "Бля",
      "Блядь",
      "Сука",
      "Ебать",
      "Трахал",
      "Хуй",
      "Пизда",
      "Ебаная",
      "Мразь",
      "Пізда",
      "Хуесос",
      "Підор",
    ];

    const regexDirtyWords = new RegExp(dirtyWords.join("|"), "gi");

    const cleanMessage = message.replace(regexDirtyWords, "!@#$%");

    const user = await User.findOne({ _id: sender });
    if (!user) {
      throw new Error("User not found");
    }

    return new Message({
      message: cleanMessage,
      sender: user._id,
      senderInfo: {
        avatarURL: user.avatarURL,
        email: user.email,
        name: user.name,
        start: user.createdAt,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    throw new Error(`Error validating message: ${error.message}`);
  }
};

module.exports = { validateMessage };
