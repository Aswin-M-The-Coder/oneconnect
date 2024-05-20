const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const app = express();
const cors = require('cors')

let authenticatedUser = null;

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow requests with no origin (like Postman)
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Origin ${origin} not allowed by CORS`); // Log the origin for debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json());

const con = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"aswin",
    database:"emp"
});

con.connect(function(err) {
    if (err) {
        console.log("Error in Connection");
    } else {
        console.log("Connected");
    }
});

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (authenticatedUser) {
        next();
    } else {
        return res.json({ Status: "Error", Error: "User not authenticated" });
    }
};

app.get('/dashboard', isAuthenticated, (req, res) => {
    const { role } = authenticatedUser;
    if (role === "admin") {
        const sql = "SELECT * FROM employee where role='admin'";
        con.query(sql, (err, result) => {
            if (err) {
                console.error("Error fetching admin data:", err);
                return res.json({ Status: "Error", Error: "Error fetching admin data" });
            }
            return res.json({ Status: "Success", role: "admin", data: result });
        });
    } else {
        const sql = "SELECT * FROM employee_data WHERE user_id = ?";
        con.query(sql, [authenticatedUser.id], (err, result) => {
            if (err) {
                console.error("Error fetching employee data:", err);
                return res.json({ Status: "Error", Error: "Error fetching employee data" });
            }
            return res.json({ Status: "Success", role: "employee", data: result });
        });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM employee WHERE email = ? AND password = ?";
    con.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error("Error in login query:", err);
            return res.json({ Status: "Error", Error: "Error in running query" });
        }
        if (result.length > 0) {
            authenticatedUser = result[0];
            return res.json({ Status: "Success", user: authenticatedUser });
        } else {
            return res.json({ Status: "Error", Error: "Wrong Email or Password" });
        }
    });
});

const user={
    name:"Aswin M",
    email:"aswin@gmail.com",
    organisation:"Bhumi"
}

app.use((req, res, next) => {
    req.user = user; 
    next(); 
  });

  app.post('/donateall/:id', (req, res) => {
    const id = req.params.id;
    const organisation_ID = req.body.ID; // Corrected to req.params.ID
    const amount = req.body.amount; // Assuming the amount is sent in the request body
    const { name, email, organisation } = req.user; // Extracting name, email, and organisation from the user object
    
    // Update the donation amount for the organization
    const sqlUpdate = `UPDATE donationdetails SET reached = reached + ? WHERE id = ?`;
    con.query(sqlUpdate, [amount, id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ Status: 'Error', Message: 'Failed to donate' });
      } else {
        const sqlUpdateOrg = `UPDATE organisation SET donation = donation + ? WHERE id = ?`;
        con.query(sqlUpdateOrg, [amount, id], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ Status: 'Error', Message: 'Failed to donate' });
          } else {
            // Update the donor's donated amount
            const sql = `SELECT * FROM donationdetails WHERE id=?`;
            con.query(sql, [organisation_ID], (err, result1) => {
              if (err) {
                console.error(err);
                res.status(500).json({ Status: 'Error', Message: 'Failed to donate' });
              } else {
                if (result1.length > 0) { // Check if there are rows returned
                  const org_name = result1[0].organisation_name; // Access the first row and extract org_name
                  const sqlInsert = `INSERT INTO donar (name, email, organisation, donated) VALUES (?, ?, ?, ?)`;
                  const values = [name, email, org_name, amount];
                  con.query(sqlInsert, values, (err, result) => {
                    if (err) {
                      console.error(err);
                      res.status(500).json({ Status: 'Error', Message: 'Failed to save donation details' });
                    } else {
                      res.status(200).json({ Status: 'Success', Message: 'Donation submitted successfully' });
                    }
                  });
                } else {
                  res.status(404).json({ Status: 'Error', Message: 'Donation details not found' });
                }
              }
            });
          }
        });
      }
    });
  });
    
  
app.get('/getEmployee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result });
    });
});

app.get('/getEmployeedonar', (req, res) => {
    const sql = "SELECT * FROM donar";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result });
    });
});

app.get('/getOrg', (req, res) => {
    const sql = "SELECT * FROM organisation";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result });
    });
});
app.get('/getcamp', (req, res) => {
    const sql = "SELECT * FROM donationdetails";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result });
    });
});

app.get('/getcamps/:id', (req, res) => {
    const id = req.params.id 
    const sql = "SELECT * FROM donationdetails where id = ?";
    con.query(sql,[id], (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result });
    });
});

app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where user_id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result });
    });
});

app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE employee set salary = ? WHERE user_id = ?";
    con.query(sql, [req.body.salary, id], (err, result) => {
        if (err) return res.json({ Error: "update employee error in sql" });
        return res.json({ Status: "Success" });
    });
});


app.get('/getcamps/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM donationdetails where id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result });
        console.log(result)
    });
});

app.put('/updatecamp/:id', (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE donationdetails set title= ?, description = ?, target = ? WHERE id = ?";
    con.query(sql, [req.body.title,req.body.description,req.body.target, id], (err, result) => {
        if (err) return res.json({ Error: "update employee error in sql" });
        return res.json({ Status: "Success" });
    });
});




app.get('/getorgdata/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM organisation where id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "Get employee error in sql" });
        return res.json({ Status: "Success", Result: result });
    });
});



app.put('/updateorgdata/:id', (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE employee set donation = ? WHERE id = ?";
    con.query(sql, [req.body.salary, id], (err, result) => {
        if (err) return res.json({ Error: "update employee error in sql" });
        return res.json({ Status: "Success" });
    });
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = "Delete FROM employee WHERE user_id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "delete employee error in sql" });
        return res.json({ Status: "Success" });
    });
});
app.delete('/deletedonar/:id', (req, res) => {
    const id = req.params.id;
    const sql = "Delete FROM donar WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "delete employee error in sql" });
        return res.json({ Status: "Success" });
    });
});

app.delete('/deleteorg/:id', (req, res) => {
    const id = req.params.id;
    const sql = "Delete FROM organisation WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "delete employee error in sql" });
        return res.json({ Status: "Success" });
    });
});

app.delete('/deletecamp/:id', (req, res) => {
    const id = req.params.id;
    const sql = "Delete FROM donationdetails WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "delete employee error in sql" });
        return res.json({ Status: "Success" });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT role, id, email FROM users WHERE email = ? AND password = ?";
    con.query(sql, [email, password], (err, result) => {
        if (err) return res.json({ Status: "Error", Error: "Error in running query" });
        if (result.length > 0) {
            const user = result[0];
            authenticatedUser = { id: user.id, email: user.email, role:user.role }; 
            console.log(user)// Store user ID in session
            return res.json({ Status: "Success", user });
        } else {
            return res.json({ Status: "Error", Error: "Wrong Email or Password" });
        }
    });
});

app.get('/userProfile', (req, res) => {
    // Check if the authenticatedUser variable is defined
    if (!authenticatedUser) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    // Fetch user data based on the user ID stored in authenticatedUser
    const userId = authenticatedUser.id;
    
    // Query the SQL database to fetch employee data based on the user ID
    const sql = "SELECT * FROM employee WHERE id = ?";
    con.query(sql, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const userData = result[0];
        res.json(userData);
    });
});



app.post('/employeelogin', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM employee WHERE email = ? AND password = ?";
    con.query(sql, [email, password], (err, result) => {
        if (err) return res.json({ Status: "Error", Error: "Error in running query" });
        if (result.length > 0) {
            const user = result[0];
            authenticatedUser = { id: user.id, email: user.email, role:user.role };
            console.log(user)
            return res.json({ Status: "Success",  user});
        } else {
            return res.json({ Status: "Error", Error: "Wrong Email or Password" });
        }
    });
});




app.get('/logout', (req, res) => {
    // Reset the authenticatedUser variable to null
    authenticatedUser = null;

    // Respond with a success message
    return res.json({ Status: "Success" });
});


app.get('/adminCount', (req, res) => {
    const sql = "SELECT COUNT(*) AS admin FROM employee where role='admin'";
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching admin count:", err);
            return res.status(500).json({ error: "Error fetching admin count" });
        }
        return res.json(result);
    });
});

app.get('/organisationCount', (req, res) => {
    const sql = "SELECT COUNT(*) AS organisation FROM organisation";
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching admin count:", err);
            return res.status(500).json({ error: "Error fetching admin count" });
        }
        return res.json(result);
    });
});

// Route to get the count of employees
app.get('/employeeCount', (req, res) => {
    const sql = "SELECT COUNT(*) AS employee FROM employee where role='employee'";
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching employee count:", err);
            return res.status(500).json({ error: "Error fetching employee count" });
        }
        return res.json(result);
    });
});

app.get('/donarCount', (req, res) => {
    const sql = "SELECT COUNT(*) AS donar FROM donar";
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching admin count:", err);
            return res.status(500).json({ error: "Error fetching admin count" });
        }
        return res.json(result);
    });
});

app.get('/totaldonation', (req, res) => {
    const sql = "SELECT sum(reached) AS donation FROM donationdetails";
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching admin count:", err);
            return res.status(500).json({ error: "Error fetching admin count" });
        }
        return res.json(result);
    });
});

app.get('/admins', (req, res) => {
    const sql = "SELECT name, email FROM employee where role='admin'";
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching admins:", err);
            return res.status(500).json({ error: "Error fetching admins" });
        }
        return res.json(result);
    });
});

app.get('/salary', (req, res) => {
    const sql = "SELECT SUM(salary) AS sumOfSalary FROM employee";
    con.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching total salary:", err);
            return res.status(500).json({ error: "Error fetching total salary" });
        }
        return res.json(result);
    });
});

app.post('/create', (req, res) => {
    const sql = "INSERT INTO employee (`name`,`email`,`password`, `address`, `salary`,`role`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.address,
        req.body.salary,
        'employee'
    ];
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Error in signup query" });
        return res.json({ Status: "Success" });
    });
});

app.post('/createorg', (req, res) => {
    const sql = "INSERT INTO organisation (`name`,`email`, `address`, `donation`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.address,
        req.body.donation,
    ];
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Error in signup query" });
        return res.json({ Status: "Success" });
    });
});



app.post('/createdonar', (req, res) => {
    const sql = "INSERT INTO donationdetails (`title`,`organisation_name`,`description`, `target`, `reached`) VALUES (?)";
    const values = [
        req.body.title,
        req.body.name,
        req.body.description,
        req.body.target,
        0
    ];
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Error in signup query" });
        return res.json({ Status: "Success" });
    });
});



app.listen(8081, () => {
    console.log("Running");
});
