// 4) screens/GestionEventos/GestionEventosStyles.js  (simple)

import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#3B6FB6" },
    backButton: { marginBottom: 10 },
    backText: { color: "#fff", fontSize: 16 },
    title: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 10 },
    subtitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginTop: 10, marginBottom: 8 },

    form: { backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 12, padding: 12 },
    input: { backgroundColor: "#fff", borderRadius: 10, padding: 10, marginBottom: 10 },
    label: { color: "#fff", marginBottom: 6 },

    row: { flexDirection: "row", gap: 10, marginTop: 4 },
    btnPrimary: { flex: 1, backgroundColor: "#2C5C9C", padding: 12, borderRadius: 10 },
    btnDanger: { flex: 1, backgroundColor: "#c0392b", padding: 12, borderRadius: 10 },
    btnGhost: { padding: 12, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.15)" },
    btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
    btnGhostText: { color: "#fff", fontWeight: "700" },

    item: { backgroundColor: "rgba(255,255,255,0.15)", padding: 12, borderRadius: 12, marginBottom: 10 },
    itemSelected: { borderWidth: 2, borderColor: "#fff" },
    itemTitle: { color: "#fff", fontWeight: "700" },
    itemMeta: { color: "#dcdde1", marginTop: 4 },
});
