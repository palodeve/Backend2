import toysDAO from '../dao/toys.dao.js';

class ToysRepository {
  getAll() {
    return toysDAO.getAll();
  }

  getById(id) {
    return toysDAO.getById(id);
  }

  create(data) {
    return toysDAO.create(data);
  }

  update(id, data) {
    return toysDAO.update(id, data);
  }

  delete(id) {
    return toysDAO.delete(id);
  }
}

export default new ToysRepository();
