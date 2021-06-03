import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
  cambioManual: { type: Number, required: true },
  tasaIva: { type: Number, required: true },
  otrosImp: { type: Number, required: true },
  montoEnvio: { type: Number, required: true },
  mostrarBs: { type: Boolean, default: false },
  mostrarBcv: { type: Boolean, default: false },
}, {
  timestamps: true
});

const Config = mongoose.model('Config', configSchema);

export default Config;