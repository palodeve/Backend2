let toys =[];
let nextId =1;

export default class ToysDAO {
    getAll(){
        return toys;
    }

    getById(id){
        return toys.find(toy => toy.id === id) || null;
    }

    create(data){
        const newToy={
            id: nextId++,
            name: data.name,
            description: data.description,
            price: data.price
        };
        toys.push(newToy);
        return newToy;
    }

    update(id, data){
        const index= toys.findIndex(toy => toy.id === id);
        if(index === -1) return null;
        toys[index] = { ...toys[index], ...data, id: toys[index].id };
        return toys[index];
    }
    

    delete(id){
        const index= toys.findIndex(toy => toy.id === id);
        if(index === -1) return false;
        toys.splice(index, 1);
        return true;
    }
}