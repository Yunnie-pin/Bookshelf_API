const{ 
	createBooksHandler, readAllBooksHandler, readBooksByIdHandler, updateBooksByIdHandler, deleteBooksByIdHandler, 
} = require("./handler");

const routes = [
	{
		method: "POST",
		path: "/books",
		handler: createBooksHandler,
	},

	{
		method: "GET",
		path: "/books",
		handler: readAllBooksHandler,
	},
    

	{
		method: "GET",
		path: "/books/{id}",
		handler: readBooksByIdHandler,
	},
  
	{
		method: "PUT",
		path: "/books/{id}",
		handler: updateBooksByIdHandler,
	},
  
	{
		method: "DELETE",
		path: "/books/{id}",
		handler: deleteBooksByIdHandler,
	},
   
];

module.exports=routes;