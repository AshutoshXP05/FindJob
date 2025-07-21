import mongoose from 'mongoose';
import bcrypt from "bcryptjs"

const bioSchema = new mongoose.Schema({
    bio: {
        type: String,
    },
    profilePic: {
        type: String,
        default: "",
    },
    skills: [
        { type: String, }
    ],
    resume: {
        type: String
    },
    resumeOriginalName: {
        type: String
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    }
})

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: false,
        default: "",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    mobNo: {
        type: Number,
        required: false,
    },
    role: {
        type: String,
        enum: ["employee", "recruiter"],
        required: true
    },
    profile: bioSchema,
}, {
    timestamps: true,
})




userSchema.pre("save", async function(next) {
    if ( ! this.isModified("password") ) return next()
        this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
}

export const User = mongoose.model("User", userSchema);
