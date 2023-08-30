const { Sequelize, DataTypes } = require('sequelize');
const password = require('../credentials/mysql');


const sequelize = new Sequelize('expense', 'root', password, {
    host: 'localhost',
    dialect: 'mysql',
  });


const User = sequelize.define('user', {
  // Define the columns of the table
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement:true,
    unique:true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    // validate: {
    //   isEmail: true,
    // },
  },
  password: {
    type: DataTypes.STRING,
    allowNull:false,

  },
  total_expense: {
    type: DataTypes.FLOAT,
    allowNull: false
    
  }
});




const Expense = sequelize.define('userexepense', {
    // Define the columns of the table
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement:true,
      unique:true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      
    },
    category: {
      type: DataTypes.STRING,
      allowNull:false,
      
    }
  });
  

const Orders = sequelize.define('orders',{
    id:{
        type: DataTypes.INTEGER,
        autoIncrement:true,
        unique:true,
        primaryKey:true,
        allowNull:false
    },
    paymentid:DataTypes.STRING,
    orderid:DataTypes.STRING,
    status:DataTypes.STRING

});



const ForgotPasswordRequests = sequelize.define('forgotpasswordrequests',{
  sl:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    unique: true,
    primaryKey: true,
    allowNull: false,
  
    
  },
  id:{
      type: DataTypes.INTEGER,
      unique:true,
      allowNull:false
  },
  userId:{ 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isActive:{
    type: DataTypes.BOOLEAN,
    allowNull: false
  }

});


const DownloadedFile = sequelize.define('downloadedFile',{
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  links: {
    type: DataTypes.STRING,
    allowNull: false
  }

}) 






// Create the table in the database
async function createTable(obj) {
  try {
    await obj.sync({ force: false });
    console.log('Table created successfully.');
  } catch (error) {
    console.error('Unable to create table:', error);
  }
}


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Orders);
Orders.belongsTo(User);

User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

User.hasMany(DownloadedFile);
DownloadedFile.belongsTo(User);

let ex = async()=>{
    await createTable(User);
    await createTable(Expense);
    await createTable(Orders);
    await createTable(ForgotPasswordRequests);
    await createTable(DownloadedFile);
}

ex();



module.exports = {
    User:User,
    Expense:Expense,
    Orders: Orders,
    FPR: ForgotPasswordRequests,
    DownloadedFile: DownloadedFile
};
