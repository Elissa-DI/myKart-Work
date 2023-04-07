const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const port = process.env.PORT || 7777;

const app = express();

app.use(bodyParser.json());
app.use(cors());

  mongoose.connect('mongodb://127.0.0.1/students', {
    useNewUrlParser: true,
    useUnifiedTopology: true  
  }).then(() => {
    console.log('mongodb connected successfully');
  }).catch(e => console.log('Could not connect to Mongodb', e));



  const Student = mongoose.model('Student', {
    name: String,
    age: Number,
    email: String, 
  });

    app.post('/students', (req, res) => {
        const student = new Student(req.body);
        student.save()
          .then(savedStudent => {
            res.send(savedStudent);
          })
          .catch(error => {
            res.status(404).send(error);
          });
      });
      

    app.post('/students', (req, res) => {
        const student = new Student(req.body);
        student.save((err) => {
          if (err) {
            res.status(404).send(err);
          } else {
            res.send(student);
          }
        });
      });      

    app.put('/students/:id', async (req, res) => {
        try {
          const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
          if (!student) {
            return res.status(404).send('Student not found');
          }
          res.send(student);
        } catch (error) {
          console.log(error);
          res.status(500).send('Server error');
        }
      });

    app.delete('/students/:id', (req, res) => {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).send('Invalid student ID');
        }
      
        Student.findByIdAndDelete(id)
          .then(student => {
            if (!student) {
              return res.status(404).send('Student not found');
            }
            res.send(student);
          })
          .catch(err => {
            console.log(err);
            res.status(500).send('Server error');
          });
      });
      
      
      app.listen(port, () => {
        console.log('Server running on port', port + '...');
      });