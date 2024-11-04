// ./model/productos.js
import mongoose from "mongoose";
 
//Schema
const ProductosSchema = new mongoose.Schema({
    "id": {
        "type": "Number",
        "unique": true
      },
      "title": {
        "type": "String",
        "required": true,
        "validate": {
            "validator": function(value) {
                return /^[A-Z]/.test(value);
            },
            "message": 'El título debe comenzar con una letra mayúscula.'
        }
    },
      "price": {
        "type": "Number"
      },
      "description": {
        "type": "String"
      },
      "category": {
        "type": "String"
      },
      "image": {
        "type": "String"
      },
      "rating": {
        "rate": {
          "type": "Number"
        },
        "count": {
          "type": "Number"
        }
      }
})
const Productos = mongoose.model("productos", ProductosSchema);
export default Productos