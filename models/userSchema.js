import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    default: 'user',
    // enum: ['user', 'admin'], --> en la vida real lo que hacemos es definir estas dos propiedades en el esquema. Después creamos al admin(s) y una vez que lo hacemos eliminamos ese role del schema (y quedaría tal como sigue) --> ya nadie puede definirse como un admin en el futuro --> está protegido
    enum: ['user'],
  },
  // orders: [{ type: Schema.Types.ObjectId, ref: 'orders' }],
  profileImage: {
    type: String,
    default: function () {
      return `https://robohash.org/${this.lastName}`;
    }, // para que funcione el 'this' hay que hacerlo así (y no vale arrow function)
  },
});

// INDEX CREATION: set email as an index
userSchema.indexes({ email: 1 }); // esto lo ponemos para que el email sea realmente único (con la línea 6 no sería suficiente). Además de este nuevo index, está el creado automáticamente (_id). Este código tenemos que ponerlo antes del 'model'

const UserCollection = model('users', userSchema);

export default UserCollection;
