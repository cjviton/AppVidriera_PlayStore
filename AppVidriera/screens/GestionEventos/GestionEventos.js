// 3) screens/GestionEventos/GestionEventos.js  (pantalla completa)

import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import styles from "./GestionEventosStyles";

const API = "http://10.0.2.2:5088/api/calendar";

export default function GestionEventos({ navigation }) {
    const [events, setEvents] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const [summary, setSummary] = useState("");
    const [description, setDescription] = useState("");
    const [start, setStart] = useState(""); // "2025-12-18T09:00:00"
    const [end, setEnd] = useState("");     // "2025-12-18T10:00:00"
    const [colorId, setColorId] = useState("2"); // 2=verde, 11=rojo, 5=amarillo

    useEffect(() => {
        cargarEventosSemana();
    }, []);

    const cargarEventosSemana = async () => {
        try {
            const hoy = new Date();
            const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0);
            const fin = new Date(inicio);
            fin.setDate(inicio.getDate() + 7);

            const res = await fetch(`${API}/events?from=${inicio.toISOString()}&to=${fin.toISOString()}`);
            const data = await res.json();

            // data viene ya "simplificado" por tu controller (id, summary, description, start, end, colorId...)
            setEvents(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "No se pudieron cargar eventos");
        }
    };

    const limpiarFormulario = () => {
        setSelectedId(null);
        setSummary("");
        setDescription("");
        setStart("");
        setEnd("");
        setColorId("2");
    };

    const seleccionar = (ev) => {
        setSelectedId(ev.id);
        setSummary(ev.summary || "");
        setDescription(ev.description || "");
        setStart((ev.start || "").replace("Z", "").substring(0, 19));
        setEnd((ev.end || "").replace("Z", "").substring(0, 19));
        setColorId(String(ev.colorId || "2"));
    };

    const crear = async () => {
        try {
            if (!summary || !start || !end) {
                Alert.alert("Faltan datos", "Summary, Start y End son obligatorios");
                return;
            }

            const body = {
                summary,
                description,
                start: new Date(start).toISOString(),
                end: new Date(end).toISOString(),
                timeZone: "Europe/Madrid",
                colorId: String(colorId),
            };

            const res = await fetch(`${API}/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!res.ok) throw new Error(await res.text());

            Alert.alert("OK", "Evento creado");
            limpiarFormulario();
            cargarEventosSemana();
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "No se pudo crear");
        }
    };

    // ✅ EN GestionEventos.js -> sustituye tu modificar() por este (para ver el error REAL)
    const modificar = async () => {
        try {
            if (!selectedId) {
                Alert.alert("Selecciona un evento", "Toca un evento de la lista");
                return;
            }

            const body = {
                summary,
                description,
                start: start,
                end: end,    
                timeZone: "Europe/Madrid",
                colorId: String(colorId),
            };

            const res = await fetch(`${API}/events/${selectedId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const txt = await res.text(); 

            if (!res.ok) {
                console.log("PUT ERROR:", res.status, txt);
                Alert.alert("Error API", `${res.status}\n${txt}`);
                return;
            }

            Alert.alert("OK", "Evento modificado");
            cargarEventosSemana();
        } catch (e) {
            console.log(e);
            Alert.alert("Error", String(e?.message || e));
        }
    };



    const eliminar = async () => {
        try {
            if (!selectedId) {
                Alert.alert("Selecciona un evento", "Toca un evento de la lista primero");
                return;
            }

            const res = await fetch(`${API}/events/${selectedId}`, { method: "DELETE" });
            if (!res.ok) throw new Error(await res.text());

            Alert.alert("OK", "Evento eliminado");
            limpiarFormulario();
            cargarEventosSemana();
        } catch (e) {
            console.error(e);
            Alert.alert("Error", "No se pudo eliminar");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>← Volver</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Gestión de eventos</Text>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Título (summary)"
                    value={summary}
                    onChangeText={setSummary}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Descripción"
                    value={description}
                    onChangeText={setDescription}
                />

                <TextInput
                    style={styles.input}
                    placeholder='Inicio (YYYY-MM-DDTHH:mm:ss) ej: 2025-12-18T09:00:00'
                    value={start}
                    onChangeText={setStart}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Fin (YYYY-MM-DDTHH:mm:ss) ej: 2025-12-18T10:00:00'
                    value={end}
                    onChangeText={setEnd}
                />

                <Text style={styles.label}>ColorId (2=verde, 11=rojo, 5=amarillo)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ColorId"
                    value={String(colorId)}
                    onChangeText={setColorId}
                    keyboardType="numeric"
                />

                <View style={styles.row}>
                    <TouchableOpacity style={styles.btnPrimary} onPress={crear}>
                        <Text style={styles.btnText}>Crear</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnPrimary} onPress={modificar}>
                        <Text style={styles.btnText}>Modificar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnDanger} onPress={eliminar}>
                        <Text style={styles.btnText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>

            </View>

            <Text style={styles.subtitle}>Eventos (toca uno para seleccionar)</Text>

            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.item,
                            selectedId === item.id ? styles.itemSelected : null,
                        ]}
                        onPress={() => seleccionar(item)}
                    >
                        <Text style={styles.itemTitle}>{item.summary}</Text>
                        <Text style={styles.itemMeta}>
                            {String(item.colorId || "")} | {(item.start || "").substring(0, 16).replace("T", " ")}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
