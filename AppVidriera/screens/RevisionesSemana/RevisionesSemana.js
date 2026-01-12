import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import styles from "./RevisionesSemanaStyles";

export default function RevisionesSemana({ navigation }) {
    const [revisiones, setRevisiones] = useState([]);

    useEffect(() => {
        cargarRevisiones();
    }, []);

    const cargarRevisiones = async () => {
        try {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            const domingo = new Date(hoy);
            domingo.setDate(hoy.getDate() + (7 - hoy.getDay()));
            domingo.setHours(23, 59, 59, 999);

            const res = await fetch(
                `http://10.0.2.2:5088/api/calendar/events?from=${hoy.toISOString()}&to=${domingo.toISOString()}`
            );

            const data = await res.json();

            // 🟡 AMARILLO REAL EN TU CALENDARIO = "5"
            const amarillas = data.filter(
                (e) => String(e.colorId) === "5"
            );

            setRevisiones(amarillas);
        } catch (error) {
            console.error("Error cargando revisiones:", error);
        }
    };

    const formatFecha = (item) => {
        const iso = item?.start || item?.start?.dateTime || item?.start?.date;
        if (!iso) return "";
        return String(iso).substring(0, 10).split("-").reverse().join("/");
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backText}>⬅ Volver</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Revisiones (hasta domingo)</Text>

            <FlatList
                data={revisiones}
                keyExtractor={(item, idx) => String(item.id ?? idx)}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.summary}>{item.summary}</Text>
                        <Text style={styles.date}>{formatFecha(item)}</Text>
                    </View>
                )}
            />

        </View>
    );
}
