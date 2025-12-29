import toysService from '../services/toys.service.js';

export const getToys = (req, res) => {
  const toys = toysService.getAllToys();
  res.send({ status: 'success', payload: toys });
};

export const getToyById = (req, res) => {
  const id = Number(req.params.id);
  const toy = toysService.getToyById(id);
  if (!toy) return res.status(404).send({ status: 'error', message: 'Juguete no encontrado' });
  res.send({ status: 'success', payload: toy });
};

export const createToy = (req, res) => {
  try {
    const newToy = toysService.createToy(req.body);
    res.status(201).send({ status: 'success', payload: newToy });
  } catch (err) {
    res.status(400).send({ status: 'error', message: err.message });
  }
};

export const updateToy = (req, res) => {
  const id = Number(req.params.id);

  try {
    const updated = toysService.updateToy(id, req.body);
    res.status(201).send({ status: 'success', payload: updated });
  } catch (err) {
    res.status(404).send({ status: 'error', message: err.message });
  }
};

export const deleteToy = (req, res) => {
  const id = Number(req.params.id);
  try {
    toysService.deleteToy(id);
    res.send({ status: 'success', message: "Eliminado" });
  } catch (err) {
    res.status(404).send({ status: 'error', message: err.message });
  }
};
