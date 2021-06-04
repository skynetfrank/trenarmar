import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  rif: { type: String, required: true },
  direccion: { type: String, required: true },
  condiciones: { type: String, required: true },
  saldo: { type: Number, required: true },
  

}, {

  timestamps: true
});

const Cliente = mongoose.model('User', clienteSchema);

export default Cliente;