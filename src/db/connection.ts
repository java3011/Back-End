import { Sequelize } from "sequelize";

const sequelize = new Sequelize('', '', '', { //(''Nombre bd, 'Nombre del rol', 'contraseña bd')
    host: 'localhost',
    dialect: 'postgres',
});

export default sequelize;