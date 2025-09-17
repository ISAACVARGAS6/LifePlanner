import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, HelperText, Text, Chip } from "react-native-paper";
import { useRouter } from "expo-router";
import { api } from "../../services/api";
import { Project, Priority, ProjectStatus } from "../../types";
import { SakuraColors } from "../../constants/Colors";
import { SakuraStyles } from "../../constants/Styles";
import DatePicker from "../../components/DatePicker";

export default function CreateProjectScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [category, setCategory] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<ProjectStatus>("activo");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "El título es obligatorio");
      return;
    }

    if (!priority) {
      Alert.alert("Error", "Debes seleccionar una prioridad");
      return;
    }

    setLoading(true);
    try {
      const projectData: {
        title: string;
        description?: string;
        priority: Priority;
        category?: string;
        status: ProjectStatus;
        deadline?: string;
      } = {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category: category.trim() || undefined,
        status,
      };

      if (deadline) {
        // Establecer la hora a las 23:59:59 UTC
        const utcDate = new Date(
          Date.UTC(
            deadline.getFullYear(),
            deadline.getMonth(),
            deadline.getDate(),
            23,
            59,
            59
          )
        );
        projectData.deadline = utcDate.toISOString();
      }

      await api.projects.create(projectData);
      Alert.alert("¡Éxito!", "Proyecto creado correctamente", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error al crear proyecto:", error);
      Alert.alert("Error", "No se pudo crear el proyecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Proyecto</Text>

      <TextInput
        label="Título*"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[styles.input, styles.multilineInput]}
        mode="outlined"
      />

      <Text style={styles.sectionTitle}>Prioridad</Text>
      <View style={styles.row}>
        {(["baja", "media", "alta"] as const).map((item) => (
          <Chip
            key={item}
            style={[
              styles.optionButton,
              priority === item && styles.activeOptionButton
            ]}
            textStyle={[
              styles.optionButtonText,
              priority === item && styles.activeOptionButtonText
            ]}
            onPress={() => setPriority(item)}
          >
            {item}
          </Chip>
        ))}
      </View>

      <TextInput
        label="Categoría"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
        mode="outlined"
      />

      <DatePicker
        value={deadline}
        onChange={setDeadline}
        label="Fecha límite (opcional)"
        placeholder="Seleccionar fecha límite"
        minDate={new Date()}
      />

      <Text style={styles.sectionTitle}>Estado</Text>
      <View style={styles.row}>
        {(["activo", "en_pausa", "terminado"] as const).map((item) => (
          <Chip
            key={item}
            style={[
              styles.optionButton,
              status === item && styles.activeOptionButton
            ]}
            textStyle={[
              styles.optionButtonText,
              status === item && styles.activeOptionButtonText
            ]}
            onPress={() => setStatus(item)}
          >
            {item}
          </Chip>
        ))}
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        loading={loading}
        disabled={loading || title.trim() === ""}
      >
        Crear Proyecto
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
    color: SakuraColors.primary,
  },
  input: {
    marginBottom: 16,
    backgroundColor: SakuraColors.surface,
  },
  multilineInput: {
    height: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: SakuraColors.primary,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: SakuraColors.surface,
    borderColor: SakuraColors.border,
    borderWidth: 1,
  },
  activeOptionButton: {
    backgroundColor: SakuraColors.primary,
    borderColor: SakuraColors.primary,
  },
  optionButtonText: {
    color: SakuraColors.textSecondary,
  },
  activeOptionButtonText: {
    color: SakuraColors.textLight,
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    marginBottom: 4,
    color: SakuraColors.primary,
  },
  buttonContainer: {
    marginTop: 20,
  },
  purpleButton: {
    backgroundColor: SakuraColors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  clearButton: {
    marginTop: 8,
    color: SakuraColors.primary,
  },
  submitButton: {
    backgroundColor: SakuraColors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
});

