import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, Platform } from "react-native";
import { TextInput, Button, HelperText, Text } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import { api } from "../../../services/api";
import { Project } from "../../../types";
import { DeviceEventEmitter } from "react-native";
import { EVENT_TYPES } from "../../../services/eventEmitter";
import DatePicker from "../../../components/DatePicker";

export default function EditProject() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [priority, setPriority] = useState<"baja" | "media" | "alta" | "">("");
  const [status, setStatus] = useState<"activo" | "en_pausa" | "terminado">(
    "activo"
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      if (!id) return;
      const projectData = await api.projects.get(Number(id));
      setProject(projectData);
      setTitle(projectData.title);
      setDescription(projectData.description || "");
      setCategory(projectData.category || "");
      setDeadline(projectData.deadline ? new Date(projectData.deadline) : null);
      setPriority(projectData.priority || "");
      setStatus(projectData.status || "activo");
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el proyecto");
      router.back();
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim()) {
      newErrors.title = "El título es requerido";
    } else if (title.length > 100) {
      newErrors.title = "El título no puede tener más de 100 caracteres";
    }

    if (description && description.length > 500) {
      newErrors.description =
        "La descripción no puede tener más de 500 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Preparar los datos para la actualización
      const updateData: Partial<Project> = {};

      // Solo incluir campos que han cambiado
      if (title !== project?.title) {
        updateData.title = title.trim();
      }
      if (description !== project?.description) {
        updateData.description = description.trim() || undefined;
      }
      if (category !== project?.category) {
        updateData.category = category.trim() || undefined;
      }
      if (priority !== project?.priority) {
        updateData.priority = priority || undefined;
      }
      if (status !== project?.status) {
        updateData.status = status;
      }

      // Solo incluir deadline si ha cambiado
      if (deadline?.toISOString() !== project?.deadline) {
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
          updateData.deadline = utcDate.toISOString();
          console.log("Fecha a enviar:", updateData.deadline);
        } else {
          updateData.deadline = undefined;
        }
      }

      console.log(
        "Datos completos a enviar:",
        JSON.stringify(updateData, null, 2)
      );

      const response = await api.projects.update(Number(id), updateData);
      console.log("Respuesta del servidor:", JSON.stringify(response, null, 2));

      DeviceEventEmitter.emit(EVENT_TYPES.PROJECT_UPDATED);
      Alert.alert("Éxito", "Proyecto actualizado correctamente", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      let errorMessage = "No se pudo actualizar el proyecto";
      if (error instanceof Error) {
        if (error.message.includes("fecha límite")) {
          errorMessage = "La fecha límite no puede estar en el pasado";
        } else if (error.message.includes("título")) {
          errorMessage = "El título debe tener entre 1 y 100 caracteres";
        } else if (error.message.includes("descripción")) {
          errorMessage = "La descripción no puede tener más de 500 caracteres";
        } else {
          errorMessage = error.message;
        }
      }
      Alert.alert("Error", errorMessage);
      console.error("Error al actualizar:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!project) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TextInput
          label="Título"
          value={title}
          onChangeText={setTitle}
          mode="outlined"
          error={!!errors.title}
        />
        <HelperText type="error" visible={!!errors.title}>
          {errors.title}
        </HelperText>

        <TextInput
          label="Descripción"
          value={description}
          onChangeText={setDescription}
          mode="outlined"
          multiline
          numberOfLines={5}
          error={!!errors.description}
        />
        <HelperText type="error" visible={!!errors.description}>
          {errors.description}
        </HelperText>

        <TextInput
          label="Categoría"
          value={category}
          onChangeText={setCategory}
          mode="outlined"
        />

        <DatePicker
          value={deadline || undefined}
          onChange={(date) => setDeadline(date || null)}
          label="Fecha límite"
          placeholder="Seleccionar fecha límite"
          minDate={new Date()}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          loading={loading}
          disabled={loading}
        >
          Actualizar Proyecto
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  form: {
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  priorityButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  statusButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonContainer: {
    marginTop: 16,
    gap: 8,
  },
  submitButton: {
    marginBottom: 8,
  },
  dateContainer: {
    marginVertical: 8,
  },
});
