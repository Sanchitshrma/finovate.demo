const { model } = require("mongoose");
const { AuthHandoffSchema } = require("../schemas/AuthHandoffSchema");

const AuthHandoffModel = model("auth_handoff", AuthHandoffSchema);

module.exports = { AuthHandoffModel };
