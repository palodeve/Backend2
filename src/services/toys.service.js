import toysRepository from '../repositories/toys.repository.js';

const toysDAO = new ToysDAO();

class ToysServices {
  getAllToys() {
    return toysRepository.getAll();
  }

  getToyById(id) {
    return toysRepository.getById(id);
  }

  createToy(data) {
    if (!data.name) throw new Error("El nombre es obligatorio");
    if (data.price < 0) throw new Error("El precio no puede ser negativo");
    return toysRepository.create(data);
  }

  updateToy(id, data) {
    const updated = toysRepository.update(id, data);
    if (!updated) throw new Error("Juguete no encontrado");
    return updated;
  }

  deleteToy(id) {
    const ok = toysRepository.delete(id);
    if (!ok) throw new Error("Juguete no encontrado");
    return ok;
  }
}

export default ToysServices;
