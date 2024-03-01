"use client";

import "./globals.css";
import { useState, useEffect } from "react";

const inputStylesClass = "bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"

export default function Home() {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [namePost, setNamePost] = useState("Esperando datos...");
  const [lastNamePost, setLastNamePost] = useState("Esperando datos...");
  const [badgeNumberPost, setBadgeNumberPost] = useState("Esperando datos...");
  const [passwordPost, setPasswordPost] = useState("");
  const [rolePost, setRolePost] = useState("Esperando datos...");

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL!;
    console.log(wsUrl)
    const socket = new WebSocket(wsUrl); 

    socket.onmessage = (event) => {
      console.log('Recibido de WebSocket:', event.data);
      const data = JSON.parse(event.data);
      setNamePost(data.name);
      setLastNamePost(data.lastName);
      setBadgeNumberPost(data.badgeNumber);
      setPasswordPost(data.password);
      setRolePost(data.role);
    };

 
    socket.addEventListener('open', (event) => {
      console.log('Conectado al servidor WS');
      console.log(event);
    });


    socket.addEventListener('error', (event) => {
      console.error('WebSocket error:', event);
    });

  
    return () => {
      socket.close();
    };
  }, []);

  const sendMessageToFirstApi = async (): Promise<void> => {
    try {
      const user = { name: name, lastName: lastName, badgeNumber: badgeNumber, password: password, role: role };
      console.log(JSON.stringify(user))
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL! + 'users', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      console.log(response)
      if (response.ok) {
        const data = await response.json();
        console.log('Mensaje enviado a la API y recibido respuesta...', data);
      } else {
        console.error('Error al enviar mensaje:', response.statusText);
      }
    } catch (error) {
      console.error('Error al enviar mensaje a la API:', error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center">
      <div id="formContainer" className="flex min-h-screen flex-col items-center justify-center">
        <div id="form" className="flex flex-col gap-4">
          <label>
            Nombre: <br />
            <input className={inputStylesClass} autoComplete="no"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Apellidos: <br />
            <input className={inputStylesClass} autoComplete="no"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label>
            Matrícula: <br />
            <input className={inputStylesClass} autoComplete="no"
              type="text"
              value={badgeNumber}
              onChange={(e) => setBadgeNumber(e.target.value)}
            />
          </label>
          <label>
            Contraseña: <br />
            <input className={inputStylesClass} autoComplete="no"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <label>
            Rol: <br />
            <input className={inputStylesClass} autoComplete="no"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </label>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => sendMessageToFirstApi()}>Registrarse</button>
        </div>
      </div>
      <div id="result" className="flex flex-col items-center justify-center gap-4 bg-gray-800">
        <label>
            Nombre: <br />
            <input className={inputStylesClass} autoComplete="no"
              type="text"
              value={namePost}
              onChange={(e) => setName(e.target.value)}
              disabled={true}
            />
          </label>
          <label>
            Apellidos: <br />
            <input className={inputStylesClass} autoComplete="no"
              type="text"
              value={lastNamePost}
              onChange={(e) => setLastName(e.target.value)}
              disabled={true}
            />
          </label>
          <label>
            Matrícula: <br />
            <input className={inputStylesClass} autoComplete="no"
              type="text"
              value={badgeNumberPost}
              onChange={(e) => setBadgeNumber(e.target.value)}
              disabled={true}
            />
          </label>
          <label>
            Contraseña: <br />
            <input className={inputStylesClass} autoComplete="no"
              type="password"
              value={passwordPost}
              onChange={(e) => setPassword(e.target.value)}
              disabled={true}
            />
          </label>
          <label>
            Rol: <br />
            <input className={inputStylesClass} autoComplete="no"
              type="text"
              value={rolePost}
              onChange={(e) => setRole(e.target.value)}
              disabled={true}
            />
          </label>
        </div>
    </main>
  );
}
