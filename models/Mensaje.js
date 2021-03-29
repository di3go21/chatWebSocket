
  
const mongoose = require('mongoose');
const { Schema } = mongoose;


const MsgSchema = new Schema({

            autor:String,
            msg:String,
            created_at:{
                type:Date,
                default: Date.now
            }

        });
module.exports= mongoose.model("Mensaje",MsgSchema)