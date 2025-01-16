import { ClientModel } from "../models/cliente.model.js";

// http://localhost:3000/api/v1/clientes/register
const registerCliente = async (req, res) => {
    try {
        console.log(req.body);//
        const {idcliente, nombre, apellido, correo, telefono, pasaporte, direccion} = req.body;
    if(!idcliente || !nombre || !apellido || !correo|| !telefono || !pasaporte || !direccion){
        return res.status(400).json({ok: false, 
                                    message: "Faltan campos!"});
    }
    const cliente = await ClientModel.findOneByEmail(correo);
    if(cliente){
        return res.status(409).json({ok:true, 
                                    message: "El cliente ya existe!"});
    }

    //nueva fauncionalidad o faltante
    const newCliente = await ClientModel.createCliente({idcliente, nombre, apellido, correo, telefono, pasaporte, direccion});

    return res.status(201).json({
        ok: true,
        message: newCliente //cambiar mensaje por cliente creado
    });
    
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            message: "Error al crear el cliente!"
        });
    }
}


// http://localhost:3000/api/v1/clientes/list
const listCliente = async (req, res) => {
    try {
        const clientes = await ClientModel.readCliente();
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los clientes' });
    }
};

const searchCliente = async (req, res) => {
    const { query } = req.query;
    try {
        const clients = await ClientModel.findIdOrEmail(query)
        return res.json( clients )

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            message: 'Error server'
        })
    }
}

// http://localhost:3000/api/v1/clientes/deleteClients
const deleteCliente = async (req, res) => {
    const { idcliente } = req.params;
    const userRole = req.role;

     // Verificar si el rol del usuario es "superadmin" o "usu1"
     if (userRole !== 'Superadmin' && userRole !== 'usu2') {
        return res.status(403).json({
            ok: false,
            message: 'No tienes permisos para eliminar clientes'
        });
    }
    try {
        const result = await ClientModel.deleteCliente(idcliente);
        if (result.rowCount === 0) {
            return res.status(404).json({
                ok: false,
                message: 'Cliente no encontrado'
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Cliente eliminado correctamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: 'Error al eliminar el cliente'
        });
    }
}

const updateClient = async (req, res) => {
    const { idcliente } = req.params;
    const updateFields = req.body;

    try {
        const updatedClient = await ClientModel.updateCliente(idcliente, updateFields);
        return res.status(200).json({
            ok: true,
            message: 'Cliente actualizado correctamente',
            data: updatedClient
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            message: error.message
        });
    }
};

export const ClientController = {
    registerCliente,
    listCliente,
    searchCliente,
    deleteCliente,
    updateClient
}