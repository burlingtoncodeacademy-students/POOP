import React from "react";
import { useState, useEffect } from "react";
import { db, auth } from "../firebase-config";
import { collection, getDocs, addDoc, query, where, orderBy } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import {useLocation} from 'react-router-dom'

// import "./Dashboard.css";

function PatientData(props) {
  const [records, setRecords] = useState([]);
  const usersCollectionRef = collection(db, "data");

  let location = useLocation();
  console.log("location: ", location)
  console.log(location.state.patientName)

  // trying out a filter ability:
  const q = query(usersCollectionRef, where("name", "==", location.state.patientName), orderBy("date", "asc"))

  const [user, loading, error] = useAuthState(auth);

  // This area is to read all of the entries on the DB
  // and will most likely be moved to the admin dashboard
  // R is for READ (all)
  // loads data when page is loaded
  useEffect(() => {
    const getEntries = async () => {
      const data = await getDocs(q);
      // console.log('data:')
      // console.log(data) // for testing purposes
      setRecords(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // for testing purposes
    };
    getEntries();
  }, []);
  // **********************************

  function dateConvert(input) {
    let formattedDate = new Date(input);
    let month = formattedDate.getMonth();
    let day = formattedDate.getDate();
    let year = formattedDate.getFullYear();

    let dateString = year + "-" + month + "-" + day;
    return dateString;
  }




  return (
    <div>
      Patient Data Page
      <h1>{location.state.patientName}</h1>
      <div className="dashboard-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Bristol</th>
              <th>Blood</th>
              <th>Pain Level</th>
            </tr>
          </thead>
        
          <tbody>
            {records.map((entry) => {
              return (
                <tr>
                  <td>{dateConvert(entry.date)}</td>
                  <td>{entry.bristol}</td>
                  <td>{entry.blood ? "yes" : "no"}</td>
                  <td>{entry.pain}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PatientData;
