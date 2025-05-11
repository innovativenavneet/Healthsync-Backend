const getPatients = (req, res) => {
    const patients = [
      {
        id: 1,
        name: "Aiden Malfoy",
        age: 27,
        email: "aiden.malfoy@gmail.com",
        contact: "+91 1234567890",
        diagnosis: "Hypertension",
        prescription: "Prescribed MRI and medication."
      },
      {
        id: 2,
        name: "Jane Smith",
        age: 35,
        email: "jane.smith@gmail.com",
        contact: "+91 9876543210",
        diagnosis: "Diabetes Type 2",
        prescription: "Recommended insulin dosage."
      }
    ];
  
    res.status(200).json(patients);
  };
  
  module.exports = { getPatients };
  