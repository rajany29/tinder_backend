const mongoose = require('mongoose')

const ConnectionSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    status : {
        type : String ,
        enum : {
          values : ['interested','accepted','rejected','ignored'],
          message : (props) => `${props.value} is an incorrect status type`
        }
    }},
    {timpstamps :  true}

)

ConnectionSchema.index({ fromUserId: 1, toUserId: 1 });

ConnectionSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("Cannot send connection request to yourself!");
  }
  next();
});

module.exports = mongoose.model('ConnectionRequest', ConnectionSchema);
