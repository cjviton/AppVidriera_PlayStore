

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import styles from "./HomeStyles";
import { useFocusEffect } from "@react-navigation/native";

// Componente principal
export default function Home({ navigation }) {
  const [tareasActivasHoy, setTareasActivasHoy] = useState(0);
  const [incidenciasHoy, setIncidenciasHoy] = useState(0);
  const [revisionesSemana, setRevisionesSemana] = useState(0);
  const [proximasAcciones, setProximasAcciones] = useState([]);

// Cargar contadores y próximas acciones al enfocar la pantalla
  useFocusEffect(
    React.useCallback(() => {
      cargarContadores();
      cargarProximasAcciones();
    }, [])
  );

// Funciones auxiliares de fecha y hora
  const rangoHoy = () => {
    const now = new Date();
    const desde = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
    const hasta = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
    return { desde, hasta };
  };

  //desde hoy hasta el domingo 23:59:59
  const rangoSemanaHastaDomingo = () => {
    const now = new Date();
    const inicio = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);

    const domingo = new Date(inicio);
    
    // Domingo = 0 en JS, esto calcula días hasta el próximo domingo (incluido)
    const diff = (7 - inicio.getDay()) % 7;
    domingo.setDate(inicio.getDate() + diff);
    domingo.setHours(23, 59, 59, 999);

    return { desde: inicio.toISOString(), hasta: domingo.toISOString() };
  };

  const fetchEventos = async (desde, hasta) => {
    const res = await fetch(
      `http://10.0.2.2:5088/api/calendar/events?from=${encodeURIComponent(desde)}&to=${encodeURIComponent(hasta)}`
    );
    return await res.json();
  };

  const cargarContadores = async () => {
    try {
      // ✅ CONTADORES HOY (igual que TareasHoy + IncidenciasHoy)
      const { desde: desdeHoy, hasta: hastaHoy } = rangoHoy();
      const eventosHoy = await fetchEventos(desdeHoy, hastaHoy);

      setTareasActivasHoy(eventosHoy.filter(e => String(e.colorId) === "2").length);   // 🟢
      setIncidenciasHoy(eventosHoy.filter(e => String(e.colorId) === "11").length);   // 🔴

      // ✅ CONTADOR REVISIONES (igual que RevisionesSemana: hoy→domingo)
      const { desde: desdeSem, hasta: hastaSem } = rangoSemanaHastaDomingo();
      const eventosSemana = await fetchEventos(desdeSem, hastaSem);

      setRevisionesSemana(eventosSemana.filter(e => String(e.colorId) === "5").length); // 🟡
    } catch (e) {
      console.error("Error contadores:", e);
      setTareasActivasHoy(0);
      setIncidenciasHoy(0);
      setRevisionesSemana(0);
    }
  };

  const cargarProximasAcciones = async () => {
    try {
      const { desde, hasta } = rangoSemanaHastaDomingo();
      const data = await fetchEventos(desde, hasta);

      const amarillas = data
        .filter(e => String(e.colorId) === "5")
        .sort((a, b) => {
          const fa = a.start?.dateTime || a.start?.date;
          const fb = b.start?.dateTime || b.start?.date;
          return new Date(fa) - new Date(fb);
        })
        .slice(0, 3);

      setProximasAcciones(amarillas);
    } catch (e) {
      console.error("Error próximas acciones:", e);
      setProximasAcciones([]);
    }
  };

  const formatFecha = (ev) => {
    const iso = ev?.start?.dateTime || ev?.start?.date;
    return iso ? iso.substring(0, 10).split("-").reverse().join("/") : "";
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Vidriera Arandina</Text>
        <Text style={styles.subtitle}>Departamento de Mantenimiento</Text>
        <Text style={styles.welcome}>👋 Hola, Bienvenid@</Text>

        <View style={styles.cardsContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🔧 Tareas activas (hoy)</Text>
            <Text style={[styles.cardValue, { color: "#2ecc71" }]}>
              {tareasActivasHoy}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>⚠️ Incidencias</Text>
            <Text style={[styles.cardValue, { color: "#e74c3c" }]}>
              {incidenciasHoy}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🗓️ Revisiones</Text>
            <Text style={[styles.cardValue, { color: "#f1c40f" }]}>
              {revisionesSemana}
            </Text>
          </View>

          <View style={[styles.card, { justifyContent: "center", alignItems: "center" }]}>
            <TouchableOpacity onPress={() => navigation.navigate("GestionEventos")}>
              <Text style={[styles.cardTitle, { textAlign: "center" }]}>
                Crear / Modificar / Eliminar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.navContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("TareasHoy")}>
            <Text style={styles.buttonText}>VER TAREAS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("IncidenciasHoy")}>
            <Text style={styles.buttonText}>VER INCIDENCIAS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("RevisionesSemana")}>
            <Text style={styles.buttonText}>VER REVISIONES</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Próximas acciones</Text>
          {proximasAcciones.map(ev => (
            <Text key={ev.id} style={styles.calendarItem}>
              • {formatFecha(ev)} - {ev.summary}
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
