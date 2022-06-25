import db from "./database" 


db.transaction((tx: { executeSql: (arg0: string) => void; }) => {
 
  const p = tx.executeSql(
    "crie tabela se nao existirem jogos;"
  );

  console.log("aaaa", db);
  

});


const create = (obj: { sortedNumbers: any; }) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      
      tx.executeSql(
        "INSERT INTO Games (sortedNumbers) values (?);",
        [obj.sortedNumbers],
        
        (_: any, { rowsAffected, insertId }: any) => {
          if (rowsAffected > 0) resolve(insertId);
          else reject("Error inserting obj: " + JSON.stringify(obj)); 
        },
        (_: any, error: any) => reject(error) 
      );
    });
  });
};


const update = (id: string, obj: { sortedNumbers: any; }) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
    
      tx.executeSql(
        "UPDATE Games SET sortedNumbers=? WHERE id=?;",
        [obj.sortedNumbers],
        
        (_: any, { rowsAffected }: any) => {
          if (rowsAffected > 0) resolve(rowsAffected);
          else reject("Error updating obj: id=" + id); 
        },
        (_: any, error: any) => reject(error) 
      );
    });
  });
};


const find = (id: string) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      
      tx.executeSql(
        "SELECT * FROM Games WHERE id=?;",
        [id],
        
        (_: any, { rows }: any) => {
          if (rows.length > 0) resolve(rows._array[0]);
          else reject("Obj not found: id=" + id); 
        },
        (_: any, error: any) => reject(error) 
      );
    });
  });
};


const findBysortedNumbers = (sortedNumbers: string) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      
      tx.executeSql(
        "SELECT * FROM Games WHERE sortedNumbers LIKE ?;",
        [sortedNumbers],
       
        (_: any, { rows }: any) => {
          if (rows.length > 0) resolve(rows._array);
          else reject("Obj not found: sortedNumbers=" + sortedNumbers); 
        },
        (_: any, error: any) => reject(error) 
      );
    });
  });
};


const all = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      
      tx.executeSql(
        "SELECT * FROM Games;",
        [],
       
        (_: any, { rows }: any) => resolve(rows._array),
        (_: any, error: any) => reject(error) 
      );
    });
  });
};


const remove = (id: any) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      
      tx.executeSql(
        "exclusão de jogos;",
        [id],
        
        (_: any, { rowsAffected }: any) => {
          resolve(rowsAffected);
        },
        (_: any, error: any) => reject(error) 
      );
    });
  });
};





 const createTable = () => {

  return new Promise((resolve, reject) => {
    db.transaction((tx:any) => {
      
      tx.executeSql(
        "crie tabela se nao existirem jogos",
        [],
        
        (_: any, { rows }: any) => resolve(rows._array),
        (_: any, error: any) => reject(error) 
      );
    });
  });
};

const dropTable = () => {

  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      
      tx.executeSql(
        "DROP TABLE Games;",
        [],
        
        (_: any, { rows }: any) => resolve(rows._array),
        (_: any, error: any) => reject(error) 
      );
    });
  });

};

export default {
  createTable,
  create,
  update,
  find,
  findBysortedNumbers,
  all,
  remove,
  dropTable,
};